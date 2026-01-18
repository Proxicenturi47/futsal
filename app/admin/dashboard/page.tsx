"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LogOut,
  Plus,
  MapPin,
  Phone,
  Upload,
  X,
  Building2,
  DollarSign,
  Users,
  Save,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface VenueData {
  id: string
  name: string
  address: string
  googlePlusCode: string
  weekdayPrice: string
  weekendPrice: string
  courtType: "5A" | "7A"
  contact: string
  photo: string | null
  description: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [venues, setVenues] = useState<VenueData[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<VenueData, "id">>({
    name: "",
    address: "",
    googlePlusCode: "",
    weekdayPrice: "",
    weekendPrice: "",
    courtType: "5A",
    contact: "",
    photo: null,
    description: "",
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    // Load saved venues from localStorage
    const savedVenues = localStorage.getItem("adminVenues")
    if (savedVenues) {
      setVenues(JSON.parse(savedVenues))
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      googlePlusCode: "",
      weekdayPrice: "",
      weekendPrice: "",
      courtType: "5A",
      contact: "",
      photo: null,
      description: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingId) {
      // Update existing venue
      const updatedVenues = venues.map((v) =>
        v.id === editingId ? { ...formData, id: editingId } : v
      )
      setVenues(updatedVenues)
      localStorage.setItem("adminVenues", JSON.stringify(updatedVenues))
    } else {
      // Add new venue
      const newVenue: VenueData = {
        ...formData,
        id: Date.now().toString(),
      }
      const updatedVenues = [...venues, newVenue]
      setVenues(updatedVenues)
      localStorage.setItem("adminVenues", JSON.stringify(updatedVenues))
    }

    setIsSaving(false)
    resetForm()
  }

  const handleEdit = (venue: VenueData) => {
    setFormData({
      name: venue.name,
      address: venue.address,
      googlePlusCode: venue.googlePlusCode,
      weekdayPrice: venue.weekdayPrice,
      weekendPrice: venue.weekendPrice,
      courtType: venue.courtType,
      contact: venue.contact,
      photo: venue.photo,
      description: venue.description,
    })
    setEditingId(venue.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const updatedVenues = venues.filter((v) => v.id !== id)
    setVenues(updatedVenues)
    localStorage.setItem("adminVenues", JSON.stringify(updatedVenues))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Manage your venues</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{venues.length}</p>
                <p className="text-sm text-muted-foreground">Total Venues</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {venues.filter((v) => v.courtType === "5A").length} / {venues.filter((v) => v.courtType === "7A").length}
                </p>
                <p className="text-sm text-muted-foreground">5A / 7A Courts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Venue Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Venue
          </Button>
        )}

        {/* Venue Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Venue" : "Add New Venue"}</CardTitle>
              <CardDescription>
                Fill in the details to {editingId ? "update your" : "register a new"} futsal venue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Venue Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    {formData.photo ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={formData.photo || "/placeholder.svg"}
                          alt="Venue preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Upload</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Venue Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Champion Futsal Arena"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="e.g. Thamel, Kathmandu"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Google Plus Code */}
                <div className="space-y-2">
                  <Label htmlFor="plusCode">Google Plus Code *</Label>
                  <Input
                    id="plusCode"
                    placeholder="e.g. 7MR4+2J Kathmandu"
                    value={formData.googlePlusCode}
                    onChange={(e) => setFormData({ ...formData, googlePlusCode: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Find your Plus Code on Google Maps by clicking on your location
                  </p>
                </div>

                {/* Court Type */}
                <div className="space-y-3">
                  <Label>Court Type *</Label>
                  <RadioGroup
                    value={formData.courtType}
                    onValueChange={(value: "5A" | "7A") => setFormData({ ...formData, courtType: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5A" id="5A" />
                      <Label htmlFor="5A" className="font-normal cursor-pointer">
                        5-A-Side
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7A" id="7A" />
                      <Label htmlFor="7A" className="font-normal cursor-pointer">
                        7-A-Side
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekdayPrice">Weekday Price (Rs.) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="weekdayPrice"
                        type="number"
                        placeholder="1200"
                        className="pl-10"
                        value={formData.weekdayPrice}
                        onChange={(e) => setFormData({ ...formData, weekdayPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekendPrice">Weekend Price (Rs.) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="weekendPrice"
                        type="number"
                        placeholder="1500"
                        className="pl-10"
                        value={formData.weekendPrice}
                        onChange={(e) => setFormData({ ...formData, weekendPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="e.g. 9801234567"
                      className="pl-10"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description about your venue..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : editingId ? "Update Venue" : "Save Venue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Venue List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Your Venues</h2>
          {venues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No venues added yet</p>
                <p className="text-sm text-muted-foreground">Click the button above to add your first venue</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {venues.map((venue) => (
                <Card key={venue.id} className="overflow-hidden">
                  <div className="flex">
                    {venue.photo ? (
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <Image
                          src={venue.photo || "/placeholder.svg"}
                          alt={venue.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 flex-shrink-0 bg-muted flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{venue.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {venue.address}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                          {venue.courtType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Weekday: <span className="text-foreground font-medium">Rs. {venue.weekdayPrice}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Weekend: <span className="text-foreground font-medium">Rs. {venue.weekendPrice}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(venue)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDelete(venue.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
