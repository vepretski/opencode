const sections = {
  en: ["Safety updates", "Infrastructure repairs", "Volunteer opportunities"],
  he: ["עדכוני בטיחות", "תיקוני תשתיות", "הזדמנויות התנדבות"],
  ru: ["Обновления по безопасности", "Ремонт инфраструктуры", "Возможности волонтёрства"],
}

export function CommunityMagazinePage(props: { onNavigate: (next: string) => void }) {
  return (
    <main className="page dark">
      <h1>Community Magazine</h1>
      <p>Daily multilingual civic brief focused on resilience and practical support.</p>
      {Object.entries(sections).map(([lang, list]) => (
        <section className="card" key={lang} dir={lang === "he" ? "rtl" : "ltr"}>
          <h2>{lang.toUpperCase()}</h2>
          <ul>{list.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ))}
      <button onClick={() => props.onNavigate("report")}>Back</button>
    </main>
  )
}
