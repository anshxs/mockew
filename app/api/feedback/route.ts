// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const page_url = req.headers.get('referer') || null
    const user_agent = req.headers.get('user-agent') || null

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const { error } = await supabase.from('feedback').insert({
      message,
      page_url,
      user_agent,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save feedback' }, { status: 500 })
  }
}
