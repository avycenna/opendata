"use client"

import { useState, useMemo, useDeferredValue } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  SearchX, 
  Map as MapIcon,
  X
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import SchoolMap from "@/components/school-map"
import FilterPanel from "@/components/filter-panel"
import StatisticsPanel from "@/components/statistics-panel"
import SearchExport from "@/components/search-export"
import DataSources from "@/components/data-sources"
import FeedbackForm from "@/components/feedback-form"
import type { SchoolWithLocation } from "@/lib/actions"

export interface FilterOptions {
  regions?: string[]
  provinces?: string[]
  communes?: string[]
}

// Convert to School format expected by components
export interface School {
  id: number
  name: string
  latitude: number
  longitude: number
  address: string
  region: string
  province: string
  commune: string
}

interface RihlaClientProps {
  initialSchools: SchoolWithLocation[]
}

function filterAndSearchSchools(
  schools: School[], 
  filters: FilterOptions, 
  query: string
): School[] {
  let result = schools

  // Apply region filter
  if (filters.regions?.length) {
    result = result.filter(s => filters.regions!.includes(s.region))
  }

  // Apply province filter
  if (filters.provinces?.length) {
    result = result.filter(s => filters.provinces!.includes(s.province))
  }

  // Apply commune filter
  if (filters.communes?.length) {
    result = result.filter(s => filters.communes!.includes(s.commune))
  }

  // Apply search query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.address.toLowerCase().includes(lowerQuery) ||
      s.region.toLowerCase().includes(lowerQuery) ||
      s.province.toLowerCase().includes(lowerQuery) ||
      s.commune.toLowerCase().includes(lowerQuery)
    )
  }

  return result
}

export default function RihlaClient({ initialSchools }: RihlaClientProps) {
  const schools = initialSchools as School[]
  
  const [filters, setFilters] = useState<FilterOptions>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debounce search query for performance
  const deferredSearchQuery = useDeferredValue(searchQuery)

  // Combine filters and search into a single filtered result
  const filteredSchools = useMemo(() => {
    return filterAndSearchSchools(schools, filters, deferredSearchQuery)
  }, [schools, filters, deferredSearchQuery])

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    setSearchQuery("")
    setSelectedSchool(null)
  }

  const activeFilterCount = 
    (filters.regions?.length ?? 0) + 
    (filters.provinces?.length ?? 0) + 
    (filters.communes?.length ?? 0)

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0

  // Sidebar content JSX
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-1">
          <MapIcon className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-lg">School Explorer</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Discover schools across Morocco
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Search */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Search
            </label>
            <SearchExport 
              schools={filteredSchools} 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery} 
            />
          </div>

          <Separator />

          {/* Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-muted-foreground">
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                    {activeFilterCount}
                  </span>
                )}
              </label>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
              schools={schools}
            />
          </div>

          <Separator />

          {/* Statistics */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-3 block">
              Results
            </label>
            <StatisticsPanel schools={filteredSchools} />
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30">
        <div className="flex items-center justify-center gap-2">
          <DataSources />
          <FeedbackForm />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-r bg-card flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Filters and Search</SheetTitle>
          </SheetHeader>
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 z-10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 p-3 border-b bg-card">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <MapIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium truncate">School Explorer</span>
              {filteredSchools.length > 0 && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {filteredSchools.length} schools
                </span>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="shrink-0 text-xs"
            >
              Clear ({activeFilterCount + (searchQuery ? 1 : 0)})
            </Button>
          )}
        </header>

        {/* Map Container */}
        <div className="flex-1 relative">
          <SchoolMap
            schools={filteredSchools}
            selectedSchool={selectedSchool}
            onSchoolSelect={setSelectedSchool}
          />

          {/* Empty State Overlay */}
          {filteredSchools.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center p-6 max-w-sm">
                <SearchX className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="font-medium text-muted-foreground mb-1">
                  No schools found
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
