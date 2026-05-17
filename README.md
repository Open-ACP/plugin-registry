# OpenACP Plugin Registry

The official plugin registry for [OpenACP](https://github.com/Open-ACP/OpenACP). This repository contains metadata for all community plugins discoverable via `openacp plugin search`.

## Plugins

<!-- PLUGINS_START -->
| | Plugin | Description | Category | Version | |
|---|--------|-------------|----------|---------|---|
| 👋 | **[Hello World Plugin](https://www.npmjs.com/package/openacp-hello-example)** | Example plugin — greets users on session start | utility | `0.0.1` | ✓ verified |
| 🏢 | **[Workspace — Multi-User Collaboration](https://www.npmjs.com/package/@openacp/workspace-plugin)** | Multi-user collaboration for shared OpenACP sessions | utility | `2026.415.1` | ✓ verified |
| 🤝 | **[Cowork — Multi-Agent Coordination](https://www.npmjs.com/package/openacp-cowork)** | Coordinate multiple AI agents working on the same codebase with status broadcasting and context injection | utility | `1.0.9` |  |
| 📝 | **[Conversation Record & Context Bridge](https://www.npmjs.com/package/@lngdao/openacp-plugin-conversation-record)** | Record session events to JSONL and bridge context between concurrent sessions via /context command | utility | `0.1.0` |  |
| 📝 | **[Summary Plugin](https://www.npmjs.com/package/@peterr0x/summary-plugin)** | Ask the AI agent to summarize the current session — what was accomplished, key files changed, decisions made, and current status | utility | `0.1.1` |  |
| 📊 | **[Usage Plugin](https://www.npmjs.com/package/@peterr0x/usage-plugin)** | Automatically tracks token usage and cost per agent session, supports configurable monthly budgets with warning notifications | utility | `0.1.1` |  |
<!-- PLUGINS_END -->

**Total: 6 plugins** · [Submit yours →](CONTRIBUTING.md)

### Install a plugin

```bash
openacp plugin search <query>
openacp plugin install <plugin-name>
```

## For Plugin Authors

Want to list your plugin? See [CONTRIBUTING.md](CONTRIBUTING.md) for submission instructions.

## How It Works

1. Plugin authors submit a JSON file via Pull Request to `plugins/`
2. CI validates the submission (schema, npm existence, uniqueness)
3. PR auto-merges if validation passes
4. `registry.json` is automatically rebuilt
5. OpenACP CLI fetches `registry.json` to power plugin search and discovery
6. A daily CI job updates version numbers from npm

## Registry Structure

```
plugins/
  example--openacp-hello.json    # One JSON file per plugin
registry.json                     # Auto-generated aggregate (do not edit)
```

## Development

```bash
npm install

# Validate plugin files
npm run validate

# Check that npm packages exist
npm run check-npm

# Build registry.json + update README plugin list
npm run build

# Update versions from npm
npm run update-versions

# Run tests
npm test
```

## Plugin JSON Schema

```json
{
  "name": "plugin-name",
  "displayName": "Plugin Name",
  "description": "What the plugin does",
  "npm": "@scope/package-name",
  "repository": "https://github.com/org/repo",
  "author": { "name": "Author", "github": "username" },
  "version": "1.0.0",
  "minCliVersion": "2026.0326.0",
  "category": "adapter|utility|integration|ai|security|media",
  "tags": ["tag1", "tag2"],
  "icon": "🌐",
  "license": "MIT",
  "verified": false,
  "featured": false
}
```

## Categories

| Icon | Category | Description |
|------|----------|-------------|
| 🔌 | Adapters | Messaging platform adapters (WhatsApp, Line, etc.) |
| 🔧 | Utilities | Utility plugins (translation, formatting, etc.) |
| 🔗 | Integrations | Third-party integrations (Jira, Linear, etc.) |
| 🤖 | AI & Models | AI model providers |
| 🔒 | Security | Security & access control |
| 🎵 | Media | Voice, image, video processing |

## License

MIT
