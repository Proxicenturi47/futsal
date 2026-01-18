"use client"

import { RadioGroupItem } from "@/components/ui/radio-group"

import { RadioGroup } from "@/components/ui/radio-group"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, MapPin, Phone, DollarSign, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    googlePlusCode: "",
    weekdayPrice: "",
    weekendPrice: "",
    courtTypes: [] as string[],
    contact: "",
    photo: null as File | null,
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: null })
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate required fields
    if (!formData.name || !formData.address || !formData.googlePlusCode || 
        !formData.weekdayPrice || !formData.weekendPrice || !formData.contact ||
        formData.courtTypes.length === 0) {
      setError("Please fill in all required fields including at least one court type")
      setIsLoading(false)
      return
    }

    // Store venue data in localStorage (in production, use a database)
    const venueData = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      googlePlusCode: formData.googlePlusCode,
      weekdayPrice: Number(formData.weekdayPrice),
      weekendPrice: Number(formData.weekendPrice),
      courtTypes: formData.courtTypes,
      contact: formData.contact,
      photo: photoPreview,
      createdAt: new Date().toISOString(),
    }

    // Get existing venues or initialize empty array
    const existingVenues = JSON.parse(localStorage.getItem("adminVenues") || "[]")
    existingVenues.push(venueData)
    localStorage.setItem("adminVenues", JSON.stringify(existingVenues))
    localStorage.setItem("adminLoggedIn", "true")
    localStorage.setItem("currentVenueId", venueData.id)

    router.push("/admin/dashboard")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Register Your Futsal</CardTitle>
          <CardDescription>
            Enter your futsal venue details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Futsal Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Green Field Futsal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  className="pl-10"
                  placeholder="e.g. Thamel, Kathmandu"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Google Plus Code */}
            <div className="space-y-2">
              <Label htmlFor="googlePlusCode">
                Google Plus Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="googlePlusCode"
                type="text"
                placeholder="e.g. 7MV8+XQ Kathmandu"
                value={formData.googlePlusCode}
                onChange={(e) => setFormData({ ...formData, googlePlusCode: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Find this on Google Maps by right-clicking your location
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label>Price per Hour <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="weekdayPrice" className="text-xs text-muted-foreground">Weekday</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="weekdayPrice"
                      type="number"
                      className="pl-10"
                      placeholder="1500"
                      value={formData.weekdayPrice}
                      onChange={(e) => setFormData({ ...formData, weekdayPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weekendPrice" className="text-xs text-muted-foreground">Weekend</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="weekendPrice"
                      type="number"
                      className="pl-10"
                      placeholder="2000"
                      value={formData.weekendPrice}
                      onChange={(e) => setFormData({ ...formData, weekendPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Court Type */}
            <div className="space-y-2">
              <Label>Court Type <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground">Select all that apply</p>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="5a"
                    checked={formData.courtTypes.includes("5A")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, courtTypes: [...formData.courtTypes, "5A"] })
                      } else {
                        setFormData({ ...formData, courtTypes: formData.courtTypes.filter(t => t !== "5A") })
                      }
                    }}
                  />
                  <Label htmlFor="5a" className="font-normal cursor-pointer">5A (5-a-side)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="7a"
                    checked={formData.courtTypes.includes("7A")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, courtTypes: [...formData.courtTypes, "7A"] })
                      } else {
                        setFormData({ ...formData, courtTypes: formData.courtTypes.filter(t => t !== "7A") })
                      }
                    }}
                  />
                  <Label htmlFor="7a" className="font-normal cursor-pointer">7A (7-a-side)</Label>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="contact"
                  type="tel"
                  className="pl-10"
                  placeholder="e.g. 9841234567"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Photo (Optional) */}
            <div className="space-y-2">
              <Label>Photo <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              {photoPreview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={photoPreview || "/placeholder.svg"}
                    alt="Venue preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Futsal"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  localStorage.setItem("adminLoggedIn", "true")
                  router.push("/admin/dashboard")
                }}
              >
                Go to Dashboard
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
