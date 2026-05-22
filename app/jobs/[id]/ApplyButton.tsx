"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const handleApply = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setErrorMessage("");
    setApplicationStatus("idle");

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to submit the application.");
      }

      setApplicationStatus("success");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to apply for the job");
      }
      setApplicationStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <button
        disabled
        className="w-full rounded-full bg-[color:var(--accent-strong)] px-6 py-3 text-white opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (applicationStatus === "success") {
    return (
      <div className="text-center">
        <p className="mb-4 font-medium text-green-700">
          Application submitted successfully!
        </p>
        <Link
          href="/dashboard"
          className="font-semibold text-[color:var(--accent-strong)]"
        >
          View your applications →
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleApply}
        className="w-full rounded-full bg-[color:var(--accent-strong)] px-6 py-3 font-semibold text-white transition hover:bg-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Apply for this position
      </button>
      {applicationStatus === "error" && (
        <p className="mt-3 text-center text-sm text-red-700">{errorMessage}</p>
      )}
    </>
  );
}
