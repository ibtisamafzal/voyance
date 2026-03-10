import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useReduceMotion } from '../hooks/useReduceMotion';

const API_BASE = ((import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

const CONTACT_TITLE_WORDS = ['Get', 'in', 'Touch'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to send message' }));
        throw new Error(err.detail ?? 'Failed to send message');
      }
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  return (
    <motion.div
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <section className="pt-8 sm:pt-10 pb-10 sm:pb-12 text-center">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 md:px-10 space-y-4">
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-pill-border)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
              }}
            >
              Contact
            </span>
          </motion.div>
          <h1>
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
              {CONTACT_TITLE_WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  initial={reduceMotion ? {} : { y: 100, opacity: 0 }}
                  animate={reduceMotion ? {} : { y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ color: i === CONTACT_TITLE_WORDS.length - 1 ? 'var(--accent)' : 'var(--text-primary)', display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>
          <motion.p
            initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-base sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
              className="md:col-span-3 space-y-5"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                />
              </div>

              {/* Status messages */}
              {status === 'sent' && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'var(--success-glow)', color: 'var(--success)' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'var(--danger-glow)', color: 'var(--danger)' }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>

            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
              className="md:col-span-2 space-y-6"
            >
              <div
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      Location
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Built for Gemini Live Agent Challenge
                      <br />
                      Open source — available worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      Availability
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      AI platform: 24/7
                      <br />
                      Human support: Best effort
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
