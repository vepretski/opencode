import type { CivicCluster, CivicReport } from "../../lib/types"

export function buildClusters(reports: CivicReport[]) {
  const grouped = reports.reduce<Record<string, CivicReport[]>>((acc, report) => {
    const key = `${report.location.geohash.slice(0, 5)}:${report.category}`
    acc[key] = [...(acc[key] ?? []), report]
    return acc
  }, {})
  return Object.entries(grouped).map(([key, list]): CivicCluster => ({
    id: key,
    geohash_prefix: key.split(":")[0],
    issue_type: list[0].category,
    area_label: list[0].location.area_label,
    recurrence_7d: list.filter((item) => Date.now() - new Date(item.created_at).getTime() <= 604800000).length,
    urgency_score: Math.min(100, Math.round(list.reduce((sum, item) => sum + item.trust_score, 0) / list.length)),
    report_count: list.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}
