'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { School } from '@/app/rihla/rihla-client'

const MapContainer = dynamic(() => import('./map-container'), { ssr: false })

interface SchoolMapProps {
  schools: School[]
  selectedSchool?: School | null
  onSchoolSelect?: (school: School | null) => void
  onGetDirections?: (school: School) => void
}

export default function SchoolMap({ schools, selectedSchool, onSchoolSelect, onGetDirections }: SchoolMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <MapContainer
      schools={schools}
      selectedSchool={selectedSchool}
      onSchoolSelect={onSchoolSelect}
      onGetDirections={onGetDirections}
    />
  )
}
