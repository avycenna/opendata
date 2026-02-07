'use client'

import { useMemo } from 'react'
import { MultiSelect } from './ui/combobox'
import type { FilterOptions, School } from '../app/rihla/rihla-client'

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  schools: School[]
}

export default function FilterPanel({ filters, onFiltersChange, onReset, schools }: FilterPanelProps) {
  // Derive all unique regions from schools
  const allRegions = useMemo(() => {
    const regions = new Set(schools.map(s => s.region))
    return Array.from(regions).sort()
  }, [schools])

  // Get provinces filtered by selected regions
  const availableProvinces = useMemo(() => {
    const filteredSchools = filters.regions?.length 
      ? schools.filter(s => filters.regions!.includes(s.region))
      : schools
    const provinces = new Set(filteredSchools.map(s => s.province))
    return Array.from(provinces).sort()
  }, [schools, filters.regions])

  // Get communes filtered by selected provinces
  const availableCommunes = useMemo(() => {
    const filteredSchools = filters.provinces?.length
      ? schools.filter(s => filters.provinces!.includes(s.province))
      : filters.regions?.length
        ? schools.filter(s => filters.regions!.includes(s.region))
        : schools
    const communes = new Set(filteredSchools.map(s => s.commune))
    return Array.from(communes).sort()
  }, [schools, filters.regions, filters.provinces])

  // Helper to get provinces by regions from schools data
  const getProvincesByRegions = (regionNames: string[] | undefined): string[] => {
    if (!regionNames?.length) return Array.from(new Set(schools.map(s => s.province))).sort()
    const provinces = new Set(
      schools.filter(s => regionNames.includes(s.region)).map(s => s.province)
    )
    return Array.from(provinces).sort()
  }

  // Helper to get communes by provinces from schools data
  const getCommunesByProvinces = (provinceNames: string[] | undefined): string[] => {
    if (!provinceNames?.length) return Array.from(new Set(schools.map(s => s.commune))).sort()
    const communes = new Set(
      schools.filter(s => provinceNames.includes(s.province)).map(s => s.commune)
    )
    return Array.from(communes).sort()
  }

  const handleRegionsChange = (regions: string[]) => {
    // Clear provinces/communes that are no longer valid
    const validProvinces = filters.provinces?.filter(p => 
      getProvincesByRegions(regions).includes(p)
    ) || []
    const validCommunes = filters.communes?.filter(c => 
      getCommunesByProvinces(validProvinces).includes(c)
    ) || []

    onFiltersChange({
      regions: regions.length > 0 ? regions : undefined,
      provinces: validProvinces.length > 0 ? validProvinces : undefined,
      communes: validCommunes.length > 0 ? validCommunes : undefined,
    })
  }

  const handleProvincesChange = (provinces: string[]) => {
    // Clear communes that are no longer valid
    const validCommunes = filters.communes?.filter(c => 
      getCommunesByProvinces(provinces).includes(c)
    ) || []

    onFiltersChange({
      ...filters,
      provinces: provinces.length > 0 ? provinces : undefined,
      communes: validCommunes.length > 0 ? validCommunes : undefined,
    })
  }

  const handleCommunesChange = (communes: string[]) => {
    onFiltersChange({
      ...filters,
      communes: communes.length > 0 ? communes : undefined,
    })
  }

  return (
    <div className="space-y-4">
      {/* Region Select */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Regions
        </label>
        <MultiSelect
          options={allRegions}
          selected={filters.regions || []}
          onChange={handleRegionsChange}
          placeholder="All Regions"
          searchPlaceholder="Search regions..."
          emptyMessage="No regions found."
        />
      </div>

      {/* Province Select */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Provinces
        </label>
        <MultiSelect
          options={availableProvinces}
          selected={filters.provinces || []}
          onChange={handleProvincesChange}
          placeholder={filters.regions?.length ? 'All Provinces' : 'Select regions first'}
          searchPlaceholder="Search provinces..."
          emptyMessage="No provinces found."
          disabled={!filters.regions?.length}
        />
      </div>

      {/* Commune Select */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Communes
        </label>
        <MultiSelect
          options={availableCommunes}
          selected={filters.communes || []}
          onChange={handleCommunesChange}
          placeholder={filters.provinces?.length ? 'All Communes' : 'Select provinces first'}
          searchPlaceholder="Search communes..."
          emptyMessage="No communes found."
          disabled={!filters.provinces?.length}
        />
      </div>
    </div>
  )
}
