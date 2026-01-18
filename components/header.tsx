"use client"

import { MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  location: string | null
  onRequestLocation: () => void
}

export function Header({ location, onRequestLocation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl text-foreground">FutsalBook</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRequestLocation}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline text-sm max-w-32 truncate">
              {location || "Set location"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border bg-transparent"
          >
            <User className="w-4 h-4" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
