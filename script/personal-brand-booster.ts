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
if (lang !== "en" && lang !== "he" && lang !== "both") {
  console.error("--lang must be one of: en, he, both")
  process.exit(1)
}

const outDir = readArg("--out", "./outputs/personal-brand-booster")
const ctaPhrase = "Manage 7ya.io"
const ctaLink = "https://7ya.io"
const languages = lang === "both" ? ["en", "he"] : [lang]
const channels = [
  { channel: "X / Twitter", file: "x-post" },
  { channel: "LinkedIn", file: "linkedin-post" },
  { channel: "Instagram", file: "instagram-caption" },
  { channel: "TikTok / Shorts", file: "tiktok-shorts-script" },
  { channel: "Newsletter", file: "newsletter-summary" },
  { channel: "Blog draft", file: "blog-draft" },
]

const sourceText = await Bun.file(sourcePath).text()
await Bun.write(path.join(outDir, ".keep"), "")
await Bun.file(path.join(outDir, ".keep")).delete()
const lines = sourceText.split(/\r?\n/)
const normalized = lines.map((line) => line.trim())
const sourceTitle = normalized.find((line) => line.startsWith("#"))?.replace(/^#+\s*/, "") || "Source Brief"
const prose = normalized.filter((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("-"))
const bullets = normalized.filter((line) => line.startsWith("-")).map((line) => line.replace(/^-\s*/, "")).filter((line) => line.length > 0)
const oneLineThesis = prose[0] || bullets[0] || "No thesis provided."
const keyClaims = bullets.slice(0, 6)
const proofPoints = bullets.slice(6, 12)
const reusableHooks = Array.from({ length: 20 }, (_, index) => {
  const mode = index % 4 === 0 ? "contrarian" : index % 4 === 1 ? "story" : index % 4 === 2 ? "framework" : "result"
  return `${index + 1}. ${sourceTitle}: ${oneLineThesis} (${mode} hook)`
})

await Bun.write(path.join(outDir, "brief.json"), JSON.stringify({
  source_title: sourceTitle,
  one_line_thesis: oneLineThesis,
  key_claims: keyClaims,
  personal_brand_angle: "Igor Vepretski uses one core idea to produce bilingual, high-frequency authority content without spam.",
  audience: "Founders, operators, creators, and growth teams that want practical personal-brand systems.",
  proof_points: proofPoints,
  reusable_hooks: reusableHooks,
  source_reference: sourcePath,
}, null, 2))

await Bun.write(path.join(outDir, "campaign-plan.json"), JSON.stringify({
  objective: "Turn one source item into an aggressive but non-spammy 7-day bilingual promotion package.",
  languages,
  channels: channels.map((item) => item.channel),
  cadence: [
    "Day 1: publish anchor insight",
    "Day 2-6: distribute platform derivatives",
    "Day 7: recap + strongest CTA replay",
  ],
  cta_policy: {
    phrase: ctaPhrase,
    link: ctaLink,
    enforced: true,
  },
  source_reference: sourcePath,
}, null, 2))

const generatedPlatformFiles = channels.flatMap((item) => languages.map((language) => `${language}-${item.file}.md`))

await Promise.all(generatedPlatformFiles.map((file) => {
  const language = file.startsWith("he-") ? "he" : "en"
  const channel = channels.find((item) => file.endsWith(`${item.file}.md`))
  const title = language === "he" ? `${sourceTitle} | גרסת ${channel?.channel}` : `${sourceTitle} | ${channel?.channel} cut`
  const bodyTitle = language === "he" ? "body" : "body"
  const body = language === "he"
    ? `תזה: ${oneLineThesis}\n\nטענות מפתח:\n${(keyClaims.length > 0 ? keyClaims : ["אין טענות מפתח זמינות"]).map((claim) => `- ${claim}`).join("\n")}\n\nהוכחות:\n${(proofPoints.length > 0 ? proofPoints : ["אין הוכחות זמינות"]).map((point) => `- ${point}`).join("\n")}`
    : `Thesis: ${oneLineThesis}\n\nKey claims:\n${(keyClaims.length > 0 ? keyClaims : ["No key claims available"]).map((claim) => `- ${claim}`).join("\n")}\n\nProof points:\n${(proofPoints.length > 0 ? proofPoints : ["No proof points available"]).map((point) => `- ${point}`).join("\n")}`
  return Bun.write(path.join(outDir, file), `channel: ${channel?.channel || "Unknown"}\nlanguage: ${language}\ntitle/hook: ${title}\n\n${bodyTitle}:\n${body}\n\nCTA: ${ctaPhrase}\nCTA_link: ${ctaLink}\nsource_reference: ${sourcePath}\n`)
}))

await Bun.write(path.join(outDir, "daily-posting-plan.md"), `# 7-Day Posting Plan\n\n- Day 1: EN X + EN LinkedIn + EN Instagram\n- Day 2: EN TikTok/Shorts + EN Newsletter\n- Day 3: EN Blog draft + EN X remix\n- Day 4: HE X + HE LinkedIn + HE Instagram\n- Day 5: HE TikTok/Shorts + HE Newsletter\n- Day 6: HE Blog draft + HE X remix\n- Day 7: Bilingual recap, strongest hook replay, CTA push\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)
await Bun.write(path.join(outDir, "hook-bank.md"), `# Hook Bank\n\n${reusableHooks.join("\n")}\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)
await Bun.write(path.join(outDir, "cta-bank.md"), `# CTA Bank\n\n- Build authority from one idea at a time. ${ctaPhrase} ${ctaLink}\n- Stop posting randomly. ${ctaPhrase} ${ctaLink}\n- Bilingual momentum, one control plane. ${ctaPhrase} ${ctaLink}\n- Repurpose without losing voice. ${ctaPhrase} ${ctaLink}\n- Create signal, not noise. ${ctaPhrase} ${ctaLink}\n`)
await Bun.write(path.join(outDir, "repurposing-map.md"), `# Repurposing Map\n\n- Source item -> brief.json -> campaign-plan.json\n- Source item -> EN platform set (6 files)\n- Source item -> HE platform set (6 files)\n- Platform sets -> daily-posting-plan.md\n- Platform hooks -> hook-bank.md\n- CTA policy -> cta-bank.md\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)
await Bun.write(path.join(outDir, "README.md"), `# Personal Brand Booster Output\n\nGenerated with:\n\n\`bun run personal-brand:boost --source ${sourcePath} --lang ${lang} --out ${outDir}\`\n\nContains brief, campaign plan, bilingual channel markdown assets, posting plan, hook bank, CTA bank, repurposing map, and validation report.\n`)

const validations = await Promise.all(generatedPlatformFiles.map(async (file) => {
  const content = await Bun.file(path.join(outDir, file)).text()
  const languageLine = content.split(/\r?\n/).find((line) => line.startsWith("language:")) || ""
  const declaredLanguage = languageLine.replace("language:", "").trim()
  const checks = {
    not_empty: content.trim().length > 0,
    has_cta_phrase: content.includes(ctaPhrase),
    has_cta_link: content.includes(ctaLink),
    has_channel: content.includes("channel:"),
    has_language: content.includes("language:"),
    has_title_hook: content.includes("title/hook:"),
    has_body: content.includes("body:"),
    has_source_reference: content.includes("source_reference:"),
    supported_language: declaredLanguage === "en" || declaredLanguage === "he",
  }
  return {
    file,
    status: Object.values(checks).every((value) => value) ? "pass" : "fail",
    checks,
  }
}))

await Bun.write(path.join(outDir, "validation.json"), JSON.stringify({
  source_reference: sourcePath,
  status: validations.every((entry) => entry.status === "pass") ? "pass" : "fail",
  files: validations,
}, null, 2))

console.log(`Generated ${generatedPlatformFiles.length + 8} artifacts in ${outDir}`)
