import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    // Apply category filter
    if (category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('API error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Normalize products for admin display
    const normalizedProducts = (products || []).map((product: any) => ({
      ...product,
      stock: product.stock_quantity || 0,
      image: product.featured_image_url || '/images/placeholder-product.jpg',
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      features: product.features ? JSON.parse(product.features) : []
    }))

    return NextResponse.json({
      data: {
        products: normalizedProducts,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body)
    const { name, description, price, sku, stock_quantity } = body

    if (!name || !description || !price || !sku) {
      return NextResponse.json({ error: 'Name, description, price, and SKU are required' }, { status: 400 })
    }

    const insertData: any = {
      name,
      description,
      price: parseFloat(price),
      sku,
      stock_quantity: parseInt(stock_quantity) || 0
    }

    console.log('Insert data:', insertData)

    const { data, error } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { product: data } }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    const { name, description, price, sku, stock_quantity } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: any = {
      name,
      description,
      price: parseFloat(price),
      sku,
      stock_quantity: parseInt(stock_quantity) || 0
    }

    // Note: category_id is removed because it expects UUID, not string
    // Category updates would require a separate categories table

    const { data, error } = await supabase
      .from('products')
      .update([updateData])
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }

    return NextResponse.json({ data: { product: data } }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
