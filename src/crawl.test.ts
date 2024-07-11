import { test, expect } from "bun:test";
import { normalizeUrl, extractUrl } from "./crawl";

test(`normalize urls`, () => {
  const equivalentUrls = [
    "https://blog.boot.dev/path/",
    "https://blog.boot.dev/path",
    "http://blog.boot.dev/path/",
    "http://blog.boot.dev/path",
  ];

  const expected = "blog.boot.dev/path";
  for (const url of equivalentUrls) {
    const actual = normalizeUrl(new URL(url));
    expect(actual).toEqual(expected);
  }
});

test("extract absolute url", () => {
  const html =
    '<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>';
  const expected = [new URL("https://blog.boot.dev")];
  const actual = extractUrl(html, new URL("https://blog.boot.dev"));
  expect(actual).toEqual(expected);
});

test("extract relative url", () => {
  const html =
    '<html><body><a href="/path/to/resource"><span>Go to Boot.dev</span></a></body></html>';
  const baseUrl = new URL("https://blog.boot.dev");
  const expected = new URL("https://blog.boot.dev/path/to/resource");
  const actual = extractUrl(html, baseUrl);
  expect(actual).toEqual([expected]);
});

test("extract multiple urls", () => {
  const html =
    '<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a><p>Some other stuff</p><a href="/a/relative/path">Another link</a></body></html>';
  const baseUrl = new URL("https://blog.boot.dev");
  const expected = [
    new URL("https://blog.boot.dev"),
    new URL("https://blog.boot.dev/a/relative/path"),
  ];
  const actual = extractUrl(html, baseUrl);
  expect(actual).toEqual(expected);
});
