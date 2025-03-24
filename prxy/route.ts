import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // DuckDuckGo doesn't have an official API, but we can use their search JSON endpoint
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`)

    if (!response.ok) {
      throw new Error(`DuckDuckGo API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to a more usable format
    const results = data.RelatedTopics
      ? data.RelatedTopics.filter((topic: any) => topic.FirstURL && topic.Text).map((topic: any) => ({
          title: topic.Text.split(" - ")[0] || topic.Text,
          description: topic.Text.split(" - ")[1] || topic.Text,
          url: topic.FirstURL,
        }))
      : []

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error fetching from DuckDuckGo:", error)
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 })
  }
}

