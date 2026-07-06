# Plugin Naviia Two-Pager

Profil d'entreprise PE complet (« two-pager ») dans Claude : classification du
marché (mainstream/niche), recherche web, rédaction des sections en sous-agents
à contexte isolé, et rendu **PDF identique au portail Naviia** (mise en page,
watermark, logo, pagination).

Les prompts métier ne sont pas dans ce plugin : ils sont servis à l'exécution
par le connecteur MCP Naviia (`prepare_two_pager`). Le **rendu PDF s'exécute
localement** dans l'espace de travail Cowork (`renderer/` embarqué — drapeaux
inclus, aucun service tiers), avec le tool serveur `render_two_pager_pdf` en
secours. La génération elle-même est faite par le modèle de la conversation —
facturée sur l'abonnement Claude de l'utilisateur. Rien à héberger côté client.

## Installation

### Claude Code / Cowork (recommandé — sous-agents parallèles)

```
/plugin marketplace add <chemin ou repo du marketplace naviia>
/plugin install naviia-two-pager@naviia
```

Le `.mcp.json` du plugin monte automatiquement le connecteur
`https://naviia-qa-claude.fly.dev/mcp-app`. La skill `two-pager` est exposée.

### Claude Desktop (chat)

Ajouter un connecteur personnalisé : Paramètres → Connecteurs →
« Ajouter un connecteur personnalisé » → URL `https://naviia-qa-claude.fly.dev/mcp-app`.
Le formulaire s'affiche dans le chat via `open_two_pager_form`.
(Sur le chat claude.ai web, utiliser l'endpoint `/mcp` — tools seuls, le
rendu des MCP Apps custom n'y est pas encore disponible.)

## Utilisation

« Fais un two-pager sur <société> » → le formulaire s'ouvre (société, site
web, secteur, langue, teaser) → validation → la skill orchestre :
classification, recherche, sections en parallèle, validation par scripts,
PDF téléchargeable.

Joindre le teaser/IM du deal à la conversation quand il existe : il devient
la source primaire (variantes `-teaser` du pipeline).
