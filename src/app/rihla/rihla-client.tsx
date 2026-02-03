"use client"

import { useState, useMemo, useDeferredValue, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  SearchX, 
  Map as MapIcon,
  X,
  Navigation,
  MapPinned,
  Loader2,
  Clock,
  Route as RouteIcon,
  ExternalLink
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
} from "@/components/ui/map"
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
  name_latin: string
  name_arabic: string
  address_latin: string
  address_arabic: string
  type: string
  level: string
  latitude: number
  longitude: number
  region: string
  province: string
  commune: string
}

interface RouteData {
  coordinates: [number, number][]
  duration: number // seconds
  distance: number // meters
}

interface UserLocation {
  lng: number
  lat: number
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
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
      s.name_latin.toLowerCase().includes(lowerQuery) ||
      s.name_arabic.toLowerCase().includes(lowerQuery) ||
      s.address_latin.toLowerCase().includes(lowerQuery) ||
      s.address_arabic.toLowerCase().includes(lowerQuery) ||
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
  const [activeTab, setActiveTab] = useState("explore")
  const isNavigatingToRouteRef = useRef(false)
  
  // Route planning state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  // Debounce search query for performance
  const deferredSearchQuery = useDeferredValue(searchQuery)

  // Combine filters and search into a single filtered result
  const filteredSchools = useMemo(() => {
    return filterAndSearchSchools(schools, filters, deferredSearchQuery)
  }, [schools, filters, deferredSearchQuery])

