import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { email, plan_id, user_id } = await req.json();

  if (!email || !plan_id || !user_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id,
    total_count: 12, // Monthly for a year
    customer_notify: 1,
    notes: {
      user_id,
      email,
    },
  });

  return NextResponse.json({ subscription });
}
