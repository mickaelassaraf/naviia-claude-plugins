---
name: im-analysis
description: >
  Analyse d'IM Naviia (Information Memorandum) : plan de sections proposé par
  le connecteur MCP Naviia, rédaction de chaque section en sous-agent à
  contexte isolé à partir du document joint, validation par scripts, rendu
  DOCX Cambria (serveur) + HTML local. À utiliser dès que l'utilisateur
  demande « analyse cet IM », « compréhension IM », « analyse d'information
  memorandum », ou joint un IM en demandant une analyse structurée.
---

# Analyse d'IM Naviia

Tu orchestres l'analyse d'un Information Memorandum. Les prompts métier
viennent du connecteur MCP Naviia (`prepare_im_analysis`) — tu ne les
improvises jamais. Le DOCX final est rendu par `render_im_docx`. Ta valeur
ajoutée : l'orchestration disciplinée, la lecture rigoureuse du document, et
l'isolation des contextes.

## 1. Entrées

Requis : **l'IM joint à la conversation** (PDF ou document). Sans document
joint, REFUSE de démarrer : demande à l'utilisateur de joindre l'IM — cette
analyse ne s'appuie que sur le document, jamais sur des connaissances
générales ni sur le web. Souhaités : langue (`fr`/`en`, défaut `fr`) et
commentaires de focus (axes à creuser, sections à ignorer).

Crée un dossier de travail `work-im/` avec `work-im/sections/`.

**Reprise après interruption** : si `work-im/` existe déjà pour ce deal, NE
PAS repartir de zéro. Inventorier ce qui est là : `work-im/plan.json` est le
plan d'axes acquis (réutiliser tel quel), les fichiers de `work-im/sections/`
qui passent `validate_im_section.py` sont des sections acquises. Reprendre à
la première section manquante ou invalide. Ne régénérer une section existante
que si l'utilisateur le demande explicitement.

## 2. Phase 1 — Plan des axes

1. Appelle `prepare_im_analysis` avec `{language, comments}` — **sans**
   `axesResult`.
2. Exécute le prompt « plan » retourné (system + user) **sur l'IM joint**.
   Réponse stricte selon `AXES_OUTPUT_CONTRACT` : `{"sections": [string]}`,
   1 à 10 titres.
3. Écris le résultat dans `work-im/plan.json`.
4. **Annonce le plan de sections à l'utilisateur** (liste numérotée, une
   ligne d'intention par section). N'attends pas de validation sauf si les
   commentaires de l'utilisateur suggèrent qu'il veut arbitrer.

## 3. Phase 2 — Sections en sous-agents

Rappelle `prepare_im_analysis` avec le même `{language, comments}` **plus**
`axesResult` (le contenu de `work-im/plan.json`). Tu reçois un step par
section : `{id, sectionTitle, draft{system,user}, rewrite{system,user},
outputContract}`.

Règles d'orchestration :

- **UN SOUS-AGENT PAR SECTION, en parallèle** (Task tool,
  `subagent_type="naviia-step"` — agent du plugin, modèle épinglé ; un hook
  refuse tout autre agent). Chaque sous-agent reçoit UNIQUEMENT : les prompts
  de son step (draft puis rewrite), l'IM joint, et son `outputContract`. Rien
  d'autre — pas le plan complet, pas les autres sections.
- Dans chaque sous-agent : exécuter le prompt **draft** sur l'IM, puis le
  prompt **rewrite** en substituant `{{SECTION_DRAFT}}` par le draft produit.
  Les autres placeholders (`{{LANGUAGE}}`, `{{SECTION_TITLE}}`) sont déjà
  remplis par le serveur.
- **Sortie** : chaque sous-agent écrit
  `work-im/sections/<NN>-<slug>.json` (NN = position dans le plan, sur deux
  chiffres ; slug = titre en minuscules-ascii-tirets) contenant la SectionRow
  du contrat : `{"Section": "<titre>", "Output": "<markdown>",
  "Key points": ["...", x5]}`. Le champ `Output` respecte le format du
  contrat : un unique `# Titre`, 1 à 4 sous-sections `### (i)`, références de
  pages `(p.XX)` en fin de chaque paragraphe, aucun bloc `# Key points`,
  aucun placeholder résiduel.
- **Pas de recherche web** : la seule source est l'IM. Toute affirmation
  sans référence de page est suspecte.
- **Environnement sans sous-agents** (chat simple) : traiter les sections
  séquentiellement dans l'ordre du plan, mêmes fichiers de travail.

## 4. Validation

Un hook du plugin valide AUTOMATIQUEMENT chaque fichier écrit dans
`work-im/sections/` : une section invalide est bloquée à l'écriture avec les
motifs — corrige et réécris. Validation manuelle possible :

```bash
python3 scripts/validate_im_section.py work-im/sections/<NN>-<slug>.json
```

Règles : JSON parseable (SectionRow complète), volume minimal (400
caractères d'Output), aucun `{{...}}` non résolu, présence de références de
pages `(p.XX)`. En cas de rejet : régénère UNIQUEMENT cette section (relance
le sous-agent avec le motif du rejet ajouté au prompt), puis revalide. Deux
échecs consécutifs → signale la section comme dégradée et continue. Une
section dégradée reste une SectionRow VALIDE : Output contient ce qui a pu
être établi depuis l'IM (avec ses références de pages) plus un paragraphe
explicite « Limites de l'analyse : … » décrivant ce que l'IM ne couvre pas —
l'ensemble dépasse naturellement les 400 caractères et passe le hook. Ne
jamais inventer pour remplir, ne jamais écrire un fichier volontairement
invalide.

## 5. Rendu

**DOCX (livrable de référence)** — appelle le tool `render_im_docx` avec :

```json
{ "dealName": "<deal>", "sections": [ { "title": "...", "markdown": "<Output>" }, ... ] }
```

dans l'ordre du plan. Il retourne une URL de téléchargement
(`IM_<deal>_dd_mm_yyyy.docx`, template Cambria) et des stats par section. En
cas de rejet (validation serveur : longueur, placeholders, titres orphelins),
corrige les sections signalées et réessaie.

**HTML local (complément)** :

```bash
python3 scripts/render_im_html.py work-im/sections/ --html <chemin>/<Deal>_im-analysis.html --deal "<Deal>"
```

Fichier autonome (sommaire cliquable, sections, key points, références de
pages mises en évidence), s'ouvre d'un double-clic.

## 6. Livraison

Message final : l'URL du DOCX, le chemin du HTML local, le plan utilisé
(N sections), une ligne par section (état + un key point saillant), et la
liste explicite des sections dégradées s'il y en a. Pas de résumé du contenu
au-delà.

**Mise à jour ultérieure** : si l'utilisateur demande de retravailler une
section, régénérer UNIQUEMENT celle-ci (sous-agent + validation), puis
relancer `render_im_docx` et le rendu HTML — jamais tout le pipeline.

## Cas limites

- **Pas d'IM joint** : refuser et demander le document.
- **IM illisible** (scan sans texte) : le signaler et s'arrêter — pas de
  variante sans document pour cette skill.
- **Plan > 10 sections ou vide** : contraire au contrat — rejouer le prompt
  plan en rappelant la contrainte 1..10.
- **Section sans matière dans l'IM** (ex. projections absentes) : le
  sous-agent produit la section avec mention explicite du manque, jamais
  d'invention ; les blocs conditionnels du contrat s'appliquent.
