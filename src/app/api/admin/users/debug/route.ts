import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Test direct table query
    const { data: directData, error: directError } = await supabase
      .from('admin_users')
      .select('*')
    
    console.log('Direct query result:', directData)
    console.log('Direct query error:', directError)

    // Test if RPC functions exist (they probably don't yet)
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_admin_users')
    
    console.log('RPC result:', rpcData)
    console.log('RPC error:', rpcError)

    return NextResponse.json({
      directQuery: {
        data: directData,
        error: directError?.message,
        count: directData?.length || 0
      },
      rpcQuery: {
        data: rpcData,
        error: rpcError?.message,
        count: rpcData?.length || 0,
        note: 'RPC functions need to be deployed to Supabase'
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Debug error' }, { status: 500 })
  }
}
