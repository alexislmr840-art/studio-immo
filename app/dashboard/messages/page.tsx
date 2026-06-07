export default function MessagesPage() {
  const MESSAGES = [
    {
      from: "Studio Immo",
      avatar: "SI",
      subject: "Bienvenue sur Studio Immo !",
      preview: "Merci d'avoir rejoint la plateforme. Découvrez comment générer votre première stratégie en moins de 60 secondes.",
      date: "Aujourd'hui",
      unread: true,
      color: "var(--gold)",
    },
    {
      from: "Support",
      avatar: "SP",
      subject: "Votre période d'essai a démarré",
      preview: "Vous bénéficiez de 10 générations gratuites pour explorer toutes les fonctionnalités de Studio Immo.",
      date: "Il y a 2j",
      unread: false,
      color: "#818cf8",
    },
  ];

  return (
    <main className="flex-1 px-6 py-8 lg:px-8">
      <div style={{ maxWidth: "800px" }}>

        <div className="mb-8">
          <p className="label mb-1" style={{ color: "var(--txt-4)" }}>Communication</p>
          <h1 className="font-bold text-white tracking-tight" style={{ fontSize: "24px", letterSpacing: "-0.025em" }}>
            Messages
          </h1>
        </div>

        {/* Coming soon banner */}
        <div
          className="mb-6 flex items-start gap-4 rounded-2xl p-5"
          style={{ background: "var(--gold-10)", border: "1px solid var(--gold-20)" }}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
               style={{ background: "var(--gold-10)", border: "1px solid var(--gold-30)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold mb-0.5" style={{ fontSize: "14px", color: "var(--gold)" }}>
              Messagerie intégrée — Bientôt disponible
            </p>
            <p style={{ fontSize: "13px", color: "var(--txt-3)", lineHeight: 1.6 }}>
              Échangez directement avec vos prospects depuis Studio Immo.
              La messagerie intégrée sera disponible dans une prochaine mise à jour.
            </p>
          </div>
        </div>

        {/* Message list */}
        <div className="space-y-2">
          {MESSAGES.map((msg) => (
            <div
              key={msg.subject}
              className="card flex items-start gap-4 p-4 cursor-pointer transition-all duration-150"
              style={{ opacity: msg.unread ? 1 : 0.7 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-s)")}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: `${msg.color}22`, color: msg.color, border: `1px solid ${msg.color}33` }}
              >
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-white" style={{ fontSize: "13px" }}>{msg.from}</p>
                  {msg.unread && <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gold)", flexShrink: 0 }}/>}
                </div>
                <p className="font-medium mb-0.5" style={{ fontSize: "13px", color: msg.unread ? "var(--txt-1)" : "var(--txt-2)" }}>
                  {msg.subject}
                </p>
                <p className="truncate" style={{ fontSize: "12px", color: "var(--txt-4)" }}>{msg.preview}</p>
              </div>
              <p style={{ fontSize: "11px", color: "var(--txt-4)", flexShrink: 0 }}>{msg.date}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
