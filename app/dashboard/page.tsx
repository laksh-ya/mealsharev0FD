"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coffee, UtensilsCrossed, Cookie, Soup } from "lucide-react"

export default function StudentDashboard() {
  const { user, updateUser } = useAuth()
  const [sharing, setSharing] = useState({
    breakfast: false,
    lunch: false,
    snacks: false,
    dinner: false,
  })
  const [smilesShared, setSmilesShared] = useState(0)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...user })

  const handleSharingToggle = (meal: keyof typeof sharing) => {
    setSharing((prev) => ({ ...prev, [meal]: !prev[meal] }))
    // In a real app, this would trigger an API call to update the backend
    if (!sharing[meal]) {
      setSmilesShared((prev) => prev + 1)
    }
  }

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setQrCode(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = () => {
    if (updateUser) {
      updateUser(editedUser)
      setIsEditProfileOpen(false)
    }
  }

  const mealIcons = {
    breakfast: Coffee,
    lunch: UtensilsCrossed,
    snacks: Cookie,
    dinner: Soup,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
        </CardHeader>
        <CardContent>
          <p>Floor: {user?.floor}</p>
          <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="New password"
                    onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="floor" className="text-right">
                    Floor
                  </Label>
                  <Select
                    onValueChange={(value) => setEditedUser({ ...editedUser, floor: value })}
                    defaultValue={editedUser.floor}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground Floor</SelectItem>
                      <SelectItem value="first">First Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleProfileUpdate}>Save Changes</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permanent QR</CardTitle>
        </CardHeader>
        <CardContent>
          {qrCode ? (
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-full max-w-[200px] mx-auto" />
          ) : (
            <p>No QR code uploaded yet.</p>
          )}
          <Input type="file" accept="image/*" onChange={handleQrUpload} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meal Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(sharing).map(([meal, isSharing]) => {
              const Icon = mealIcons[meal as keyof typeof mealIcons]
              return (
                <div key={meal} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <Label htmlFor={`${meal}-toggle`} className="capitalize">
                      {meal}
                    </Label>
                  </div>
                  <Switch
                    id={`${meal}-toggle`}
                    checked={isSharing}
                    onCheckedChange={() => handleSharingToggle(meal as keyof typeof sharing)}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharing Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-center">{smilesShared}</p>
          <p className="text-center text-muted-foreground">Smiles Shared</p>
        </CardContent>
      </Card>
    </div>
  )
}

