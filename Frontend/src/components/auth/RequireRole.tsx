import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
}

export default function RequireRole({ roles, children }: RequireRoleProps) {
  const { isLoggedIn, isLoading, authError, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p className="py-8 text-center text-slate-600">Checking your access...</p>;
  }

  if (authError) {
    return (
      <p role="alert" className="my-8 rounded-md bg-red-50 p-4 text-sm text-red-800">
        Could not verify your account: {authError}
      </p>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!roles.some(hasRole)) {
    return (
      <section className="my-8 space-y-3 rounded-xl border border-amber-200 bg-white p-6 text-blue-900">
        <h1 className="text-xl font-bold text-blue-950">Access denied</h1>
        <p>Your account does not have permission to view this page.</p>
        <Link to="/books" className="font-medium text-[#9A7626] hover:underline">
          Return to books
        </Link>
      </section>
    );
  }

  return children;
}
