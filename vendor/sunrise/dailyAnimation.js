let animationInterval;
const ANIMATION_DURATION = 10000; // 10 seconds
let animationStartTime;

function startDailyAnimation() {
  stopDailyAnimation(); // Clear any existing animation
  
  animationStartTime = Date.now();
  animationInterval = setInterval(updateDailyAnimation, 16); // ~60fps
  
  // Initialize sun at bottom position
  updateSunPosition(0);
}

function stopDailyAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

function updateDailyAnimation() {
  const elapsed = Date.now() - animationStartTime;
  const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;
  
  // Use sine wave for smooth up-down movement
  const position = 0.5 - Math.cos(progress * Math.PI * 2) * 0.5;
  updateSunPosition(position);
}

function updateSunPosition(normalizedPosition) {
  // normalizedPosition is 0-1 where 0=bottom, 1=top
  const body = document.body;
  const height = body.clientHeight;
  const yPos = height * (1 - normalizedPosition); // Invert since y=0 is top
  
  // Update all sun-related elements
  const elements = [
    'sun', 'sunDay', 'sunSet', 'waterReflectionMiddle'
  ];
  
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.background = el.style.background.replace(
        /radial-gradient\([^)]+\)/,
        `radial-gradient(${body.clientWidth/2}px ${yPos}px, circle, ${getGradientColors(id, normalizedPosition)})`
      );
    }
  });
  
  // Update darkness overlay based on position
  const darkness = document.getElementById('darknessOverlay');
  if (darkness) {
    darkness.style.opacity = Math.min(normalizedPosition, 0.7);
  }
  
  // Update water reflection perspective
  const reflection = document.getElementById('waterReflectionContainer');
  if (reflection) {
    reflection.style.perspectiveOrigin = `50% ${-15 + (normalizedPosition * 30)}%`;
  }
}

function getGradientColors(elementId, position) {
  // Simplified gradient colors that change based on sun position
  switch(elementId) {
    case 'sun':
      return `rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%,rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%`;
    case 'sunDay':
      return `rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%,rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%`;
    case 'sunSet':
      return position > 0.5 
        ? `rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%,rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%`
        : `rgba(254,255,255,0.0) 5%,rgba(236,255,0,0) 10%,rgba(253,50,41,0) 25%,rgba(243,0,0,0) 40%,rgba(93,0,0,0) 100%`;
    case 'waterReflectionMiddle':
      return position > 0.5
        ? `rgba(247,177,72,1) 3%,rgba(248,175,65,1) 6%,rgba(207,62,30,0.4) 35%,rgba(176,91,48,0.1) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%`
        : `rgba(247,177,72,0) 3%,rgba(248,175,65,0) 6%,rgba(207,62,30,0) 35%,rgba(176,91,48,0) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%`;
  }
}

// Export for testing/access
window.dailyAnimation = {
  start: startDailyAnimation,
  stop: stopDailyAnimation
};
