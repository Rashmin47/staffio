import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, location } = await searchParams;

  const query = q as string | undefined;
  const searchType = type as string | undefined;
  const searchLocation = location as string | undefined;
  const hasFilters = Boolean(query || searchType || searchLocation);

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        searchType ? { type: searchType } : {},
        searchLocation
          ? { location: { contains: searchLocation, mode: "insensitive" } }
          : {},
      ],
    },
    orderBy: { postedAt: "desc" },
    include: { postedBy: true },
  });

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Browse roles</p>
            <h1 className="text-4xl text-[color:var(--foreground)] sm:text-5xl">
              Find a job that feels right.
            </h1>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              Filter by role, company, type, and location. The search state is
              preserved in the URL so you can share or return to the same view.
            </p>
          </div>
          <div className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--muted)]">
            {jobs.length} result{jobs.length === 1 ? "" : "s"}
          </div>
        </div>

        <form className="mt-8 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            name="q"
            placeholder="Search jobs..."
            defaultValue={query ?? ""}
            className="rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
          />
          <select
            name="type"
            defaultValue={searchType ?? ""}
            className="rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            defaultValue={searchLocation ?? ""}
            className="rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
          />
          <button
            type="submit"
            className="rounded-full bg-[color:var(--accent-strong)] px-4 py-3 font-semibold text-white transition hover:bg-[color:var(--accent)] md:col-span-3"
          >
            Search
          </button>
        </form>
      </section>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
          <span className="font-medium text-[color:var(--foreground)]">
            Active filters:
          </span>
          {query && (
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
              Keyword: {query}
            </span>
          )}
          {searchType && (
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
              Type: {searchType}
            </span>
          )}
          {searchLocation && (
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
              Location: {searchLocation}
            </span>
          )}
          <Link
            href="/jobs"
            className="font-semibold text-[color:var(--accent-strong)]"
          >
            Clear filters
          </Link>
        </div>
      )}

      <div className="grid gap-5">
        {jobs.length === 0 ? (
          <div className="soft-card rounded-[2rem] p-10 text-center">
            <h2 className="text-3xl text-[color:var(--foreground)]">
              No matching roles yet.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[color:var(--muted)]">
              Try a broader search or clear the filters to see everything that
              is currently live.
            </p>
            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-full bg-[color:var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]"
            >
              Reset search
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <article
              key={job.id}
              className="soft-card rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(62,43,24,0.12)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl leading-tight text-[color:var(--foreground)]">
                    {job.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--accent)]">
                    {job.company}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
                    <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                      {job.location}
                    </span>
                    <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                      {job.type}
                    </span>
                    {job.salary && (
                      <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 max-w-3xl line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end lg:text-right">
                  <span className="text-sm text-[color:var(--muted)]">
                    Posted by {job.postedBy.name}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="rounded-full bg-[color:var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
