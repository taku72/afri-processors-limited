'use client'

// Mock user database - In production, this would connect to your real database
interface MockUser {
  id: number
  username: string
  email: string
  password: string
  full_name: string
  role: 'super_admin' | 'admin'
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

const mockUsers: MockUser[] = [
  {
    id: 1,
    username: 'superadmin',
    email: 'superadmin@afriprocessors.com',
    password: 'admin123', // In production, this would be hashed
    full_name: 'Super Administrator',
    role: 'super_admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@afriprocessors.com',
    password: 'admin123', // In production, this would be hashed
    full_name: 'Administrator',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin'
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function login(username: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    // Find user by username
    const user = mockUsers.find(u => u.username === username && u.is_active)
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    // Check password (in production, use bcrypt to compare hashes)
    if (user.password !== password) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    // Update last login
    user.last_login = new Date().toISOString()
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('loginTime', new Date().toISOString())
    
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Login failed' }
  }
}

export function logout(): void {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('loginTime')
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) return null
    
    const user = JSON.parse(userStr) as User
    return user
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  const user = getCurrentUser()
  const loginTime = localStorage.getItem('loginTime')
  
  if (!user || !loginTime) return false
  
  // Check if session is older than 24 hours
  const loginDate = new Date(loginTime)
  const now = new Date()
  const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
  
  if (hoursDiff > 24) {
    logout()
    return false
  }
  
  return true
}

export function hasPermission(requiredRole: 'admin' | 'super_admin'): boolean {
  const user = getCurrentUser()
  if (!user) return false
  
  if (requiredRole === 'super_admin') {
    return user.role === 'super_admin'
  }
  
  return user.role === 'admin' || user.role === 'super_admin'
}

// Mock functions for user management (super admin only)
export function getAllAdmins(): User[] {
  return mockUsers.filter(u => u.role === 'admin' || u.role === 'super_admin')
}

export function createAdmin(userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): { success: boolean; user?: User; error?: string } {
  try {
    // Check if username or email already exists
    const existingUser = mockUsers.find(u => u.username === userData.username || u.email === userData.email)
    if (existingUser) {
      return { success: false, error: 'Username or email already exists' }
    }
    
    const newUser: MockUser = {
      ...userData,
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    
    // Return User type without password
    const { password, ...userWithoutPassword } = newUser
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Failed to create admin' }
  }
}

export function updateAdmin(id: number, userData: Partial<User>): { success: boolean; user?: User; error?: string } {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    }
    
    return { success: true, user: mockUsers[userIndex] }
  } catch (error) {
    return { success: false, error: 'Failed to update admin' }
  }
}

export function deleteAdmin(id: number): { success: boolean; error?: string } {
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    // Prevent deleting the last super admin
    const user = mockUsers[userIndex]
    if (user.role === 'super_admin') {
      const superAdminCount = mockUsers.filter(u => u.role === 'super_admin').length
      if (superAdminCount <= 1) {
        return { success: false, error: 'Cannot delete the last super admin' }
      }
    }
    
    mockUsers.splice(userIndex, 1)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete admin' }
  }
}
