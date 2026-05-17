export function StartOnPage(props: { onNavigate: (next: string) => void }) {
  return (
    <main className="page dark">
      <h1>StartOn</h1>
      <p>Youth tech, mentoring, volunteering, and micro-agency civic projects.</p>
      <section className="card"><h2>Programs</h2><ul><li>Youth tech labs</li><li>Volunteer onboarding</li><li>Mentor matching</li><li>Project showcase</li></ul></section>
      <section className="card"><h2>Partner / donation interest</h2><form className="grid"><input placeholder="Name" /><input placeholder="Email" /><textarea placeholder="How you want to help" /><label><input type="checkbox" /> I consent to be contacted.</label><button type="button">Submit</button></form></section>
      <button onClick={() => props.onNavigate("report")}>Back</button>
    </main>
  )
}
