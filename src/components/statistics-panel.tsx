'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { School } from '@/lib/data'
import { MapPin, Building2, Map, GraduationCap } from 'lucide-react'

interface StatisticsPanelProps {
  schools: School[]
}

export default function StatisticsPanel({ schools }: StatisticsPanelProps) {
  const stats = useMemo(() => {
    const totalSchools = schools.length
    const uniqueRegions = new Set(schools.map(s => s.region)).size
    const uniqueCommunes = new Set(schools.map(s => s.commune)).size

    const byType = {} as Record<string, number>
    schools.forEach(school => {
      byType[school.schoolType] = (byType[school.schoolType] || 0) + 1
    })

    return {
      totalSchools,
      uniqueRegions,
      uniqueCommunes,
      typeStats: Object.entries(byType).sort(([, a], [, b]) => b - a),
    }
  }, [schools])

  return (
    <div className="space-y-3">
      {/* Primary stat */}
      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
        <div className="p-2 bg-primary/10 rounded-md">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{stats.totalSchools.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Schools found</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <Map className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{stats.uniqueRegions}</p>
            <p className="text-xs text-muted-foreground">Regions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{stats.uniqueCommunes}</p>
            <p className="text-xs text-muted-foreground">Communes</p>
          </div>
        </div>
      </div>

      {/* School Types */}
      {stats.typeStats.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>By Type</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.typeStats.map(([type, count]) => (
              <Badge key={type} variant="outline" className="gap-1 text-xs">
                {type}: <span className="font-semibold">{count}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
