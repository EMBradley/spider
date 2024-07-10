import { JSDOM } from "jsdom";
export { normalizeUrl, extractUrl, crawlPage };

async function crawlPage(
  currentUrl: URL,
  baseUrl: URL,
  pages: Map<string, number>,
): Promise<Map<string, number>> {
  if (currentUrl.host !== baseUrl.host) {
    // link is external
    return pages;
  }

  const normalized = normalizeUrl(currentUrl);
  let count = pages.get(normalized);
  if (count) {
    // link has been seen
    pages.set(normalized, count + 1);
    return pages;
  }

  pages.set(normalized, 1);
  const htmlBody = await fetchHtmlBody(currentUrl);
  const urls = extractUrl(htmlBody, baseUrl);

  for (const url of urls) {
    pages = await crawlPage(url, baseUrl, pages);
  }

  return pages;
}

async function fetchHtmlBody(url: URL): Promise<string> {
  const response = await fetch(url);

  const status = response.status;
  if (status >= 400) {
    throw Error(`unexpected http response status: ${status}`);
  }

  const contentType = response.headers.get("Content-Type");
  if (
    !contentType ||
    !(
      contentType.includes("text/html") ||
      contentType.includes("application/xml")
    )
  ) {
    throw Error(`unexpected http response content type: ${contentType}`);
  }

  const responseText = await response.text();
  const bodyStartIndex = responseText.indexOf("<body");
  const bodyEndIndex = responseText.indexOf("</body>");
  const body = responseText.slice(bodyStartIndex, bodyEndIndex) + "</body>";

  return body;
}

function normalizeUrl(url: URL): string {
  let path = `${url.host}${url.pathname}`;

  if (path.endsWith("/")) {
    return path.slice(0, -1);
  } else {
    return path;
  }
}

function extractUrl(html: string, baseUrl: URL): URL[] {
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");
  const urls = [];

  for (const anchor of anchors) {
    if (!anchor.hasAttribute("href")) {
      continue;
    }

    const url = new URL(anchor.href, baseUrl);
    urls.push(url);
  }

  return urls;
}
