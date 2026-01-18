"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  MapPin,
  Star,
  Clock,
  ArrowLeft,
  Phone,
  Navigation,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  time: string
  available: boolean
}

interface VenueDetail {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  weekdayPrice: number
  weekendPrice: number
  imageUrl: string
  images: string[]
  description: string
  phone: string
  openingTime: string
  closingTime: string
  availableSlots: {
    weekday: TimeSlot[]
    weekend: TimeSlot[]
  }
}

// Mock venue data with single court time slots
const VENUE_DATA: Record<string, VenueDetail> = {
  "1": {
    id: "1",
    name: "Champion's Arena Futsal",
    address: "Thamel, Kathmandu, Nepal",
    latitude: 27.715,
    longitude: 85.313,
    rating: 4.8,
    reviewCount: 234,
    weekdayPrice: 2000,
    weekendPrice: 2500,
    imageUrl:
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Champion's Arena is a premier futsal facility in the heart of Thamel. Featuring professional-grade synthetic turf, excellent lighting, and modern facilities.",
    phone: "+977 9841234567",
    openingTime: "06:00",
    closingTime: "22:00",
    availableSlots: {
      weekday: [
        { time: "6-7", available: true },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: true },
        { time: "10-11", available: false },
        { time: "11-12", available: true },
        { time: "12-1", available: false },
        { time: "1-2", available: true },
        { time: "2-3", available: true },
        { time: "3-4", available: false },
        { time: "4-5", available: true },
        { time: "5-6", available: false },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: false },
        { time: "8-9 PM", available: true },
        { time: "9-10 PM", available: false },
      ],
      weekend: [
        { time: "6-7", available: false },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: false },
        { time: "10-11", available: true },
        { time: "11-12", available: false },
        { time: "12-1", available: true },
        { time: "1-2", available: false },
        { time: "2-3", available: false },
        { time: "3-4", available: true },
        { time: "4-5", available: false },
        { time: "5-6", available: true },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: false },
        { time: "9-10 PM", available: true },
      ],
    },
  },
  "2": {
    id: "2",
    name: "Goal Zone Futsal",
    address: "Baluwatar, Kathmandu, Nepal",
    latitude: 27.728,
    longitude: 85.328,
    rating: 4.5,
    reviewCount: 189,
    weekdayPrice: 1800,
    weekendPrice: 2200,
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Goal Zone offers an affordable futsal experience with quality facilities. Located in the peaceful area of Baluwatar, it's perfect for evening games after work.",
    phone: "+977 9851234567",
    openingTime: "06:00",
    closingTime: "21:00",
    availableSlots: {
      weekday: [
        { time: "6-7", available: true },
        { time: "7-8", available: true },
        { time: "8-9", available: false },
        { time: "9-10", available: true },
        { time: "10-11", available: true },
        { time: "11-12", available: false },
        { time: "4-5", available: true },
        { time: "5-6", available: false },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: false },
      ],
      weekend: [
        { time: "6-7", available: false },
        { time: "7-8", available: true },
        { time: "8-9", available: false },
        { time: "9-10", available: false },
        { time: "10-11", available: true },
        { time: "11-12", available: true },
        { time: "4-5", available: false },
        { time: "5-6", available: true },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: true },
      ],
    },
  },
  "3": {
    id: "3",
    name: "Kick Masters Sports",
    address: "Lazimpat, Kathmandu, Nepal",
    latitude: 27.72,
    longitude: 85.32,
    rating: 4.7,
    reviewCount: 312,
    weekdayPrice: 2500,
    weekendPrice: 3000,
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Kick Masters is a premium sports facility offering top-tier futsal courts with professional-grade turf. Perfect for both casual games and competitive matches.",
    phone: "+977 9861234567",
    openingTime: "06:00",
    closingTime: "22:00",
    availableSlots: {
      weekday: [
        { time: "6-7", available: true },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: true },
        { time: "10-11", available: false },
        { time: "2-3", available: true },
        { time: "3-4", available: true },
        { time: "4-5", available: false },
        { time: "5-6", available: true },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: true },
        { time: "9-10 PM", available: false },
      ],
      weekend: [
        { time: "6-7", available: false },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: false },
        { time: "10-11", available: true },
        { time: "2-3", available: false },
        { time: "3-4", available: true },
        { time: "4-5", available: false },
        { time: "5-6", available: false },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: false },
        { time: "8-9 PM", available: true },
        { time: "9-10 PM", available: true },
      ],
    },
  },
  "4": {
    id: "4",
    name: "Unity Futsal Center",
    address: "Baneshwor, Kathmandu, Nepal",
    latitude: 27.69,
    longitude: 85.34,
    rating: 4.3,
    reviewCount: 156,
    weekdayPrice: 1500,
    weekendPrice: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Unity Futsal Center offers budget-friendly futsal experience without compromising on quality. Great for beginners and regular players looking for affordable court time.",
    phone: "+977 9871234567",
    openingTime: "06:00",
    closingTime: "22:00",
    availableSlots: {
      weekday: [
        { time: "6-7", available: true },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: true },
        { time: "12-1", available: true },
        { time: "1-2", available: false },
        { time: "5-6", available: true },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: false },
        { time: "8-9 PM", available: true },
        { time: "9-10 PM", available: true },
      ],
      weekend: [
        { time: "6-7", available: false },
        { time: "7-8", available: true },
        { time: "8-9", available: false },
        { time: "9-10", available: true },
        { time: "12-1", available: false },
        { time: "1-2", available: true },
        { time: "5-6", available: false },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: false },
        { time: "9-10 PM", available: true },
      ],
    },
  },
  "5": {
    id: "5",
    name: "Premier Futsal Hub",
    address: "Maharajgunj, Kathmandu, Nepal",
    latitude: 27.735,
    longitude: 85.335,
    rating: 4.9,
    reviewCount: 423,
    weekdayPrice: 2800,
    weekendPrice: 3500,
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Premier Futsal Hub is the largest and most premium futsal facility in Kathmandu. With FIFA-standard courts, professional lighting, and world-class facilities.",
    phone: "+977 9801234567",
    openingTime: "05:00",
    closingTime: "23:00",
    availableSlots: {
      weekday: [
        { time: "5-6", available: true },
        { time: "6-7", available: true },
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: false },
        { time: "10-11", available: true },
        { time: "4-5", available: true },
        { time: "5-6 PM", available: false },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: false },
        { time: "9-10 PM", available: true },
        { time: "10-11 PM", available: true },
      ],
      weekend: [
        { time: "5-6", available: false },
        { time: "6-7", available: false },
        { time: "7-8", available: true },
        { time: "8-9", available: false },
        { time: "9-10", available: true },
        { time: "10-11", available: false },
        { time: "4-5", available: false },
        { time: "5-6 PM", available: true },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: true },
        { time: "9-10 PM", available: false },
        { time: "10-11 PM", available: true },
      ],
    },
  },
  "6": {
    id: "6",
    name: "Street Kings Futsal",
    address: "Patan, Lalitpur, Nepal",
    latitude: 27.676,
    longitude: 85.318,
    rating: 4.4,
    reviewCount: 198,
    weekdayPrice: 1600,
    weekendPrice: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60",
    ],
    description:
      "Street Kings brings the authentic street football experience to Patan. With its urban vibe and quality turf, it's a favorite among young players.",
    phone: "+977 9812345678",
    openingTime: "07:00",
    closingTime: "21:00",
    availableSlots: {
      weekday: [
        { time: "7-8", available: true },
        { time: "8-9", available: true },
        { time: "9-10", available: false },
        { time: "10-11", available: true },
        { time: "3-4", available: true },
        { time: "4-5", available: false },
        { time: "5-6", available: true },
        { time: "6-7 PM", available: false },
        { time: "7-8 PM", available: true },
        { time: "8-9 PM", available: true },
      ],
      weekend: [
        { time: "7-8", available: false },
        { time: "8-9", available: true },
        { time: "9-10", available: true },
        { time: "10-11", available: false },
        { time: "3-4", available: false },
        { time: "4-5", available: true },
        { time: "5-6", available: false },
        { time: "6-7 PM", available: true },
        { time: "7-8 PM", available: false },
        { time: "8-9 PM", available: true },
      ],
    },
  },
}

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string
  const venue = VENUE_DATA[venueId]

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Generate next 7 days for date selection
  const dates = useMemo(() => {
    const result = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      result.push(date)
    }
    return result
  }, [])

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const currentPrice = isWeekend(selectedDate)
    ? venue?.weekendPrice
    : venue?.weekdayPrice

  const currentSlots = isWeekend(selectedDate)
    ? venue?.availableSlots.weekend
    : venue?.availableSlots.weekday

  const availableCount = currentSlots?.filter((s) => s.available).length || 0
  const bookedCount = currentSlots?.filter((s) => !s.available).length || 0

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Venue Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The venue you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")}>Go Back Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="truncate">
            <h1 className="font-semibold text-foreground truncate">
              {venue.name}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {venue.address}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Image Gallery */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={venue.images[currentImageIndex] || "/placeholder.svg"}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          {venue.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? venue.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === venue.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg rotate-180"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {venue.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex
                        ? "bg-primary"
                        : "bg-background/60"
                    }`}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Venue Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-foreground">
                {venue.name}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold">{venue.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({venue.reviewCount})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{venue.address}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Pricing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    !isWeekend(selectedDate)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    Weekday Rate
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    Rs. {venue.weekdayPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
                <div
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isWeekend(selectedDate)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    Weekend Rate
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    Rs. {venue.weekendPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${venue.phone}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {venue.phone}
                    </a>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${venue.phone}`}>Call</a>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Opening Hours</p>
                  <p className="font-medium text-foreground">
                    {venue.openingTime} - {venue.closingTime}
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden border border-border mt-4">
                <iframe
                  title="Venue Location"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.longitude - 0.01}%2C${venue.latitude - 0.01}%2C${venue.longitude + 0.01}%2C${venue.latitude + 0.01}&layer=mapnik&marker=${venue.latitude}%2C${venue.longitude}`}
                />
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`,
                    "_blank"
                  )
                }
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {dates.map((date, idx) => {
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString()
                  const isWeekendDay = isWeekend(date)
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedSlot(null)
                      }}
                      className={`flex-shrink-0 w-16 py-3 rounded-lg border-2 transition-all text-center ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                      type="button"
                    >
                      <p
                        className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                      >
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                      {isWeekendDay && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1 py-0 mt-1 ${isSelected ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
                        >
                          Weekend
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Available Time Slots</CardTitle>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      Available ({availableCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <span className="text-muted-foreground">
                      Booked ({bookedCount})
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {currentSlots?.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() =>
                      slot.available && setSelectedSlot(slot.time)
                    }
                    disabled={!slot.available}
                    className={`py-3 px-2 rounded-lg border-2 text-center transition-all ${
                      !slot.available
                        ? "border-border bg-muted/50 cursor-not-allowed"
                        : selectedSlot === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                    }`}
                    type="button"
                  >
                    <p
                      className={`font-semibold ${
                        !slot.available
                          ? "text-muted-foreground line-through"
                          : selectedSlot === slot.time
                            ? "text-primary-foreground"
                            : "text-foreground"
                      }`}
                    >
                      {slot.time}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        !slot.available
                          ? "text-muted-foreground"
                          : selectedSlot === slot.time
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                      }`}
                    >
                      {slot.available ? "Available" : "Booked"}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {isWeekend(selectedDate) ? "Weekend" : "Weekday"} Rate
            </p>
            <p className="text-2xl font-bold text-foreground">
              Rs. {currentPrice?.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">
                /hr
              </span>
            </p>
          </div>
          <Button
            size="lg"
            disabled={!selectedSlot}
            className="px-8 bg-primary hover:bg-primary/90"
          >
            {selectedSlot ? `Book ${selectedSlot}` : "Select a Time Slot"}
          </Button>
        </div>
      </div>
    </div>
  )
}
