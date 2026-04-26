import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Catalog API: Called successfully')
    
    // Return sample data for testing
    const sampleProducts = [
      {
        id: '1',
        name: 'Moringa Flour',
        description: 'Premium quality moringa flour rich in vitamins and minerals',
        price: 15000,
        category: 'Flours',
        sku: 'MF001',
        stock: 100,
        image: '/images/placeholder-product.jpg',
        rating: 4.5,
        reviews: 12,
        created_at: '2024-01-01T00:00:00Z',
        unit: 'kg',
        features: ['Rich in vitamins', 'High protein', '100% organic'],
        specifications: 'Weight: 2kg, Protein: 25%'
      },
      {
        id: '2',
        name: 'Premium Maize Seeds',
        description: 'High-quality maize seeds suitable for commercial farming',
        price: 45000,
        category: 'Seeds',
        sku: 'MS001',
        stock: 500,
        image: '/images/placeholder-product.jpg',
        rating: 4.8,
        reviews: 25,
        created_at: '2024-01-02T00:00:00Z',
        unit: 'kg',
        features: ['High germination rate', 'Drought resistant', 'Premium grade'],
        specifications: 'Germination rate: 95%, Purity: 99%'
      },
      {
        id: '3',
        name: 'Organic Beans',
        description: 'Certified organic beans for healthy consumption',
        price: 32500,
        category: 'Legumes',
        sku: 'OB001',
        stock: 300,
        image: '/images/placeholder-product.jpg',
        rating: 4.2,
        reviews: 18,
        created_at: '2024-01-03T00:00:00Z',
        unit: 'kg',
        features: ['Organic certified', 'Rich in protein', 'Non-GMO'],
        specifications: 'Protein: 22%, Moisture: 14%'
      }
    ]

    return NextResponse.json({
      products: sampleProducts
    })
  } catch (error) {
    console.error('Catalog API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
