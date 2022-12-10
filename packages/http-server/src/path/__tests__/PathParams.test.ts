
import {describe, it, expect} from "@jest/globals";
import PathParams from "../PathParams.js";
import type Match from "../types/Match.js";

describe("PathParams", () => {
  describe(
    `
    sensitive = true,
    strict = true,
    end = true,
    start = true
    `,
    () => {
      const path = new PathParams("/:foo/bar");
      path.mount({
        sensitive: true,
        strict: true,
        end: true,
        start: true,
      });

      it.each<[string, Match]>([
        ["/foo/bar", {params: {foo: "foo"}}],
        ["/baz/bar", {params: {foo: "baz"}}],
        ["/foo", false],
        ["/Foo/Bar", false],
      ])("should match %s as %p", (url: string, result: Match) => {
        expect(path.match(url)).toEqual(result);
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
      const path = new PathParams("/:foo/bar");
      path.mount({
        sensitive: true,
        strict: true,
        end: false,
        start: true,
      });

      it.each<[string, Match]>([
        ["/foo/bar/boo", {params: {foo: "foo"}, rest: "/boo"}],
        ["/baz/bar/boo", {params: {foo: "baz"}, rest: "/boo"}],
        ["/foo/boo", false],
        ["/Foo/Bar/Boo", false],
      ])("should match %s as %p", (url: string, result: Match) => {
        expect(path.match(url)).toEqual(result);
      });
    });
});