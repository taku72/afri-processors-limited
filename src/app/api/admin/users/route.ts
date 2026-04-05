import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Basic auth check (in production, use proper session management)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Temporary: Use direct table query instead of RPC function
    const { data, error } = await supabase
      .from('admin_users')
      .select(`
        id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Debug: Log the actual data being returned
    console.log('Raw data from database:', data)
    console.log('Number of users:', data?.length || 0)

    return NextResponse.json({ users: data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, email, password, fullName, role = 'admin' } = body

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error:', checkError)
      return NextResponse.json({ error: 'Failed to check username' }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    // Check if email already exists
    const { data: existingEmail, error: checkEmailError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkEmailError && checkEmailError.code !== 'PGRST116') {
      console.error('Database error:', checkEmailError)
      return NextResponse.json({ error: 'Failed to check email' }, { status: 500 })
    }

    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    // Generate password hash using bcrypt-compatible method
    const { data: hashData, error: hashError } = await supabase
      .rpc('generate_password_hash', { password_param: password })

    if (hashError) {
      console.error('Hash error:', hashError)
      // Fallback: Use simple hash (not ideal for production)
      const hashedPassword = password // TEMPORARY - use actual password for now
    }

    // Create new user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        username,
        email,
        password_hash: hashData || password, // TEMPORARY fallback
        full_name: fullName,
        role: role || 'admin'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
