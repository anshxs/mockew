"use client";

import { useUserPlan } from "@/hooks/usePlan";
import { SparklesText } from "@/components/magicui/sparkles-text";
import PriceDemoUI from "@/components/PricingComponent";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
// Remove this import, Razorpay is loaded via script tag, not as a module
// import Razorpay from "razorpay";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useUser } from "@stackframe/stack";
import { useRouter } from 'next/navigation';


export default function Pricing() {
  const {user, plan, planExpiry, loading} = useUserPlan();
  const [isReady, setIsReady] = useState(false);
  const usermail=user?.primaryEmail;
  const router = useRouter()

  const handleRefresh = () => {
  router.refresh();
};
  const userX=useUser();

  async function getUserSubscriptionId(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('razorpay_subscription_id')
    .eq('email', usermail)
    .single();

  if (error) {
    console.error('Error fetching subscription ID:', error.message);
    return null;
  }

  return data?.razorpay_subscription_id ?? null;
}

  useEffect(() => {
    // Ensure the Razorpay script is loaded
    const checkRazorpay = setInterval(() => {
      if (typeof window !== "undefined" && typeof window.Razorpay !== "undefined") {
        setIsReady(true);
        clearInterval(checkRazorpay);
      }
    }, 100);
    return () => clearInterval(checkRazorpay);
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  const handleSubscribe = async (plan: "Paid" | "Sponsored") => {
    if (!isReady || typeof window === "undefined" || !window.Razorpay) {
      alert("Razorpay is not ready yet.");
      return;
    }
  const planId = plan === "Paid" ? "plan_QcEH7KGbegQhr8" : "plan_QcEHS69Iu6MVue";

  const res = await fetch("/api/razorpay/subscribe", {
    method: "POST",
    body: JSON.stringify({
      email: user?.primaryEmail,
      user_id: user?.id,
      plan_id: planId,
    }),
  });

  const data = await res.json();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    subscription_id: data.subscription.id,
    name: "Mockew AI",
    description: `${plan} Plan Subscription`,
    handler: async function (response: any) {
      // Save to Supabase
      await fetch("/api/razorpay/success", {
        method: "POST",
        body: JSON.stringify({
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          plan,
          user_id: user?.id,
          user_email: user?.primaryEmail,
        }),
      });
      handleRefresh();

      // Redirect or show success message
    },
    prefill: {
      email: user?.primaryEmail,
    },
    theme: {
      color: "#000",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <motion.div
      className="mx-auto max-w-screen px-4 py-12 lg:px-6 lg:py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black">Choose Your Plan</h2>
      </div>

      {/* If on Paid or Sponsored */}
      {plan === "Paid" || plan === "Sponsored" ? (
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-xl font-semibold">
            🎉 You're on the <span className="underline">{plan}</span> plan
          </p>
          {planExpiry && (
            <p className="text-gray-600">
              Plan expires on <b>{planExpiry.toDateString()}</b>
            </p>
          )}
          <p className="text-gray-600">
            You will be charged again on your billing date. You can{" "}
            <span className="underline cursor-pointer">cancel</span> or{" "}
            <span className="underline cursor-pointer">change</span> your plan
            anytime.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Button
  variant="destructive"
  className="text-white"
  onClick={async () => {
    try {
      if (!usermail || !userX?.primaryEmail) {
        alert('User ID not found.');
        return;
      }
      const subscriptionId = await getUserSubscriptionId(userX.primaryEmail);
      if (!subscriptionId) {
        alert('Subscription ID not found.');
        return;
      }
      const res = await fetch('/api/razorpay/cancel', {
        method: 'POST',
        body: JSON.stringify({
          subscription_id: subscriptionId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Subscription cancelled successfully!');
        handleRefresh();
        // Optionally: refetch profile/transactions or reload page
      } else {
        alert('Failed to cancel subscription.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  }}
>
  Cancel Plan
</Button>
          </div>
        </div>
      ) : (
        <motion.div
          className="mx-auto max-w-screen px-4 py-12 -mt-12 lg:px-6 lg:py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black">
              Less than the cost of rejection therapy
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {/* Pricing Card 1 */}
            <div className="bg-white text-gray-900 border-2 border-black shadow-[8px_8px_0_black] rounded-3xl p-6 xl:p-8 flex flex-col space-y-8">
              <h3 className="text-lg font-normal text-black">Free</h3>
              <div className="relative flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
              <p className="text-sm font-light text-gray-600">
                The{" "}
                <span className="bg-blue-100 font-bold text-blue-600 px-1 rounded">
                  Free
                </span>{" "}
                plan gets you ready. The others get you hired.
              </p>
              <a className="bg-gray-900 text-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 transition">
                Go to dashboard
              </a>
              <ul className="text-sm text-left text-gray-600 space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckIcon />{" "}
                  <span className="bg-white font-bold border-2 border-blue-600 text-blue-600 px-1 rounded">
                    1
                  </span>
                  <span> Mock interview</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Access to DebugFeed</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Access to Top 20 Section</span>
                </li>

                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Priority Support</span>
                </li>
              </ul>
            </div>

            {/* Pricing Card 2 */}
            <div className="bg-[#D8FA6D] text-gray-900 rounded-3xl border-2 border-black shadow-[8px_8px_0_black] p-6 xl:p-8 flex flex-col space-y-8">
              <h3 className="text-lg font-normal text-black">
                <span className="bg-black font-bold text-[#D8FA6D] px-1 rounded">
                  Recommended
                </span>
              </h3>
              <div className="flex relative flex-col sm:flex-row items-center justify-center text-center sm:text-left">
                <span className="text-3xl sm:text-5xl font-extrabold mr-2">
                  ~$2.34
                </span>
                <span className="text-gray-600">/month</span>
                <div className="absolute top-0 right-0">
                  <div className="relative">
                    <span className="cursor-pointer text-gray-600">USD</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-light text-gray-600">
                The sweet spot between{" "}
                <span className="bg-white font-bold text-black px-1 rounded">
                  just enough
                </span>{" "}
                and{" "}
                <span className="bg-white font-bold text-black px-1 rounded">
                  way too much
                </span>
                .
              </p>
              <Button onClick={()=>handleSubscribe('Paid')} className="bg-gray-900 text-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 transition">
                Get started
              </Button>
              <ul className="text-sm text-left text-gray-600 space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon />{" "}
                  <span className="bg-white font-bold border-black border-2 text-black px-1 rounded">
                    5
                  </span>
                  <span>Mock interview</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-white bg-blue-600 p-0.5 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  <SparklesText
                    sparklesCount={3}
                    className="text-md font-light"
                  >
                    Blue Tick
                  </SparklesText>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Resume Builder Full Access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Link Dance Full Access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Code Reviewer Agent Access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Logo Maker Access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Code To Image Access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon /> <span>Priority Support</span>
                </li>
              </ul>
            </div>

            {/* Pricing Card 3 */}
            <div className="bg-[#ff0651da] text-gray-900 rounded-3xl p-6 xl:p-8 border-2 border-black shadow-[8px_8px_0_black] flex flex-col space-y-8">
              <h3 className="text-lg font-normal text-white">Supporter</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left relative">
                <span className="text-3xl sm:text-5xl font-extrabold mr-2 text-white">
                  ~$24
                </span>
                <span className=" text-white">/month</span>
                <div className="absolute top-0 right-0">
                  <div className="relative">
                    <span className="cursor-pointer text-white">USD</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-light text-white">
                Only upgrade if you{" "}
                <span className="bg-white font-bold text-red-500 px-1 rounded">
                  love
                </span>{" "}
                us more than your money.
              </p>
              <Button onClick={() => handleSubscribe('Sponsored')} className="text-gray-900 bg-white text-sm font-semibold text-center p-3 w-full rounded-md shadow-sm cursor-pointer hover:-translate-y-1 hover:bg-white transition">
                Get started
              </Button>
              <ul className="text-sm text-left text-white space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckIcon2 /> <span>Everything in Recommended</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-black bg-[#fff024] border-2 border-amber-50 p-0.5 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  <SparklesText
                    sparklesCount={3}
                    className="text-md font-light"
                  >
                    Golden Tick
                  </SparklesText>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon2 />{" "}
                  <span className="bg-white font-bold border-black border-2 text-red-500 px-1 rounded">
                    15
                  </span>
                  <span>Mock interview</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon2 /> <span>Priority Support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckIcon2 /> <span>Priority Features Add Request</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
const CheckIcon = () => (
  <svg
    className="h-5 w-5 bg-gray-900 text-white p-0.5 rounded-full"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon2 = () => (
  <svg
    className="h-5 w-5 text-gray-900 bg-white p-0.5 rounded-full"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon1 = () => (
  <svg
    className="h-5 w-5 text-white bg-blue-600 p-0.5 rounded-full"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
