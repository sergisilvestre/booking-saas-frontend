"use client";

/** Loading and not-found states of the public booking pages. */
export default function EventTypeStatus({
  status,
}: {
  status: "loading" | "not-found" | "error";
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-6">
      {status === "loading" ? (
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
          role="status"
          aria-label="Loading"
        />
      ) : (
        <div className="text-center">
          <p className="text-5xl font-semibold text-gray-900">404</p>
          <p className="mt-3 text-gray-500">
            {status === "error" ? "Something went wrong. Please try again." : "This page could not be found."}
          </p>
        </div>
      )}
    </main>
  );
}
