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

const outDir = readArg("--out", "./outputs/personal-brand-booster")
const ctaPhrase = "Manage 7ya.io"
const ctaLink = "https://7ya.io"
const channels = [
  { key: "x", label: "X / Twitter", file: "x-post" },
  { key: "linkedin", label: "LinkedIn", file: "linkedin-post" },
  { key: "instagram", label: "Instagram", file: "instagram-caption" },
  { key: "tiktok", label: "TikTok / Shorts", file: "tiktok-shorts-script" },
  { key: "newsletter", label: "Newsletter", file: "newsletter-summary" },
  { key: "blog", label: "Blog", file: "blog-draft" },
]

const sourceText = await Bun.file(sourcePath).text()
await Bun.write(path.join(outDir, ".keep"), "")
await Bun.file(path.join(outDir, ".keep")).delete()
const lines = sourceText.split(/\r?\n/)
const cleanLines = lines.map((line) => line.trim())
const sourceTitle = cleanLines.find((line) => line.startsWith("#"))?.replace(/^#+\s*/, "") || "Source Brief"
const nonHeading = cleanLines.filter((line) => line.length > 0 && !line.startsWith("#"))
const oneLineThesis = nonHeading.find((line) => !line.startsWith("-")) || "No thesis provided."
const bullets = cleanLines.filter((line) => line.startsWith("-")).map((line) => line.replace(/^-\s*/, "")).filter((line) => line.length > 0)
const keyClaims = bullets.slice(0, 6)
const proofPoints = bullets.slice(6, 10)
const personalBrandAngle = `Igor Vepretski turns one source insight into a bilingual growth narrative tied directly to ${ctaPhrase}.`
const audience = "Founders, operators, creators, and growth-minded builders exploring practical personal-brand systems."
const languages = lang === "both" ? ["en", "he"] : [lang]

const getLanguageLabel = (language: string) => language === "he" ? "Hebrew" : "English"
const getHookPrefix = (language: string) => language === "he" ? "הוק" : "Hook"
const getBodyIntro = (language: string) => language === "he"
  ? `תזה: ${oneLineThesis}`
  : `Thesis: ${oneLineThesis}`
const getClaimLabel = (language: string) => language === "he" ? "טענות מפתח" : "Key claims"
const getProofLabel = (language: string) => language === "he" ? "הוכחות" : "Proof points"
const getSourceLabel = (language: string) => language === "he" ? "מקור" : "source_reference"

await Bun.write(path.join(outDir, "brief.json"), JSON.stringify({
  source_path: sourcePath,
  source_title: sourceTitle,
  one_line_thesis: oneLineThesis,
  key_claims: keyClaims,
  personal_brand_angle: personalBrandAngle,
  audience,
  proof_points: proofPoints,
  reusable_hooks: Array.from({ length: 20 }, (_, i) => `#${i + 1} ${sourceTitle} -> ${oneLineThesis}`),
  channels: channels.map((channel) => channel.label),
  languages,
}, null, 2))

await Bun.write(path.join(outDir, "campaign-plan.json"), JSON.stringify({
  objective: "Aggressive but non-spammy personal brand amplification from one source asset.",
  source_title: sourceTitle,
  audience,
  sequence: [
    "Publish anchor blog draft",
    "Launch social posts in both languages",
    "Drive follow-up newsletter and short-form videos",
    "Route all engagement through CTA policy",
  ],
  cta_policy: { phrase: ctaPhrase, link: ctaLink },
  channels: channels.map((channel) => ({ channel: channel.label, cadence: "1 primary + 1 derivative" })),
}, null, 2))

const generatedMarkdownFiles: string[] = []
for (const language of languages) {
  for (const channel of channels) {
    const fileName = `${language}-${channel.file}.md`
    const content = `channel: ${channel.label}\nlanguage: ${getLanguageLabel(language)}\ntitle/hook: ${getHookPrefix(language)}: ${sourceTitle} / ${channel.label}\n\nbody:\n${getBodyIntro(language)}\n\n${getClaimLabel(language)}:\n${keyClaims.map((item) => `- ${item}`).join("\n") || "- N/A"}\n\n${getProofLabel(language)}:\n${proofPoints.map((item) => `- ${item}`).join("\n") || "- N/A"}\n\nCTA: ${ctaPhrase}\nCTA_link: ${ctaLink}\n${getSourceLabel(language)}: ${sourcePath}\n`
    await Bun.write(path.join(outDir, fileName), content)
    generatedMarkdownFiles.push(fileName)
  }
}

await Bun.write(path.join(outDir, "daily-posting-plan.md"), `# 7-Day Posting Plan\n\n1. Day 1: Publish ${languages.includes("en") ? "English" : "primary"} X + LinkedIn\n2. Day 2: Publish Instagram + TikTok/Shorts\n3. Day 3: Publish newsletter summary\n4. Day 4: Publish blog draft recap\n5. Day 5: Publish Hebrew X + LinkedIn\n6. Day 6: Publish Hebrew Instagram + TikTok/Shorts\n7. Day 7: Publish bilingual wrap-up with CTA\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)

await Bun.write(path.join(outDir, "hook-bank.md"), `# Hook Bank\n\n${Array.from({ length: 20 }, (_, i) => `${i + 1}. ${sourceTitle}: ${oneLineThesis} (${i % 2 === 0 ? "data" : "story"} angle)`).join("\n")}\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)

await Bun.write(path.join(outDir, "cta-bank.md"), `# CTA Bank\n\n- Start with clarity. ${ctaPhrase} -> ${ctaLink}\n- Build the system, not random posts. ${ctaPhrase} -> ${ctaLink}\n- Turn attention into outcomes. ${ctaPhrase} -> ${ctaLink}\n- Bilingual brand, single destination. ${ctaPhrase} -> ${ctaLink}\n`)

await Bun.write(path.join(outDir, "repurposing-map.md"), `# Repurposing Map\n\n- Source -> Blog draft -> Newsletter summary\n- Source -> X + LinkedIn (EN/HE variants)\n- Source -> Instagram caption + TikTok/Shorts script\n- Newsletter replies -> next week's hook bank\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)

await Bun.write(path.join(outDir, "README.md"), `# Personal Brand Booster Output\n\nThis folder is generated by:\n\n\`bun run personal-brand:boost --source ${sourcePath} --lang ${lang} --out ${outDir}\`\n\nIncludes bilingual channel files, campaign plan, posting plan, hook bank, CTA bank, repurposing map, and validation report.\n`)

const requiredKeys = ["channel", "language", "title/hook", "body", "CTA", "source_reference"]
const validation = await Promise.all(generatedMarkdownFiles.map(async (file) => {
  const content = await Bun.file(path.join(outDir, file)).text()
  const languageLine = content.split(/\r?\n/).find((line) => line.startsWith("language:")) || ""
  const languageValid = languageLine.includes("English") || languageLine.includes("Hebrew")
  return {
    file,
    pass: content.trim().length > 0
      && requiredKeys.every((key) => content.includes(`${key}:`) || (key === "body" && content.includes("body:")))
      && content.includes(ctaPhrase)
      && content.includes(ctaLink)
      && content.includes("channel:")
      && languageValid,
    checks: {
      not_empty: content.trim().length > 0,
      has_channel: content.includes("channel:"),
      has_language: content.includes("language:"),
      has_title_hook: content.includes("title/hook:"),
      has_body: content.includes("body:"),
      has_cta_phrase: content.includes(ctaPhrase),
      has_cta_link: content.includes(ctaLink),
      has_source_reference: content.includes("source_reference:") || content.includes("מקור:"),
      supported_language: languageValid,
    },
  }
}))

await Bun.write(path.join(outDir, "validation.json"), JSON.stringify({
  source_path: sourcePath,
  output_path: outDir,
  status: validation.every((item) => item.pass) ? "pass" : "fail",
  files: validation,
}, null, 2))

console.log(`Generated ${generatedMarkdownFiles.length + 8} artifacts in ${outDir}`)
