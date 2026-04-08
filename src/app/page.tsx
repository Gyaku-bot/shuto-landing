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

function ShutoLogo({ size = 48, dark = true }: { size?: number; dark?: boolean }) {
  const circleColor = "#FF0033";
  const sColor = dark ? "#FFFFFF" : "#111111";
  const filterId = `glow_${size}`;
  return (
    <svg viewBox="0 0 200 200" fill="none" width={size} height={size}>
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        className="animate-draw-circle"
        cx="100"
        cy="100"
        r="55"
        fill="none"
        stroke={circleColor}
        strokeWidth="4"
        filter={`url(#${filterId})`}
      />
      <text
        x="100"
        y="125"
        fontFamily="system-ui"
        fontSize="80"
        fontWeight="900"
        fill="none"
        stroke={sColor}
        strokeWidth="2"
        textAnchor="middle"
        filter={`url(#${filterId})`}
      >
        S
      </text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShutoLogo size={72} dark={true} />
            <span className="text-base font-bold tracking-[0.15em] uppercase text-white">
              SHUTO
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-neutral-500 hover:text-white transition hidden sm:block"
            >
              Fonctionnalités
            </a>
            <a
              href="#how"
              className="text-sm text-neutral-500 hover:text-white transition hidden sm:block"
            >
              Comment ça marche
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#FF0033] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#e6002e] transition"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 text-[#FF0033] text-base font-medium mb-5">
                  <span className="w-1.5 h-1.5 bg-[#FF0033] rounded-full" />
                  Pilotage de marque automatisé
                </span>
              </div>

              <h1 className="text-2xl md:text-[2rem] font-extrabold tracking-tight text-black leading-[1.2] animate-fade-in-up-delay-1">
                Vos KPIs de marque :
                <br />
                <span className="whitespace-nowrap">zéro bruit, zéro effort, zéro délai.</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-neutral-400 leading-relaxed max-w-lg animate-fade-in-up-delay-2">
                Shuto crée des dashboards de pilotage de marque.
                <br />
                Sur-mesure. Automatisé. Pour décider, pas pour compiler.
              </p>

              <div className="mt-8 flex items-center gap-4 animate-fade-in-up-delay-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-[#FF0033] text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#e6002e] transition"
                >
                  Demander une démo
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#features"
                  className="text-sm text-neutral-400 font-medium hover:text-black transition"
                >
                  En savoir plus
                </a>
              </div>

              <div className="mt-8 flex items-center gap-5 animate-fade-in-up-delay-3">
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF0033]" />
                  Gratuit, sans engagement
                </span>
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF0033]" />
                  Prêt en quelques jours
                </span>
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="animate-fade-in-up-delay-2">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-neutral-200 p-1">
                  <div className="bg-white rounded-xl overflow-hidden">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF0033]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                      </div>
                      <div className="ml-3 flex-1 bg-neutral-50 rounded px-2.5 py-1">
                        <span className="text-[10px] text-neutral-400">
                          app.shuto.ai/dashboard
                        </span>
                      </div>
                    </div>
                    {/* Mock dashboard */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Notoriété", value: "67%", trend: "+2.3" },
                          { label: "Considération", value: "16.2%", trend: "+1.8" },
                          { label: "Réputation", value: "72", trend: "+4.1" },
                          { label: "Brand Index", value: "8.4", trend: "+0.6" },
                        ].map((kpi) => (
                          <div key={kpi.label} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                            <p className="text-[10px] text-neutral-400">{kpi.label}</p>
                            <p className="text-lg font-bold text-black mt-1">{kpi.value}</p>
                            <span className="text-[10px] text-[#FF0033] font-medium">{kpi.trend} pts</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                          <p className="text-[10px] text-neutral-400 mb-2 font-medium">Évolution 12 mois</p>
                          <div className="flex items-end gap-[2px] h-20">
                            {[32,35,33,38,42,40,45,48,46,50,53,57,55,60,63,58,62,66,70,68,73,76,80,78].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm"
                                style={{ height: `${h}%`, background: `linear-gradient(to top, #FF0033, rgba(255, 0, 51, 0.15))` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                          <p className="text-[10px] text-neutral-400 mb-2 font-medium">Concurrents</p>
                          <div className="space-y-2.5">
                            {[
                              { name: "Vous", w: 85, color: "bg-[#FF0033]" },
                              { name: "Marque B", w: 68, color: "bg-neutral-300" },
                              { name: "Marque C", w: 55, color: "bg-neutral-300" },
                              { name: "Marque D", w: 42, color: "bg-neutral-300" },
                            ].map((m) => (
                              <div key={m.name} className="flex items-center gap-1.5">
                                <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.w}%` }} />
                                <span className="text-[9px] text-neutral-400 whitespace-nowrap">{m.name}</span>
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
      <section id="features" className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Tout ce qu&apos;il vous faut, rien de superflu
            </h2>
            <p className="mt-4 text-lg text-neutral-400 mx-auto whitespace-nowrap">
              On a conçu Shuto pour que ce soit simple à utiliser, même sans être data analyst.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "KPIs en temps réel",
                description:
                  "Notoriété, considération, réputation... Vos indicateurs de marque se mettent à jour tout seuls.",
              },
              {
                icon: Eye,
                title: "Veille concurrentielle",
                description:
                  "Comparez-vous aux concurrents en un regard. Repérez les mouvements avant tout le monde.",
              },
              {
                icon: TrendingUp,
                title: "Tendances & alertes",
                description:
                  "Suivez l'évolution dans le temps et détectez les signaux faibles avant qu'ils deviennent des problèmes.",
              },
              {
                icon: Target,
                title: "Objectifs clairs",
                description:
                  "Fixez des cibles, suivez votre progression. Tout le monde sait où on va.",
              },
              {
                icon: Share2,
                title: "Export en 1 clic",
                description:
                  "PNG, PowerPoint... Vos dashboards sont prêts pour le comex en 2 secondes.",
              },
              {
                icon: Zap,
                title: "Zéro saisie manuelle",
                description:
                  "Les données remontent toutes seules. Vous, vous pilotez.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-[#FF0033]/20 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border border-neutral-100 bg-neutral-50 group-hover:border-[#FF0033]/30 group-hover:bg-red-50 transition-all">
                  <feature.icon className="w-5 h-5 text-neutral-400 group-hover:text-[#FF0033] transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Opérationnel en quelques jours
            </h2>
            <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
              Pas de projet à rallonge. On vous installe ça vite et bien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "On échange sur vos besoins",
                description:
                  "Quelles marques, quels KPIs, quels concurrents ? On cadre tout ensemble lors d'un appel de 30 min.",
              },
              {
                step: "02",
                title: "On configure votre espace",
                description:
                  "Votre dashboard est prêt avec vos marques, vos données et votre identité visuelle.",
              },
              {
                step: "03",
                title: "Vous pilotez, on maintient",
                description:
                  "Tout se met à jour automatiquement. Et si vous avez besoin, on est là.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-black text-[#FF0033]/15 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-neutral-100">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#FF0033] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-500 leading-relaxed">
                &ldquo;On est passés d&apos;un reporting trimestriel pénible à
                un suivi continu de nos KPIs de marque. Le gain de temps est
                énorme, et surtout on prend de meilleures décisions.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF0033]/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#FF0033]">SC</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Sophie C.</p>
                  <p className="text-xs text-neutral-400">Directrice Marketing</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-100">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#FF0033] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-500 leading-relaxed">
                &ldquo;L&apos;export PowerPoint c&apos;est un game-changer.
                En un clic, mes slides sont prêts pour le comex. Plus
                besoin de passer des heures sur la mise en forme.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-neutral-600">TM</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Thomas M.</p>
                  <p className="text-xs text-neutral-400">Brand Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-[#0a0a0a] rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <ShutoLogo size={64} dark={true} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Envie d&apos;y voir plus clair ?
              </h2>
              <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
                On vous montre Shuto en 20 minutes. Gratuit, sans engagement,
                et on ne vous spammera pas. Promis.
              </p>
              <div className="mt-8">
                <a
                  href="mailto:quentin@shuto.ai"
                  className="inline-flex items-center gap-2 bg-[#FF0033] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#e6002e] transition"
                >
                  <Mail className="w-4 h-4" />
                  quentin@shuto.ai
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-neutral-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0033]" />
                  Démo gratuite
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0033]" />
                  Prêt en quelques jours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0033]" />
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShutoLogo size={22} dark={false} />
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-black">
              SHUTO
            </span>
          </div>
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Shuto. Tous droits réservés.
          </p>
          <a
            href="mailto:quentin@shuto.ai"
            className="text-sm text-neutral-400 hover:text-[#FF0033] transition"
          >
            quentin@shuto.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
