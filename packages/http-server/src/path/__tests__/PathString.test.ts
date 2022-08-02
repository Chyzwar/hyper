import PathString from "../PathString.js";
import type Match from "../types/Match.js";

describe("PathString", () => {

  describe(
    `
    sensitive = true,
    strict = true,
    end = true,
    start = true
    `,
    () => {
      const path = new PathString("/foo/bar");
      path.mount({
        sensitive: true,
        strict: true,
        end: true,
        start: true,
      });

      it.each<[string, Match]>([
        ["/foo/bar", true],
        ["/foo/bar/", false],
        ["/foo", false],
        ["/Foo/Bar", false],
      ])("should match %s as %p", (url: string, result: Match) => {
        expect(path.match(url)).toBe(result);
      });
    });

  describe(
    `
    sensitive = true,
    strict = true,
    end = false,
    start = true
    `,
    () => {
      const path = new PathString("/foo/bar");
      path.mount({
        sensitive: true,
        strict: true,
        end: false,
        start: true,
      });

      it.each<[string, Match]>([
        ["/foo/bar", {rest: "/"}],
        ["/foo/bar/baz", {rest: "/baz"}],
        ["/foo/bar/", {rest: "/"}],
        ["/Foo/Bar", false],
      ])("should match %s as %p", (url: string, result: Match) => {
        expect(path.match(url)).toEqual(result);
      });
    });

  describe(
    `
    sensitive = true,
    strict = false,
    end = false,
    start = true
    `,
    () => {
      const path = new PathString("/foo/bar");
      path.mount({
        sensitive: true,
        strict: false,
        end: true,
        start: true,
      });

      it.each<[string, Match]>([
        ["/foo/bar", true],
        ["/foo/bar/", true],
        ["/foo/bar/baz", false],
        ["/Foo/Bar", false],
      ])("should match %s as %p", (url: string, result: Match) => {
        expect(path.match(url)).toEqual(result);
      });
    });
});