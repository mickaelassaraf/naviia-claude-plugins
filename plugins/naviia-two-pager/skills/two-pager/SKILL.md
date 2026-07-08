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

**Formulaire garanti par hook** : un hook du plugin BLOQUE tout appel à
`prepare_two_pager`/`prepare_qa` tant que le formulaire n'a pas été validé
dans la session (message « [Formulaire … validé] »). Ne tente pas de le
contourner : appelle le formulaire et attends. Échappatoire prévue : si
l'utilisateur écrit « sans formulaire » avec ses paramètres, la voie est
débloquée. Un hook de fin vérifie aussi qu'un run validé produit bien un
livrable avant de s'arrêter.

- Si le connecteur expose `open_two_pager_form` et que l'hôte affiche les MCP
  Apps (Desktop/Cowork/Code) : appelle-le et attends la validation du
  formulaire — elle arrive comme un message `[Formulaire two-pager validé]`.
- Sinon : collecte les champs dans la conversation. Ne démarre jamais sans le
  nom de la société ; si la société est introuvable en ligne, arrête-toi et
  demande confirmation (homonymes fréquents en PE).

Crée un dossier de travail `work/` avec `work/steps/` et `work/sections/`.

**Reprise après interruption** : si `work/` existe déjà pour cette société,
NE PAS repartir de zéro. Inventorier ce qui est déjà là : les fichiers de
`work/steps/` sont des étapes terminées (leurs sorties sont réutilisables
telles quelles), les fichiers de `work/sections/` qui passent
`validate_section.py` sont des sections acquises. Reprendre le plan au premier
step manquant, en respectant les `dependsOn`. Ne régénérer une étape existante
que si l'utilisateur le demande explicitement.

## 2. Classification

1. Appelle `prepare_two_pager` **sans** `classification`.
2. Exécute le prompt retourné (avec le teaser joint comme source si présent).
   Réponse stricte : `{"result":"mainstream"}` ou `{"result":"niche"}`.
3. Annonce le résultat en une ligne, puis rappelle `prepare_two_pager` avec
   `classification` renseignée (sans `stepId`). Tu reçois le **plan compact** :
   ~21 étapes avec `dependsOn`, `webSearch`, `sectionKey` — SANS les prompts
   (le plan fait quelques centaines d'octets, pas 90 Ko).

## 3. Exécution du plan

Règles d'orchestration :

- **Respecte `dependsOn`.** Les étapes dont toutes les dépendances sont
  satisfaites se lancent **en parallèle, chacune dans un sous-agent à contexte
  isolé** (Task tool).
- **Charge les prompts à la demande, une étape à la fois.** Ne recharge JAMAIS
  le plan entier avec ses prompts. Au moment d'exécuter une étape, appelle
  `prepare_two_pager` avec le même contexte + `stepId="<id>"` : tu récupères
  UNIQUEMENT les prompts remplis et l'`outputContract` de cette étape. C'est ce
  que reçoit le sous-agent, avec en plus les sorties de ses dépendances (lues
  dans `work/steps/`) et le teaser joint si l'étape le requiert.
- **Substitution des placeholders** : avant de lancer une étape, remplace dans
  ses prompts les `{{PLACEHOLDERS}}` restants par les sorties des étapes
  correspondantes (`{{MARKET_DEFINITION}}`, `{{MARKET_SUMMARY}}`,
  `{{LINKEDIN_PROFILES}}`, `{{COMPETITORS_LIST}}`, etc.).
- **Choix du modèle des sous-agents** (vitesse sans perte de qualité) :
  la **classification** mainstream/niche se fait avec un modèle intermédiaire
  (Sonnet) — jamais le plus petit : une erreur change toute la variante. Les
  étapes de **pure mise en forme** (`market-reports-format`, formatage des
  profils LinkedIn) utilisent le modèle le plus rapide (Haiku). Toutes les
  étapes de recherche et de rédaction gardent le modèle par défaut de la
  session — ne jamais les downgrader.
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

Un hook du plugin valide AUTOMATIQUEMENT chaque fichier écrit dans
`work/sections/` (même script que ci-dessous) : une section invalide est
bloquée à l'écriture avec les motifs — corrige et réécris. Tu peux aussi
valider manuellement :

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

**Rendu rapide en environnement contraint** (connexion lente, sandbox à timeout court) : préfixe la commande de rendu par `NAVIIA_SKIP_LOGO_FETCH=1 NAVIIA_IMG_TIMEOUT_MS=4000` — le moteur n'ira pas chercher les logos concurrents sur le réseau (souvent lents/404) et coupe court sur les images lourdes. Les logos déjà fournis dans le web_payload restent affichés.

**Rendu LOCAL (par défaut)** — le moteur de rendu Naviia est embarqué dans le
dossier de cette skill (`renderer/`, à côté de ce SKILL.md), le PDF est
produit directement dans l'espace de travail :

```bash
cd <dossier de cette skill>/renderer && npm install --silent   # première fois uniquement
node dist/render.mjs <chemin>/work/web_payload.json <chemin>/<Société>_two-pager.pdf \
  --html <chemin>/<Société>_two-pager.html \
  --doc '{"name":"<Société>","sector":["<secteur>"],"website":"<site>","iso_code":"<langue>"}'
```

Le script imprime un JSON `{ok, out, html, sections}` — vérifie que les
sections attendues sont à `true`.

**Fallback serveur** — si `node`/`npm` sont indisponibles ou que l'installation
échoue : appelle le tool `render_two_pager_pdf` avec
`{ "doc": {...}, "webPayload": <contenu de work/web_payload.json> }` ; il
retourne une URL de téléchargement. En cas de rejet (validation), corrige les
sections signalées et réessaie.

## 6. Livraison

Trois fichiers restent dans l'espace de travail, à présenter à l'utilisateur :

1. `<Société>_two-pager.pdf` — le document de référence (mise en page Naviia) ;
2. `<Société>_two-pager.html` — la version interactive locale (onglets,
   graphiques, sources cliquables) : un fichier autonome, s'ouvre d'un
   double-clic ;
3. `work/web_payload.json` — la donnée structurée (permet de régénérer ou de
   mettre à jour une section plus tard sans relancer toute la recherche).

Message final : les chemins des trois fichiers, la variante utilisée
(mainstream/niche, ±teaser), une ligne par section (état + points saillants),
et la liste explicite des sections dégradées ou pauvres en sources s'il y en
a. Pas de résumé du contenu au-delà.

**Mise à jour ultérieure** : si l'utilisateur demande de rafraîchir une
section, régénérer UNIQUEMENT cette section (sous-agent + validation),
remplacer sa clé dans `work/web_payload.json`, ré-assembler et relancer le
rendu — ne jamais relancer tout le pipeline.

## Cas limites

- **Société introuvable / site mort** : stop, demander à l'utilisateur.
- **Teaser illisible** (scan sans texte) : le signaler et basculer sur la
  variante sans teaser après accord de l'utilisateur.
- **Étape de recherche vide** (aucune source trouvée) : l'étape produit ce
  qu'elle peut avec mention explicite du manque — jamais d'invention.
