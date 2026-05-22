import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyButton from "./ApplyButton";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const jobId = (await params).id;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
        <div className="mb-8">
          <Link
            href="/jobs"
            className="inline-block text-sm font-semibold text-[color:var(--accent-strong)]"
          >
            ← Back to Jobs
          </Link>
          <h1 className="mt-4 text-5xl text-[color:var(--foreground)]">
            {job.title}
          </h1>
          <p className="mt-3 text-xl uppercase tracking-[0.16em] text-[color:var(--accent)]">
            {job.company}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
              {job.location}
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1">
              {job.type}
            </span>
            {job.salary && (
              <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1 font-medium text-[color:var(--foreground)]">
                {job.salary}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center text-sm text-[color:var(--muted)]">
            <span>Posted by {job.postedBy.name}</span>
            <span className="mx-2">•</span>
            <span>
              {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-[color:var(--foreground)] mb-4">
            Job Description
          </h2>
          <div className="whitespace-pre-wrap leading-8 text-[color:var(--muted)]">
            {job.description}
          </div>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-8">
          <ApplyButton jobId={job.id} />
        </div>
      </div>
    </div>
  );
}
