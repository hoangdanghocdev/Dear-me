import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio } from 'lucide-react';

export default function App() {
  // phase: 0=Intro, 0.5=ShakeHead, 1=Note1, 2=Note2, 3=Driving, 4=Final
  const [phase, setPhase] = useState(0);
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });

  const fadeOutAudio = (audio: HTMLAudioElement) => {
    const fade = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        clearInterval(fade);
        audio.pause();
      }
    }, 100);
  };

  const fadeInAudio = (audio: HTMLAudioElement) => {
    audio.volume = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    const fade = setInterval(() => {
      if (audio.volume < 0.45) {
        audio.volume += 0.05;
      } else {
        clearInterval(fade);
      }
    }, 100);
  };

  const handleStart = () => {
    if (audio1Ref.current) {
      fadeInAudio(audio1Ref.current);
    }
    setPhase(0.5);
    setTimeout(() => {
      setPhase(1);
    }, 1500);
  };

  const handleAgree1 = () => {
    setPhase(2);
    setNoBtnPos({ x: 0, y: 0 });
  };

  const handleAgree2 = () => {
    setPhase(3);
    setTimeout(() => {
      setPhase(4);
      if (audio1Ref.current) fadeOutAudio(audio1Ref.current);
      if (audio2Ref.current) fadeInAudio(audio2Ref.current);
    }, 3000);
  };

  const handleNoHover = () => {
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    setNoBtnPos({ x: newX, y: newY });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900 via-slate-800 to-[#020617] text-white font-sans">
      {/* Audio Elements */}
      <audio ref={audio1Ref} src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112135.mp3" loop />
      <audio ref={audio2Ref} src="nhac-cua-toi.mp3" loop />

      {/* Cinematic Letterbox */}
      <motion.div className="absolute top-0 left-0 w-full h-[10vh] bg-black z-[70]" initial={{ y: '-100%' }} animate={{ y: 0 }} transition={{ duration: 2, ease: "easeOut" }} />
      <motion.div className="absolute bottom-0 left-0 w-full h-[10vh] bg-black z-[70]" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 2, ease: "easeOut" }} />

      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[60] bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_120%)]" />

      {/* Background Elements */}
      <Stars />
      <ShootingStars />
      <Moon phase={phase} />
      <PineHill phase={phase} />
      {phase === 4 && <Fireflies />}

      {/* --- SCENE 1: ĐƯỜNG PHỐ (Phase 0, 0.5, 1, 2) --- */}
      <AnimatePresence>
        {phase < 3 && (
          <>
            {/* Gấu nâu đi SH tới */}
            <motion.div
              key="brown-bear"
              className="absolute bottom-[20%] text-6xl md:text-8xl z-20 flex items-end drop-shadow-2xl"
              initial={{ x: '-20vw' }}
              animate={{ x: '30vw' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              🐻<span className="text-5xl md:text-7xl -ml-2 transform scale-x-[-1]">🛵</span>
            </motion.div>

            {/* Gấu trắng đứng đợi & lắc đầu */}
            <motion.div
              key="white-bear"
              className="absolute bottom-[20%] text-6xl md:text-8xl z-20 drop-shadow-2xl"
              initial={{ x: '60vw' }}
              animate={{
                x: '60vw',
                rotate: phase === 0.5 ? [0, -15, 15, -15, 15, 0] : 0
              }}
              exit={{ opacity: 0 }}
              transition={{ rotate: { duration: 1.2, ease: "easeInOut" } }}
            >
              🐻‍❄️
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- SCENE 2: PHÓNG XE LÊN ĐỒI (Phase 3) --- */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            key="driving-bears"
            className="absolute bottom-[20%] z-20 drop-shadow-2xl"
            initial={{ x: '10vw' }}
            animate={{ x: '120vw', y: [0, -8, 0, -5, 0, -8, 0] }}
            transition={{ 
              x: { duration: 4, ease: "easeInOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="relative w-64 h-48">
              {/* Xe máy */}
              <span className="absolute bottom-0 right-0 text-[6rem] md:text-[8rem] transform scale-x-[-1] z-20">🛵</span>
              {/* Gấu nâu (Lái xe) */}
              <span className="absolute bottom-[25%] right-[20%] text-[4rem] md:text-[5.5rem] z-30">🐻</span>
              {/* Gấu trắng (Ngồi sau ôm) */}
              <span className="absolute bottom-[30%] right-[45%] text-[3.5rem] md:text-[5rem] z-10 transform -rotate-12">🐻‍❄️</span>
              {/* Tim bay */}
              <motion.span 
                className="absolute top-[10%] right-[30%] text-3xl z-0"
                animate={{ y: [0, -40], opacity: [1, 0], scale: [1, 1.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >💖</motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCENE 3: FINAL - NGẮM TRĂNG TRÊN ĐỒI (Phase 4) --- */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div
            key="final-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-10"
          >
            {/* Dòng chữ I miss you so much */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ delay: 3.5, duration: 3, ease: "easeOut" }}
              className="absolute top-[30%] w-full text-center z-50 pointer-events-none"
            >
              <h2 className="text-4xl md:text-6xl font-serif text-rose-100 tracking-widest drop-shadow-[0_0_25px_rgba(225,29,72,0.8)] italic font-medium">
                I miss you so much...
              </h2>
            </motion.div>

            {/* Ngôi nhà sáng đèn (SVG) */}
            <div className="absolute bottom-[28%] right-[10%] md:right-[20%] w-36 md:w-56 z-10 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                {/* Glow behind house */}
                <circle cx="100" cy="100" r="80" fill="#fef08a" opacity="0.15" className="animate-pulse" />
                {/* Smoke */}
                <path d="M140 30 Q145 15 135 0 Q125 -15 140 -30" stroke="#cbd5e1" strokeWidth="3" fill="none" className="animate-pulse" opacity="0.5"/>
                <path d="M145 35 Q155 20 145 5 Q135 -10 150 -25" stroke="#cbd5e1" strokeWidth="2" fill="none" className="animate-pulse" opacity="0.3" style={{animationDelay: '1s'}}/>
                {/* Chimney */}
                <path d="M130 40 L150 40 L150 70 L130 70 Z" fill="#1e293b" />
                <path d="M125 35 L155 35 L155 45 L125 45 Z" fill="#0f172a" />
                {/* Main Body */}
                <path d="M20 80 L180 80 L180 140 L20 140 Z" fill="#1e293b" />
                {/* Roof */}
                <path d="M10 80 L100 20 L190 80 Z" fill="#0f172a" stroke="#334155" strokeWidth="4" strokeLinejoin="round"/>
                {/* Fairy lights */}
                <path d="M10 80 L100 20 L190 80" stroke="#fef08a" strokeWidth="2" strokeDasharray="4 6" className="animate-pulse" />
                <circle cx="40" cy="60" r="3" fill="#fef08a" className="animate-pulse" />
                <circle cx="70" cy="40" r="3" fill="#fef08a" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                <circle cx="100" cy="20" r="3" fill="#fef08a" className="animate-pulse" style={{animationDelay: '1s'}} />
                <circle cx="130" cy="40" r="3" fill="#fef08a" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                <circle cx="160" cy="60" r="3" fill="#fef08a" className="animate-pulse" style={{animationDelay: '0.7s'}} />
                {/* Door */}
                <path d="M85 95 L115 95 L115 140 L85 140 Z" fill="#0f172a" />
                <path d="M85 95 Q100 85 115 95" fill="#0f172a" />
                <circle cx="110" cy="120" r="2" fill="#fbbf24" />
                {/* Heart on door */}
                <text x="92" y="125" fontSize="16" fill="#f43f5e" className="animate-pulse">❤️</text>
                {/* Windows */}
                <rect x="40" y="95" width="30" height="30" rx="2" fill="#fef08a" className="animate-pulse" />
                <path d="M55 95 L55 125 M40 110 L70 110" stroke="#0f172a" strokeWidth="3" />
                <rect x="130" y="95" width="30" height="30" rx="2" fill="#fef08a" className="animate-pulse" />
                <path d="M145 95 L145 125 M130 110 L160 110" stroke="#0f172a" strokeWidth="3" />
                {/* Bushes */}
                <circle cx="20" cy="135" r="15" fill="#064e3b" />
                <circle cx="35" cy="140" r="12" fill="#065f46" />
                <circle cx="180" cy="135" r="15" fill="#064e3b" />
                <circle cx="165" cy="140" r="12" fill="#065f46" />
              </svg>
            </div>

            {/* Thảm Picnic */}
            <div className="absolute bottom-[12%] left-[50%] transform -translate-x-1/2 w-72 md:w-[28rem] h-32 md:h-40 z-10" style={{ perspective: '800px' }}>
              <div 
                className="w-full h-full rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-red-950/60"
                style={{
                  transform: 'rotateX(65deg)',
                  backgroundColor: '#7f1d1d',
                  backgroundImage: `
                    linear-gradient(90deg, rgba(69, 10, 10, 0.6) 50%, transparent 50%),
                    linear-gradient(rgba(69, 10, 10, 0.6) 50%, transparent 50%)
                  `,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>

            {/* Hai gấu đứng trên thảm & Stickers */}
            <div className="absolute bottom-[18%] left-[50%] transform -translate-x-1/2 flex items-end gap-1 text-5xl md:text-7xl z-20 drop-shadow-2xl">
              <span className="transform rotate-6">🐻</span>
              <span className="transform -rotate-6">🐻‍❄️</span>
              
              {/* Floating Heart Sticker */}
              <motion.span 
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-4xl drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >💖</motion.span>
              
              {/* Rose & Wine Stickers */}
              <span className="absolute -left-12 bottom-2 text-3xl drop-shadow-lg">🌹</span>
              <span className="absolute -right-12 bottom-2 text-3xl drop-shadow-lg">🍷</span>
              <span className="absolute -right-4 -bottom-6 text-2xl drop-shadow-lg">✨</span>
              <span className="absolute -left-4 -bottom-4 text-2xl drop-shadow-lg">✨</span>
            </div>

            {/* Radio */}
            <div className="absolute bottom-[17%] left-[62%] md:left-[56%] text-amber-100 drop-shadow-[0_0_20px_rgba(253,230,138,0.6)] z-20">
              <Radio size={32} className="animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- UI CONTAINER (Notes & Buttons) --- */}
      <div className="relative z-[65] flex flex-col items-center justify-center w-full h-full p-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="pointer-events-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] font-medium">
                A Midnight Ride
              </h1>
              <button
                onClick={handleStart}
                className="px-10 py-4 text-sm md:text-base font-bold text-white uppercase tracking-[0.2em] border-2 border-white/40 rounded-full hover:bg-white/20 hover:border-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-md"
              >
                Bật nhạc và Đón em
              </button>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="pointer-events-auto bg-slate-900/70 backdrop-blur-xl border border-white/30 p-10 md:p-14 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-lg w-full text-center"
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-10 text-white leading-relaxed tracking-wide font-medium drop-shadow-md">
                "Xin quyền truy cập vào cuộc đời"
              </h2>
              <div className="flex justify-center gap-6 relative h-12">
                <button
                  onClick={handleAgree1}
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full tracking-widest uppercase text-xs font-bold transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Đồng ý
                </button>
                <motion.button
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  className="px-8 py-3 bg-transparent text-white/70 border border-white/20 rounded-full tracking-widest uppercase text-xs font-semibold transition-colors duration-500"
                >
                  Không đồng ý
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="pointer-events-auto bg-slate-900/70 backdrop-blur-xl border border-white/30 p-10 md:p-14 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-lg w-full text-center"
            >
              <p className="text-xl md:text-2xl font-serif font-medium leading-relaxed mb-10 text-white italic drop-shadow-md">
                "Cảm ơn em đã đồng ý. Anh hứa cam kết không làm em đau, nguyện bị thương và chịu phạt nếu làm sai."
              </p>
              <div className="flex justify-center gap-6 relative h-12">
                <button
                  onClick={handleAgree2}
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full tracking-widest uppercase text-xs font-bold transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Đồng ý
                </button>
                <motion.button
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  onMouseEnter={handleNoHover}
                  onClick={handleNoHover}
                  className="px-8 py-3 bg-transparent text-white/70 border border-white/20 rounded-full tracking-widest uppercase text-xs font-semibold transition-colors duration-500"
                >
                  Không đồng ý
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-[20%] left-[10%] w-[100px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
        style={{ transform: 'rotate(-45deg)' }}
        animate={{ x: [0, 500], y: [0, 500], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[10%] left-[60%] w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
        style={{ transform: 'rotate(-45deg)' }}
        animate={{ x: [0, 600], y: [0, 600], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 7, ease: "linear", delay: 2 }}
      />
    </div>
  );
}

function Moon({ phase }: { phase: number }) {
  const isFinal = phase === 4;
  return (
    <motion.div
      className="absolute z-0 rounded-full bg-amber-50"
      initial={{ top: '15%', right: '15%', width: 100, height: 100 }}
      animate={{
        top: isFinal ? '20%' : '15%',
        right: isFinal ? '50%' : '15%',
        width: isFinal ? 300 : 100,
        height: isFinal ? 300 : 100,
        x: isFinal ? '50%' : 0,
        boxShadow: isFinal 
          ? '0 0 200px rgba(253,230,138,0.4), inset 0 0 60px rgba(253,230,138,0.8)' 
          : '0 0 80px rgba(253,230,138,0.2)'
      }}
      transition={{ duration: 4, ease: "easeInOut" }}
    />
  );
}

function Fireflies() {
  const flies = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 50}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
  }));

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {flies.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-amber-200 shadow-[0_0_12px_rgba(253,230,138,0.9)]"
          style={{ left: f.left, bottom: f.bottom, width: f.size, height: f.size }}
          animate={{ 
            y: [0, -30, 0], 
            x: [0, 15, -15, 0], 
            opacity: [0, 0.8, 0] 
          }}
          transition={{ 
            duration: f.duration, 
            repeat: Infinity, 
            delay: f.delay, 
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
}

function PineHill({ phase }: { phase: number }) {
  // Move the hill slightly down during driving to simulate camera pan
  const yOffset = phase === 3 ? '5%' : '0%';

  return (
    <motion.div 
      className="absolute bottom-0 left-0 w-full h-[55%] z-10 pointer-events-none overflow-hidden"
      animate={{ y: yOffset }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      {/* Fog/Mist Layer at the very bottom to blend with letterbox */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black via-black/80 to-transparent z-30"></div>

      {/* Layer 1 (Back hill) */}
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full object-cover opacity-40" preserveAspectRatio="none">
        <path fill="#020617" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      
      {/* Layer 2 (Front hill) */}
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-[80%] object-cover opacity-80" preserveAspectRatio="none">
        <path fill="#0f172a" d="M0,128L60,149.3C120,171,240,213,360,213.3C480,213,600,171,720,165.3C840,160,960,192,1080,202.7C1200,213,1320,203,1380,197.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg>

      {/* Trees */}
      <div className="absolute bottom-0 w-full h-full">
        {/* Back trees */}
        <Tree left="2%" bottom="32%" scale={0.5} color="#020617" />
        <Tree left="8%" bottom="30%" scale={0.6} color="#020617" />
        <Tree left="15%" bottom="34%" scale={0.4} color="#020617" />
        <Tree left="25%" bottom="35%" scale={0.5} color="#020617" />
        <Tree left="35%" bottom="31%" scale={0.6} color="#020617" />
        <Tree left="45%" bottom="33%" scale={0.4} color="#020617" />
        <Tree left="60%" bottom="36%" scale={0.5} color="#020617" />
        <Tree left="70%" bottom="32%" scale={0.6} color="#020617" />
        <Tree left="80%" bottom="32%" scale={0.7} color="#020617" />
        <Tree left="88%" bottom="35%" scale={0.4} color="#020617" />
        <Tree left="95%" bottom="28%" scale={0.5} color="#020617" />
        
        {/* Mid trees */}
        <Tree left="5%" bottom="20%" scale={0.7} color="#060b14" />
        <Tree left="12%" bottom="22%" scale={0.8} color="#060b14" />
        <Tree left="22%" bottom="18%" scale={0.7} color="#060b14" />
        <Tree left="32%" bottom="24%" scale={0.9} color="#060b14" />
        <Tree left="42%" bottom="20%" scale={0.8} color="#060b14" />
        <Tree left="65%" bottom="22%" scale={0.7} color="#060b14" />
        <Tree left="75%" bottom="19%" scale={0.8} color="#060b14" />
        <Tree left="85%" bottom="23%" scale={0.7} color="#060b14" />
        <Tree left="92%" bottom="18%" scale={0.8} color="#060b14" />

        {/* Front trees */}
        <Tree left="0%" bottom="10%" scale={1.0} color="#0f172a" />
        <Tree left="18%" bottom="10%" scale={1.1} color="#0f172a" />
        <Tree left="30%" bottom="12%" scale={0.9} color="#0f172a" />
        <Tree left="70%" bottom="12%" scale={1.2} color="#0f172a" />
        <Tree left="85%" bottom="8%" scale={1.0} color="#0f172a" />
        <Tree left="98%" bottom="10%" scale={1.1} color="#0f172a" />
      </div>
    </motion.div>
  );
}

function Tree({ left, bottom, scale, color }: { left: string, bottom: string, scale: number, color: string }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left, bottom, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
      <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-transparent" style={{ borderBottomColor: color, marginBottom: '-20px' }}></div>
      <div className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-transparent" style={{ borderBottomColor: color, marginBottom: '-20px' }}></div>
      <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] border-transparent" style={{ borderBottomColor: color }}></div>
      <div className="w-[8px] h-[15px] bg-black"></div>
    </div>
  );
}
