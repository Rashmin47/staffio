"use client";

import { FormEvent } from "react";
import { useState } from "react";

export default function PostJobPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      type: formData.get("type"),
      description: formData.get("description"),
      salary: formData.get("salary"),
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Unable to publish the job right now.");
      }

      window.location.href = "/jobs";
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl">
      <section className="glass-panel rounded-[2rem] p-8 sm:p-10">
        <p className="eyebrow mb-2">Post a role</p>
        <h1 className="text-4xl text-[color:var(--foreground)]">
          Publish a job with a cleaner presentation.
        </h1>
        <p className="mt-3 text-[color:var(--muted)]">
          Keep the listing concise and practical. The form checks the API result
          before redirecting, so failures are visible instead of hidden.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="w-full rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              required
              className="w-full rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              className="w-full rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Job Type
            </label>
            <select
              name="type"
              id="type"
              required
              className="w-full rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            >
              <option value="">Select a type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={7}
              required
              className="w-full rounded-[1.5rem] border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            />
          </div>

          <div>
            <label
              htmlFor="salary"
              className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
            >
              Salary (optional)
            </label>
            <input
              type="text"
              name="salary"
              id="salary"
              placeholder="e.g., $80,000 - $100,000"
              className="w-full rounded-full border border-[color:var(--border)] bg-white/90 px-4 py-3 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:rgba(138,90,43,0.16)]"
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[color:var(--accent-strong)] px-4 py-3 font-semibold text-white transition hover:bg-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Post Job"}
          </button>
        </form>
      </section>
    </div>
  );
}
