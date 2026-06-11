"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl" aria-hidden>
            🧦
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sockenwerk</h1>
          <p className="mt-1 text-sm text-muted">
            Bestandsverwaltung · Shopify-Demo
          </p>
        </div>

        <form action={formAction} className="card flex flex-col gap-4 p-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Benutzername</span>
            <input
              name="username"
              autoComplete="username"
              required
              className="rounded-(--radius-control) border border-border-subtle bg-background px-3 py-2 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Passwort</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-(--radius-control) border border-border-subtle bg-background px-3 py-2 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>

          {state?.error && (
            <p
              role="alert"
              className="rounded-(--radius-control) bg-danger-soft px-3 py-2 text-sm text-danger"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-(--radius-control) bg-accent px-4 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Anmelden …" : "Anmelden"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Demo-Zugang: <span className="font-medium">Test</span> /{" "}
          <span className="font-medium">Test</span>
        </p>
      </div>
    </main>
  );
}
