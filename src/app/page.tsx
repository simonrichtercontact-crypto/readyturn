import Link from "next/link";
import { cookies } from "next/headers";
import {
  CheckCircle2, RotateCcw, Building2, ArrowRight, Star,
  Camera, ListChecks, BarChart3, AlertTriangle, Users,
  FileSpreadsheet, DollarSign, Zap, ChevronRight, Shield, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "@/components/lang-switcher";
import { detectLocale, type Locale } from "@/lib/i18n/locales";
import { getT } from "@/lib/i18n/translations";
import { Logo, LogoMark } from "@/components/logo";

const featureIcons = [RotateCcw, ListChecks, DollarSign, Camera, BarChart3, Users, FileSpreadsheet, TrendingUp, Shield];
const featureColors = [
  "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600", "bg-purple-100 text-purple-600",
  "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600",
  "bg-teal-100 text-teal-600", "bg-indigo-100 text-indigo-600",
  "bg-slate-100 text-slate-600",
];
const stepColors = [
  "from-blue-500 to-blue-600", "from-violet-500 to-violet-600",
  "from-amber-500 to-orange-500", "from-emerald-500 to-emerald-600",
];
const stepIcons = [Building2, ListChecks, AlertTriangle, CheckCircle2];
const testimonialColors = ["bg-blue-100 text-blue-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700"];
const testimonialInitials = ["SM", "JR", "LK"];

export default async function LandingPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("rt_locale")?.value;
  const locale: Locale = (cookieLocale as Locale) ?? detectLocale(null);
  const T = getT(locale);

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{T.nav.features}</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{T.nav.howItWorks}</a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">{T.nav.pricing}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher current={locale} />
            <Link href="/sign-in" className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              {T.nav.signIn}
            </Link>
            <Button asChild size="sm" className="shadow-md shadow-primary/20">
              <Link href="/sign-up">
                {T.nav.startFree}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8f0fe_1px,transparent_1px),linear-gradient(to_bottom,#e8f0fe_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_60%,transparent_115%)] opacity-50" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 mb-8">
            <Star className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">{T.hero.badge}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
            {T.hero.h1a}
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
              {T.hero.h1b}
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg text-slate-500 leading-relaxed">{T.hero.sub}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" className="w-full sm:w-auto shadow-xl shadow-primary/25 text-base px-8">
              <Link href="/sign-up">{T.hero.cta1} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto text-base">
              <Link href="/sign-in">{T.hero.cta2}</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {T.hero.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative mx-auto mt-20 max-w-5xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md bg-slate-200/70 text-xs text-slate-400 flex items-center px-3">app.readyturn.com/dashboard</div>
            </div>
            <div className="p-6 bg-slate-50/50">
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Active Turnovers", value: "12", color: "text-blue-600" },
                  { label: "Overdue", value: "2", color: "text-red-600" },
                  { label: "Blocked", value: "1", color: "text-amber-600" },
                  { label: "Ready Units", value: "8", color: "text-emerald-600" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="grid grid-cols-5 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
                  <span>Unit</span><span>Property</span><span>Due</span><span>Priority</span><span>Status</span>
                </div>
                {[
                  { unit: "Unit 12A", prop: "Maple Residences", due: "Apr 8", pri: "Urgent", priC: "bg-red-100 text-red-700", status: "In Progress", stC: "bg-blue-100 text-blue-700" },
                  { unit: "Unit 4B", prop: "Oak Gardens", due: "Apr 10", pri: "High", priC: "bg-orange-100 text-orange-700", status: "Not Started", stC: "bg-slate-100 text-slate-600" },
                  { unit: "Unit 7C", prop: "Pine Valley", due: "Apr 14", pri: "Medium", priC: "bg-amber-100 text-amber-700", status: "Blocked", stC: "bg-red-100 text-red-700" },
                ].map((r) => (
                  <div key={r.unit} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-slate-50 text-sm items-center">
                    <span className="font-medium text-primary">{r.unit}</span>
                    <span className="text-slate-600">{r.prop}</span>
                    <span className="text-slate-500">{r.due}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${r.priC}`}>{r.pri}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${r.stC}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-3/4 bg-primary/10 blur-2xl rounded-full" />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-slate-100 py-12 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-10">Trusted by property management teams</p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {T.stats.map((value, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{T.statLabels[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
                <AlertTriangle className="h-3.5 w-3.5" />{T.problem.tag}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{T.problem.title}</h2>
              <div className="space-y-4">
                {T.problem.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    </div>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/8 to-blue-50 border border-primary/15 p-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                <CheckCircle2 className="h-3.5 w-3.5" />{T.solution.tag}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{T.solution.title}</h3>
              <div className="space-y-4">
                {T.solution.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{T.features.tag}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{T.features.title}</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">{T.features.sub}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {T.features.items.map(({ title, desc }, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={title} className="group rounded-2xl bg-white border border-slate-200 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${featureColors[i]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{T.workflow.tag}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{T.workflow.title}</h2>
          </div>
          <div className="space-y-6">
            {T.workflow.steps.map(({ title, desc }, i) => {
              const Icon = stepIcons[i];
              return (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stepColors[i]} text-white font-bold text-sm shadow-lg`}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-gradient-to-b from-slate-200 to-transparent mt-2 min-h-6" />}
                  </div>
                  <div className="pt-3 pb-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <h3 className="font-semibold text-slate-900">{title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VS SPREADSHEETS */}
      <section className="py-28 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">{T.compare.title}</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">{T.compare.sub}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {T.compare.rows.map(({ bad, good }, i) => (
              <div key={i} className="grid grid-cols-2 gap-0 rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex items-start gap-2.5 p-4 bg-slate-800/50">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">{bad}</p>
                </div>
                <div className="flex items-start gap-2.5 p-4 bg-primary/5 border-l border-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 leading-relaxed">{good}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{T.testimonials.tag}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{T.testimonials.title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {T.testimonials.items.map(({ quote, name, role }, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-7 flex flex-col gap-5 hover:shadow-md transition-shadow">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0 ${testimonialColors[i]}`}>
                    {testimonialInitials[i]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-6 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{T.pricing.tag}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{T.pricing.title}</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">{T.pricing.sub}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{T.pricing.free.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{T.pricing.free.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400 text-sm">{T.pricing.forever}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {T.pricing.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/sign-up">{T.pricing.free.cta}</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-primary bg-white p-8 flex flex-col shadow-xl shadow-primary/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">{T.pricing.popular}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{T.pricing.pro.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{T.pricing.pro.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$29</span>
                  <span className="text-slate-400 text-sm">{T.pricing.month}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {T.pricing.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full shadow-lg shadow-primary/20" size="lg">
                <Link href="/sign-up">{T.pricing.pro.cta}</Link>
              </Button>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{T.pricing.business.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{T.pricing.business.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$79</span>
                  <span className="text-slate-400 text-sm">{T.pricing.month}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {T.pricing.business.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/sign-up">{T.pricing.business.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-violet-50/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-xl shadow-primary/30 mx-auto mb-8">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">{T.cta.title}</h2>
          <p className="mt-6 text-lg text-slate-500">{T.cta.sub}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" className="w-full sm:w-auto shadow-xl shadow-primary/25 text-base px-10">
              <Link href="/sign-up">{T.cta.btn1} <ChevronRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto text-base">
              <Link href="/sign-in">{T.cta.btn2}</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {T.cta.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-10 px-6 bg-white">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p className="text-sm text-slate-400 order-last md:order-none">
            © {new Date().getFullYear()} ReadyTurn. {T.footer.built}
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/pricing" className="hover:text-slate-700 transition-colors">{T.nav.pricing}</Link>
            <Link href="/guide" className="hover:text-slate-700 transition-colors">Guide</Link>
            <Link href="/sign-in" className="hover:text-slate-700 transition-colors">{T.nav.signIn}</Link>
            <Link href="/sign-up" className="hover:text-slate-700 transition-colors font-medium text-primary">{T.nav.startFree}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
