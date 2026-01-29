'use client'

import { useMemo } from 'react'
import { MultiSelect } from '@/components/ui/combobox'
import { FilterOptions, REGIONS, getProvincesByRegions, getCommunesByProvinces } from '@/lib/data'

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export default function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const availableProvinces = useMemo(
    () => getProvincesByRegions(filters.regions),
    [filters.regions]
  )

  const availableCommunes = useMemo(
    () => getCommunesByProvinces(filters.provinces),
    [filters.provinces]
  )

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
          options={REGIONS}
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
