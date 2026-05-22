"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div>
        <div>
          <div>
            <Link href={"/"}>
              <Image
                src={"/logo.png"}
                alt="Staffio Logo"
                width={40}
                height={40}
              />
              <span>Staffio</span>
            </Link>
          </div>
          <div>
            <Link
              href={"/jobs"}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Jobs
            </Link>
            <Link
              href={"/jobs/post"}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Post a Job
            </Link>
            <Link
              href={"/dashboard"}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href={"/auth/signin"}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
