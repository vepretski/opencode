export function TrustPolicyPage(props: { onNavigate: (next: string) => void }) {
  return (
    <main className="page dark">
      <h1>Trust & Compliance Policy</h1>
      <ul>
        <li>Explicit consent is required for account-linked civic data.</li>
        <li>Data minimization: only required fields are collected.</li>
        <li>Delete-my-data requests are supported and auditable.</li>
        <li>Civic intelligence is separated from public/political activity.</li>
        <li>Admin actions are recorded in immutable audit logs.</li>
      </ul>
      <button onClick={() => props.onNavigate("report")}>Back</button>
    </main>
  )
}
