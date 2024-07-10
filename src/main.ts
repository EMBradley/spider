import { printReport } from "./report";

async function main() {
  const args = Bun.argv;

  // expect arguments of the form ["/path/to/bun", "/path/to/main.ts", "baseUrl"]
  if (args.length !== 3) {
    console.log("incorrect number of arguments");
    return;
  }

  const baseUrl = args[2];

  try {
    let url = new URL(baseUrl);
    await printReport(url);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else if (typeof error === "string") {
      console.log(error);
    }
  }
}

await main();
