"use client"

import Link from "next/link"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Open Data Initiative by <Link href="https://avycenna.com" className="underline">Avycenna</Link></h1>
      </div>
    </main>
  )
}
