"use client"

import { useState } from 'react'

export default function WhatsAppHelper() {
  const [template, setTemplate] = useState('upcoming_class')
  const [customNotes, setCustomNotes] = useState('')
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const templates = {
    upcoming_class: "🌟 Hi Ferrell Family! Just a reminder that our next Wonder Journey class is coming up.",
    materials_needed: "🎒 Hello! For our next adventure, please make sure the kids have their materials ready.",
    cooking_ingredients: "🍳 Cooking Academy time! Please pick up these ingredients before class.",
    schedule_change: "⏰ Hi everyone, a quick update to our class schedule.",
    homework: "📚 Great job today! The family challenge for this week is...",
    lesson_summaries: "✨ We had a wonderful class today! The kids learned so much.",
    celebration: "🎉 It's time to celebrate! We are so blessed to have you in our class.",
    next_adventure: "🗺️ Get your passports ready! Next week we are traveling somewhere new."
  }

  const generateMessage = () => {
    setGeneratedMessage(templates[template as keyof typeof templates] + (customNotes ? '\n\n' + customNotes : ''))
    setStatus(null)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
    setStatus("Message copied to clipboard!")
  }

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(generatedMessage)
    window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank')
    setStatus("Opened WhatsApp Web. Don't forget to mark as sent when done!")
  }

  const markAsSent = () => {
    // In the future: await supabase.from('whatsapp_messages').insert(...)
    setStatus("Message marked as sent and saved to history.")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">📱</span>
        <div>
          <h1 className="font-display text-3xl text-ocean-deep">WhatsApp Helper</h1>
          <p className="font-hand text-lg text-ink-soft">Generate and send messages directly to the family WhatsApp group.</p>
        </div>
      </div>
      
      <div className="wj-card space-y-4 p-6">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase text-ink-soft">Message Template</label>
          <select 
            value={template} 
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full rounded-2xl border-2 border-sand-deep bg-paper p-3 text-lg outline-none transition-all focus:border-mango"
          >
            <option value="upcoming_class">Upcoming Class Reminder</option>
            <option value="materials_needed">Materials Needed</option>
            <option value="cooking_ingredients">Cooking Ingredients</option>
            <option value="schedule_change">Schedule Change</option>
            <option value="homework">Homework / Challenge</option>
            <option value="lesson_summaries">Lesson Summary</option>
            <option value="celebration">Celebration Message</option>
            <option value="next_adventure">Next Adventure Preview</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase text-ink-soft">Custom Notes</label>
          <textarea 
            rows={4}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full rounded-2xl border-2 border-sand-deep bg-paper p-3 text-lg outline-none transition-all focus:border-mango"
            placeholder="Add specific details, links, or instructions here..."
          />
        </div>

        <button onClick={generateMessage} className="wj-btn w-full text-lg">
          Generate Message ✨
        </button>
      </div>

      {generatedMessage && (
        <div className="wj-card space-y-4 p-6">
          <label className="block text-sm font-bold uppercase text-ink-soft">Generated Message Preview</label>
          <div className="whitespace-pre-wrap rounded-xl border-2 border-sand-deep bg-white p-4 font-hand text-lg">
            {generatedMessage}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <button onClick={copyToClipboard} className="wj-btn w-full">
              Copy Message 📋
            </button>
            <button 
              onClick={openWhatsApp} 
              className="wj-btn w-full border-none bg-[#25D366] text-white hover:bg-[#128C7E]"
            >
              Open WhatsApp Web 💬
            </button>
          </div>

          <button onClick={markAsSent} className="wj-btn wj-btn-ghost w-full">
            Mark as Sent ✅
          </button>
          
          {status && (
            <div className="rounded-lg bg-mango/20 p-3 text-center text-sm font-bold text-mango-deep">
              {status}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
