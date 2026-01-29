'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, X } from 'lucide-react'
import { School } from '@/lib/data'

interface SearchExportProps {
  schools: School[]
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchExport({ schools, searchQuery, onSearchChange }: SearchExportProps) {
  const handleExport = () => {
    if (schools.length === 0) {
      alert('No schools to export')
      return
    }

    const headers = ['Name', 'Address', 'Region', 'Province', 'Commune', 'Type', 'Latitude', 'Longitude']
    const rows = schools.map(school => [
      school.name,
      school.address,
      school.region,
      school.province,
      school.commune,
      school.schoolType,
      school.latitude,
      school.longitude,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `morocco-schools-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search schools, communes, regions..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-sm"
          aria-label="Search schools"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="h-9 px-3 shrink-0"
        disabled={schools.length === 0}
      >
        <Download className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </div>
  )
}
