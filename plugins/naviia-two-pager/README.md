# Plugin Naviia Two-Pager

Deux skills Naviia dans Claude, servies par le même connecteur MCP :

1. **`two-pager`** — profil d'entreprise PE complet : classification du marché
   (mainstream/niche), recherche web, rédaction des sections en sous-agents à
   contexte isolé, et rendu **PDF identique au portail Naviia** (mise en page,
   watermark, logo, pagination).
2. **`im-analysis`** — analyse d'un Information Memorandum joint à la
   conversation : plan d'axes proposé par le serveur, une section par
   sous-agent (source unique : l'IM, références de pages obligatoires),
   rendu **DOCX Cambria** via le serveur + HTML de lecture locale.

Les prompts métier ne sont pas dans ce plugin : ils sont servis à l'exécution
par le connecteur MCP Naviia (`prepare_two_pager`, `prepare_im_analysis`).
Le rendu PDF du two-pager s'exécute **localement** (`renderer/` embarqué —
drapeaux inclus, aucun service tiers), avec le tool serveur
`render_two_pager_pdf` en secours ; le DOCX d'analyse d'IM est rendu par le
tool serveur `render_im_docx` (template Cambria), complété d'un HTML local
(`render_im_html.py`, python pur). La génération elle-même est faite par le
modèle de la conversation — facturée sur l'abonnement Claude de l'utilisateur.
Rien à héberger côté client.


## Accès

Le connecteur Naviia est protégé par **OAuth** : à la première session, Claude
ouvre la page de connexion Naviia — entrez votre **email** et votre **code
d'accès** (fournis par Naviia). La session se renouvelle ensuite
automatiquement ; **aucun jeton n'est stocké dans ce plugin**. Pour révoquer
ou ajouter un utilisateur, contactez Naviia.

## Installation

### Claude Code / Cowork (recommandé — sous-agents parallèles)

```
/plugin marketplace add <chemin ou repo du marketplace naviia>
/plugin install naviia-two-pager@naviia
```

Le `.mcp.json` du plugin monte automatiquement le connecteur
`https://naviia-qa-claude.fly.dev/mcp-app`. Les skills `two-pager` et
`im-analysis` sont exposées.

### Claude Desktop (chat)

Ajouter un connecteur personnalisé : Paramètres → Connecteurs →
« Ajouter un connecteur personnalisé » → URL `https://naviia-qa-claude.fly.dev/mcp-app`.
Le formulaire s'affiche dans le chat via `open_two_pager_form`.
(Sur le chat claude.ai web, utiliser l'endpoint `/mcp` — tools seuls, le
rendu des MCP Apps custom n'y est pas encore disponible.)

## Utilisation

### Two-pager

« Fais un two-pager sur <société> » → le formulaire s'ouvre (société, site
web, secteur, langue, teaser) → validation → la skill orchestre :
classification, recherche, sections en parallèle, validation par scripts,
PDF téléchargeable.

Joindre le teaser/IM du deal à la conversation quand il existe : il devient
la source primaire (variantes `-teaser` du pipeline).

### Analyse d'IM

« Analyse cet IM » (avec l'IM joint à la conversation — obligatoire) →
la skill demande la langue et les commentaires de focus, propose le plan de
sections, rédige chaque section en sous-agent parallèle (source unique :
le document, références de pages `(p.XX)` exigées), valide par scripts,
puis livre le DOCX Naviia téléchargeable et un HTML local de lecture.

## Validation automatique

Un hook `PostToolUse` (Write/Edit) valide chaque section écrite :
`work/sections/*.json` → `validate_section.py` (two-pager) ;
`work-im/sections/*.json|md` → `validate_im_section.py` (analyse d'IM).
Une section invalide est bloquée à l'écriture avec les motifs de rejet.
