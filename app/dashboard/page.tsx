import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [applications, postedJobs] = await Promise.all([
    // Applications query
    prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    }),

    //Jobs query
    prisma.job.findMany({
      where: {
        postedById: session.user.id,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    }),
  ]);

  const summaryCards = [
    { label: "Posted jobs", value: postedJobs.length.toString() },
    { label: "Applications made", value: applications.length.toString() },
    {
      label: "Total applicant slots",
      value: postedJobs
        .reduce((sum, job) => sum + job._count.applications, 0)
        .toString(),
    },
  ];

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="text-4xl text-[color:var(--foreground)] sm:text-5xl">
          Your hiring activity, in one calm view.
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
          Review what you have posted, see who has applied, and jump back into
          the posting flow without hunting through menus.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="soft-card rounded-2xl p-5">
              <div className="text-3xl font-display text-[color:var(--accent-strong)]">
                {card.value}
              </div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="soft-card rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Posted jobs</p>
              <h2 className="text-2xl text-[color:var(--foreground)]">
                What you have published
              </h2>
            </div>
            <Link
              href="/jobs/post"
              className="rounded-full bg-[color:var(--accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]"
            >
              Post new job
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {postedJobs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-8 text-center text-[color:var(--muted)]">
                You have not posted any jobs yet.
              </p>
            ) : (
              postedJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-[color:var(--border)] bg-white/75 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl text-[color:var(--foreground)]">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[color:var(--accent)]">
                        {job.company}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
                        <span className="rounded-full bg-white px-3 py-1">
                          {job.location}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          {job.type}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          {formatDistanceToNow(new Date(job.postedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-[color:var(--foreground)] px-3 py-1 text-xs font-semibold text-white">
                      {job._count.applications} applications
                    </span>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-sm font-semibold text-[color:var(--accent-strong)]"
                    >
                      View job →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="soft-card rounded-[2rem] p-6 sm:p-7">
          <p className="eyebrow mb-2">Applications</p>
          <h2 className="text-2xl text-[color:var(--foreground)]">
            Roles you have applied to
          </h2>

          <div className="mt-6 space-y-4">
            {applications.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/60 p-8 text-center text-[color:var(--muted)]">
                You have not applied to any jobs yet.
              </p>
            ) : (
              applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-2xl border border-[color:var(--border)] bg-white/75 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl text-[color:var(--foreground)]">
                        {application.job.title}
                      </h3>
                      <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[color:var(--accent)]">
                        {application.job.company}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
                        <span className="rounded-full bg-white px-3 py-1">
                          {application.job.location}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          {application.job.type}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1">
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            { addSuffix: true },
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        application.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="text-sm font-semibold text-[color:var(--accent-strong)]"
                    >
                      View job →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
