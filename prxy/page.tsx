import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <img src="/duck-logo.svg" alt="DuckDuckGo Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold">Search The Web!</h1>
        </div>

        <SearchForm />
        <SearchResults />
      </div>
    </main>
  )
}

