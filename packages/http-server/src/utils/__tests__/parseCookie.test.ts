import parseCookie from "../parseCookie.js";
import {describe, it, expect} from "@jest/globals";

describe("parseCookie", () => {
  it("handling of empty values", function() {
    expect(parseCookie("")).toEqual({});
    expect(parseCookie.bind(undefined)).toEqual({});
  });
  
  it("basic", () => {
    expect(parseCookie("foo=bar")).toEqual({foo: "bar"});
    expect(parseCookie("foo=123")).toEqual({foo: "123"});
  });
  
  it("ignore spaces", () => {
    expect(parseCookie("FOO    = bar;   baz  =   raz"))
      .toEqual({FOO: "bar", baz: "raz"});
  });
  
  it("escaping", () => {
    expect(parseCookie("foo=\"bar=123456789&name=Magic+Mouse\""))
      .toEqual({foo: "bar=123456789&name=Magic+Mouse"});
  
    expect(parseCookie("email=%20%22%2c%3b%2f"))
      .toEqual({email: " \",;/"});
  });
  
  it("ignore escaping error and return original value", () => {
    expect(parseCookie("foo=%1;bar=bar")).toEqual({foo: "%1", bar: "bar"});
  });
  
  it("ignore non values", function() {
    expect(parseCookie("foo=%1;bar=bar;HttpOnly;Secure"))
      .toEqual({foo: "%1", bar: "bar"});
  });
  
  // it("unencoded", function() {
  //   expect(parseCookie("foo=\"bar=123456789&name=Magic+Mouse\"", {
  //     decode: function(v) {
  //       return v; 
  //     },
  //   }), {foo: "bar=123456789&name=Magic+Mouse"});
  
  //   expect(parseCookie("email=%20%22%2c%3b%2f", {
  //     decode: function(v) {
  //       return v; 
  //     },
  //   }), {email: "%20%22%2c%3b%2f"});
  // });
  
  it("dates", () => {
    expect(parseCookie("priority=true; expires=Wed, 29 Jan 2014 17:43:25 GMT; Path=/")).toEqual({priority: "true", Path: "/", expires: "Wed, 29 Jan 2014 17:43:25 GMT"});
  });
  
  it("missing value", () => {
    expect(parseCookie("foo; bar=1; fizz= ; buzz=2")).toEqual({bar: "1", fizz: "", buzz: "2"});
  });
  
  it("assign only once", () => {
    expect(parseCookie("foo=%1;bar=bar;foo=boo")).toEqual({foo: "%1", bar: "bar"});
    expect(parseCookie("foo=false;bar=bar;foo=true")).toEqual({foo: "false", bar: "bar"});
    expect(parseCookie("foo=;bar=bar;foo=boo")).toEqual({foo: "", bar: "bar"});
  });
});
