import {describe, it, expect} from "@jest/globals";
import type {Content} from "../getContentType.js";
import getContentType from "../getContentType.js";
import Charset from "../Charset.js";


describe("getContentType", () => {

  it.each<[string, { type: string; params: { charset: Charset } }]>([
    ["text/html; charset=UTF-8", {type: "text/html", params: {charset: Charset.UTF8}}],
    ["text/html", {type: "text/html", params: {charset: Charset.UTF8}}],
    ["application/json; charset=UTF-8", {type: "application/json", params: {charset: Charset.UTF8}}],
    ["application/json", {type: "application/json", params: {charset: Charset.UTF8}}],
  ])("should parse %s as %p", (type: string, result: Content) => {
    expect(getContentType(type)).toEqual(result);
  });
});
