'use client'

import React from "react"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { MessageSquare, Send } from 'lucide-react'

export default function FeedbackForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'feedback' | 'question'>('feedback')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Feedback submitted:', { email, type, message })
    // In a real app, this would send to a backend
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setEmail('')
      setMessage('')
      setType('feedback')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve this open data platform. Your input helps us better serve the public.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <Card className="p-6 bg-accent/10 border-accent/20 text-center space-y-3">
            <p className="text-sm font-medium text-foreground">Thank you for your feedback!</p>
            <p className="text-xs text-muted-foreground">
              Your message has been received. The platform administrators will review it.
            </p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Feedback Type</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('feedback')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                    type === 'feedback'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border bg-card hover:bg-secondary'
                  }`}
                >
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setType('question')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                    type === 'question'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border bg-card hover:bg-secondary'
                  }`}
                >
                  Question
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-xs font-medium mb-2 block">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide an email if you&apos;d like us to follow up
              </p>
            </div>

            {/* Message Textarea */}
            <div>
              <Label htmlFor="message" className="text-xs font-medium mb-2 block">
                Your Message
              </Label>
              <Textarea
                id="message"
                placeholder={type === 'feedback' ? 'Share your thoughts about the platform...' : 'Ask your question...'}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="text-sm min-h-30"
                required
              />
            </div>

            {/* Important Notice */}
            <Card className="p-3 bg-muted/50 border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Note:</span> This platform does not modify official data. Feedback is forwarded to platform administrators for review.
              </p>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full text-sm gap-2" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
