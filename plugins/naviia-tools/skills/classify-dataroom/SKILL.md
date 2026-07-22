---
name: classify-dataroom
description: Classe une dataroom locale M&A/PE — Claude lit le début de chaque document et le range dans une arborescence taxonomique, avec index et manifest persistant. Incrémental natif — relancer après ajout de documents ne retraite que le delta. Zéro dépendance externe (python3 stdlib + tool Read). Déclencheurs — "classe cette dataroom", "trie la dataroom", "range ces documents", "j'ai ajouté des documents à la dataroom".
---

# Classify Dataroom

Autonome : `python3` système (stdlib uniquement), aucun venv, aucune API externe.
Les scripts font le mécanique (scan, extraction Office, copie) ; **toi tu fais la lecture
des PDF (tool Read) et toute la classification**.

**Scripts** : `<base directory de cette skill>/scripts/` — **Taxonomies** : `<base directory de cette skill>/taxonomies/`
(le base directory est indiqué en tête de l'invocation de la skill ; définir `S=<base>/scripts` avant les commandes)
**Fichiers d'état** (par dataroom) : manifest `<dataroom>/.dataroom/manifest.json`, sortie `<dataroom>/_classified/` (copies organisées + `INDEX.md` + `index.csv`). Les sources ne sont jamais déplacées ni modifiées.

## Workflow

### 1. Scan + diff

```bash
S=<base directory de cette skill>/scripts
python3 $S/scan_diff.py <dataroom>
```

Diff JSON : `new` / `modified` / `renamed` / `deleted` / `unchanged`, plus `existing_tree`
(arborescence déjà classée, avec exemples — à imiter pour la cohérence) et la taxonomie active.
Si `new` et `modified` sont vides et `renamed`/`deleted` aussi : tout est à jour, s'arrêter là.
Le champ `duplicates` liste les fichiers `new` au contenu identique (même hash) : ne classer
que le `keep` de chaque groupe, lister les `dupes` dans le rapport final sans les classer.
Le champ `duplicates_of_classified` liste les fichiers dont le contenu est déjà classé sous
un autre chemin (ils sont retirés de `new`) : simple mention dans le rapport, rien à faire.

### 2. Taxonomie (premier run seulement)

Si `has_taxonomy: false` :
- L'utilisateur a fourni sa propre checklist → la convertir en JSON
  (`{cat_key: {label, subcategories: [{code, label}]}}`), l'écrire dans
  `<dataroom>/.dataroom/taxonomy.json`, et la référencer dans le plan via `"taxonomy_file"`.
  Toujours ajouter une catégorie filet `00_A_Trier` / code `0.1`.
- Sinon → un template de `<base directory de cette skill>/taxonomies/` :
  `default` (M&A générique), `growth`, `infra`, `real_estate`, `carveout` ;
  référencé via `"taxonomy_template"`. Prendre `default` sauf indication contraire.

Aux runs suivants la taxonomie est figée dans le manifest — ne jamais en changer sans
demande explicite.

### 3. Lecture — stratégie à 3 niveaux (du moins cher au plus cher)

1. **Nom + dossier d'abord** : si le nom est sans ambiguïté (Kbis, statuts, liasse fiscale,
   attestation RC…), classifier directement sans lire. Un nom explicite + un dossier cohérent
   suffisent. En cas de doute, lire.
2. **Office/texte en batch** (docx, xlsx, pptx, txt, csv, zip → listing du contenu) :
   ```bash
   python3 $S/extract.py --dataroom <dataroom> "rel/a.docx" "rel/b.xlsx" ...
   ```
   Passer 10-20 fichiers par appel. `note: "use_read_tool"` = fichier à lire via Read.
3. **PDF et images via le tool Read** (`pages: "1-2"` pour les PDF) : gère nativement les
   scans (vision) — c'est l'OCR. Lancer ces Read en parallèle quand il y en a plusieurs.
   Ne lire que les PDF non résolus par le niveau 1.

