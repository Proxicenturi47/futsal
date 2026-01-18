"use client"

import { useRouter } from "next/navigation"
import { MapPin, Star, Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  time: string
  available: boolean
}

interface VenueCardProps {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  reviewCount: number
  pricePerHour: number
  imageUrl: string
  courts: number
  availableSlots: TimeSlot[]
  selectedTime: string | null
}

export function VenueCard({
  id,
  name,
  address,
  distance,
  rating,
  reviewCount,
  pricePerHour,
  imageUrl,
  courts,
  availableSlots,
  selectedTime,
}: VenueCardProps) {
  const router = useRouter()
  const filteredSlots = selectedTime
    ? availableSlots.filter((slot) => slot.time === selectedTime)
    : availableSlots

  const hasAvailability = filteredSlots.some((slot) => slot.available)

  const handleCardClick = () => {
    router.push(`/venue/${id}`)
  }

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg border-border/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {courts} {courts > 1 ? "Courts" : "Court"}
          </Badge>
        </div>
        <CardContent className="flex-1 p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium text-sm">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">
                  ({reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{address}</span>
              <span className="mx-1">•</span>
              <span className="font-medium text-primary">
                {distance < 1
                  ? `${(distance * 1000).toFixed(0)}m`
                  : `${distance.toFixed(1)}km`}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>NPR {pricePerHour}/hr</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>5v5</span>
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-xs text-muted-foreground mb-2">
                Available Slots
              </p>
              <div className="flex flex-wrap gap-2">
                {filteredSlots.slice(0, 4).map((slot) => (
                  <Badge
                    key={slot.time}
                    variant={slot.available ? "default" : "secondary"}
                    className={`text-xs ${
                      slot.available
                        ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        : "bg-muted text-muted-foreground line-through cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </Badge>
                ))}
                {filteredSlots.length > 4 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    +{filteredSlots.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-foreground">
                  NPR {pricePerHour}
                </span>
                <span className="text-muted-foreground text-sm">/hour</span>
              </div>
              <Button
                disabled={!hasAvailability}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/venue/${id}`)
                }}
              >
                {hasAvailability ? "Book Now" : "View Details"}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
