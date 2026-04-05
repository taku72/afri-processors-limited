import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all users for statistics
    const { data: users, error: usersError } = await supabase
      .from('admin_users')
      .select('role, is_active, created_at, last_login')
    
    if (usersError) {
      console.error('Database error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
    }

    // Calculate statistics
    const totalUsers = users?.length || 0
    const activeUsers = users?.filter(user => user.is_active).length || 0
    const inactiveUsers = users?.filter(user => !user.is_active).length || 0
    
    const superAdminUsers = users?.filter(user => user.role === 'super_admin').length || 0
    const adminUsers = users?.filter(user => user.role === 'admin').length || 0
    
    // Users who logged in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentLogins = users?.filter(user => 
      user.last_login && new Date(user.last_login) > sevenDaysAgo
    ).length || 0
    
    // Users created this month
    const currentMonth = new Date()
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    
    const newUsersThisMonth = users?.filter(user => 
      new Date(user.created_at) >= currentMonthStart
    ).length || 0

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      superAdminUsers,
      adminUsers,
      recentLogins,
      newUsersThisMonth,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
