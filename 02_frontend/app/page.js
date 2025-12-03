"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("title");

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

  const filtered = Array.isArray(rows)
    ? rows.filter((x) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          String(x.title).toLowerCase().includes(q) ||
          String(x.genre).toLowerCase().includes(q) ||
          String(x.platform).toLowerCase().includes(q)
        );
      })
    : [];

  const displayed = filtered.sort((a, b) => {
    if (sort === "year_desc") return Number(b.year) - Number(a.year);
    const ta = String(a.title).toLowerCase();
    const tb = String(b.title).toLowerCase();
    if (ta < tb) return -1;
    if (ta > tb) return 1;
    return 0;
  });

  return (
    <main className="container">
      <header className="header">
        <p className="kicker">DIT312 – CI/CD with Jenkins + Docker</p>
        <h1 className="title">Video Game Library</h1>
        <p className="subtitle">Search, sort, and explore seeded data</p>
        <div className="toolbar">
          <input
            className="input"
            type="search"
            placeholder="Search title, genre, platform"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search videogames"
          />
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort"
          >
            <option value="title">Title A→Z</option>
            <option value="year_desc">Year (newest)</option>
          </select>
        </div>
      </header>

      {!rows || rows.length === 0 ? (
        <div className="empty">No videogames found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {displayed.map((x) => (
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
                <div className="badge-row">
                  <span className="pill">{x.genre}</span>
                  <span className="pill">{x.platform}</span>
                  <span className="pill">{x.year}</span>
                </div>
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
