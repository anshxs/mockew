// components/FloatingFeedback.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Megaphone } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMessage('')
      setIsOpen(false)
      alert('✅ Thanks for your feedback!')
    } catch (err) {
      alert('❌ Failed to send feedback.')
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition"
          aria-label="Give Feedback"
        >
          <Megaphone className="w-6 h-6" />
        </button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">
            <Dialog.Title className="text-lg font-semibold">Report / Suggest / Send /</Dialog.Title>
            <Textarea
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
