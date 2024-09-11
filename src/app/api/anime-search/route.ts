export async function GET(request: Request): Promise<Response> {
  try {
    // Get query params from the request URL
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    // If query is less than 3 characters, return an error
    if (!query || query.length < 3) {
      return new Response("Query must be at least 3 characters", {
        status: 400,
      });
    }

    // Fetch data from the Jikan API
    const res = await fetch(
      `${process.env.API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw`
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
