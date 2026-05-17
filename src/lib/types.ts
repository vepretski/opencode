export type ReportCategory =
  | "safety"
  | "infrastructure"
  | "lighting"
  | "vandalism"
  | "noise"
  | "community_support"

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_more_info"

export type UserRole = "public" | "reviewer" | "admin" | "editor" | "starton_manager"

export type CivicReport = {
  id: string
  category: ReportCategory
  summary: string
  details: string
  location: {
    area_label: string
    geohash: string
  }
  trust_score: number
  rumor_flag: boolean
  emergency_disclaimer_seen: boolean
  media_urls: string[]
  created_at: string
  created_by: string
  status: ReviewStatus
}

export type CivicCluster = {
  id: string
  area_label: string
  geohash_prefix: string
  issue_type: ReportCategory
  recurrence_7d: number
  urgency_score: number
  report_count: number
  created_at: string
  updated_at: string
}
