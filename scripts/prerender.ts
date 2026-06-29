import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../client/src/entry-server";
import { renderHeadMarkup } from "../client/src/seo/head";
import {
  getPrerenderRoutes,
  getRouteMetadata,
  getSitemapEntries,
  normalizePath,
  toAbsoluteUrl,
} from "../client/src/seo/siteMetadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.resolve(projectRoot, "dist", "public");
const templatePath = path.resolve(distRoot, "index.html");

function toHtmlOutputPath(routePath: string) {
  if (routePath === "/") {
    return path.join(distRoot, "index.html");
  }

  const normalized = normalizePath(routePath).replace(/^\//, "");
  return path.join(distRoot, `${normalized}.html`);
}

async function ensureParentDirectory(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function getLastModifiedMap() {
  const entries = getSitemapEntries();
  const uniqueSources = [...new Set(entries.map((entry) => entry.sourceKey))];
  const sourceDates = new Map<string, string>();

  await Promise.all(
    uniqueSources.map(async (sourceKey) => {
      const absolutePath = path.resolve(projectRoot, sourceKey);
      try {
        const stat = await fs.stat(absolutePath);
        sourceDates.set(sourceKey, stat.mtime.toISOString());
      } catch {
        sourceDates.set(sourceKey, new Date().toISOString());
      }
    })
  );

  return new Map(
    entries.map((entry) => [entry.path, sourceDates.get(entry.sourceKey) ?? new Date().toISOString()])
  );
}

async function writeHtmlRoutes(template: string) {
  await Promise.all(
    getPrerenderRoutes().map(async (routePath) => {
      const metadata = getRouteMetadata(routePath);
      const appHtml = render(routePath);
      const html = template
        .replace("<!--seo:start--><!--seo:end-->", renderHeadMarkup(metadata))
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      const outputPath = toHtmlOutputPath(routePath);
      await ensureParentDirectory(outputPath);
      await fs.writeFile(outputPath, html, "utf8");
    })
  );
}

async function writeSitemap() {
  const lastModifiedMap = await getLastModifiedMap();
  const sitemapEntries = getSitemapEntries()
    .map((entry) => {
      const lastmod = lastModifiedMap.get(entry.path) ?? new Date().toISOString();
      return `  <url>
    <loc>${toAbsoluteUrl(entry.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

  await fs.writeFile(path.join(distRoot, "sitemap.xml"), content, "utf8");
}

async function writeRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: ${toAbsoluteUrl("/sitemap.xml")}
`;

  await fs.writeFile(path.join(distRoot, "robots.txt"), content, "utf8");
}

async function write404Alias() {
  const sourcePath = path.join(distRoot, "404.html");
  const targetPath = path.join(distRoot, "404", "index.html");
  await ensureParentDirectory(targetPath);
  await fs.copyFile(sourcePath, targetPath);
}

async function main() {
  const template = await fs.readFile(templatePath, "utf8");
  await writeHtmlRoutes(template);
  await writeSitemap();
  await writeRobots();
  await write404Alias();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
