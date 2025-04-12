'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Define user type
type User = {
  id: string
  name: string
  email: string
  profilePicture?: string
  createdAt: string
  role?: string
  school?: string
  interests?: string[]
}

// Define context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (name: string, email: string, password: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
}

// Avatar options from existing files
const avatarOptions = [
  '/avatars/ayoub.png',
  '/avatars/hanae.png',
  '/avatars/leila.png',
  '/avatars/mehdi.png',
  '/avatars/nizar.png',
  '/avatars/safae.png',
  '/avatars/salma.png',
  '/avatars/yasmine.png',
  '/avatars/zakariae.png'
]

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  register: async () => false,
  login: async () => false,
  logout: () => {},
  updateProfile: () => {},
})

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [])

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = existingUsers.some((u: any) => u.email === email)
      
      if (userExists) {
        throw new Error('Email already registered')
      }
      
      // Select a random avatar from the existing options
      const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        profilePicture: randomAvatar, // Use a random avatar from our collection
        createdAt: new Date().toISOString(),
        interests: []
      }
      
      // Add password to user object only for storage (in a real app, you'd hash this)
      const userWithPassword = { ...newUser, password }
      
      // Store in "database"
      const updatedUsers = [...existingUsers, userWithPassword]
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Log user in
      const { password: _, ...userWithoutPassword } = userWithPassword
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from local storage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      // Save user data without password
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  // Update user profile
  const updateProfile = (userData: Partial<User>) => {
    if (!user) return
    
    // Update current user
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, ...userData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}