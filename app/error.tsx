"use client";
import { useEffect } from "react";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("RNT route error", error); }, [error]);
  return <div className="empty-state section"><span className="eyebrow">RNT / RECOVERY</span><h1>That didn’t load.</h1><p>Your bag and saved pieces stay on this device. Try the page again.</p><button className="button-primary" onClick={() => reset()}>Try again</button></div>;
}
