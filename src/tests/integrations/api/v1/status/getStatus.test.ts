describe("Status", () => {
  const pgBaseVersion = "16.0";

  it("GET status should be return 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    expect(response.status).toBe(200);
  });

  it("GET status should be return postgresVersion", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const data = await response.json();
    const pgVersion = data.db.version;
    expect(pgVersion).toBe(pgBaseVersion);
  });

  it("GET status should be return maxConnections", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const data = await response.json();
    const maxConnections = data.db.max_connections;
    expect(maxConnections).toBeGreaterThanOrEqual(100);
  });

  it("GET status should be return currentConnections", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");
    const data = await response.json();
    const currentConnections = data.db.current_connections;
    expect(currentConnections).toEqual(1);
  });
});
