import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint } from 'lucide-react';

interface HeroProps {
  onScrollToDashboard: () => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const Hero: React.FC<HeroProps> = ({ onScrollToDashboard }) => {
  const inlineIconStyle: React.CSSProperties = {
    color: '#192837',
    display: 'inline',
    verticalAlign: 'middle',
    position: 'relative',
    top: -2,
    margin: '0 4px',
  };

  const fingerprintStyle: React.CSSProperties = {
    ...inlineIconStyle,
    margin: 0,
    marginLeft: 6,
  };

  return (
    <section
      className="relative z-10 mx-auto"
      style={{
        maxWidth: 1280,
        paddingTop: 'clamp(40px, 8vw, 72px)',
        paddingBottom: 48,
      }}
    >
      <div
        className="mx-auto flex flex-col items-center px-5"
        style={{ maxWidth: 660 }}
      >
        {/* Animated Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.65rem, 5vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: 'var(--color-text)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            Lock <Zap size={24} style={inlineIconStyle} /> Down Your <LockKeyhole size={24} style={inlineIconStyle} /> Passwords
          </span>
          <br />
          with Ironclad Security <Fingerprint size={24} style={fingerprintStyle} />
        </motion.h1>

        {/* Animated Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'var(--color-text)',
            maxWidth: 560,
            lineHeight: 1.65,
            textAlign: 'center',
            margin: '20px auto 0',
          }}
        >
          <span style={{ opacity: 0.8 }}>
            Zero stress, total control. Unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
          </span>
        </motion.p>

        {/* Animated CTA Button */}
        <motion.button
          type="button"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center justify-between text-white font-semibold cursor-pointer"
          style={{
            borderRadius: 50,
            backgroundColor: '#7342E2',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            padding: '17px 24px',
            minWidth: 210,
            boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
            gap: 32,
            border: 'none',
            marginTop: 32,
          }}
          onClick={onScrollToDashboard}
        >
          <span>Get It Free</span>
          <ArrowRightCircle size={20} />
        </motion.button>
      </div>
    </section>
  );
};
