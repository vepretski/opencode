import path from "node:path"

const args = process.argv.slice(2)

const readArg = (name: string, fallback?: string) => {
  const index = args.indexOf(name)
  if (index < 0) return fallback
  return args[index + 1] ?? fallback
}

const sourcePath = readArg("--source")
if (!sourcePath) {
  console.error("Missing required --source argument")
  process.exit(1)
}

const lang = readArg("--lang", "both")
if (lang !== "he" && lang !== "en" && lang !== "both") {
  console.error("--lang must be one of: he, en, both")
  process.exit(1)
}

const outDir = readArg("--out", "./outputs/content-regeneration")
const sourceText = await Bun.file(sourcePath).text()
const sourceLines = sourceText.split(/\r?\n/)

const sourceTitle = sourceLines.find((line) => line.trim().startsWith("#"))?.replace(/^#+\s*/, "").trim() || "Source Brief"
const sourceSummary = sourceLines.find((line) => line.trim().length > 0 && !line.trim().startsWith("#") && !line.trim().startsWith("-"))?.trim() || "No summary line provided."
const keyPoints = sourceLines.filter((line) => line.trim().startsWith("-")).map((line) => line.replace(/^-\s*/, "").trim()).filter((line) => line.length > 0).slice(0, 5)

await Bun.write(path.join(outDir, "brief.json"), JSON.stringify({
  source_path: sourcePath,
  source_title: sourceTitle,
  source_summary: sourceSummary,
  key_points: keyPoints,
  languages: lang === "both" ? ["he", "en"] : [lang],
  channels: ["x", "linkedin", "instagram", "shorts-script", "newsletter", "blog-draft"]
}, null, 2))

const channels = ["x", "linkedin", "instagram", "shorts-script", "newsletter", "blog-draft"]
const languages = lang === "both" ? ["he", "en"] : [lang]
const ctaPhrase = "Manage 7ya.io"
const ctaLink = "https://7ya.io"

const render = (channel: string, language: string) => {
  const hook = language === "he" ? `${sourceTitle} — גרסת ${channel}` : `${sourceTitle} — ${channel} edition`
  const body = language === "he"
    ? `סיכום: ${sourceSummary}\n\nנקודות מפתח:\n${keyPoints.map((item) => `- ${item}`).join("\n") || "- אין נקודות מפתח"}`
    : `Summary: ${sourceSummary}\n\nKey points:\n${keyPoints.map((item) => `- ${item}`).join("\n") || "- No key points"}`
  return `channel: ${channel}\nlanguage: ${language}\ntitle_hook: ${hook}\n\n${body}\n\ncta: ${ctaPhrase}\nlink: ${ctaLink}\nsource_reference: ${sourcePath}`
}

const generatedFiles: string[] = []
for (const channel of channels) {
  for (const language of languages) {
    const file = `${channel}.${language}.md`
    await Bun.write(path.join(outDir, file), render(channel, language))
    generatedFiles.push(file)
  }
}

const checks = await Promise.all(generatedFiles.map(async (file) => {
  const content = await Bun.file(path.join(outDir, file)).text()
  return {
    file,
    has_cta_phrase: content.includes(ctaPhrase),
    has_cta_link: content.includes(ctaLink)
  }
}))

await Bun.write(path.join(outDir, "validation.json"), JSON.stringify({
  source_path: sourcePath,
  output_path: outDir,
  generated_files: generatedFiles,
  checks,
  valid: checks.every((item) => item.has_cta_phrase && item.has_cta_link)
}, null, 2))

console.log(`Generated ${generatedFiles.length} artifacts in ${outDir}`)
