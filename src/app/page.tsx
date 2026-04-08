import {
  BarChart3,
  TrendingUp,
  Zap,
  Share2,
  Eye,
  Target,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-stone-800">
            shuto<span className="text-orange-500">.</span>
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-stone-400 hover:text-stone-700 transition hidden sm:block"
            >
              Fonctionnalités
            </a>
            <a
              href="#how"
              className="text-sm text-stone-400 hover:text-stone-700 transition hidden sm:block"
            >
              Comment ça marche
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-orange-600 transition shadow-sm"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Warm background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-50/80 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 text-orange-500 text-sm font-medium mb-5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Pilotage de marque automatisé
                </span>
              </div>

              <h1 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-stone-800 leading-[1.15] animate-fade-in-up-delay-1">
                Vos KPIs de marque, clairs et à jour.{" "}
                <span className="text-stone-300">Automatiquement.</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-stone-400 leading-relaxed max-w-lg animate-fade-in-up-delay-2">
                Shuto crée des dashboards sur-mesure pour suivre votre notoriété,
                votre considération et votre réputation face à la concurrence.
                Sans effort de votre côté.
              </p>

              <div className="mt-8 flex items-center gap-4 animate-fade-in-up-delay-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-stone-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-stone-700 transition"
                >
                  Demander une démo
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#features"
                  className="text-sm text-stone-400 font-medium hover:text-stone-600 transition"
                >
                  En savoir plus
                </a>
              </div>

              <div className="mt-8 flex items-center gap-5 animate-fade-in-up-delay-3">
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Gratuit, sans engagement
                </span>
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Prêt en quelques jours
                </span>
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="animate-fade-in-up-delay-2">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-orange-100/50 to-amber-50/30 rounded-3xl blur-xl -z-10" />
                <div className="bg-stone-900 rounded-2xl shadow-2xl shadow-stone-900/15 p-1">
                  <div className="bg-stone-900 rounded-xl overflow-hidden">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-800">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="ml-3 flex-1 bg-stone-800 rounded px-2.5 py-1">
                        <span className="text-[10px] text-stone-500">
                          app.shuto.ai/dashboard
                        </span>
                      </div>
                    </div>
                    {/* Mock dashboard */}
                    <div className="p-4 space-y-3">
                      {/* KPI row */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Notoriété", value: "67%", trend: "+2.3", color: "bg-orange-500" },
                          { label: "Considération", value: "16.2%", trend: "+1.8", color: "bg-amber-500" },
                          { label: "Réputation", value: "72", trend: "+4.1", color: "bg-emerald-500" },
                          { label: "Brand Index", value: "8.4", trend: "+0.6", color: "bg-sky-500" },
                        ].map((kpi) => (
                          <div key={kpi.label} className="bg-stone-800/60 rounded-lg p-3 border border-stone-700/30">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${kpi.color}`} />
                              <p className="text-[10px] text-stone-400">{kpi.label}</p>
                            </div>
                            <p className="text-lg font-bold text-white mt-1">{kpi.value}</p>
                            <span className="text-[10px] text-emerald-400 font-medium">{kpi.trend} pts</span>
                          </div>
                        ))}
                      </div>
                      {/* Chart + sidebar */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-stone-800/60 rounded-lg p-3 border border-stone-700/30">
                          <p className="text-[10px] text-stone-400 mb-2 font-medium">Évolution 12 mois</p>
                          <div className="flex items-end gap-[2px] h-20">
                            {[32,35,33,38,42,40,45,48,46,50,53,57,55,60,63,58,62,66,70,68,73,76,80,78].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm"
                                style={{ height: `${h}%`, background: `linear-gradient(to top, rgb(249 115 22), rgb(251 191 36 / 0.6))` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-stone-800/60 rounded-lg p-3 border border-stone-700/30">
                          <p className="text-[10px] text-stone-400 mb-2 font-medium">Concurrents</p>
                          <div className="space-y-2.5">
                            {[
                              { name: "Vous", w: 85, color: "bg-orange-500" },
                              { name: "Marque B", w: 68, color: "bg-stone-600" },
                              { name: "Marque C", w: 55, color: "bg-stone-600" },
                              { name: "Marque D", w: 42, color: "bg-stone-600" },
                            ].map((m) => (
                              <div key={m.name} className="flex items-center gap-1.5">
                                <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.w}%` }} />
                                <span className="text-[9px] text-stone-500 whitespace-nowrap">{m.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-800">
              Tout ce qu&apos;il vous faut, rien de superflu
            </h2>
            <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
              On a conçu Shuto pour que ce soit simple à utiliser,
              même sans être data analyst.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "KPIs en temps réel",
                description:
                  "Notoriété, considération, réputation... Vos indicateurs de marque se mettent à jour tout seuls.",
                accent: "bg-orange-50 text-orange-500 border-orange-100",
              },
              {
                icon: Eye,
                title: "Veille concurrentielle",
                description:
                  "Comparez-vous aux concurrents en un regard. Repérez les mouvements avant tout le monde.",
                accent: "bg-amber-50 text-amber-600 border-amber-100",
              },
              {
                icon: TrendingUp,
                title: "Tendances & alertes",
                description:
                  "Suivez l'évolution dans le temps et détectez les signaux faibles avant qu'ils deviennent des problèmes.",
                accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                icon: Target,
                title: "Objectifs clairs",
                description:
                  "Fixez des cibles, suivez votre progression. Tout le monde sait où on va.",
                accent: "bg-sky-50 text-sky-600 border-sky-100",
              },
              {
                icon: Share2,
                title: "Export en 1 clic",
                description:
                  "PNG, PowerPoint... Vos dashboards sont prêts pour le comex en 2 secondes.",
                accent: "bg-violet-50 text-violet-600 border-violet-100",
              },
              {
                icon: Zap,
                title: "Zéro saisie manuelle",
                description:
                  "Les données remontent toutes seules. Vous, vous pilotez.",
                accent: "bg-rose-50 text-rose-500 border-rose-100",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${feature.accent}`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-stone-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-800">
              Opérationnel en quelques jours
            </h2>
            <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
              Pas de projet à rallonge. On vous installe ça vite et bien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "On échange sur vos besoins",
                description:
                  "Quelles marques, quels KPIs, quels concurrents ? On cadre tout ensemble lors d'un appel de 30 min.",
                emoji: "👋",
              },
              {
                step: "2",
                title: "On configure votre espace",
                description:
                  "Votre dashboard est prêt avec vos marques, vos données et votre identité visuelle.",
                emoji: "⚙️",
              },
              {
                step: "3",
                title: "Vous pilotez, on maintient",
                description:
                  "Tout se met à jour automatiquement. Et si vous avez besoin, on est là.",
                emoji: "🚀",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl">
                  {item.emoji}
                </div>
                <h3 className="text-lg font-semibold text-stone-800">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-stone-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-800">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-stone-100">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed">
                &ldquo;On est passés d&apos;un reporting trimestriel pénible à
                un suivi continu de nos KPIs de marque. Le gain de temps est
                énorme, et surtout on prend de meilleures décisions.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-orange-600">
                    SC
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Sophie C.
                  </p>
                  <p className="text-xs text-stone-400">
                    Directrice Marketing
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone-100">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed">
                &ldquo;L&apos;export PowerPoint c&apos;est un game-changer.
                En un clic, mes slides sont prêts pour le comex. Plus
                besoin de passer des heures sur la mise en forme.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-amber-600">
                    TM
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Thomas M.
                  </p>
                  <p className="text-xs text-stone-400">Brand Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Warm glows */}
            <div className="absolute inset-0 -z-0">
              <div className="absolute top-0 left-1/3 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Envie d&apos;y voir plus clair ?
              </h2>
              <p className="mt-4 text-lg text-stone-400 max-w-xl mx-auto">
                On vous montre Shuto en 20 minutes. Gratuit, sans engagement,
                et on ne vous spammera pas. Promis.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:quentin@shuto.ai"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                >
                  <Mail className="w-4 h-4" />
                  quentin@shuto.ai
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-stone-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Démo gratuite
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Prêt en quelques jours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold tracking-tight text-stone-800">
            shuto<span className="text-orange-500">.</span>
          </span>
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} Shuto. Tous droits réservés.
          </p>
          <a
            href="mailto:quentin@shuto.ai"
            className="text-sm text-stone-400 hover:text-orange-500 transition"
          >
            quentin@shuto.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
