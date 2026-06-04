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
  {
    channel: "X / Twitter",
    file: "x-post",
    syncRole: "Fast public narrative, quote-card threads, and rapid response",
    reachAction: "Post the sharpest claim first, reply to 5 Israeli civic/media accounts, then pin the 7ya.io CTA for 24 hours.",
  },
  {
    channel: "LinkedIn",
    file: "linkedin-post",
    syncRole: "Credibility layer for operators, civic leaders, donors, and professional allies",
    reachAction: "Publish a calmer proof-led version and tag partners only when they are directly relevant.",
  },
  {
    channel: "Instagram",
    file: "instagram-caption",
    syncRole: "Visual trust, Reels captions, carousel proof, and Stories reminders",
    reachAction: "Turn the thesis into a 5-slide carousel, add Hebrew-first Stories, and use the CTA sticker to route to 7ya.io.",
  },
  {
    channel: "TikTok",
    file: "tiktok-shorts-script",
    syncRole: "Youth reach, direct-to-camera field clips, and emotional hooks",
    reachAction: "Open with a 2-second Israeli street-level problem, keep one idea per video, and ask viewers to save/share.",
  },
  {
    channel: "YouTube Shorts",
    file: "youtube-shorts-script",
    syncRole: "Searchable short video archive and cross-post home for vertical clips",
    reachAction: "Reuse the TikTok cut with a clearer title, burned-in Hebrew captions, and a pinned 7ya.io comment.",
  },
  {
    channel: "Facebook",
    file: "facebook-post",
    syncRole: "Local community groups, older audiences, and Russian/Hebrew civic discussion",
    reachAction: "Post the practical community angle, ask one question, and avoid over-posting into groups without context.",
  },
  {
    channel: "Threads",
    file: "threads-post",
    syncRole: "Lightweight conversation bridge between Instagram audience and public text updates",
    reachAction: "Publish a concise 3-part thought chain and manually answer early comments in the first hour.",
  },
  {
    channel: "Telegram",
    file: "telegram-broadcast",
    syncRole: "Primary broadcast layer for supporters, volunteers, and high-signal updates",
    reachAction: "Send the cleanest summary, one action, one link, and forward the follow-up only after meaningful engagement.",
  },
  {
    channel: "WhatsApp Broadcast",
    file: "whatsapp-broadcast",
    syncRole: "Low-noise direct distribution to trusted lists and local coordinators",
    reachAction: "Send one compact message with a clear forward instruction and no more than one CTA link.",
  },
  {
    channel: "Viber",
    file: "viber-message",
    syncRole: "Legacy community reach for Russian-speaking and older supporter clusters",
    reachAction: "Mirror the WhatsApp version, emphasize local usefulness, and keep the tone personal rather than campaign-like.",
  },
  {
    channel: "Newsletter",
    file: "newsletter-summary",
    syncRole: "Owned audience memory, weekly synthesis, and conversion recap",
    reachAction: "Bundle the best public reactions, proof points, and one primary 7ya.io action.",
  },
  {
    channel: "Blog draft",
    file: "blog-draft",
    syncRole: "Canonical SEO and long-form source of truth on 7ya.io",
    reachAction: "Publish the complete argument with UTM-ready links to every social derivative.",
  },
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
  personal_brand_angle: "Igor Vepretski uses one Israeli civic leadership idea to produce bilingual, high-frequency authority content without spam.",
  audience: "Israeli voters, young civic leaders, Russian-speaking community members, local operators, journalists, volunteers, and supporters who need practical updates they can share.",
  proof_points: proofPoints,
  reusable_hooks: reusableHooks,
  source_reference: sourcePath,
}, null, 2))

