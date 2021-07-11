import HttpClient from "../lib/NodeClient";

describe("NodeHttp", () => {
  const client = new HttpClient(
    new URL("https://jsonplaceholder.typicode.com")
  );

  it("should get first 100 posts", async() => {
    const employees = await client.get("/posts");

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(employees).toHaveLength(100);
  });
});