import fs from 'node:fs'
import path from 'node:path'

const CATEGORIES = [
  { id: 'adapter', name: 'Adapters', icon: '🔌' },
  { id: 'utility', name: 'Utilities', icon: '🔧' },
  { id: 'integration', name: 'Integrations', icon: '🔗' },
  { id: 'ai', name: 'AI & Models', icon: '🤖' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'media', name: 'Media', icon: '🎵' },
]

export function buildRegistry(pluginsDir: string): any {
  const plugins: any[] = []

  if (!fs.existsSync(pluginsDir)) return { version: 1, generatedAt: new Date().toISOString(), pluginCount: 0, plugins: [], categories: CATEGORIES }

  for (const file of fs.readdirSync(pluginsDir)) {
    if (!file.endsWith('.json')) continue
    try {
      const content = JSON.parse(fs.readFileSync(path.join(pluginsDir, file), 'utf-8'))
      plugins.push({
        name: content.name,
        displayName: content.displayName ?? content.name,
        description: content.description,
        npm: content.npm,
        version: content.version,
        minCliVersion: content.minCliVersion,
        category: content.category,
        tags: content.tags ?? [],
        icon: content.icon ?? '',
        author: typeof content.author === 'string' ? content.author : content.author?.name ?? '',
        repository: content.repository,
        license: content.license,
        verified: content.verified ?? false,
        featured: content.featured ?? false,
      })
    } catch (err) {
      console.error(`Failed to parse ${file}: ${err}`)
    }
  }

  // Sort: featured first, then alphabetical
  plugins.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    pluginCount: plugins.length,
    plugins,
    categories: CATEGORIES,
  }
}

export function generatePluginTable(plugins: any[]): string {
  if (plugins.length === 0) {
    return '| | Plugin | Description | Category | Version | |\n|---|--------|-------------|----------|---------|---|\n| | *No plugins yet* | [Submit yours →](CONTRIBUTING.md) | | | |'
  }

  const header = '| | Plugin | Description | Category | Version | |\n|---|--------|-------------|----------|---------|---|'
  const rows = plugins.map(p => {
    const icon = p.icon || '📦'
    const npmUrl = p.npm ? `https://www.npmjs.com/package/${p.npm}` : undefined
    const name = npmUrl ? `**[${p.displayName}](${npmUrl})**` : `**${p.displayName}**`
    const badge = p.verified ? '✓ verified' : ''
    return `| ${icon} | ${name} | ${p.description} | ${p.category} | \`${p.version}\` | ${badge} |`
  })

  return [header, ...rows].join('\n')
}

export function updateReadmePluginList(readmePath: string, plugins: any[]): boolean {
  if (!fs.existsSync(readmePath)) return false

  const readme = fs.readFileSync(readmePath, 'utf-8')
  const startMarker = '<!-- PLUGINS_START -->'
  const endMarker = '<!-- PLUGINS_END -->'

  const startIdx = readme.indexOf(startMarker)
  const endIdx = readme.indexOf(endMarker)
  if (startIdx === -1 || endIdx === -1) return false

  const table = generatePluginTable(plugins)
  const before = readme.slice(0, startIdx + startMarker.length)
  const after = readme.slice(endIdx)
  const newReadme = `${before}\n${table}\n${after}`

  // Update total count
  const countRegex = /\*\*Total: \d+ plugin[s]?\*\*/
  const finalReadme = newReadme.replace(countRegex, `**Total: ${plugins.length} plugin${plugins.length !== 1 ? 's' : ''}**`)

  fs.writeFileSync(readmePath, finalReadme)
  return true
}

// CLI entry point
if (process.argv[1]?.endsWith('build-registry.ts') || process.argv[1]?.endsWith('build-registry.js')) {
  const registry = buildRegistry('plugins')
  fs.writeFileSync('registry.json', JSON.stringify(registry, null, 2) + '\n')
  console.log(`✅ Built registry.json with ${registry.pluginCount} plugins`)

  // Update README plugin list
  if (updateReadmePluginList('README.md', registry.plugins)) {
    console.log('✅ Updated README.md plugin list')
  }
}
