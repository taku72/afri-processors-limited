import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Test if products table exists
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error,
        tableExists: false 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      tableExists: true,
      sampleData: data,
      columns: data && data.length > 0 ? Object.keys(data[0]) : []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test POST body:', body)

    // Test simple insert
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name || 'Test Product',
        description: body.description || 'Test Description',
        price: body.price || 100,
        sku: body.sku || 'TEST001'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      data: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error 
    }, { status: 500 })
  }
}
