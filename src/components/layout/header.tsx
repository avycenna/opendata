"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Hexagon } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Company Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Hexagon className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">
              Avycenna
            </span>
          </Link>

          {/* Platform Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link 
              href="/rihla" 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground transition-colors hover:bg-accent/50"
            >
              Rihla
              {/* <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded">
                <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-medium text-accent">2024-12-15</span>
              </div> */}
            </Link>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground/40 cursor-not-allowed">
              Platform 2
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">Soon</Badge>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground/40 cursor-not-allowed">
              Platform 3
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">Soon</Badge>
            </div>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* GitHub link with stars */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative"
          >
            <a
              href="https://github.com/avycenna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5" />
              {/* <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 px-1 text-[10px] font-bold hidden sm:flex"
              >
                ⭐ 24
              </Badge> */}
            </a>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile platform selector */}
      <div className="border-t border-border bg-muted/30 px-4 py-2 sm:px-6 lg:px-8 md:hidden">
        <div className="flex items-center justify-center gap-3 text-xs">
          <Link href="/rihla" className="flex items-center gap-1.5 text-foreground font-medium">
            Rihla
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded">
              <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
              <span className="text-[9px] text-accent">12/15/24</span>
            </div>
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground/60">More platforms coming soon</span>
        </div>
      </div>
    </header>
  );
}