  // Get user location when switching to route tab
  useEffect(() => {
    if (activeTab === "route" && !userLocation && !locationError && !isLoadingLocation) {
      setIsLoadingLocation(true)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lng: position.coords.longitude,
              lat: position.coords.latitude
            })
            setIsLoadingLocation(false)
          },
          (error) => {
            setLocationError(error.message || "Could not get your location")
            setIsLoadingLocation(false)
          }
        )
      } else {
        setLocationError("Geolocation is not supported by your browser")
        setIsLoadingLocation(false)
      }
    }
  }, [activeTab, userLocation, locationError, isLoadingLocation])

  // Fetch routes when user location and selected school are available
  useEffect(() => {
    if (activeTab === "route" && userLocation && selectedSchool) {
      const currentLocation = userLocation
      const currentSchool = selectedSchool
      
      async function fetchRoutes() {
        setIsLoadingRoute(true)
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${currentLocation.lng},${currentLocation.lat};${currentSchool.longitude},${currentSchool.latitude}?overview=full&geometries=geojson&alternatives=true`
          )
          const data = await response.json()

          if (data.routes?.length > 0) {
            const routeData: RouteData[] = data.routes.map(
              (route: {
                geometry: { coordinates: [number, number][] }
                duration: number
                distance: number
              }) => ({
                coordinates: route.geometry.coordinates,
                duration: route.duration,
                distance: route.distance,
              })
            )
            setRoutes(routeData)
            setSelectedRouteIndex(0)
          }
        } catch (error) {
          console.error("Failed to fetch routes:", error)
        } finally {
          setIsLoadingRoute(false)
        }
      }

      fetchRoutes()
    }
  }, [activeTab, userLocation, selectedSchool])

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    setSearchQuery("")
    setSelectedSchool(null)
  }

  const handleSchoolSelect = (school: School | null) => {
    // Don't clear selection if we're navigating to route tab
    if (school === null && isNavigatingToRouteRef.current) {
      return
    }
    setSelectedSchool(school)
  }

  const handleGetDirections = (school: School) => {
    // Set flag to prevent clearing selection during tab switch (using ref for immediate update)
    isNavigatingToRouteRef.current = true
    setSelectedSchool(school)
    // Switch to route tab
    setActiveTab("route")
    // Reset flag after a short delay to allow tab switch to complete
    setTimeout(() => {
      isNavigatingToRouteRef.current = false
    }, 200)
  }

  const activeFilterCount = 
    (filters.regions?.length ?? 0) + 
    (filters.provinces?.length ?? 0) + 
    (filters.communes?.length ?? 0)

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim().length > 0

  // Sidebar content JSX
  const sidebarContent = (
    <div className="flex flex-col h-[80vh]">
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

        {/* Map Container with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-card px-4">
            <TabsList variant="line">
              <TabsTrigger value="explore">
                <MapPinned className="h-4 w-4" />
                Explore Schools
              </TabsTrigger>
              <TabsTrigger value="route">
                <Navigation className="h-4 w-4" />
                Get Directions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="explore" className="flex-1 relative mt-0">
            <SchoolMap
              schools={filteredSchools}
              selectedSchool={selectedSchool}
              onSchoolSelect={handleSchoolSelect}
              onGetDirections={handleGetDirections}
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
          </TabsContent>

          <TabsContent value="route" className="flex-1 relative mt-0">
            {/* Loading Location State */}
            {(isLoadingLocation || (!userLocation && !locationError)) && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center p-6">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                  <p className="font-medium text-foreground mb-1">
                    Getting your location...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please allow location access
                  </p>
                </div>
              </div>
            )}

            {/* Location Error State */}
            {locationError && !isLoadingLocation && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center p-6 max-w-sm">
                  <Navigation className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
                  <p className="font-medium text-foreground mb-1">
                    Location access denied
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {locationError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLocationError(null)
                      setIsLoadingLocation(false)
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {/* No School Selected State */}
            {!selectedSchool && userLocation && !locationError && !isLoadingLocation && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center p-6 max-w-sm">
                  <MapPinned className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="font-medium text-foreground mb-1">
                    Select a school
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Switch to Explore tab and select a school to see directions
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("explore")}
                  >
                    Go to Explore
                  </Button>
                </div>
              </div>
            )}

            {/* Route Map */}
            {userLocation && selectedSchool && !locationError && !isLoadingLocation && (
              <div className="absolute inset-0">
                <Map 
                  center={[
                    (userLocation.lng + selectedSchool.longitude) / 2,
                    (userLocation.lat + selectedSchool.latitude) / 2
                  ]} 
                  zoom={10}
                >
                  {/* Render routes */}
                  {routes.map((route, index) => {
                    const isSelected = index === selectedRouteIndex
                    return (
                      <MapRoute
                        key={index}
                        coordinates={route.coordinates}
                        color={isSelected ? "#6366f1" : "#94a3b8"}
                        width={isSelected ? 6 : 5}
                        opacity={isSelected ? 1 : 0.6}
                        onClick={() => setSelectedRouteIndex(index)}
                      />
                    )
                  })}

                  {/* User location marker */}
                  <MapMarker longitude={userLocation.lng} latitude={userLocation.lat}>
                    <MarkerContent>
                      <div className="size-5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                      <MarkerLabel position="top">Your Location</MarkerLabel>
                    </MarkerContent>
                  </MapMarker>

                  {/* School marker */}
                  <MapMarker longitude={selectedSchool.longitude} latitude={selectedSchool.latitude}>
                    <MarkerContent>
                      <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                      <MarkerLabel position="bottom">{selectedSchool.name_latin}</MarkerLabel>
                    </MarkerContent>
                  </MapMarker>
                </Map>

                {/* Route Options */}
                {routes.length > 0 && !isLoadingRoute && (
                  <div className="absolute top-3 left-3 flex flex-col gap-2 max-w-xs">
                    {routes.map((route, index) => {
                      const isActive = index === selectedRouteIndex
                      const isFastest = index === 0
                      return (
                        <Button
                          key={index}
                          variant={isActive ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setSelectedRouteIndex(index)}
                          className="justify-start gap-3"
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            <span className="font-medium">
                              {formatDuration(route.duration)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs opacity-80">
                            <RouteIcon className="size-3" />
                            {formatDistance(route.distance)}
                          </div>
                          {isFastest && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Fastest
                            </span>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                )}

                {/* Loading Route State */}
                {isLoadingRoute && (
                  <div className="absolute top-3 left-3 bg-card border rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">Finding routes...</span>
                    </div>
                  </div>
                )}

                {/* School Info Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-card border rounded-lg p-4 shadow-lg max-w-md">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">{selectedSchool.name_latin}</h3>
                      <p className="text-xs text-muted-foreground truncate">{selectedSchool.address_latin}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedSchool.commune}, {selectedSchool.province}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSchool(null)
                        setRoutes([])
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* External Navigation Apps */}
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Open in:</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const url = `http://maps.apple.com/?daddr=${selectedSchool.latitude},${selectedSchool.longitude}&saddr=${userLocation.lat},${userLocation.lng}`
                          window.open(url, '_blank')
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Apple Maps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedSchool.latitude},${selectedSchool.longitude}`
                          window.open(url, '_blank')
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Google Maps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const url = `https://waze.com/ul?ll=${selectedSchool.latitude},${selectedSchool.longitude}&navigate=yes`
                          window.open(url, '_blank')
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Waze
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
