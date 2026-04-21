import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: string;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => readMeta(file));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    image: data.image ? String(data.image) : undefined,
    category: data.category ? String(data.category) : undefined,
    html: marked.parse(content, { async: false }) as string,
  };
}

function readMeta(file: string): BlogPostMeta {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    image: data.image ? String(data.image) : undefined,
    category: data.category ? String(data.category) : undefined,
  };
}
