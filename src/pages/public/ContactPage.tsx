import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/hooks/useToast';
import { FAQ_ITEMS } from '@/data/mock';

export default function ContactPage() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Message sent — we\'ll get back to you soon!', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  const categories = Array.from(new Set(FAQ_ITEMS.map(i => i.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto space-y-12 pt-24 px-4 sm:px-6 pb-24"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-950 tracking-tight">Help & Support</h1>
        <p className="text-ink-500 mt-3 text-lg">Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-3 space-y-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-ink-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider">{category}</h3>
                  <div className="space-y-2">
                    {FAQ_ITEMS.filter(item => item.category === category).map((item) => (
                      <div key={item.id} className="border border-ink-100 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-ink-50 transition-colors"
                        >
                          <span className="font-medium text-ink-900 pr-4">{item.question}</span>
                          <Icon
                            name="chevron"
                            size={16}
                            className={`text-ink-400 transition-transform duration-200 ${openFaq === item.id ? '-rotate-90' : 'rotate-90'}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openFaq === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 text-ink-600 text-sm leading-relaxed border-t border-ink-50">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-display font-bold text-ink-900 mb-2">Still need help?</h2>
            <p className="text-sm text-ink-500 mb-6">Send us a message and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink-700 block mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-300 transition-shadow"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 block mb-1.5">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-300 transition-shadow"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 block mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-ink-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-300 transition-shadow resize-none"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <Button type="submit" variant="accent" className="w-full" icon="mail">
                Send message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
