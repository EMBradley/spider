import { crawlPage } from "./crawl";

async function main() {
  const args = Bun.argv;

  // expect arguments of the form ["/path/to/bun", "/path/to/main.ts", "baseUrl"]
  if (args.length !== 3) {
    console.log("incorrect number of arguments");
    return;
  }

  const baseUrl = args[2];
  console.log(`spider now crawling over ${baseUrl}\n`);

  try {
    let url = new URL(baseUrl);
    let pages = await crawlPage(url, url, new Map());
    for (const [page, count] of pages.entries()) {
      console.log(`${page}: ${count}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else if (typeof error === "string") {
      console.log(error);
    }
  }
}

await main();
