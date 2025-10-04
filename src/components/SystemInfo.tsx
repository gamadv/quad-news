import useSWR from "swr";
import { fetchAPI } from "../services/fetchFn";

export function SystemInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000, // 2 seconds
  });

  const updatedAt =
    !isLoading && data?.timestamp
      ? new Date(data.timestamp).toLocaleString("pt-br")
      : "Loading...";

  const dbDetails =
    isLoading && !data?.db ? (
      "Loading..."
    ) : (
      <div>
        <p>Version: {data.db.version}</p>
        <p>Max Connections: {data.db.max_connections}</p>
        <p>Current Connections: {data.db.current_connections}</p>
      </div>
    );

  return (
    <div>
      <section>
        <h2>Status</h2>
        <div>Updated at: {updatedAt}</div>
      </section>
      <section>
        <h2>DB Details</h2>
        <div>{dbDetails}</div>
      </section>
    </div>
  );
}
