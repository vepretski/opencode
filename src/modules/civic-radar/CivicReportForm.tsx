import { useState } from "react"

export function CivicReportForm(props: { onNavigate: (next: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <main className="page dark">
      <header>
        <h1>Civic Radar</h1>
        <p>Report local issues safely. Personal data is never shown publicly.</p>
      </header>
      <section className="card warning">
        <strong>Emergency disclaimer:</strong> For active emergencies, call official emergency services immediately.
      </section>
      {!submitted && (
        <form className="card grid" onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}>
          <label>Category<select required><option>safety</option><option>infrastructure</option><option>lighting</option><option>vandalism</option><option>noise</option><option>community_support</option></select></label>
          <label>Area<label><input required placeholder="Neighborhood / street" /></label></label>
          <label>Short summary<input required maxLength={140} /></label>
          <label>Details<textarea required /></label>
          <label><input type="checkbox" required /> I confirm this report is factual to the best of my knowledge.</label>
          <button type="submit">Submit for human review</button>
        </form>
      )}
      {submitted && <section className="card success">Thanks. Your report entered the human review queue.</section>}
      <nav><button onClick={() => props.onNavigate("trust")}>Trust policy</button><button onClick={() => props.onNavigate("magazine")}>Community magazine</button><button onClick={() => props.onNavigate("starton")}>StartOn</button><button onClick={() => props.onNavigate("admin")}>Admin</button></nav>
    </main>
  )
}
