import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDemoteUser, usePromoteUser, useUser } from "../../hooks/useUsers";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function UserDetailsPage() {
  const { id = "" } = useParams();
  const userQuery = useUser(id);
  const promoteUser = usePromoteUser(id);
  const demoteUser = useDemoteUser(id);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRoleChange = async (nextAction: "promote" | "demote") => {
    setFeedback(null);

    try {
      if (nextAction === "promote") {
        await promoteUser.mutateAsync();
      } else {
        await demoteUser.mutateAsync();
      }
      setFeedback(nextAction === "promote" ? "User promoted successfully." : "User demoted successfully.");
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  };

  return (
    <section className="space-y-6 py-8 text-blue-900">
      <header className="space-y-2">
        <Link to="/users" className="text-sm font-medium text-[#9A7626] hover:underline">
          ← Back to users
        </Link>
        <h1 className="text-3xl font-bold text-blue-950">User details</h1>
      </header>

      {userQuery.isLoading && <p className="text-slate-600">Loading user...</p>}
      {userQuery.isError && (
        <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Could not load user: {errorMessage(userQuery.error)}
        </p>
      )}

      {userQuery.data && (
        <article className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Account</p>
            <h2 className="text-2xl font-bold text-blue-950">
              {userQuery.data.firstName} {userQuery.data.lastName}
            </h2>
            <p className="text-sm text-slate-500">ID: {userQuery.data.id}</p>
          </div>

          <dl className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="mt-1 font-semibold text-blue-950">{userQuery.data.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Roles</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {userQuery.data.roles.length > 0 ? (
                  userQuery.data.roles.map((role) => (
                    <span
                      key={`${userQuery.data.id}-${role}`}
                      className="rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-[#9A7626]"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No roles assigned</span>
                )}
              </dd>
            </div>
          </dl>

          {feedback && (
            <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              {feedback}
            </p>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => handleRoleChange("promote")}
              disabled={promoteUser.isPending || demoteUser.isPending}
              className="rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:opacity-60"
            >
              {promoteUser.isPending ? "Promoting..." : "Promote to admin"}
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("demote")}
              disabled={promoteUser.isPending || demoteUser.isPending}
              className="rounded-md border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {demoteUser.isPending ? "Demoting..." : "Demote"}
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