await Bun.write(path.join(outDir, "campaign-plan.json"), JSON.stringify({
  objective: "Turn one source item into a synchronized, non-spammy 7-day Israeli influencer promotion package that reaches every active 7ya.io platform.",
  languages,
  channels: channels.map((item) => item.channel),
  sync_strategy: channels.map((item) => ({
    channel: item.channel,
    role: item.syncRole,
    reach_action: item.reachAction,
  })),
  cadence: [
    "Day 1: publish the 7ya.io blog anchor, EN/HE X, LinkedIn, Instagram carousel, and Telegram summary",
    "Day 2: release TikTok + YouTube Shorts from the same vertical cut and repost as Instagram Reel",
    "Day 3: send WhatsApp/Viber compact forward message and answer high-signal comments",
    "Day 4: publish Facebook + Threads conversation prompts with proof-first framing",
    "Day 5: remix strongest comment into short video and X/Threads follow-up",
    "Day 6: newsletter recap with best public reactions and one concrete 7ya.io action",
    "Day 7: bilingual recap, strongest hook replay, CTA push, and metrics review",
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
  return Bun.write(path.join(outDir, file), `channel: ${channel?.channel || "Unknown"}\nlanguage: ${language}\ntitle/hook: ${title}\n\n${bodyTitle}:\n${body}\n\nsync_role: ${channel?.syncRole || "Unknown"}\nreach_action: ${channel?.reachAction || "Unknown"}\n\nCTA: ${ctaPhrase}\nCTA_link: ${ctaLink}\nsource_reference: ${sourcePath}\n`)
}))

await Bun.write(path.join(outDir, "daily-posting-plan.md"), `# 7-Day Posting Plan

- Day 1: Publish the 7ya.io blog anchor, EN/HE X, LinkedIn, Instagram carousel, and Telegram summary.
- Day 2: Release TikTok + YouTube Shorts from the same vertical cut and repost as Instagram Reel.
- Day 3: Send WhatsApp/Viber compact forward message and answer high-signal comments.
- Day 4: Publish Facebook + Threads conversation prompts with proof-first framing.
- Day 5: Remix strongest comment into short video and X/Threads follow-up.
- Day 6: Newsletter recap with best public reactions and one concrete 7ya.io action.
- Day 7: Bilingual recap, strongest hook replay, CTA push, and metrics review.

CTA: ${ctaPhrase}
${ctaLink}
source_reference: ${sourcePath}
`)
await Bun.write(path.join(outDir, "hook-bank.md"), `# Hook Bank\n\n${reusableHooks.join("\n")}\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`)
await Bun.write(path.join(outDir, "cta-bank.md"), `# CTA Bank\n\n- Build authority from one idea at a time. ${ctaPhrase} ${ctaLink}\n- Stop posting randomly. ${ctaPhrase} ${ctaLink}\n- Bilingual momentum, one control plane. ${ctaPhrase} ${ctaLink}\n- Repurpose without losing voice. ${ctaPhrase} ${ctaLink}\n- Create signal, not noise. ${ctaPhrase} ${ctaLink}\n`)
await Bun.write(path.join(outDir, "repurposing-map.md"), `# Repurposing Map

- Source item -> brief.json -> campaign-plan.json
- Source item -> EN platform set (${channels.length} files)
- Source item -> HE platform set (${channels.length} files)
- Blog draft -> canonical 7ya.io source of truth
- TikTok script -> YouTube Shorts + Instagram Reel variant
- Telegram broadcast -> WhatsApp Broadcast + Viber compact direct-message variants
- X / Twitter post -> Threads conversation bridge + Facebook community prompt
- LinkedIn post -> newsletter professional recap
- Platform sets -> daily-posting-plan.md
- Platform sync roles -> platform-sync-playbook.md
- Platform hooks -> hook-bank.md
- CTA policy -> cta-bank.md

CTA: ${ctaPhrase}
${ctaLink}
source_reference: ${sourcePath}
`)
await Bun.write(path.join(outDir, "platform-sync-playbook.md"), `# Platform Sync Playbook

${channels.map((item) => `## ${item.channel}\n\n- Role: ${item.syncRole}\n- Reach action: ${item.reachAction}`).join("\n\n")}

## Operating Rules

- Keep 7ya.io as the canonical link and UTM source of truth.
- Publish Hebrew-first when addressing Israeli civic action; mirror in English for allies, press, and diaspora reach.
- Reuse one core proof point per platform so every post feels native but stays synchronized.
- Reply during the first hour on text platforms and the first two hours on video platforms.
- Review saves, shares, replies, link clicks, and volunteer signups before choosing the next remix.

CTA: ${ctaPhrase}
${ctaLink}
source_reference: ${sourcePath}
`)

await Bun.write(path.join(outDir, "README.md"), `# Personal Brand Booster Output\n\nGenerated with:\n\n\`bun run personal-brand:boost --source ${sourcePath} --lang ${lang} --out ${outDir}\`\n\nContains brief, campaign plan, bilingual channel markdown assets, posting plan, platform sync playbook, hook bank, CTA bank, repurposing map, and validation report.\n`)

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
    has_sync_role: content.includes("sync_role:"),
    has_reach_action: content.includes("reach_action:"),
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

console.log(`Generated ${generatedPlatformFiles.length + 9} artifacts in ${outDir}`)
