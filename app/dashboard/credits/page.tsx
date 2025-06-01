'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import supabase from '@/lib/supabase'
import { useUser } from '@stackframe/stack'

export default function CreditsPage() {
  const user = useUser()
  const [credits, setCredits] = useState(0)
  const [selectedCredits, setSelectedCredits] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (!error && data) setCredits(data.credits || 0)
    }

    fetchCredits()
  }, [user])

  const handlePayment = async () => {
    if (!user) return
    setLoading(true)

    const amount = selectedCredits * 100 * 100 // INR to paise

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
    'Content-Type': 'application/json',
  },
      body: JSON.stringify({ amount, credits: selectedCredits }),
    })

    const order = await res.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
      name: 'Mockew AI',
      description: `Buy ${selectedCredits} credits`,
      order_id: order.id,
      handler: async function (response: any) {
        await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
    'Content-Type': 'application/json',
  },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            credits: selectedCredits,
            user_id: user.id, // send this securely or derive on backend
          }),
        })

        // refresh credits after payment
        const { data } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single()
        if (data) setCredits(data.credits)
      },
      prefill: {
        email: user.primaryEmail,
      },
      theme: {
        color: '#22c55e',
      },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <Button variant="secondary" className="border-2 cursor-default">
        Credits:{' '}
        <span className="text-green-600 font-bold ml-2">{credits}</span>
      </Button>

      <div className="space-y-2">
        <label htmlFor="creditSlider" className="text-sm font-medium">
          Select Credits to Buy: {selectedCredits} ({selectedCredits * 100} INR)
        </label>
        <input
          id="creditSlider"
          type="range"
          min={1}
          max={20}
          value={selectedCredits}
          onChange={(e) => setSelectedCredits(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <Button onClick={handlePayment} disabled={loading}>
        {loading
          ? 'Processing...'
          : `Buy ${selectedCredits} Credits for ₹${selectedCredits * 100}`}
      </Button>
    </div>
  )
}
