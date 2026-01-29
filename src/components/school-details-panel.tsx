'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { School } from '@/lib/data'
import { X, MapPin, Building2, Tag } from 'lucide-react'

interface SchoolDetailsPanelProps {
  school: School | null
  onClose: () => void
}

export default function SchoolDetailsPanel({ school, onClose }: SchoolDetailsPanelProps) {
  if (!school) return null

  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{school.name}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Address */}
        <div className="flex gap-3">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
            <p className="text-foreground">{school.address}</p>
          </div>
        </div>

        {/* Administrative Info */}
        <div className="flex gap-3">
          <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
            <p className="text-foreground text-sm">
              {school.commune}, {school.province}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{school.region}</p>
          </div>
        </div>

        {/* School Type */}
        <div className="flex gap-3">
          <Tag className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</p>
            <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded mt-1">
              {school.schoolType}
            </span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Coordinates</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 p-2 rounded">
              <p className="text-muted-foreground">Latitude</p>
              <p className="font-mono text-foreground">{school.latitude.toFixed(4)}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <p className="text-muted-foreground">Longitude</p>
              <p className="font-mono text-foreground">{school.longitude.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
