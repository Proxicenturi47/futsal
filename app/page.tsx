"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { TimeFilter } from "@/components/time-filter"
import { VenueCard } from "@/components/venue-card"
import { Loader2, MapPinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

interface TimeSlot {
  time: string
  available: boolean
}

interface Venue {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  pricePerHour: number
  imageUrl: string
  courts: number
  availableSlots: TimeSlot[]
}

// Mock data for futsal venues
const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "Champion's Arena Futsal",
    address: "Thamel, Kathmandu",
    latitude: 27.7150,
    longitude: 85.3130,
    rating: 4.8,
    reviewCount: 234,
    pricePerHour: 2500,
    imageUrl: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&auto=format&fit=crop&q=60",
    courts: 3,
    availableSlots: [
      { time: "06:00", available: true },
      { time: "07:00", available: true },
      { time: "08:00", available: false },
      { time: "09:00", available: true },
      { time: "17:00", available: true },
      { time: "18:00", available: false },
      { time: "19:00", available: true },
      { time: "20:00", available: true },
    ],
  },
  {
    id: "2",
    name: "Goal Zone Futsal",
    address: "Baluwatar, Kathmandu",
    latitude: 27.7280,
    longitude: 85.3280,
    rating: 4.5,
    reviewCount: 189,
    pricePerHour: 2000,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60",
    courts: 2,
    availableSlots: [
      { time: "06:00", available: false },
      { time: "07:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "16:00", available: true },
      { time: "17:00", available: false },
      { time: "18:00", available: true },
      { time: "21:00", available: true },
    ],
  },
  {
    id: "3",
    name: "Kick Masters Sports",
    address: "Lazimpat, Kathmandu",
    latitude: 27.7200,
    longitude: 85.3200,
    rating: 4.7,
    reviewCount: 312,
    pricePerHour: 2800,
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60",
    courts: 4,
    availableSlots: [
      { time: "08:00", available: true },
      { time: "09:00", available: true },
      { time: "10:00", available: false },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "19:00", available: true },
      { time: "20:00", available: false },
      { time: "21:00", available: true },
    ],
  },
  {
    id: "4",
    name: "Unity Futsal Center",
    address: "Baneshwor, Kathmandu",
    latitude: 27.6900,
    longitude: 85.3400,
    rating: 4.3,
    reviewCount: 156,
    pricePerHour: 1800,
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60",
    courts: 2,
    availableSlots: [
      { time: "06:00", available: true },
      { time: "07:00", available: false },
      { time: "12:00", available: true },
      { time: "13:00", available: true },
      { time: "17:00", available: true },
      { time: "18:00", available: true },
      { time: "19:00", available: false },
      { time: "22:00", available: true },
    ],
  },
  {
    id: "5",
    name: "Premier Futsal Hub",
    address: "Maharajgunj, Kathmandu",
    latitude: 27.7350,
    longitude: 85.3350,
    rating: 4.9,
    reviewCount: 423,
    pricePerHour: 3000,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60",
    courts: 5,
    availableSlots: [
      { time: "06:00", available: true },
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: false },
      { time: "16:00", available: true },
      { time: "17:00", available: true },
      { time: "20:00", available: true },
      { time: "21:00", available: false },
    ],
  },
  {
    id: "6",
    name: "Valley Sports Arena",
    address: "Patan, Lalitpur",
    latitude: 27.6700,
    longitude: 85.3250,
    rating: 4.6,
    reviewCount: 278,
    pricePerHour: 2200,
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    courts: 3,
    availableSlots: [
      { time: "07:00", available: true },
      { time: "08:00", available: true },
      { time: "09:00", available: false },
      { time: "15:00", available: true },
      { time: "16:00", available: false },
      { time: "18:00", available: true },
      { time: "19:00", available: true },
      { time: "20:00", available: true },
    ],
  },
]

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Request user's location on mount
  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = () => {
    setLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Current Location",
        })
        setLocationLoading(false)
      },
      (error) => {
        console.log("[v0] Geolocation error:", error.message)
        // Set default location to Kathmandu center
        setUserLocation({
          lat: 27.7172,
          lng: 85.324,
          address: "Kathmandu (Default)",
        })
        setLocationError("Using default location")
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    let venues = [...MOCK_VENUES]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      venues = venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(query) ||
          venue.address.toLowerCase().includes(query)
      )
    }

    // Filter by time slot availability
    if (selectedTime) {
      venues = venues.filter((venue) =>
        venue.availableSlots.some(
          (slot) => slot.time === selectedTime && slot.available
        )
      )
    }

    // Calculate distances and sort by distance
    if (userLocation) {
      venues = venues
        .map((venue) => ({
          ...venue,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            venue.latitude,
            venue.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
    } else {
      // If no location, add default distance
      venues = venues.map((venue) => ({
        ...venue,
        distance: Math.random() * 5 + 0.5,
      }))
    }

    return venues
  }, [searchQuery, selectedTime, userLocation])

  return (
    <div className="min-h-screen bg-background">
      <Header
        location={userLocation?.address || null}
        onRequestLocation={requestLocation}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            Find & Book Futsal Courts
          </h1>
          <p className="text-muted-foreground">
            Discover nearby futsal venues and book your perfect time slot
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by venue name or location..."
          />
          <TimeFilter selectedTime={selectedTime} onTimeSelect={setSelectedTime} />
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedTime) && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <span>Showing results for:</span>
            {searchQuery && (
              <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                "{searchQuery}"
              </span>
            )}
            {selectedTime && (
              <span className="bg-primary/10 px-2 py-1 rounded-md text-primary">
                {selectedTime}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedTime(null)
              }}
              className="text-muted-foreground hover:text-foreground ml-auto"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Location Status */}
        {locationLoading && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Getting your location...</span>
          </div>
        )}

        {locationError && !locationLoading && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm">
            <MapPinOff className="w-4 h-4" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredVenues.length} venue{filteredVenues.length !== 1 ? "s" : ""}{" "}
            found
            {userLocation && " • Sorted by distance"}
          </p>
        </div>

        {/* Venue List */}
        <div className="space-y-4">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                {...venue}
                selectedTime={selectedTime}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MapPinOff className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No venues found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or time filter
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTime(null)
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
