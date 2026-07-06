#!/usr/bin/env python3
"""Deterministic form/delivery interlock for the Naviia workflows.

Three modes (argv[1]), all fed the hook event JSON on stdin:

  prompt   (UserPromptSubmit) — sets the session flag when the MCP App form
           posts its "[Formulaire ... validé]" message, or when the user
           explicitly opts out with « sans formulaire ».
  pretool  (PreToolUse on prepare_two_pager|prepare_qa) — DENIES the call
           (exit 2) until the form flag is set, forcing the model to call
           open_two_pager_form / open_qa_form first (the host then renders
           the form — guaranteed by the host once the tool is called).
  posttool (PostToolUse on render_*) — marks the run as delivered and
           consumes the form flag (next run requires a fresh validation).
  stop     (Stop) — if a validated run produced no deliverable, blocks the
           stop ONCE with instructions to resume from work/.

Flags: /tmp/naviia-flags/<session_id>.json — best-effort session state, safe
to lose (worst case: the form is requested again).
"""
import json
import re
import sys
from pathlib import Path

FLAGS_DIR = Path("/tmp/naviia-flags")

GATED_TOOLS = re.compile(r"prepare_two_pager|prepare_qa")
RENDER_TOOLS = re.compile(r"render_two_pager_pdf|render_qa_docx|render_im_docx")
FORM_VALIDATED = re.compile(r"\[Formulaire .{0,30}valid[ée]\]", re.I)
OPT_OUT = re.compile(r"sans formulaire", re.I)


def load(session: str) -> dict:
    try:
        return json.loads((FLAGS_DIR / f"{session}.json").read_text())
    except Exception:
        return {}


def save(session: str, state: dict) -> None:
    FLAGS_DIR.mkdir(parents=True, exist_ok=True)
    (FLAGS_DIR / f"{session}.json").write_text(json.dumps(state))


def main() -> int:
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    try:
        event = json.load(sys.stdin)
    except Exception:
        return 0
    session = str(event.get("session_id") or "default")
    state = load(session)

    if mode == "prompt":
        prompt = str(event.get("prompt") or "")
        if FORM_VALIDATED.search(prompt) or OPT_OUT.search(prompt):
            state["formValidated"] = True
            state["delivered"] = False
            save(session, state)
        return 0

    if mode == "pretool":
        tool = str(event.get("tool_name") or "")
        if not GATED_TOOLS.search(tool):
            return 0
        if state.get("formValidated"):
            return 0
        print(
            "Formulaire non validé : appelle d'abord le tool de formulaire "
            "(open_two_pager_form ou open_qa_form) et ATTENDS que l'utilisateur "
            "valide ses options dans le formulaire (son message « [Formulaire "
            "validé] » débloquera cette étape). Si l'environnement ne peut pas "
            "afficher le formulaire, demande à l'utilisateur de confirmer les "
            "paramètres en écrivant « sans formulaire » suivi de ses choix.",
            file=sys.stderr,
        )
        return 2

    if mode == "pretool-bash":
        command = str((event.get("tool_input") or {}).get("command") or "")
        # Checkpoints are the crash-recovery currency: deleting work*/ before a
        # deliverable exists is only allowed via an explicit user request.
        if re.search(r"\brm\b[^\n|;&]*\bwork(-im)?\b", command) and not state.get("delivered"):
            print(
                "Suppression des checkpoints refusée : le run n'a produit aucun "
                "livrable — work/ et work-im/ sont la reprise après interruption. "
                "Si l'utilisateur veut vraiment repartir de zéro, demande-lui de "
                "confirmer explicitement (il peut aussi supprimer le dossier "
                "lui-même).",
                file=sys.stderr,
            )
            return 2
        return 0

    if mode == "posttool":
        tool = str(event.get("tool_name") or "")
        if RENDER_TOOLS.search(tool):
            state["delivered"] = True
            state["formValidated"] = False  # next run needs a fresh validation
            save(session, state)
        return 0

    if mode == "stop":
        if event.get("stop_hook_active"):
            return 0
        if state.get("formValidated") and not state.get("delivered"):
            # One shot: clear the flag so a legitimate stop isn't blocked twice.
            state["formValidated"] = False
            save(session, state)
            print(
                "Le run Naviia validé par formulaire n'a produit aucun livrable "
                "(aucun render_* appelé). Reprends depuis les checkpoints du "
                "dossier work/ (étapes déjà validées à conserver) ou explique "
                "précisément à l'utilisateur ce qui bloque avant de t'arrêter.",
                file=sys.stderr,
            )
            return 2
        return 0

    return 0


if __name__ == "__main__":
    sys.exit(main())
