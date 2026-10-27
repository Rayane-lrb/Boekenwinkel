import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { LoginRequest } from "../../types";

interface LoginLocationState {
  message?: string;
  from?: { pathname?: string };
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(state?.from?.pathname || "/books", { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-6 py-10 text-blue-900">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Welcome back</p>
        <h1 className="text-3xl font-bold text-blue-950">Log in</h1>
        <p className="text-sm text-slate-600">Sign in to your Library account.</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
        {state?.message && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">{state.message}</p>
        )}
        <label className="block space-y-1 text-sm font-medium">
          <span>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
        {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-sm text-slate-600">
          Don’t have an account? <Link to="/register" className="font-semibold text-[#9A7626] hover:underline">Register</Link>
        </p>
      </form>
    </section>
  );
}
