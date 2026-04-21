import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { ContactCta } from "../../_components/ContactCta";
import { ArticleJsonLd } from "../../_components/JsonLd";
import { getAllPosts, getPost } from "@/lib/blog";
import { SITE } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      url: `${SITE.url}/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <ArticleJsonLd
        article={{
          title: post.title,
          description: post.description,
          datePublished: post.date,
          image: post.image,
          url: `${SITE.url}/blog/${post.slug}`,
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Forside", href: "/" },
          { name: "Viden", href: "/blog" },
          { name: post.title },
        ]}
      />

      <article>
        <header className="pt-8 pb-10 md:pt-14 md:pb-16">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="eyebrow-accent mb-6">{post.category ?? "VIDEN"}</div>
            <h1 className="display-lg">{post.title}</h1>
            <p className="mt-6 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">{post.description}</p>
            <div className="mt-8 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)]">
              ↳ {new Date(post.date).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </header>

        {post.image && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <Image src={post.image} alt="" fill priority className="object-cover" sizes="100vw" />
          </div>
        )}

        <div
          className="mx-auto max-w-3xl px-6 md:px-10 py-14 md:py-20 blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-[color:var(--color-line)] py-20 md:py-28 bg-[color:var(--color-surface)]">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="eyebrow-accent mb-6">↳ MERE FRA VIDEN</div>
            <h2 className="display-md mb-10">Andre artikler du måske skal læse.</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[color:var(--color-line)] border border-[color:var(--color-line)]">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white p-6 md:p-8 flex flex-col gap-3">
                  <span className="eyebrow-accent">{r.category ?? "Viden"}</span>
                  <h3 className="font-display font-bold text-lg leading-tight group-hover:text-[color:var(--color-blue)]">{r.title}</h3>
                  <p className="text-[color:var(--color-ink-soft)] text-sm leading-relaxed">{r.description}</p>
                  <span className="link-arrow mt-auto pt-2">Læs</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}
