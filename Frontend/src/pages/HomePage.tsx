import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="space-y-4 py-12 text-blue-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7626]">Welcome to Library</p>
      <h1 className="text-3xl font-bold text-blue-950">Find your next book</h1>
      <p className="max-w-xl text-slate-600">
        Browse the library collection and discover books to read.
      </p>
      <Link
        to="/books"
        className="inline-block rounded-md bg-[#C9A24B] px-4 py-2 font-semibold text-blue-950 transition hover:bg-amber-400"
      >
        Browse books
      </Link>
    </section>
  );
}