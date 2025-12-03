"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getVideogames() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/videogames`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getVideogames();
  }, []);

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Pyi Thein Kyaw(JOJO) 6703466</h1>
        <h1 className="title">Video Games</h1>
        <p className="subtitle">Browse popular titles from the database</p>
      </header>

      {!rows || rows.length === 0 ? (
        <div className="empty">No videogames found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((x) => (
            <article key={x.id} className="card" tabIndex={0}>
              {x.coverimage && (
                <div className="media">
                  <Image
                    src={x.coverimage}
                    alt={x.title}
                    className="img"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
              )}
              <div className="body">
                <h3 className="card-title">{x.title}</h3>
                {x.description && <p className="detail">{x.description}</p>}
                <div className="meta">
                  <small>
                    Genre: <span className="code">{x.genre}</span> · Platform: {" "}
                    <span className="code">{x.platform}</span> · Year: {" "}
                    <span className="code">{x.year}</span>
                  </small>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
