import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function UsersPage() {
  const usersQuery = useUsers();
  const [search, setSearch] = useState("");

  const users = usersQuery.data ?? [];
  const filteredUsers = users.filter((user) => {
    const text = `${user.firstName} ${user.lastName} ${user.email} ${user.roles.join(" ")}`;
    return text.toLowerCase().includes(search.trim().toLowerCase());
  });

  return (
    <section className="space-y-8 py-8 text-blue-900">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Account management</p>
          <h1 className="text-3xl font-bold text-blue-950">Users</h1>
          <p className="max-w-2xl text-sm text-slate-600">Review registered users and their roles.</p>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">All users</h2>
            <p className="mt-1 text-sm text-slate-600">
              {users.length} {users.length === 1 ? "user" : "users"} in the system
            </p>
          </div>
          <label className="w-full space-y-1 text-sm font-medium sm:max-w-xs">
            <span>Search users</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
            />
          </label>
        </div>

        {usersQuery.isLoading && <p className="py-8 text-center text-slate-600">Loading users...</p>}
        {usersQuery.isError && (
          <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            Could not load users: {errorMessage(usersQuery.error)}
          </p>
        )}
        {usersQuery.isSuccess && filteredUsers.length === 0 && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center text-slate-600">
            {search ? "No users match your search." : "There are no users yet."}
          </p>
        )}

        {filteredUsers.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredUsers.map((user) => (
              <li key={user.id} className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-950">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <span
                          key={`${user.id}-${role}`}
                          className="rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-[#9A7626]"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        No roles
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/users/${encodeURIComponent(user.id)}`}
                    className="mt-2 block rounded-md border border-amber-300 px-3 py-2 text-center text-sm font-medium hover:bg-amber-50"
                  >
                    View profile
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