Extensions illisibles (.rar, .7z, .doc legacy, .msg) : classifier par le nom ; si le nom ne
suffit pas → la catégorie fourre-tout de la taxonomie active (son code varie : `10_Divers`,
`11_Divers`, `12_Divers` selon le template, `00_A_Trier` en custom — la repérer dans le JSON)
+ signaler dans le rapport.

**Archives (.zip) au contenu classifiable** (le listing `extract.py` montre des documents —
PDF, comptes, contrats…) : ne pas se contenter de classer le zip. Extraire l'archive dans un
dossier du même nom (sans extension) à la racine de la dataroom (python3 + zipfile, stdlib),
puis relancer le scan : les fichiers extraits arrivent en `new` et se classent
individuellement. Le zip d'origine reste classé comme archive.

### 4. Classification

- **Le contenu prime sur le nom/chemin** — méfiance : un fichier nommé "PAIE" peut être une
  brochure. Si le contenu contredit le nom, suivre le contenu.
- **Uniquement** les catégories/sous-catégories de la taxonomie. S'il en manque une, la
  proposer à l'utilisateur, ne pas la créer en douce.
- `new_name` : `Description_Entite.ext`, lisible, **sans** préfixe de date (ajouté par le
  script depuis `date`), max 80 chars. Ex : `Statuts_SAS_Dupont.pdf`, `Kbis_CWF.pdf`.
- `date` : `YYYY-MM-DD` si détectable. `entity` : société concernée. `doc_type` : 2-3 mots.
- Multi-entités (groupe) : mettre l'entité dans `new_name` pour distinguer les documents
  homologues (ex. `Kbis_CWF.pdf` / `Kbis_CWFE.pdf`).

### 5. Plan + application

Écrire `<dataroom>/.dataroom/plan.json` :

```json
{
  "taxonomy_template": "default",          // OU "taxonomy_file": "<dataroom>/.dataroom/taxonomy.json"
  "items": [
    {"path": "comptes/bilan 2023 vf(2).pdf", "category": "02_Financier", "sub_category": "02.1",
     "new_name": "Comptes_Annuels_2023.pdf", "date": "2023-12-31",
     "entity": "Dupont SAS", "doc_type": "Comptes annuels"}
  ]
}
```

```bash
python3 $S/apply_plan.py --dataroom <dataroom> --plan <dataroom>/.dataroom/plan.json
```

Le script gère seul les `renamed` (héritage) et `deleted` (nettoyage manifest + copie).
`--dry-run` si l'utilisateur veut valider avant. Exit code 2 = items en erreur → lire
`errors` du rapport JSON et corriger.

### 6. Rapport

Générer le rapport visuel (HTML auto-contenu, charte Naviia, liens cliquables vers les
copies classées, répartition, doublons, gap analysis) :

```bash
python3 $S/render_report.py --dataroom <dataroom>
```

→ `<dataroom>/_classified/RAPPORT.html` — l'envoyer à l'utilisateur (SendUserFile, display
render). Puis présenter en texte : fichiers classés par catégorie, doublons détectés,
renames/suppressions traités, fichiers douteux (illisibles, protégés, fourre-tout,
classification incertaine) avec ta raison, gap analysis, et le chemin de `INDEX.md`.

**Export du delta** (si l'utilisateur veut « la diff » / uploader seulement les nouveautés
vers une VDR) :

```bash
python3 $S/export_diff.py --dataroom <dataroom>          # dernier run
python3 $S/export_diff.py --dataroom <dataroom> --since 2026-07-22T00:00:00Z
```

→ `<dataroom>/_classified_diff/` : uniquement les documents du dernier run dans la même
arborescence, + `DIFF.md` et `diff.csv`. Le dossier est écrasé à chaque export.

## Règles de stabilité (runs incrémentaux)

- **Ne jamais réorganiser l'existant** : un run incrémental ne touche que le delta, même si
  tu classerais différemment aujourd'hui.
- Fichier renommé côté source (même hash) → hérite de sa classification automatiquement.
- Fichier `modified` → re-classification normale (l'ancienne copie est remplacée).
- Reset complet sur demande : supprimer `<dataroom>/.dataroom/` et `<dataroom>/_classified/`.
