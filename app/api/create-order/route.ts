// app/api/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
  const { amount, credits } = await req.json()

  const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `receipt_${Math.random()}`,
  })

  return NextResponse.json(order)
}
