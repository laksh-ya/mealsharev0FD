"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Coffee, UtensilsCrossed, Cookie, Soup } from "lucide-react"

type QR = {
  id: string
  floor: string
  mealType: string
  redeemed: boolean
}

export default function StaffDashboard() {
  const [availableQRs, setAvailableQRs] = useState<QR[]>([
    { id: "1", floor: "First Floor", mealType: "Breakfast", redeemed: false },
    { id: "2", floor: "Ground Floor", mealType: "Lunch", redeemed: false },
    { id: "3", floor: "First Floor", mealType: "Dinner", redeemed: false },
  ])

  const [redeemedQRs, setRedeemedQRs] = useState<QR[]>([])
  const [selectedQR, setSelectedQR] = useState<QR | null>(null)

  const handleRedeem = (qr: QR) => {
    setAvailableQRs(availableQRs.filter((q) => q.id !== qr.id))
    setRedeemedQRs([...redeemedQRs, { ...qr, redeemed: true }])
  }

  const mealIcons = {
    Breakfast: Coffee,
    Lunch: UtensilsCrossed,
    Snacks: Cookie,
    Dinner: Soup,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Available QRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableQRs.map((qr) => {
              const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
              return (
                <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Icon className="w-6 h-6" />
                    <div>
                      <Badge variant="outline">{qr.floor}</Badge>
                      <Badge variant="outline" className="ml-2">
                        {qr.mealType}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={() => handleRedeem(qr)}>Redeem</Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redeemed QRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {redeemedQRs.map((qr) => {
              const Icon = mealIcons[qr.mealType as keyof typeof mealIcons]
              return (
                <div key={qr.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Icon className="w-6 h-6" />
                    <div>
                      <Badge variant="outline">{qr.floor}</Badge>
                      <Badge variant="outline" className="ml-2">
                        {qr.mealType}
                      </Badge>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedQR(qr)}>
                        View QR
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center">
                        <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-48 h-48" />
                        <p className="mt-4">Floor: {selectedQR?.floor}</p>
                        <p>Meal: {selectedQR?.mealType}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

