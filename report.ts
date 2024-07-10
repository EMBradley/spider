import { crawlPage } from "./crawl";

export { printReport };

async function printReport(url: URL) {
  console.log(`Spider now crawling over ${url}\n`);

  const pages = await crawlPage(url, url, new Map());
  console.log(`Printing crawl report for ${url}:\n`);

  const sortedPages = [...pages.entries()].sort((a, b) => a[1] - b[1]);
  for (const [page, count] of sortedPages) {
    console.log(`Found ${count} internal links to ${page}`);
  }
}
