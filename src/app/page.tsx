import Logo from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF0033]/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <div className="animate-fade-in">
            <Logo />
          </div>

          <div className="space-y-6 pt-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide leading-tight">
              <span className="font-extralight text-gray-300">Vos données.</span>{' '}
              <span className="font-extralight text-gray-300">Vos décisions.</span>{' '}
              <span className="font-normal text-white">Automatisées.</span>
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FF0033] to-transparent mx-auto" />
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Dashboards sur-mesure et automatisations intelligentes : des données actionnables,
              des process fluides, un temps optimisé pour vous recentrer sur votre véritable métier.
            </p>
          </div>

          <div className="pt-8">
            <a
              href="mailto:quentin@shuto.ai"
              className="group inline-flex items-center gap-3 px-10 py-4 border border-[#FF0033]/30 hover:border-[#FF0033] text-white font-light rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,51,0.3)] backdrop-blur-sm"
            >
              <span>Parlons-en</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-4">
              Services
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Dashboard */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0033]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#FF0033]/20 rounded-2xl p-10 transition-all duration-500">
                <div className="w-14 h-14 rounded-full border border-[#FF0033]/20 flex items-center justify-center mb-8 group-hover:border-[#FF0033]/40 transition-colors duration-500">
                  <svg
                    className="w-6 h-6 text-[#FF0033]/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-4 text-white">Dashboards sur mesure</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm">
                  Conception et développement de tableaux de bord personnalisés pour visualiser vos KPIs et piloter votre activité en temps réel.
                </p>
              </div>
            </div>

            {/* Marketing Automation */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0033]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 hover:border-[#FF0033]/20 rounded-2xl p-10 transition-all duration-500">
                <div className="w-14 h-14 rounded-full border border-[#FF0033]/20 flex items-center justify-center mb-8 group-hover:border-[#FF0033]/40 transition-colors duration-500">
                  <svg
                    className="w-6 h-6 text-[#FF0033]/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-4 text-white">Automatisations intelligentes</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm">
                  Automatisation de vos campagnes marketing, workflows intelligents et optimisation de vos conversions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-light text-gray-300">
              Prêt à démarrer ?
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto" />
          </div>
          <p className="text-base text-gray-400 font-light">
            Discutons de votre projet
          </p>
          <div className="pt-2">
            <a
              href="mailto:quentin@shuto.ai"
              className="group inline-flex items-center gap-3 text-gray-300 hover:text-white text-base font-light transition-colors duration-300"
            >
              <span>quentin@shuto.ai</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-xs font-light tracking-wide">
          <p>© {new Date().getFullYear()} Shuto. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
