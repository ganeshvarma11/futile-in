import { useEffect } from "react";
import { useLocation } from "wouter";
import { renderHeadMarkup } from "./head";
import { getRouteMetadata, normalizePath } from "./siteMetadata";

function upsertMeta(selector: string, attributeName: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    const [, key, attrValue] = selector.match(/meta\[(.+?)="(.+?)"\]/) ?? [];
    if (key && attrValue) {
      element.setAttribute(key, attrValue);
    }
    document.head.appendChild(element);
  }

  element.setAttribute(attributeName, value);
}

function upsertLink(selector: string, rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function updateSchemaScripts(markup: string) {
  document.head
    .querySelectorAll('script[data-route-schema="true"]')
    .forEach((element) => element.remove());

  const wrapper = document.createElement("template");
  wrapper.innerHTML = markup;

  wrapper.content
    .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
    .forEach((script) => {
      script.dataset.routeSchema = "true";
      document.head.appendChild(script);
    });
}

export function SeoUpdater() {
  const [location] = useLocation();

  useEffect(() => {
    const metadata = getRouteMetadata(normalizePath(location));
    document.title = metadata.title;
    upsertMeta('meta[name="description"]', "content", metadata.description);
    upsertMeta('meta[name="robots"]', "content", metadata.robots);
    upsertMeta('meta[property="og:type"]', "content", metadata.ogType);
    upsertMeta('meta[property="og:site_name"]', "content", "futile.in");
    upsertMeta('meta[property="og:title"]', "content", metadata.title);
    upsertMeta(
      'meta[property="og:description"]',
      "content",
      metadata.description
    );
    upsertMeta('meta[property="og:url"]', "content", metadata.canonicalUrl);
    upsertMeta('meta[property="og:locale"]', "content", "en_IN");
    upsertMeta('meta[name="twitter:card"]', "content", "summary");
    upsertMeta('meta[name="twitter:title"]', "content", metadata.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "content",
      metadata.description
    );
    upsertLink('link[rel="canonical"]', "canonical", metadata.canonicalUrl);
    updateSchemaScripts(renderHeadMarkup(metadata));
  }, [location]);

  return null;
}
