async function fetchAPI(key: string) {
  const response = await fetch(key);
  const responseData = await response.json();
  if (!response.ok) {
    const error = new Error(
      responseData?.message || "An error occurred while fetching the data.",
    );
    throw error;
  }
  return responseData;
}

export { fetchAPI };
