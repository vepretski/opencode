import { useState } from "react"
import { CivicReportForm } from "../modules/civic-radar/CivicReportForm"
import { AdminOpsRoom } from "../modules/admin-ops/AdminOpsRoom"
import { CommunityMagazinePage } from "../modules/community-magazine/CommunityMagazinePage"
import { StartOnPage } from "../modules/starton/StartOnPage"
import { TrustPolicyPage } from "../modules/trust-compliance/TrustPolicyPage"

export function App() {
  const [tab, setTab] = useState("report")
  if (tab === "admin") return <AdminOpsRoom onNavigate={setTab} />
  if (tab === "magazine") return <CommunityMagazinePage onNavigate={setTab} />
  if (tab === "starton") return <StartOnPage onNavigate={setTab} />
  if (tab === "trust") return <TrustPolicyPage onNavigate={setTab} />
  return <CivicReportForm onNavigate={setTab} />
}
