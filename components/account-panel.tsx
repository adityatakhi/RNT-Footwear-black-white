"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, LockKeyhole } from "lucide-react";
type Props = { email: string | null };
export function AccountPanel({ email: initialEmail }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Sign-in is unavailable."); return; }
      setEmail(result.user.email);
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) router.replace(next);
      else router.refresh(); setMessage("You’re signed in.");
    } catch { setMessage("Unable to reach sign-in. Try again when you’re online."); }
    finally { setBusy(false); }
  }
  async function signOut() { await fetch("/api/auth/logout", { method: "POST" }); setEmail(null); setMessage("You are signed out."); router.refresh(); }
  if (email) return <div className="account-gate"><div className="checkout-card__icon"><LockKeyhole size={19}/></div><h2>Welcome back.</h2><p>Signed in as {email}. Account history is not connected to the sample catalogue yet.</p><button className="button-secondary" onClick={signOut}><LogOut size={15}/> Sign out</button>{message && <p role="status">{message}</p>}</div>;
  return <div className="account-gate"><div className="checkout-card__icon"><LockKeyhole size={19}/></div><h2>Sign in to your RNT.</h2><p>Sign-in is for accounts provisioned and verified by the store administrator. New account registration is not enabled in this sample.</p><form className="account-login" onSubmit={signIn}><div className="form-field"><label htmlFor="account-email">Email address</label><input id="account-email" name="email" type="email" autoComplete="email" required/></div><div className="form-field"><label htmlFor="account-password">Password</label><input id="account-password" name="password" type="password" autoComplete="current-password" minLength={10} required/></div><button className="button-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <ArrowRight size={15}/></button></form>{message && <p className="account-message" role="status">{message}</p>}</div>;
}

