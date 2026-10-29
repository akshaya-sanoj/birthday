import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TerminalIntro from './components/TerminalIntro';
import BirthdayReveal from './components/BirthdayReveal';
import PhotoReveal from './components/PhotoReveal';
import CodeBirthdayCard from './components/CodeBirthdayCard';
import AppreciationCards from './components/AppreciationCards';
import JourneyTimeline from './components/JourneyTimeline';
import PhotoGallery from './components/PhotoGallery';
import WisherVideos from './components/WisherVideos';
import SurpriseBox from './components/SurpriseBox';
import WishWheel from './components/WishWheel';
import StudentMessages from './components/StudentMessages';
import BirthdayWishGenerator from './components/BirthdayWishGenerator';
import CelebrationSection from './components/CelebrationSection';
import BirthdayLetter from './components/BirthdayLetter';
import FinalSurprise from './components/FinalSurprise';
import { useSound } from './hooks/useSound';
import Navigation from './components/Navigation';
import Confetti from './components/Confetti';
import SoundControls from './components/SoundControls';
import CursorTrail from './components/CursorTrail';
import AmbientField from './components/AmbientField';

export default function App() {
  const { play } = useSound();
  const [stage, setStage] = useState('terminal');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const scrollRef = useRef(null);

  const fireConfetti = useCallback(() => {
    setConfettiTrigger((n) => n + 1);
    play('confetti');
  }, [play]);

  const unlock = useCallback(() => {
    setStage('experience');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const replay = useCallback(() => {
    setStage('terminal');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (stage === 'experience') {
      const t = setTimeout(() => fireConfetti(), 200);
      return () => clearTimeout(t);
    }
  }, [stage, fireConfetti]);

  return (
    <div ref={scrollRef} className="relative min-h-screen bg-midnight">
      <AmbientField />
      <CursorTrail />
      <Confetti trigger={confettiTrigger} />

      <Navigation visible={stage === 'experience'} onReplay={replay} />
      <SoundControls visible={stage === 'experience'} />

      <AnimatePresence mode="wait">
        {stage === 'terminal' ? (
          <motion.main
            key="terminal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TerminalIntro onUnlock={unlock} />
          </motion.main>
        ) : (
          <motion.main
            key="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <BirthdayReveal onConfetti={fireConfetti} />
            <PhotoReveal />
            <CodeBirthdayCard />
            <AppreciationCards />
            <JourneyTimeline />
            <PhotoGallery />
            <StudentMessages />
            <WisherVideos />
            <SurpriseBox />
            <WishWheel />
            <BirthdayWishGenerator />
            <CelebrationSection onConfetti={fireConfetti} />
            <BirthdayLetter />
            <FinalSurprise onReplay={replay} />
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="border-t border-lavender/10 px-4 py-8 text-center">
        <p className="font-mono text-xs text-warmwhite/35">
          crafted with love, gratitude, and a little JavaScript — for Amritha Ma'am 💜
        </p>
      </footer>
    </div>
  );
}