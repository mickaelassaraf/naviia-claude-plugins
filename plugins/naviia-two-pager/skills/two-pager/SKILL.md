---
name: two-pager
description: >
  Génère un two-pager Naviia (profil d'entreprise PE) : classification du
  marché, recherche web, sections rédigées en sous-agents à contexte isolé,
  validation par scripts, rendu PDF identique au portail Naviia. À utiliser
  dès que l'utilisateur demande un two-pager / 2pager / profil d'entreprise /
  company profile sur une société.
---

# Two-pager Naviia

Tu orchestres la génération d'un two-pager. Les prompts métier viennent du
connecteur MCP Naviia (`prepare_two_pager`) — tu ne les improvises jamais. Le
PDF final est rendu par `render_two_pager_pdf`. Ta valeur ajoutée :
l'orchestration disciplinée, la recherche, et l'isolation des contextes.

## 1. Entrées

Requis : **nom de la société**. Souhaités : site web, secteur, langue (fr/en),
teaser ou IM joint à la conversation, commentaires de focus.

- Si le connecteur expose `open_two_pager_form` et que l'hôte affiche les MCP
  Apps (Desktop/Cowork/Code) : appelle-le et attends la validation du
  formulaire — elle arrive comme un message `[Formulaire two-pager validé]`.
- Sinon : collecte les champs dans la conversation. Ne démarre jamais sans le
  nom de la société ; si la société est introuvable en ligne, arrête-toi et
  demande confirmation (homonymes fréquents en PE).

Crée un dossier de travail `work/` avec `work/steps/` et `work/sections/`.

## 2. Classification

1. Appelle `prepare_two_pager` **sans** `classification`.
2. Exécute le prompt retourné (avec le teaser joint comme source si présent).
   Réponse stricte : `{"result":"mainstream"}` ou `{"result":"niche"}`.
3. Annonce le résultat en une ligne, puis rappelle `prepare_two_pager` avec
   `classification` renseignée. Tu reçois le plan : ~19 étapes avec
   `dependsOn`, `webSearch`, `sectionKey`, `outputContract` et les prompts.

## 3. Exécution du plan

Règles d'orchestration :

- **Respecte `dependsOn`.** Les étapes dont toutes les dépendances sont
  satisfaites se lancent **en parallèle, chacune dans un sous-agent à contexte
  isolé** (Task tool). Chaque sous-agent reçoit UNIQUEMENT : les prompts de son
  étape, les sorties de ses dépendances (lues dans `work/steps/`), le teaser
  joint si l'étape le requiert, et son `outputContract` s'il existe.
- **Substitution des placeholders** : avant de lancer une étape, remplace dans
  ses prompts les `{{PLACEHOLDERS}}` restants par les sorties des étapes
  correspondantes (`{{MARKET_DEFINITION}}`, `{{MARKET_SUMMARY}}`,
  `{{LINKEDIN_PROFILES}}`, `{{COMPETITORS_LIST}}`, etc.).
- **Recherche web** : autorisée uniquement pour les étapes `webSearch: true`.
  Respecte les consignes de sources des prompts (sources spécialisées type
  cfnews.net, lesechos.fr, capitalfinance ; jamais Wikipedia/Pappers quand le
  prompt les exclut). Chaque affirmation clé est citée `[Source](url)`.
- Chaque sous-agent écrit sa sortie brute dans `work/steps/<id>.md` (ou `.json`
  si `output: json`).
- **Étapes avec `sectionKey`** : après le fond (prompt suivi strictement), la
  sortie est restructurée selon `outputContract` et écrite dans
  `work/sections/<sectionKey>.json`. Pour `PresentationEntreprise` (string
  markdown), écris `work/sections/PresentationEntreprise.json` contenant la
  string JSON-encodée.
- **Environnement sans sous-agents** (chat simple) : exécute les étapes
  séquentiellement dans l'ordre topologique, mais garde les fichiers de
  travail comme mémoire d'étape.

## 4. Validation

Pour chaque section produite :

```bash
python3 scripts/validate_section.py work/sections/<SectionKey>.json
```

En cas de rejet : régénère UNIQUEMENT cette section (relance le sous-agent de
l'étape avec le motif du rejet ajouté au prompt), puis revalide. Deux échecs
consécutifs → signale la section comme dégradée et continue.

## 5. Assemblage et rendu

```bash
python3 scripts/assemble_payload.py work/sections/ work/web_payload.json
```

Puis appelle `render_two_pager_pdf` avec :

```json
{
  "doc": { "name": "<Société>", "sector": ["<secteur>"], "website": "<site>", "iso_code": "<langue>" },
  "webPayload": <contenu de work/web_payload.json>
}
```

Si le tool rejette (validation serveur), corrige les sections signalées et
rappelle-le. En succès, il retourne l'URL de téléchargement du PDF.

## 6. Livraison

Message final : le lien de téléchargement, la variante utilisée
(mainstream/niche, ±teaser), une ligne par section (état + points saillants),
et la liste explicite des sections dégradées ou pauvres en sources s'il y en
a. Pas de résumé du contenu au-delà.

## Cas limites

- **Société introuvable / site mort** : stop, demander à l'utilisateur.
- **Teaser illisible** (scan sans texte) : le signaler et basculer sur la
  variante sans teaser après accord de l'utilisateur.
- **Étape de recherche vide** (aucune source trouvée) : l'étape produit ce
  qu'elle peut avec mention explicite du manque — jamais d'invention.
