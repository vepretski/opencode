export function AdminOpsRoom(props: { onNavigate: (next: string) => void }) {
  return (
    <main className="page dark">
      <h1>Admin Ops Room</h1>
      <div className="grid two">
        <section className="card"><h2>Review queue</h2><p>Approve / reject / request more info.</p></section>
        <section className="card"><h2>Clusters</h2><p>Location + issue recurrence + urgency.</p></section>
        <section className="card"><h2>Civic brief export</h2><p>Export anonymized neutral summaries only.</p></section>
        <section className="card"><h2>Magazine drafts</h2><p>Manage multilingual daily drafts.</p></section>
        <section className="card"><h2>StartOn leads</h2><p>Manage mentor/volunteer/partner interest.</p></section>
      </div>
      <button onClick={() => props.onNavigate("report")}>Back</button>
    </main>
  )
}
