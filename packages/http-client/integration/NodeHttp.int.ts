import HttpClient from "../lib/NodeClient";
import {expect, describe, it} from "@jest/globals";

describe("NodeHttp", () => {
  const client = new HttpClient(
    new URL("https://jsonplaceholder.typicode.com")
  );

  it("should get first 100 posts", async() => {
    const employees = await client.get("/posts");

    expect(employees).toHaveLength(100);
  });
});