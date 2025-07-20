import React, { useEffect, useState, useRef } from 'react';

interface SunriseAnimationProps {
  active: boolean;
}

const SunriseAnimation = ({ active }: SunriseAnimationProps) => {
  const [position, setPosition] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation timing parameters
  const ANIMATION_DURATION = 10000; //30000; // 30 seconds for full day/night cycle
  const UPDATE_INTERVAL = 50; // Update every 50ms (~20fps)

  useEffect(() => {
    if (!active) {
      // Clean up animation frame if active becomes false
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    console.log('Starting animation with duration:', ANIMATION_DURATION, 'ms');
    
    let startTime = performance.now();
    let lastUpdateTime = 0;

    const animate = (timestamp: number) => {
      if (!active) return;

      const elapsed = (timestamp - startTime) % ANIMATION_DURATION;
      const progress = elapsed / ANIMATION_DURATION;

      // Only update if enough time has passed since last update
      if (timestamp - lastUpdateTime >= UPDATE_INTERVAL) {
        // Use cosine for smooth transition from -1 to 1 over full duration
        const newPos = Math.cos(progress * Math.PI * 2);
        setPosition(newPos);
        lastUpdateTime = timestamp;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [active]);

  const yPos = dimensions.height * (1 - position);
  const normalizedPos = (position + 1) / 2; // Convert from [-1,1] to [0,1]

  if (!active) return null;

  return (
    <div id="sunrise" style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'transparent',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* Background Overlay */}
      <div id="daily-bg" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: -1001
      }} />

      Stars Container
      <div
        id="starsContainer"
        style={{
          perspective: 350,
          perspectiveOrigin: '50% 300%',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: '-50%',
          width: '200%',
          height: '50%',
          zIndex: -1000,
          opacity: Math.max(0, 0.5 - normalizedPos * 0.5)
        }}
      >
        <div
          id="stars"
          style={{
            backgroundRepeat: 'repeat',
            position: 'absolute',
            width: '200%',
            height: '200%',
            left: '-50%',
            bottom: 0,
            opacity: 0.5,
            transform: 'rotateX(-90deg)'
          }}
        />
      </div>

      {/* Sun Elements */}
      <div
        id="sun"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${yPos}px)`,
          width: '100%',
          height: '50%',
          background: `radial-gradient(50% ${yPos}px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%,rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)`,
          zIndex: -900,
          opacity: 0.5
        }}
      />

      <div
        id="sunDay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: `radial-gradient(50% ${yPos}px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%,rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)`,
          zIndex: -800,
          opacity: Math.max(0, 1 - yPos / dimensions.height)
        }}
      />

      <div
        id="sunSet"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: `radial-gradient(50% ${yPos}px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%,rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)`,
          zIndex: -800,
          opacity: Math.max(0, yPos / dimensions.height - 0.2)
        }}
      />

      {/* Sky and Horizon */}
      <div
        id="sky"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: -700,
          background: 'linear-gradient(to top, rgba(249,251,240,1) 10%,rgba(215,253,254,1) 20%,rgba(167,222,253,1) 40%,rgba(110,175,255,1) 100%)',
          opacity: Math.max(0, 1 - yPos / dimensions.height)
        }}
      />

      <div
        id="horizon"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(to top, rgba(212,87,43,0.9) 0%,rgba(246,149,52,0.8) 20%,rgba(24,75,106,0) 100%)',
          zIndex: -700,
          opacity: Math.max(0, yPos > dimensions.height / 2
            ? (dimensions.height - yPos) / (dimensions.height / 2) + 0.2
            : yPos / (dimensions.height / 2))
        }}
      />

      <div
        id="horizonNight"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(to top, rgba(57,167,255,1) 0%,rgba(13,98,245,1) 20%,rgba(0,11,22,0.1) 60%)',
          zIndex: -600,
          opacity: Math.max(0, (yPos - (dimensions.height * 4 / 5)) / (dimensions.height - (dimensions.height * 4 / 5)))
        }}
      />

      {/* Moon */}
      <div
        id="moon"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'radial-gradient(40% 55%, circle, rgba(249,249,250,1) -1%,rgba(189,255,254,1) 1%,rgba(8,49,78,1) 1%,rgba(8,26,56,1) 10%,rgba(4,16,46,1) 40%,rgba(2,8,13,1) 70%)',
          zIndex: -500,
          opacity: Math.max(0, (yPos - (dimensions.height * 9 / 10)) / (dimensions.height - (dimensions.height * 9 / 10)))
        }}
      />

      {/* Water Elements */}
      <div
        id="water"
        style={{
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,25,45,1) 0%,rgba(14,71,117,1) 35%,rgba(26,126,174,1) 70%,rgba(62,168,220,1) 100%)',
          zIndex: -400
        }}
      />

      <div
        id="waterReflectionContainer"
        style={{
          perspective: 30,
          perspectiveOrigin: `50% ${-15 + (normalizedPos * 30)}%`,
          overflow: 'hidden',
          position: 'absolute',
          top: '50%',
          left: '-3%',
          width: '103%',
          height: '50%',
          zIndex: -300,
          transform: `translateY(${dimensions.height - yPos}px)`
        }}
      >
        <div
          id="waterReflectionMiddle"
          style={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '200%',
            height: '55%',
            background: 'radial-gradient(50% 0px, rgba(247,177,72,1) 3%,rgba(248,175,65,1) 6%,rgba(207,62,30,0.4) 35%,rgba(176,91,48,0.1) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%)',
            zIndex: -200,
            opacity: Math.max(0, yPos > dimensions.height / 2
              ? (dimensions.height - yPos) / (dimensions.height / 2) - 0.1
              : yPos / (dimensions.height / 2) - 0.1),
            transform: 'rotateX(45deg)'
          }}
        />
      </div>

      <div
        id="waterDistance"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.0) 10%,rgba(0,0,0,0.20) 44%,rgba(0,0,0,0.65) 95%,rgba(0,0,0,0.62) 100%)',
          zIndex: -100,
          opacity: Math.max(0, yPos / dimensions.height + 0.6)
        }}
      />

      {/* Darkness Overlays */}
      <div
        id="darknessOverlaySky"
        style={{
          backgroundColor: '#000',
          opacity: Math.max(0, (yPos - (dimensions.height * 7 / 10)) / (dimensions.height - (dimensions.height * 7 / 10))),
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: -50
        }}
      />

      <div
        id="darknessOverlay"
        style={{
          backgroundColor: '#000',
          opacity: Math.max(0, (yPos - (dimensions.height / 2)) / (dimensions.height / 2)),
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: -5
        }}
      />

      {/* Ocean Ripple */}
      <div
        id="oceanRipple"
        style={{
          backgroundImage: 'repeating-linear-gradient(175deg, rgba(165,165,165,0.08) 43%,rgba(175,175,175,0.08) 45%,rgba(235,235,235,0.08) 49%,rgba(195,195,195,0.08) 50%,rgba(165,165,165,0.08) 54%)',
          opacity: 0.5,
          position: 'absolute',
          left: '0%',
          bottom: 0,
          width: '100%',
          height: '50%',
          zIndex: -10
        }}
      />
    </div>
  );
};

export default SunriseAnimation;
