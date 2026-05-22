import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const [recentJobs, totalJobs, totalApplications, totalCompanies] =
    await Promise.all([
      prisma.job.findMany({
        take: 4,
        orderBy: {
          postedAt: "desc",
        },
        include: {
          postedBy: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.job.count(),
      prisma.application.count(),
      prisma.job.groupBy({
        by: ["company"],
      }),
    ]);

  const stats = [
    { label: "Open roles", value: totalJobs.toString() },
    { label: "Applications sent", value: totalApplications.toString() },
    { label: "Hiring teams", value: totalCompanies.length.toString() },
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[2rem] p-8 sm:p-10 lg:p-12">
          <p className="eyebrow mb-4">Modern hiring, without the noise</p>
          <h1 className="max-w-3xl text-5xl leading-none text-[color:var(--foreground)] sm:text-6xl lg:text-7xl">
            A calmer way to post roles, review applicants, and move faster.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 muted-text sm:text-xl">
            Staffio keeps the job board straightforward: elegant listings,
            focused search, and a dashboard that shows what is happening now.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--accent)]"
            >
              Browse roles
            </Link>
            <Link
              href="/jobs/post"
              className="rounded-full border border-[color:var(--border)] bg-white/80 px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white"
            >
              Post a position
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="soft-card rounded-2xl p-5">
                <div className="text-3xl font-display text-[color:var(--accent-strong)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="soft-card rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow mb-3">What it does well</p>
            <div className="space-y-4 text-sm leading-6 text-[color:var(--foreground)]">
              <p>
                Search jobs by role, company, type, and location with clean,
                direct filters.
              </p>
              <p>
                Track postings and applications from a single dashboard instead
                of digging through separate screens.
              </p>
              <p>
                Apply, post, and manage roles with authentication already wired
                in.
              </p>
            </div>
          </div>

          <div className="soft-card rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow mb-3">Simple flow</p>
            <ol className="space-y-3 text-sm text-[color:var(--muted)]">
              <li>1. Sign in with GitHub.</li>
              <li>2. Publish roles or browse current openings.</li>
              <li>3. Follow applications from the dashboard.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Latest openings</p>
            <h2 className="text-3xl text-[color:var(--foreground)] sm:text-4xl">
              Fresh roles worth a look
            </h2>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-semibold text-[color:var(--accent-strong)] transition hover:text-[color:var(--accent)]"
          >
            View all jobs →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recentJobs.map((job) => (
            <article
              key={job.id}
              className="soft-card group rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(62,43,24,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl leading-tight text-[color:var(--foreground)]">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                    {job.company}
                  </p>
                </div>
                {job.salary && (
                  <span className="rounded-full bg-[color:var(--foreground)] px-3 py-1 text-xs font-semibold text-white">
                    {job.salary}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
                <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                  {job.location}
                </span>
                <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                  {job.type}
                </span>
              </div>

              <p className="mt-5 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                {job.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-[color:var(--muted)]">
                  Posted by {job.postedBy.name}
                </p>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm font-semibold text-[color:var(--accent-strong)] transition group-hover:text-[color:var(--accent)]"
                >
                  Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
