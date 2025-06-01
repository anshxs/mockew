import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance (replace with your actual key_id and key_secret)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  const { subscription_id } = await req.json();

  await razorpay.subscriptions.cancel(subscription_id);

  await supabase
    .from("transactions")
    .update({ status: "cancelled" })
    .eq("razorpay_subscription_id", subscription_id);

    await supabase.from('profiles').update({plan:'Free', plan_expires_at:null,razorpay_subscription_id:null}).eq("razorpay_subscription_id", subscription_id)

  return NextResponse.json({ success: true });
}
