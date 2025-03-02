// create an fake test
describe("Status", () => {
  it("GET status should be return 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const data = await response.json();

    console.log("🚀 ~ dataRetrieved:", data);

    expect(response.status).toBe(200);
  });
});
