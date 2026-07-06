# Naviia — plugins Claude

Marketplace de plugins Claude (Cowork / Claude Code) de Naviia.

## Prérequis

- Accès en lecture à ce dépôt GitHub (invitation Naviia) et `git` authentifié
  sur la machine (`gh auth login` ou clés SSH).
- Node.js ≥ 20 (pour le rendu PDF/HTML local — vérifier avec `node -v`).
- Le connecteur Naviia est fourni par le plugin avec son jeton d'accès :
  rien à configurer côté serveur.

## Installation (une fois par utilisateur)

Dans Cowork ou Claude Code :

```
/plugin marketplace add mickaelassaraf/naviia-claude-plugins
/plugin install naviia-two-pager@naviia
```

Puis ouvrir une **nouvelle session**. Premier test : « Fais un two-pager sur
<société> » — le formulaire Naviia s'affiche, la génération produit trois
fichiers dans l'espace de travail (PDF Naviia, HTML interactif, données JSON).
Au premier rendu, le plugin installe ses dépendances locales (~1 min).

## Mises à jour

Chaque livraison Naviia incrémente la version du plugin (`0.2.1`, `0.2.2`…).
Pour mettre à jour :

```
/plugin marketplace update naviia
/plugin uninstall naviia-two-pager@naviia
/plugin install naviia-two-pager@naviia
```

Puis nouvelle session. La version affichée dans `/plugin list` confirme que
vous êtes à jour. Important : `marketplace update` d'abord — l'installation
seule ne rafraîchit pas le catalogue.

## Versionnage — qui fait quoi

| Composant | Versionné par | Impact d'une mise à jour |
|---|---|---|
| **Plugin** (skill, renderer local, formulaire) | version dans ce dépôt (`plugin.json`) | à récupérer par chaque utilisateur (commandes ci-dessus) |
| **Serveur Naviia** (prompts métier, plan des étapes) | déployé par Naviia, transparent | immédiat pour tous, rien à faire |

Les prompts métier vivent sur le serveur Naviia : leurs améliorations sont
effectives instantanément sans mise à jour du plugin. Le plugin n'est à
mettre à jour que lorsque la mécanique change (rendu, formulaire, skill).

## Accès et révocation

L'accès au connecteur est protégé par un jeton propre à chaque organisation,
embarqué dans le plugin distribué. Naviia peut révoquer un jeton à tout
moment sans impacter les autres clients.
