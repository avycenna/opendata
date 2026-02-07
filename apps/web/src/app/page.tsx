import Link from "next/link"

export default function Page() {
  return (
    <main className="bg-background">
      <section className="border-b border-border">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Data Initiative
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
              Public data, delivered as a public service
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              This platform exists to make public data usable—strengthening transparency,
              supporting evidence-based decision-making, and enabling meaningful reuse by
              developers (API coming soon), students, researchers, journalists, civil society,
              and public institutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rihla"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Explore Data
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/50"
              >
                About the Initiative
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-foreground">Why open data exists</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Open data supports openness and transparency. It allows institutions and communities to verify, compare, and act on shared facts.
              </p>
            </div>
            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">Transparency</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear, accessible information builds trust and enables oversight.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">Evidence-based decisions</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Policies and services improve when decisions are grounded in data.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">Public reuse</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reuse enables new services, research, and civic engagement.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">Shared value</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Data creates value when it can be discovered, understood, and applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
