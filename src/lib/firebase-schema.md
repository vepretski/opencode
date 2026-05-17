# Firebase / Firestore Schema (7YA Civic Intelligence OS)

## Collections

### `users/{uid}`
- `role`: `public | reviewer | admin | editor | starton_manager`
- `display_name`: string
- `languages`: string[] (`he`, `ru`, `en`)
- `consent`: { `accepted`: boolean, `accepted_at`: timestamp }
- `created_at`: timestamp

### `civic_reports/{report_id}`
- `category`: `safety | infrastructure | lighting | vandalism | noise | community_support`
- `summary`: string
- `details`: string
- `location`: { `area_label`: string, `geohash`: string }
- `trust_score`: number (0-100)
- `rumor_flag`: boolean
- `emergency_disclaimer_seen`: boolean
- `media_urls`: string[]
- `created_by`: uid
- `created_at`: timestamp
- `status`: `pending | approved | rejected | needs_more_info`
- `review_notes`: string

### `report_reviews/{review_id}`
- `report_id`: string
- `action`: `approved | rejected | needs_more_info`
- `reviewer_uid`: uid
- `note`: string
- `created_at`: timestamp

### `civic_clusters/{cluster_id}`
- `area_label`: string
- `geohash_prefix`: string
- `issue_type`: report category
- `recurrence_7d`: number
- `urgency_score`: number
- `report_count`: number
- `created_at`: timestamp
- `updated_at`: timestamp

### `insight_exports/{export_id}`
- `title`: string
- `period_start`: timestamp
- `period_end`: timestamp
- `summary_markdown`: string
- `anonymized`: true
- `created_by`: uid
- `created_at`: timestamp

### `magazine_drafts/{draft_id}`
- `date_key`: string (YYYY-MM-DD)
- `language`: `he | ru | en`
- `sections`: array
- `status`: `draft | approved | published`
- `created_by`: uid
- `created_at`: timestamp

### `starton_leads/{lead_id}`
- `name`: string
- `email`: string
- `interest_type`: `youth_program | volunteer | mentor | partner | donation`
- `note`: string
- `consent`: boolean
- `created_at`: timestamp

### `audit_logs/{log_id}`
- `actor_uid`: uid
- `action`: string
- `entity_type`: string
- `entity_id`: string
- `metadata`: map
- `created_at`: timestamp
