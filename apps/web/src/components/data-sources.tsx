'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { ExternalLink, Info } from 'lucide-react'

export default function DataSources() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
          <Info className="h-3.5 w-3.5" />
          Data Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dataset Information & Transparency</DialogTitle>
          <DialogDescription>
            Learn about the open data sources used in this platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Last Updated */}
          <Card className="p-4 bg-accent/10 border-accent/20">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm text-foreground">Dataset Freshness</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Last dataset update: <span className="font-medium">2024-12-15</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  This platform displays static or periodically updated data. It is not a real-time system.
                </p>
              </div>
            </div>
          </Card>

          {/* Main Dataset Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Primary Data Source</h4>
            <Card className="p-4 bg-card border-border space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Dataset Name</p>
                  <p className="text-sm text-foreground mt-1">Educational Infrastructure - Schools Distribution</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Publisher</p>
                  <p className="text-sm text-foreground mt-1">Ministry of Education</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Format</p>
                  <p className="text-sm text-foreground mt-1">GeoJSON, CSV</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">License</p>
                  <p className="text-sm text-foreground mt-1">Open License (CC-BY)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Platform Source */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Data Portal</h4>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Agence du Développement Numérique (ADD)</p>
                  <p className="text-xs text-muted-foreground mt-1">data.gov.ma - Morocco&apos;s National Open Data Platform</p>
                </div>
                <a
                  href="https://data.gov.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>

          {/* Open Data Mission */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Digital Morocco 2030 Initiative</h4>
            <Card className="p-4 bg-card border-border space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This platform demonstrates the power of open data for transparency and public service improvement. By reusing ADD datasets, we enable citizens and organizations to discover, understand, and leverage publicly available information about Morocco&apos;s educational infrastructure.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The visualization is aligned with Digital Morocco 2030 objectives to promote digital transformation, transparency, and data-driven decision-making across government.
              </p>
            </Card>
          </div>

          {/* Data Disclaimer */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Important Notices</h4>
            <Card className="p-4 bg-destructive/10 border-destructive/20 space-y-2">
              <p className="text-xs font-medium text-foreground">Data Accuracy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This platform does not modify official data. All information comes directly from ADD open datasets. For corrections or updates to underlying data, please contact the Ministry of Education through official channels.
              </p>
            </Card>
            <Card className="p-4 bg-card border-border space-y-2">
              <p className="text-xs font-medium text-foreground">Data Reuse</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Data presented here is subject to the CC-BY license and can be freely reused for public benefit, research, and non-commercial purposes. Attribution to ADD and the original dataset is appreciated.
              </p>
            </Card>
          </div>

          {/* API Access */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Direct Access</h4>
            <Card className="p-4 bg-card border-border">
              <p className="text-xs text-muted-foreground mb-3">
                For programmatic access to raw datasets, visit ADD&apos;s data portal:
              </p>
              <a
                href="https://data.gov.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary text-xs font-medium hover:underline"
              >
                data.gov.ma
                <ExternalLink className="h-3 w-3" />
              </a>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
