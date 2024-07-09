import { JSDOM } from "jsdom";
export { normalizeUrl, extractUrl };

function normalizeUrl(url: URL): string {
  const host = url.host;
  let path = url.pathname;
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return host + path;
}

function extractUrl(html: string, baseUrl: string): URL[] {
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");
  const urls = [];

  for (const anchor of anchors) {
    let url = anchor.href;

    if (!url.startsWith("http")) {
      url = baseUrl + url;
    }

    const urlObj = new URL(url);
    urls.push(urlObj);
  }

  return urls;
}
