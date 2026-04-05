import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id
    const body = await request.json()
    const { username, email, fullName, role, isActive } = body

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
    }

    // Update user
    const { data, error } = await supabase.rpc('update_admin_user', {
      user_id_param: userId,
      username_param: username || null,
      email_param: email || null,
      full_name_param: fullName || null,
      role_param: role || null,
      is_active_param: isActive !== undefined ? isActive : null
    })

    if (error) {
      console.error('Database error:', error)
      
      if (error.message.includes('User not found')) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      if (error.message.includes('Username already exists')) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
      }
      if (error.message.includes('Email already exists')) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
      }
      
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ user: data[0] })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // Delete user
    const { data, error } = await supabase.rpc('delete_admin_user', {
      user_id_param: userId
    })

    if (error) {
      console.error('Database error:', error)
      
      if (error.message.includes('User not found')) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
