import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const {
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    user_email,
    user_id
  } = await req.json();

  const { error } = await supabase
    .from("transactions")
    .insert({
      user_email,
      razorpay_payment_id,
      razorpay_subscription_id,
      plan,
      status: "active",
    });

    // Fetch current credits
const { data: userData, error: fetchError } = await supabase
  .from("users")
  .select("credits")
  .eq("email", user_email)
  .single();

if (fetchError) {
  console.log(fetchError);
  return NextResponse.json({ error: fetchError }, { status: 500 });
}

let additionalCredits = 0;
if (plan === "Paid") additionalCredits = 5;
if (plan === "Sponsored") additionalCredits = 15;

const updatedCredits = (userData?.credits || 0) + additionalCredits;

  const { error: updateError } = await supabase
  .from("profiles")
  .update({
    plan,
    razorpay_subscription_id,
    plan_expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
  })
  .eq("email", user_email);

  const {error: updateError2} = await supabase.from('users').update({
    credits: updatedCredits}).eq('email',user_email)

  if (updateError) {
  console.log(updateError);
  return NextResponse.json({ error: updateError }, { status: 500 });
}

  if (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
  
}
