import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { wheelSlices } from '../data/wheelSlices';
import { useSound } from '../hooks/useSound';

const SLICE = 360 / wheelSlices.length;

export default function WishWheel() {
  const { play } = useSound();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [resultKey, setResultKey] = useState(0);
  const totalRotRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    play('spin');

    const winningIndex = Math.floor(Math.random() * wheelSlices.length);
    const targetSliceCenter = winningIndex * SLICE + SLICE / 2;
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const newRotation = totalRotRef.current + fullSpins * 360 + (360 - targetSliceCenter);
    totalRotRef.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(wheelSlices[winningIndex].label);
      setResultKey((k) => k + 1);
      play('ding');
    }, 4200);
  }, [spinning, play]);

  return (
    <section className="px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-purple-300/80"
        >
          Spin For A Wish
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 font-display text-3xl font-semibold text-purple-100 sm:text-4xl"
        >
          The Wheel Of Wishes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-md text-purple-200/60 font-sans"
        >
          Give it a spin. Wherever it lands, that's our wish for you this year.
        </motion.p>

        <div className="relative mx-auto mt-12 h-72 w-72 sm:h-80 sm:w-80">
          {/* pointer */}
          <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
            <div className="h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-yellow-300 drop-shadow-lg" />
          </div>

          {/* wheel */}
          <motion.div
            className="relative h-full w-full rounded-full border-4 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)]"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full">
              {wheelSlices.map((slice, i) => {
                const startAngle = (i * SLICE - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * SLICE - 90) * (Math.PI / 180);
                const x1 = 100 + 95 * Math.cos(startAngle);
                const y1 = 100 + 95 * Math.sin(startAngle);
                const x2 = 100 + 95 * Math.cos(endAngle);
                const y2 = 100 + 95 * Math.sin(endAngle);
                const midAngle = (i * SLICE + SLICE / 2 - 90) * (Math.PI / 180);
                const tx = 100 + 55 * Math.cos(midAngle);
                const ty = 100 + 55 * Math.sin(midAngle);
                return (
                  <g key={slice.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      opacity={0.75}
                      stroke="#07050d"
                      strokeWidth={1}
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#FAF7FF"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${i * SLICE + SLICE / 2} ${tx} ${ty})`}
                    >
                      {slice.label.length > 18 ? slice.label.slice(0, 16) + '…' : slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* center hub */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 border-2 border-purple-400/40 shadow-lg">
            <span className="text-lg">💜</span>
          </div>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 px-7 py-3 font-semibold text-slate-950 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer font-sans"
        >
          <RotateCw size={20} className={spinning ? 'animate-spin' : ''} />
          <span>{spinning ? 'Spinning...' : 'Spin the wheel'}</span>
        </button>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={resultKey}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-8 max-w-md rounded-2xl bg-slate-950/80 border border-purple-500/30 p-5 shadow-[0_0_40px_rgba(236,72,153,0.2)] backdrop-blur-md"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-yellow-300/80">
                The wheel has decided
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-purple-100">
                {result}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}