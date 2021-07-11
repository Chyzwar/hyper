import type {ContentType} from "../getContentType";
import getContentType from "../getContentType";
import Charset from "../Charset";


describe("getContentType", () => {

  it.each<[string, {type: string; params: {charset: Charset}}]>([
    ["text/html; charset=UTF-8", {type: "text/html", params: {charset: Charset.UTF8}}],
    ["text/html", {type: "text/html", params: {charset: Charset.UTF8}}],
    ["application/json; charset=UTF-8", {type: "application/json", params: {charset: Charset.UTF8}}],
    ["application/json", {type: "application/json", params: {charset: Charset.UTF8}}],
  ])("should parse %s as %p", (type: string, result: ContentType) => {
    expect(getContentType(type)).toEqual(result);
  });
});
