"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type User = {
  email: string
  role: "student" | "staff" | "admin"
  name: string
  floor?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, floor: string) => Promise<void>
  updateUser: (updatedUser: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newUser: User = { email, role: "student", name: "" }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const signup = async (name: string, email: string, password: string, floor: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newUser: User = { email, role: "student", name, floor }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedUser }
        localStorage.setItem("user", JSON.stringify(newUser))
        return newUser
      }
      return prevUser
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

