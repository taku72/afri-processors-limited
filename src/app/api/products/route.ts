import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Use same query structure as admin API but without filters
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Public API - Products found:', products?.length || 0)

    // Normalize products for public display
    const normalizedProducts = (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category_id || 'Uncategorized', // Use category_id from database
      image: product.image_url || '/images/placeholder-product.jpg', // Use image_url from database
      sku: product.sku,
      stock: product.stock_quantity,
      featured: false, // We don't have featured field in the table
      rating: 4.5, // Default rating since we don't have reviews table yet
      reviews: 0,
      created_at: product.created_at,
      unit: 'unit', // Default unit
      features: ['High quality', 'Premium grade'], // Default features
      specifications: 'Premium agricultural product' // Default specifications
    }))

    return NextResponse.json({
      products: normalizedProducts
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
