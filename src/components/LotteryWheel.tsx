import { motion } from 'motion/react';

interface LotteryWheelProps {
  isSpinning: boolean;
  winningIndex?: number;
}

export default function LotteryWheel({ isSpinning, winningIndex }: LotteryWheelProps) {
  const segments = [
    { label: 'MEMORY', color: 'bg-primary-lime' },
    { label: 'BODY', color: 'bg-primary-cyan' },
    { label: 'CHAT', color: 'bg-white' },
    { label: 'MAGIC', color: 'bg-primary-lime' },
    { label: 'MATH', color: 'bg-primary-cyan' },
    { label: 'SKETCH', color: 'bg-white' },
    { label: 'POISE', color: 'bg-primary-lime' },
    { label: 'HUMOR', color: 'bg-primary-cyan' },
    { label: 'LOGIC', color: 'bg-white' },
    { label: 'SCRIBE', color: 'bg-primary-lime' },
    { label: 'FOCUS', color: 'bg-primary-cyan' },
    { label: 'ZEN', color: 'bg-white' },
  ];

  const rotation = winningIndex !== undefined 
    ? (360 * 5) - (winningIndex * (360 / segments.length))
    : 360 * 5;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20">
        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary-lime drop-shadow-[0_0_10px_rgba(209,255,0,0.5)]" />
      </div>

      {/* Wheel */}
      <motion.div
        className="w-full h-full rounded-full border-8 border-white/10 relative overflow-hidden bg-black shadow-[0_0_50px_rgba(255,255,255,0.05)]"
        animate={isSpinning ? { rotate: rotation } : { rotate: rotation }}
        transition={{
          duration: isSpinning ? 3 : 0.5,
          ease: isSpinning ? "linear" : "easeOut",
          repeat: isSpinning ? Infinity : 0
        }}
      >
        {segments.map((segment, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `rotate(${i * (360 / segments.length)}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <div 
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 ${segment.color}/20 origin-bottom`}
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
            <span 
              className="absolute top-12 left-1/2 -translate-x-1/2 font-display font-black text-[10px] tracking-widest text-white/40 rotate-180"
              style={{ writingMode: 'vertical-rl' }}
            >
              {segment.label}
            </span>
          </div>
        ))}
        
        {/* Hub */}
        <div className="absolute inset-0 m-auto w-12 h-12 bg-black border-4 border-white/20 rounded-full z-10 flex items-center justify-center shadow-2xl">
          <div className="w-4 h-4 bg-primary-lime rounded-full animate-pulse shadow-[0_0_10px_#D1FF00]" />
        </div>
      </motion.div>

      {/* Lights/Decor */}
      <div className="absolute inset-[-10%] border-4 border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
    </div>
  );
}
