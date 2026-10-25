import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { wisherVideos } from '../data/wisherVideos';

export default function WisherVideos() {
  const [activeId, setActiveId] = useState(null);
  const [errored, setErrored] = useState(new Set());
  const videoRefs = useRef({});

  const toggle = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (activeId === id) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      return;
    }

    if (activeId !== null) {
      const prevVideo = videoRefs.current[activeId];
      if (prevVideo) {
        prevVideo.pause();
        prevVideo.currentTime = 0;
      }
    }

    setActiveId(id);
    video.play().catch(() => {});
  };

  const handleError = (id) =>
    setErrored((prev) => new Set(prev).add(id));

  return (
    <section id="videos" className="px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-purple-300/80">
            Video Wishes
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-purple-100 sm:text-4xl">
            Wishes Straight From The Heart
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-purple-200/60 font-sans">
            Some messages are better said face-to-face. Press play to hear from us.
          </p>
        </motion.div>

        {/* Updated grid to handle 7 items smoothly across screen sizes */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wisherVideos.map((wv, i) => (
            <VideoCard
              key={wv.id}
              video={wv}
              index={i}
              isActive={activeId === wv.id}
              errored={errored.has(wv.id)}
              onToggle={() => toggle(wv.id)}
              onError={() => handleError(wv.id)}
              registerRef={(el) => {
                videoRefs.current[wv.id] = el;
              }}
            />
          ))}
        </div>

        {/* <p className="mx-auto mt-8 max-w-lg text-center text-xs text-purple-300/40 font-mono">
          <code className="font-mono text-purple-300">public/videos/</code> and update{' '}
          <code className="font-mono text-purple-300">src/data/wisherVideos.js</code> to
          include more wishers.
        </p> */}
      </div>
    </section>
  );
}

function VideoCard({
  video,
  index,
  isActive,
  errored,
  onToggle,
  onError,
  registerRef,
}) {
  const [muted, setMuted] = useState(false);

  if (errored) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.1, 0.4) }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-950/80 border border-purple-500/20 p-8 text-center backdrop-blur-md shadow-lg"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-purple-400/50">
          <VideoOff size={26} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-purple-100">{video.name}</h3>
          <p className="text-xs text-purple-300/70 font-sans">{video.role}</p>
        </div>
        <p className="text-sm text-purple-200/50 font-sans">{video.message}</p>
        <p className="text-xs text-purple-300/30 font-mono">
          Video not found. Add it at{' '}
          <code className="font-mono text-purple-300/60">{video.src}</code>
        </p>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.1, 0.4) }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl bg-slate-950/80 border border-purple-500/20 backdrop-blur-md shadow-lg ${
        index === 6 ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      <div className="relative aspect-video bg-slate-900/60">
        <video
          ref={registerRef}
          src={video.src}
          poster={video.poster}
          preload="metadata"
          playsInline
          muted={muted}
          onError={onError}
          onClick={onToggle}
          className="h-full w-full cursor-pointer object-cover"
        />

        {/* gradient overlay */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent transition-opacity ${
            isActive ? 'opacity-30' : 'opacity-70'
          }`}
        />

        {/* play / pause button */}
        <button
          type="button"
          onClick={onToggle}
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-purple-500/30 text-purple-100 backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-500/50 cursor-pointer ${
            isActive ? 'scale-90 opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          aria-label={isActive ? 'Pause video' : 'Play video'}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        {/* mute toggle */}
        {isActive && (
          <button
            type="button"
            onClick={() => {
              setMuted((m) => !m);
              const v = video.src;
              const el = document.querySelector(`video[src="${v}"]`);
              if (el) el.muted = !muted;
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-purple-100 backdrop-blur-sm transition-colors hover:bg-purple-500/20 cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>

      <div className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
          <Video size={16} />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-purple-100">{video.name}</h3>
          <p className="text-xs text-purple-300/70 font-sans">{video.role}</p>
          <p className="mt-1.5 text-sm text-purple-200/55 font-sans">{video.message}</p>
        </div>
      </div>
    </motion.article>
  );
}