"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

interface EditProfileDialogProps {
  currentName: string
  onUpdate?: () => void
}

export function EditProfileDialog({ currentName, onUpdate }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(currentName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { data: session, update } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Submitting profile update...")
    console.log("Current session:", session)
    console.log("New name:", name)

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      console.log("Response status:", response.status)
      console.log("Response OK:", response.ok)

      // Get response text first to see what we're getting
      const responseText = await response.text()
      console.log("Response text:", responseText)

      if (!response.ok) {
        let errorMessage = "Failed to update profile"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
          console.log("Error data:", errorData)
        } catch (e) {
          console.log("Could not parse error response as JSON")
        }
        throw new Error(errorMessage)
      }

      const data = JSON.parse(responseText)
      console.log("Success data:", data)
      
      // Update the session with new name
      await update({
        name: data.user.name,
      })

      console.log("Session updated")

      setOpen(false)
      
      // Refresh the page to show updated data
      if (onUpdate) {
        onUpdate()
      }
      router.refresh()
    } catch (err) {
      console.error("Update profile error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
                disabled={loading}
                required
                minLength={1}
              />
            </div>
            {error && (
              <div className="col-span-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}