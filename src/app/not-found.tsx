import Link from "next/link";
import "@/styles/globals.css";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-accent)" }}>
            404
          </p>
          <h1 style={{ marginTop: "1rem", fontSize: "var(--text-h1)" }}>Page not found</h1>
          <Link
            href="/"
            style={{
              marginTop: "2.5rem",
              borderRadius: "0.75rem",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Back to homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
