import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "../../../components/atalanta/Shell";
import Footer from "../../../components/atalanta/Footer";
import MuxMedia from "../../../components/atalanta/MuxMedia";
import { ARTICLES, articleBySlug, articlesByCategory, SITE } from "../../../lib/atalanta/content";

const CATS = ["all", "research", "ideas", "press"];

export const metadata = {
  title: "Learn",
  description: "Maersat Learn — research, ideas, and press on maritime intelligence and software understanding.",
  alternates: { canonical: "/articles/all/1/" },
};

export default async function ArticlesCatchAll({ params }) {
  const { path = [] } = await params;

  if (path.length === 0) redirect("/articles/all/1");

  if (path.length === 2 && CATS.includes(path[0])) {
    const category = path[0];
    const items = articlesByCategory(category);
    return (
      <Shell>
        <article className="at-inner at-enter">
          <p className="at-kicker">Articles</p>
          <h1>Learn</h1>
          <p>From theory to operational impact — curated by Maersat.</p>
          <div className="at-filters">
            {CATS.map((c) => (
              <Link
                key={c}
                href={`/articles/${c}/1`}
                className="at-link"
                style={c === category ? { color: "#fcfaf3" } : undefined}
              >
                / {c[0].toUpperCase() + c.slice(1)}
              </Link>
            ))}
          </div>
          {items.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="at-card">
              <p className="at-cat">{a.featured ? "Featured · " : ""}{a.category}</p>
              <h2>{a.title}</h2>
              <p>{a.dek}</p>
              <span className="at-cta">Read More</span>
            </Link>
          ))}
        </article>
        <Footer />
      </Shell>
    );
  }

  if (path.length === 1) {
    const article = articleBySlug(path[0]);
    if (!article) notFound();
    return (
      <Shell>
        <article className="at-inner at-enter">
          <p className="at-kicker">{article.category}</p>
          <p className="at-meta">{article.date} · Written By {article.author}</p>
          <h1>{article.title}</h1>
          <p>{article.dek}</p>
          {article.mux && <MuxMedia className="at-wide" playbackId={article.mux} />}
          {article.body.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          <p>
            <Link className="at-cta" href="/articles/all/1">Read all</Link>
            {" · "}
            <a className="at-cta" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </article>
        <Footer />
      </Shell>
    );
  }

  notFound();
}

export function generateStaticParams() {
  const cats = CATS.flatMap((c) => [{ path: [c, "1"] }]);
  const articles = ARTICLES.map((a) => ({ path: [a.slug] }));
  return [...cats, ...articles];
}
