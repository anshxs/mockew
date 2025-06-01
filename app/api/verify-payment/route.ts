// app/api/verify-payment/route.ts
import supabase from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { razorpay_payment_id, razorpay_order_id, credits, user_id } = await req.json()

  // Store payment
  await supabase.from('payments').insert([
    {
      user_id,
      credits,
      amount: credits * 100,
      razorpay_payment_id,
    },
  ])

  // Increment user credits
  await supabase.rpc('increment_user_credits', {
    uid: user_id,
    add_credits: credits,
  })

  return NextResponse.json({ success: true })
}
