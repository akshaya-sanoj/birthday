import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquareHeart, Plus, Trash2, X } from 'lucide-react';
import { studentMessages as seedMessages } from '../data/studentMessages';

const STORAGE_KEY = 'amritha_local_messages_v1';

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    /* ignore quota errors */
  }
}

export default function StudentMessages() {
  const [localMsgs, setLocalMsgs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalMsgs(loadLocal());
  }, []);

  const all = useMemo(
    () => [...localMsgs, ...seedMessages.map((m) => ({ ...m }))],
    [localMsgs]
  );

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) {
      setError('Please add both your name and a message.');
      return;
    }
    const next = {
      id: Date.now(),
      name: n,
      message: m,
      local: true,
    };
    const updated = [next, ...localMsgs];
    setLocalMsgs(updated);
    saveLocal(updated);
    setName('');
    setMessage('');
    setError(null);
    setShowForm(false);
  };

  const clearLocal = () => {
    setLocalMsgs([]);
    saveLocal([]);
  };

  return (
    <section id="messages" className="px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-purple-300/80">
            Messages From Your Students
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-purple-100 sm:text-4xl">
            A Little Note From Each of Us
          </h2>
          <p className="mt-4 text-purple-200/65 font-sans">
            One trainer, many students, countless reasons to say thank you.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 px-5 py-2.5 text-sm font-medium text-slate-950 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg font-sans"
          >
            <Plus size={16} /> Add Your Birthday Message
          </button>
          {localMsgs.length > 0 && (
            <button
              type="button"
              onClick={clearLocal}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-slate-950/60 px-4 py-2.5 text-sm text-purple-200/70 transition-colors hover:border-red-400/40 hover:text-red-300 cursor-pointer font-sans"
            >
              <Trash2 size={14} /> Clear my local messages
            </button>
          )}
        </div>

        <p className="mx-auto mb-10 max-w-xl text-center text-xs text-purple-300/40 font-mono">
          Messages added through the form are saved only in this browser. They won't appear
          on other devices.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((msg, i) => {
            const isOpen = expanded === msg.id;
            const long = msg.message.length > 160;
            return (
              <motion.article
                key={msg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col rounded-2xl bg-slate-950/80 border border-purple-500/20 p-5 backdrop-blur-md shadow-lg ${
                  msg.local ? 'ring-1 ring-yellow-300/30' : ''
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                    <MessageSquareHeart size={15} />
                  </span>
                  <h3 className="font-display text-base font-semibold text-purple-100">
                    {msg.name}
                  </h3>
                  {msg.local && (
                    <span className="ml-auto rounded-full bg-yellow-300/15 px-2 py-0.5 font-mono text-[10px] text-yellow-300">
                      you
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed text-purple-200/75 font-sans ${
                    long && !isOpen ? 'line-clamp-4' : ''
                  }`}
                >
                  {msg.message}
                </p>
                {long && (
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : msg.id)}
                    className="mt-3 inline-flex items-center gap-1 self-start text-xs text-purple-300 transition-colors hover:text-pink-400 cursor-pointer font-sans"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Show less' : 'Read more'}
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* modal form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submit}
              className="w-full max-w-md rounded-2xl bg-slate-950/95 border border-purple-500/30 p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-purple-100">
                  Add Your Message
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full p-1.5 text-purple-300/60 hover:text-purple-100 cursor-pointer"
                  aria-label="Close form"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="msg-name" className="mb-1.5 block text-sm text-purple-200/70 font-sans">
                    Your name
                  </label>
                  <input
                    id="msg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    className="w-full rounded-lg border border-purple-500/30 bg-slate-900/60 px-3 py-2.5 text-purple-100 placeholder:text-purple-400/30 focus:border-purple-400 focus:outline-none font-sans"
                    placeholder="e.g. A grateful student"
                  />
                </div>
                <div>
                  <label htmlFor="msg-text" className="mb-1.5 block text-sm text-purple-200/70 font-sans">
                    Your birthday message
                  </label>
                  <textarea
                    id="msg-text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={600}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-purple-500/30 bg-slate-900/60 px-3 py-2.5 text-purple-100 placeholder:text-purple-400/30 focus:border-purple-400 focus:outline-none font-sans"
                    placeholder="Write something heartfelt…"
                  />
                </div>
                {error && <p className="text-sm text-red-400 font-sans">{error}</p>}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 py-2.5 font-medium text-slate-950 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg font-sans"
                >
                  Add my message
                </button>
                <p className="text-center text-xs text-purple-300/40 font-mono">
                  Saved only in this browser.
                </p>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}