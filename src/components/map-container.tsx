'use client'

import { useMemo } from 'react'
import { Map, MapClusterLayer, MapPopup, MapControls } from '@/components/ui/map'
import type { School } from '@/app/rihla/rihla-client'
import { MapPin, Building2 } from 'lucide-react'

interface MapContainerProps {
  schools: School[]
  selectedSchool?: School | null
  onSchoolSelect?: (school: School | null) => void
}

export default function MapContainer({ schools, selectedSchool, onSchoolSelect }: MapContainerProps) {
  // Convert schools array to GeoJSON format for MapClusterLayer
  const schoolsGeoJSON = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: schools.map(school => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [school.longitude, school.latitude]
      },
      properties: school
    }))
  }), [schools])

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Map 
        center={[-7.0926, 31.7917]} 
        zoom={6}
      >
      <MapClusterLayer<School>
        data={schoolsGeoJSON}
        clusterRadius={60}
        clusterMaxZoom={12}
        clusterColors={['#3b82f6', '#8b5cf6', '#ec4899']}
        pointColor="#3b82f6"
        onPointClick={(feature, coordinates) => {
          onSchoolSelect?.(feature.properties)
        }}
      />

      {selectedSchool && (
        <MapPopup
          longitude={selectedSchool.longitude}
          latitude={selectedSchool.latitude}
          onClose={() => onSchoolSelect?.(null)}
          closeButton
          focusAfterOpen={false}
          className="w-80"
        >
          <div className="space-y-3 p-1">
            {/* School Name */}
            <h3 className="font-semibold text-foreground pr-4">{selectedSchool.name}</h3>
            
            {/* Address */}
            <div className="flex gap-2.5">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                <p className="text-sm text-foreground">{selectedSchool.address}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-2.5">
              <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                <p className="text-sm text-foreground">
                  {selectedSchool.commune}, {selectedSchool.province}
                </p>
                <p className="text-xs text-muted-foreground">{selectedSchool.region}</p>
              </div>
            </div>

            {/* Coordinates */}
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Coordinates</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 p-1.5 rounded">
                  <p className="text-muted-foreground text-[10px]">Latitude</p>
                  <p className="font-mono text-foreground">{selectedSchool.latitude.toFixed(4)}</p>
                </div>
                <div className="bg-muted/50 p-1.5 rounded">
                  <p className="text-muted-foreground text-[10px]">Longitude</p>
                  <p className="font-mono text-foreground">{selectedSchool.longitude.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        </MapPopup>
      )}

      <MapControls position="top-right" showZoom showFullscreen />
    </Map>
    </div>
  )
}
