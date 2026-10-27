import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../api/auth";
import type { RegisterRequest } from "../../types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signUp({
        ...form,
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      navigate("/login", {
        replace: true,
        state: { message: "Your account has been created. You can now log in." },
      });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-6 py-10 text-blue-900">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Join the library</p>
        <h1 className="text-3xl font-bold text-blue-950">Create an account</h1>
        <p className="text-sm text-slate-600">Register to get started.</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
        <label className="block space-y-1 text-sm font-medium">
          <span>First name</span>
          <input
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => setForm({ ...form, firstName: event.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Last name</span>
          <input
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => setForm({ ...form, lastName: event.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
        </label>
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
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-amber-200"
          />
          <span className="block text-xs font-normal text-slate-500">Use at least 8 characters.</span>
        </label>
        {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-[#9A7626] hover:underline">Log in</Link>
        </p>
      </form>
    </section>
  );
}
