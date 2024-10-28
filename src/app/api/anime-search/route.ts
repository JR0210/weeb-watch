export async function GET(request: Request): Promise<Response> {
  try {
    // Get query params from the request URL
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const page = url.searchParams.get("page");

    // If query is less than 3 characters, return an error
    if (!query || query.length < 3) {
      return new Response("Query must be at least 3 characters", {
        status: 400,
      });
    }

    // Fetch data from Jikan API, only attach query and page if they exist
    const res = await fetch(
      `${process.env.API_BASE_URL}/anime?q=${encodeURIComponent(query)}${
        page ? `&page=${page}` : ""
      }&sfw`
    );
    const json = await res.json();

    // Return the response
    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
