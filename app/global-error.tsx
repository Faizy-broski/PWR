"use client";

import { useEffect } from "react";

// Only rendered if the root layout itself throws — app/error.tsx handles
// everything else, so this stays deliberately minimal (no design system
// dependencies, since the layout that provides them may be what's broken).
// Animation here is plain CSS (a <style> tag), not GSAP or Tailwind, so it
// has nothing to depend on beyond the browser itself.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
          background: "#0D0C0C",
          color: "white",
        }}
      >
        <style>{`
          @keyframes ge-in {
            from { opacity: 0; transform: translateY(12px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes ge-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(235, 189, 87, 0.35); }
            50% { box-shadow: 0 0 0 14px rgba(235, 189, 87, 0); }
          }
          .ge-mark {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.25rem;
            background: linear-gradient(111.53deg, #ebbd57 0%, #ad7b3d 100%);
            color: #0D0C0C;
            animation: ge-in 0.5s ease-out both, ge-pulse 2.4s ease-out 0.5s infinite;
          }
          .ge-body { animation: ge-in 0.5s ease-out 0.1s both; }
          .ge-btn {
            padding: 0.6rem 1.5rem;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.25);
            background: transparent;
            color: white;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: background-color 0.2s, border-color 0.2s;
            animation: ge-in 0.5s ease-out 0.2s both;
          }
          .ge-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
        `}</style>
        <div className="ge-mark">PWR</div>
        <div className="ge-body">
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "28rem", marginTop: "0.5rem" }}>
            We hit an unexpected error loading the page. Please try again.
          </p>
        </div>
        <button className="ge-btn" onClick={retry}>
          Try again
        </button>
      </body>
    </html>
  );
}
