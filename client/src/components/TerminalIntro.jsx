import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CornerDownLeft, Sparkles } from 'lucide-react';

const COMMANDS = [
  '$ initializing special_project...',
  '$ loading memories...',
  '$ compiling gratitude...',
  '$ checking happiness levels...',
  "$ trainer detected: Amritha Ma'am",
  '$ surprise status: READY',
];

const UNLOCK_COMMAND = 'open-surprise';

export default function TerminalIntro({ onUnlock }) {
  const [printed, setPrinted] = useState([]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const clearTimers = () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
    const typeNext = () => {
      if (cancelled || i >= COMMANDS.length) {
        if (!cancelled) {
          timersRef.current.push(setTimeout(() => setShowInput(true), 500));
        }
        return;
      }
      const cmd = COMMANDS[i];
      if (typeof cmd === 'string') {
        setPrinted((prev) => [...prev, cmd]);
      }
      i += 1;
      timersRef.current.push(setTimeout(typeNext, 650));
    };
    timersRef.current.push(setTimeout(typeNext, 600));
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const handleCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === UNLOCK_COMMAND) {
      setAccepted(true);
      setResponse(null);
      setTimeout(onUnlock, 700);
    } else if (cmd === '') {
      setResponse(null);
    } else if (cmd === 'help') {
      setResponse("hint: try 'open-surprise' — or click the button below.");
    } else if (cmd === 'clear') {
      setPrinted([]);
      setResponse(null);
    } else {
      setResponse(
        `command not found: ${cmd}. try 'open-surprise' to unlock the surprise.`
      );
    }
    setInput('');
  };

  return (
    <motion.section
      className="relative flex min-h-screen items-center justify-center px-4 py-16"
      initial={{ opacity: 1 }}
      animate={{ opacity: accepted ? 0 : 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <FloatingChars />
      </div>

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-950/80 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] backdrop-blur-md">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-purple-500/20 bg-slate-900/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 flex items-center gap-2 font-mono text-xs text-purple-200/70">
            <Terminal size={13} className="text-purple-400" />
            amritha_birthday_surprise — terminal
          </span>
        </div>

        {/* body */}
        <div className="space-y-1.5 px-5 py-6 font-mono text-sm leading-relaxed sm:px-7 sm:text-[15px]">
          {printed.map((line, i) => {
            const text = line ?? '';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  text.includes('READY')
                    ? 'text-yellow-300'
                    : text.includes('Amritha')
                      ? 'text-pink-400'
                      : 'text-purple-100/85'
                }
              >
                {text}
                {i === COMMANDS.length - 1 && (
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-purple-400 align-middle" />
                )}
              </motion.div>
            );
          })}

          <AnimatePresence>
            {showInput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 pt-4"
              >
                <div className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-3.5 py-2.5 text-pink-300">
                  WARNING: An unusually special person has a birthday today.
                </div>
                <div className="text-purple-200/80 font-sans">
                  This experience was created with love by your students.
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommand(input);
                  }}
                  className="flex flex-col gap-2 pt-1 sm:flex-row"
                >
                  <label htmlFor="terminal-input" className="sr-only">
                    Enter a terminal command
                  </label>
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-purple-500/30 bg-slate-900/60 px-3 py-2.5 focus-within:border-purple-400">
                    <span className="text-purple-400">$</span>
                    <input
                      id="terminal-input"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="type open-surprise"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full bg-transparent text-purple-100 placeholder:text-purple-400/30 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2.5 font-medium text-slate-950 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer font-sans"
                  >
                    <span>Run</span> <CornerDownLeft size={15} />
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCommand(UNLOCK_COMMAND)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 transition-colors hover:bg-purple-500/20 cursor-pointer"
                  >
                    <Sparkles size={14} /> open-surprise
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommand(UNLOCK_COMMAND)}
                    className="rounded-full border border-purple-500/20 px-4 py-2 text-sm text-purple-200/70 transition-colors hover:border-purple-500/40 hover:text-purple-100 cursor-pointer font-sans"
                  >
                    I'm curious…
                  </button>
                </div>

                <AnimatePresence>
                  {response && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-purple-200/60 font-sans text-sm"
                    >
                      {response}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function FloatingChars() {
  const chars = ['{ }', '</>', '()', '=>', 'const', '&&', '||', 'npm', 'git', '[]'];
  return (
    <div className="absolute inset-0">
      {chars.map((c, i) => (
        <span
          key={i}
          className="absolute font-mono text-xs text-purple-400/15"
          style={{
            top: `${(i * 97) % 90}%`,
            left: `${(i * 53) % 92}%`,
            animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}