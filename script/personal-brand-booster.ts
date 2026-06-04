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
const campaignId = path.basename(outDir).replace(/[^a-zA-Z0-9_-]/g, "-") || "personal-brand-booster"
const languages = lang === "both" ? ["en", "he"] : [lang]
const channels = [
  { channel: "X / Twitter", key: "x", file: "x-post", medium: "social", cadence: "Day 1 and Day 3 remix" },
  { channel: "LinkedIn", key: "linkedin", file: "linkedin-post", medium: "social", cadence: "Day 1 authority post" },
  {
    channel: "Instagram",
    key: "instagram",
    file: "instagram-caption",
    medium: "social",
    cadence: "Day 1 carousel/caption",
  },
  {
    channel: "TikTok / Shorts",
    key: "tiktok-shorts",
    file: "tiktok-shorts-script",
    medium: "social_video",
    cadence: "Day 2 short-form video",
  },
  {
    channel: "Newsletter",
    key: "newsletter",
    file: "newsletter-summary",
    medium: "email",
    cadence: "Day 2 subscriber send",
  },
  { channel: "Blog draft", key: "blog", file: "blog-draft", medium: "owned", cadence: "Day 3 owned anchor" },
]

const sourceText = await Bun.file(sourcePath).text()
await Bun.write(path.join(outDir, ".keep"), "")
await Bun.file(path.join(outDir, ".keep")).delete()
const lines = sourceText.split(/\r?\n/)
const normalized = lines.map((line) => line.trim())
const sourceTitle = normalized.find((line) => line.startsWith("#"))?.replace(/^#+\s*/, "") || "Source Brief"
const prose = normalized.filter((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("-"))
const bullets = normalized
  .filter((line) => line.startsWith("-"))
  .map((line) => line.replace(/^-\s*/, ""))
  .filter((line) => line.length > 0)
const oneLineThesis = prose[0] || bullets[0] || "No thesis provided."
const keyClaims = bullets.slice(0, 6)
const proofPoints = bullets.slice(6, 12)
const reusableHooks = Array.from({ length: 20 }, (_, index) => {
  const mode = index % 4 === 0 ? "contrarian" : index % 4 === 1 ? "story" : index % 4 === 2 ? "framework" : "result"
  return `${index + 1}. ${sourceTitle}: ${oneLineThesis} (${mode} hook)`
})
const generatedPlatformItems = channels.flatMap((item) =>
  languages.map((language) => ({
    ...item,
    language,
    fileName: `${language}-${item.file}.md`,
    syncKey: `${campaignId}:${language}:${item.key}`,
    crossPostGroup: `${campaignId}:${language}`,
    utmUrl: `${ctaLink}?utm_source=${item.key}&utm_medium=${item.medium}&utm_campaign=${campaignId}&utm_content=${language}-${item.file}`,
  })),
)

await Bun.write(
  path.join(outDir, "brief.json"),
  JSON.stringify(
    {
      source_title: sourceTitle,
      one_line_thesis: oneLineThesis,
      key_claims: keyClaims,
      personal_brand_angle:
        "Igor Vepretski uses one core idea to produce bilingual, high-frequency authority content without spam.",
      audience: "Founders, operators, creators, and growth teams that want practical personal-brand systems.",
      proof_points: proofPoints,
      reusable_hooks: reusableHooks,
      source_reference: sourcePath,
    },
    null,
    2,
  ),
)

await Bun.write(
  path.join(outDir, "campaign-plan.json"),
  JSON.stringify(
    {
      objective: "Turn one source item into an aggressive but non-spammy 7-day bilingual promotion package.",
      campaign_id: campaignId,
      languages,
      channels: channels.map((item) => item.channel),
      sync_policy: {
        enabled: true,
        manifest: "social-sync-manifest.json",
        checklist: "social-sync-checklist.md",
        platforms: channels.map((item) => item.key),
        rule: "Every generated platform file carries a sync key, cross-post group, canonical CTA, and platform-specific UTM URL.",
      },
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
    },
    null,
    2,
  ),
)

await Promise.all(
  generatedPlatformItems.map((item) => {
    const title =
      item.language === "he" ? `${sourceTitle} | גרסת ${item.channel}` : `${sourceTitle} | ${item.channel} cut`
    const body =
      item.language === "he"
        ? `תזה: ${oneLineThesis}\n\nטענות מפתח:\n${(keyClaims.length > 0 ? keyClaims : ["אין טענות מפתח זמינות"]).map((claim) => `- ${claim}`).join("\n")}\n\nהוכחות:\n${(proofPoints.length > 0 ? proofPoints : ["אין הוכחות זמינות"]).map((point) => `- ${point}`).join("\n")}`
        : `Thesis: ${oneLineThesis}\n\nKey claims:\n${(keyClaims.length > 0 ? keyClaims : ["No key claims available"]).map((claim) => `- ${claim}`).join("\n")}\n\nProof points:\n${(proofPoints.length > 0 ? proofPoints : ["No proof points available"]).map((point) => `- ${point}`).join("\n")}`
    return Bun.write(
      path.join(outDir, item.fileName),
      `channel: ${item.channel}\nplatform_key: ${item.key}\nlanguage: ${item.language}\nsync_status: ready\nsync_key: ${item.syncKey}\ncross_post_group: ${item.crossPostGroup}\ncanonical_url: ${ctaLink}\nutm_url: ${item.utmUrl}\ntitle/hook: ${title}\n\nbody:\n${body}\n\nCTA: ${ctaPhrase}\nCTA_link: ${ctaLink}\nsource_reference: ${sourcePath}\n`,
    )
  }),
)

const syncManifest = {
  campaign_id: campaignId,
  source_reference: sourcePath,
  canonical_cta: {
    phrase: ctaPhrase,
    link: ctaLink,
  },
  status: "ready",
  platforms: generatedPlatformItems.map((item) => ({
    file: item.fileName,
    channel: item.channel,
    platform_key: item.key,
    language: item.language,
    sync_status: "ready",
    sync_key: item.syncKey,
    cross_post_group: item.crossPostGroup,
    canonical_url: ctaLink,
    utm_url: item.utmUrl,
    cadence: item.cadence,
  })),
}

await Bun.write(path.join(outDir, "social-sync-manifest.json"), JSON.stringify(syncManifest, null, 2))

await Bun.write(
  path.join(outDir, "social-sync-checklist.md"),
  `# Social Sync Checklist\n\nCampaign: ${campaignId}\nSource: ${sourcePath}\n\n| Status | Language | Platform | File | UTM URL |\n| --- | --- | --- | --- | --- |\n${generatedPlatformItems.map((item) => `| ready | ${item.language.toUpperCase()} | ${item.channel} | ${item.fileName} | ${item.utmUrl} |`).join("\n")}\n\nCanonical CTA: ${ctaPhrase}\n${ctaLink}\n`,
)
await Bun.write(
  path.join(outDir, "daily-posting-plan.md"),
  `# 7-Day Posting Plan\n\n- Day 1: EN X + EN LinkedIn + EN Instagram\n- Day 2: EN TikTok/Shorts + EN Newsletter\n- Day 3: EN Blog draft + EN X remix\n- Day 4: HE X + HE LinkedIn + HE Instagram\n- Day 5: HE TikTok/Shorts + HE Newsletter\n- Day 6: HE Blog draft + HE X remix\n- Day 7: Bilingual recap, strongest hook replay, CTA push\n\nSync source: social-sync-manifest.json\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`,
)
await Bun.write(
  path.join(outDir, "hook-bank.md"),
  `# Hook Bank\n\n${reusableHooks.join("\n")}\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`,
)
await Bun.write(
  path.join(outDir, "cta-bank.md"),
  `# CTA Bank\n\n- Build authority from one idea at a time. ${ctaPhrase} ${ctaLink}\n- Stop posting randomly. ${ctaPhrase} ${ctaLink}\n- Bilingual momentum, one control plane. ${ctaPhrase} ${ctaLink}\n- Repurpose without losing voice. ${ctaPhrase} ${ctaLink}\n- Create signal, not noise. ${ctaPhrase} ${ctaLink}\n`,
)
await Bun.write(
  path.join(outDir, "repurposing-map.md"),
  `# Repurposing Map\n\n- Source item -> brief.json -> campaign-plan.json\n- Source item -> social-sync-manifest.json\n- Source item -> EN platform set (6 files)\n- Source item -> HE platform set (6 files)\n- Platform sets -> social-sync-checklist.md -> daily-posting-plan.md\n- Platform hooks -> hook-bank.md\n- CTA policy -> cta-bank.md\n\nCTA: ${ctaPhrase}\n${ctaLink}\nsource_reference: ${sourcePath}\n`,
)
await Bun.write(
  path.join(outDir, "README.md"),
  `# Personal Brand Booster Output\n\nGenerated with:\n\n\`bun run personal-brand:boost --source ${sourcePath} --lang ${lang} --out ${outDir}\`\n\nContains brief, campaign plan, social sync manifest, social sync checklist, bilingual channel markdown assets, posting plan, hook bank, CTA bank, repurposing map, and validation report.\n`,
)

const validations = await Promise.all(
  generatedPlatformItems.map(async (item) => {
    const content = await Bun.file(path.join(outDir, item.fileName)).text()
    const languageLine = content.split(/\r?\n/).find((line) => line.startsWith("language:")) || ""
    const declaredLanguage = languageLine.replace("language:", "").trim()
    const checks = {
      not_empty: content.trim().length > 0,
      has_cta_phrase: content.includes(ctaPhrase),
      has_cta_link: content.includes(ctaLink),
      has_channel: content.includes("channel:"),
      has_platform_key: content.includes(`platform_key: ${item.key}`),
      has_language: content.includes("language:"),
      has_sync_status: content.includes("sync_status: ready"),
      has_sync_key: content.includes(`sync_key: ${item.syncKey}`),
      has_cross_post_group: content.includes(`cross_post_group: ${item.crossPostGroup}`),
      has_canonical_url: content.includes(`canonical_url: ${ctaLink}`),
      has_utm_url: content.includes(`utm_url: ${item.utmUrl}`),
      has_title_hook: content.includes("title/hook:"),
      has_body: content.includes("body:"),
      has_source_reference: content.includes("source_reference:"),
      supported_language: declaredLanguage === "en" || declaredLanguage === "he",
    }
    return {
      file: item.fileName,
      status: Object.values(checks).every((value) => value) ? "pass" : "fail",
      checks,
    }
  }),
)
const syncChecks = {
  has_manifest: generatedPlatformItems.length === syncManifest.platforms.length,
  all_platforms_ready: syncManifest.platforms.every((item) => item.sync_status === "ready"),
  all_platform_files_valid: validations.every((entry) => entry.status === "pass"),
}

await Bun.write(
  path.join(outDir, "validation.json"),
  JSON.stringify(
    {
      source_reference: sourcePath,
      status: Object.values(syncChecks).every((value) => value) ? "pass" : "fail",
      sync: syncChecks,
      files: validations,
    },
    null,
    2,
  ),
)

console.log(`Generated ${generatedPlatformItems.length + 10} artifacts in ${outDir}`)
