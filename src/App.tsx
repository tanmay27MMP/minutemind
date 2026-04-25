/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Clock, Zap, ArrowRight, Share2, Award, History, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateMicroLesson } from './services/geminiService';
import LotteryWheel from './components/LotteryWheel';

export default function App() {
  const [isLearning, setIsLearning] = useState(false);
  const [lessons, setLessons] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);
  const [winningIndex, setWinningIndex] = useState<number | undefined>(undefined);

  const handleStartLearning = async (topic?: string) => {
    setIsLoading(true);
    setIsSpinning(true);
    setWinningIndex(undefined);
    setCurrentSlide(0);
    
    // Available topics for random pick
    const topics = ["MEMORY", "BODY", "CHAT", "MAGIC", "MATH", "SKETCH", "POISE", "HUMOR", "LOGIC", "SCRIBE", "FOCUS", "ZEN"];
    const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
    const topicIndex = topics.indexOf(selectedTopic);

    // Simulate thinking/fetching
    const contentPromise = generateMicroLesson(selectedTopic);
    
    // Wait at least some time for the hype
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = await contentPromise;
    const splitLessons = content.split("===FLASHCARD_BREAK===").map(s => s.trim()).filter(Boolean);
    setLessons(splitLessons);
    
    // Use the actual index of the topic
    setWinningIndex(topicIndex !== -1 ? topicIndex : Math.floor(Math.random() * 12));
    setIsSpinning(false);
    
    // Show "Winner Revealed" for a moment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsLearning(true);
  };

  const [skillTree, setSkillTree] = useState<string[]>([]);
  const [viewingSkillTree, setViewingSkillTree] = useState(false);

  const handleComplete = () => {
    setSkillTree(prev => [...prev, ...lessons]);
    setViewingSkillTree(true);
    setIsLearning(false);
  };

  const nextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col overflow-x-hidden">
      {/* Background Accents */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-lime opacity-5 rounded-full blur-[140px] -mr-40 -mt-40 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary-cyan opacity-5 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-20 w-full max-w-[1440px] mx-auto p-12 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-primary-lime font-black text-4xl tracking-tighter leading-none">MINUTEMIND.</span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-bold">
          <button onClick={() => { setIsLearning(false); setViewingSkillTree(false); }} className="text-primary-lime border-b-2 border-primary-lime pb-1 hover:opacity-100 transition-opacity">Home</button>
          <button onClick={() => setViewingSkillTree(true)} className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 px-1"><Layers className="w-3 h-3" /> Skill Trees</button>
          <a href="#" className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 px-1"><History className="w-3 h-3" /> History</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {viewingSkillTree ? (
            <motion.div
              key="skill-tree"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-6xl py-12 mx-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-2">YOUR <span className="text-primary-lime italic">SKILL TREE</span></h1>
                  <p className="text-primary-cyan font-mono text-xs uppercase tracking-[0.3em]">Mastered {skillTree.length} micro-lessons and counting</p>
                </div>
                <button 
                  onClick={() => setViewingSkillTree(false)}
                  className="bg-white/5 border border-white/10 px-8 py-4 rounded-full font-black text-xs tracking-widest hover:bg-white/10 transition-colors"
                >
                  BACK TO HOME
                </button>
              </div>

              {skillTree.length === 0 ? (
                <div className="border border-white/10 p-20 text-center rounded-3xl bg-white/[0.02]">
                  <Layers className="w-16 h-16 text-white/10 mx-auto mb-6" />
                  <p className="text-white/40 italic font-serif text-xl">Your tree is still a seed. Start learning to grow it!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillTree.map((lessonContent, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 border-l-4 border-primary-lime p-8 rounded-r-2xl hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-4xl font-black text-white/10 italic group-hover:text-primary-lime/20 transition-colors">#{String(i + 1).padStart(2, '0')}</span>
                        <Award className="w-5 h-5 text-primary-cyan" />
                      </div>
                      <div className="markdown-body prose-invert prose-sm line-clamp-[10] overflow-hidden">
                        <ReactMarkdown>{lessonContent}</ReactMarkdown>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10 opacity-40 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary-lime">Mastered</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center space-y-12 py-20"
            >
              <LotteryWheel isSpinning={isSpinning} winningIndex={winningIndex} />
              <div className="text-center h-20">
                <AnimatePresence mode="wait">
                  {isSpinning ? (
                    <motion.div
                      key="spinning"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h2 className="text-2xl font-black tracking-widest text-primary-lime animate-pulse mb-2">SPINNING THE WHEEL...</h2>
                      <p className="text-primary-cyan font-mono text-xs uppercase tracking-[0.3em]">Consulting the Lottery Master</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="winner"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="text-4xl font-black tracking-tighter text-white animate-bounce mb-2 italic">WINNER REVEALED!</h2>
                      <p className="text-primary-lime font-mono text-xs uppercase tracking-[0.3em]">PREPARING YOUR MASTERY SESSION</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : !isLearning ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col py-20"
            >
              <div className="flex flex-col lg:flex-row lg:items-end gap-0 lg:gap-8">
                <h1 className="text-[clamp(80px,18vw,210px)] font-black leading-[0.8] tracking-tighter text-white">
                  BORED<span className="text-primary-lime">?</span>
                </h1>
                <div className="mb-4 lg:mb-8 max-w-[320px] lg:ml-4">
                  <p className="text-xl leading-tight font-medium text-white/90">
                    Bored? Learn something <span className="italic font-serif text-primary-lime text-2xl">cool</span> in minutes with MinuteMind.
                  </p>
                </div>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-12">
                <button
                  onClick={() => handleStartLearning()}
                  disabled={isLoading}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-primary-lime blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-primary-lime text-black px-14 py-8 rounded-full flex items-center justify-center gap-6 group-hover:scale-105 transition-transform">
                    <span className="text-4xl font-black tracking-tighter">
                      {isLoading ? "SPINNING..." : "I'M BORED"}
                    </span>
                    <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center -mr-4">
                      {isLoading ? (
                        <div className="w-8 h-8 border-4 border-primary-lime border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#D1FF00]" />
                      ) : (
                        <ArrowRight className="text-primary-lime w-8 h-8 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary-cyan font-bold opacity-70">Trending Tracks</span>
                  <div className="flex gap-2 flex-wrap max-w-[440px]">
                    {["MEMORY", "BODY", "CHAT", "MAGIC", "MATH", "SKETCH"].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => handleStartLearning(tag)}
                        disabled={isLoading}
                        className="border border-white/20 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight hover:border-primary-lime hover:text-primary-lime transition-colors cursor-pointer disabled:opacity-50 uppercase"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lesson-slider"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-6xl py-12 mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-primary-lime italic">0{currentSlide + 1}</span>
                  <div className="h-px w-12 bg-white/20" />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Mastery Slide</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors disabled:opacity-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    disabled={currentSlide === lessons.length - 1}
                    className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors disabled:opacity-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border-l-8 border-primary-lime p-8 md:p-16 relative min-h-[500px] flex flex-col"
                  >
                    <div className="absolute top-8 right-8 flex items-center gap-3 text-primary-cyan font-mono text-sm">
                      <Clock className="w-5 h-5 text-primary-lime animate-pulse" />
                      <span className="font-black">5 MINUTES WINDOW</span>
                    </div>

                    <div className="markdown-body prose-invert prose-xl flex-1">
                      <ReactMarkdown>{lessons[currentSlide] || ""}</ReactMarkdown>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-8 items-center justify-between">
                      <button 
                        onClick={() => setIsLearning(false)}
                        className="text-white/40 hover:text-primary-lime transition-colors flex items-center gap-2 font-black uppercase text-xs tracking-widest group"
                      >
                        <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                        Restart Wheel
                      </button>
                      <div className="flex gap-4">
                         {currentSlide < lessons.length - 1 ? (
                           <button 
                            onClick={nextSlide}
                            className="group bg-primary-cyan text-black px-10 py-5 rounded-full font-black text-sm tracking-tighter flex items-center gap-3 hover:scale-105 transition-transform"
                           >
                             NEXT FLASHCARD
                             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </button>
                         ) : (
                           <button 
                            onClick={handleComplete}
                            className="bg-primary-lime text-black px-10 py-5 rounded-full font-black text-sm tracking-tighter hover:scale-105 transition-transform"
                           >
                             ADD TO SKILL TREES
                           </button>
                         )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-6 flex flex-col">
                  <div className="border border-white/10 p-8 rounded-3xl bg-white/[0.02]">
                    <span className="text-[10px] uppercase tracking-widest text-primary-cyan font-bold block mb-6 underline decoration-primary-lime underline-offset-8">Progress Bar</span>
                    <div className="flex gap-2 mb-8">
                      {lessons.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentSlide ? 'bg-primary-lime' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] uppercase opacity-40 font-black tracking-widest">Mastery</span>
                        <span className="text-2xl font-black">{Math.round(((currentSlide + 1) / lessons.length) * 100)}%</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] uppercase opacity-40 font-black tracking-widest">State</span>
                        <span className="text-sm font-bold text-primary-cyan">ACTIVE_LEARNING</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 border-l-2 border-white/10 bg-white/[0.01] rounded-r-3xl">
                    <p className="italic text-white/30 text-lg leading-snug font-serif">
                      "Knowledge is the only treasure you can give without losing it."
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                       <div className="w-4 h-px bg-white/20" />
                       <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">MinuteMind AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-[1440px] mx-auto p-12 mt-auto border-t border-white/10 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="grid grid-cols-3 gap-12">
          <div>
            <span className="block text-primary-lime font-black text-3xl italic leading-none">5 MINS</span>
            <span className="text-[10px] uppercase opacity-40 tracking-widest font-black">Impact window</span>
          </div>
          <div>
            <span className="block text-white font-black text-3xl leading-none">1.2k+</span>
            <span className="text-[10px] uppercase opacity-40 tracking-widest font-black">Curious minds</span>
          </div>
          <div>
            <span className="block text-primary-cyan font-black text-3xl leading-none">95%</span>
            <span className="text-[10px] uppercase opacity-40 tracking-widest font-black">Retention rate</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-primary-lime rounded-full animate-pulse shadow-[0_0_10px_#D1FF00]" />
            <span className="text-[10px] font-mono text-primary-cyan tracking-wider">AI PIPELINE: ACTIVE</span>
          </div>
          <p className="text-[9px] text-white/30 max-w-[220px] font-medium leading-relaxed tracking-tight">
            Mesa AI Lead Product Mentor System // Master Prompt Instruction V.1.0 // Build for Tomorrow.
          </p>
        </div>
      </footer>

      {/* Vertical Side Accent */}
      <div className="hidden xl:flex fixed right-0 top-0 bottom-0 w-16 border-l border-white/10 items-center justify-center z-0 opacity-20 hover:opacity-100 transition-opacity">
        <span className="vertical-text text-[10px] uppercase tracking-[1em] whitespace-nowrap font-black">
          LEARN FAST • THINK DEEP • STAY CURIOUS
        </span>
      </div>
    </div>
  );
}

