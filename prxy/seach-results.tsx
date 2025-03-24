"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchResult {
  title: string
  url: string
  description: string
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Failed to fetch search results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (!query) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">Enter a search query to see results</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">No results found for "{query}"</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {results.map((result, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600 hover:underline">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </CardTitle>
            <CardDescription className="text-green-700 text-sm">{result.url}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{result.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

