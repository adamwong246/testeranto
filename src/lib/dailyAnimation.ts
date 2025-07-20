// type AnimationElement = 'sun' | 'sunDay' | 'sunSet' | 'waterReflectionMiddle';

// let animationInterval: NodeJS.Timeout | null = null;
// const ANIMATION_DURATION = 60000; // 60 seconds
// let animationStartTime: number;

// export function startDailyAnimation(): void {
//   stopDailyAnimation(); // Clear any existing animation

//   animationStartTime = Date.now();
//   animationInterval = setInterval(() => {
//     updateDailyAnimation();
//   }, 1000); // Update every second

//   // Initialize sun at bottom position
//   updateSunPosition(0);
// }

// export function stopDailyAnimation(): void {
//   if (animationInterval) {
//     clearInterval(animationInterval);
//     animationInterval = null;
//   }
// }

// function updateDailyAnimation(): void {
//   const elapsed = Date.now() - animationStartTime;
//   const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;

//   // Use sine wave for smooth up-down movement
//   const position = 0.5 - Math.cos(progress * Math.PI * 2) * 0.5;

//   // Calculate target position for smooth interpolation
//   const targetYPos = document.body.clientHeight * (1 - position);

//   // Update all elements at once
//   updateSunPosition(position);
// }

// function updateSunPosition(normalizedPosition: number): void {
//   // normalizedPosition is 0-1 where 0=bottom, 1=top
//   const body = document.body;
//   const height = body.clientHeight;
//   const yPos = height * (1 - normalizedPosition); // Invert since y=0 is top
//   const width = body.clientWidth;

//   // Update all sun-related elements
//   const elements: AnimationElement[] = [
//     'sun', 'sunDay', 'sunSet', 'waterReflectionMiddle'
//   ];

//   elements.forEach(id => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.style.background = el.style.background.replace(
//         /radial-gradient\([^)]+\)/,
//         `radial-gradient(${width/2}px ${yPos}px, circle, ${getGradientColors(id, normalizedPosition)})`
//       );
//     }
//   });

//   // Update water reflection position
//   const reflectionContainer = document.getElementById('waterReflectionContainer');
//   const reflectionMiddle = document.getElementById('waterReflectionMiddle');
//   if (reflectionContainer && reflectionMiddle) {
//     reflectionContainer.style.perspectiveOrigin = `${(width/2)/width * 100}% ${-15 + (normalizedPosition * 30)}%`;
//     reflectionMiddle.style.left = `${(width/2) - width - (width * 0.03)}px`;
//   }

//   // Update opacity of various elements based on sun position
//   const darknessOverlay = document.getElementById('darknessOverlay');
//   const darknessOverlaySky = document.getElementById('darknessOverlaySky');
//   const moon = document.getElementById('moon');
//   const horizonNight = document.getElementById('horizonNight');
//   const starsContainer = document.getElementById('starsContainer');
//   const waterDistance = document.getElementById('waterDistance');
//   const sunDay = document.getElementById('sunDay');
//   const sky = document.getElementById('sky');
//   const sunSet = document.getElementById('sunSet');
//   const sun = document.getElementById('sun');
//   const horizon = document.getElementById('horizon');

//   if (darknessOverlay) {
//     darknessOverlay.style.opacity = Math.min((yPos - (height / 2)) / (height / 2), 1).toString();
//   }
//   if (darknessOverlaySky) {
//     darknessOverlaySky.style.opacity = Math.min((yPos - (height * 7 / 10)) / (height - (height * 7 / 10)), 1).toString();
//   }
//   if (moon) {
//     moon.style.opacity = Math.min((yPos - (height * 9 / 10)) / (height - (height * 9 / 10)), 0.65).toString();
//   }
//   if (horizonNight) {
//     horizonNight.style.opacity = ((yPos - (height * 4 / 5)) / (height - (height * 4 / 5))).toString();
//   }
//   if (starsContainer) {
//     starsContainer.style.opacity = (yPos / height - 0.6).toString();
//   }
//   if (waterDistance) {
//     waterDistance.style.opacity = (yPos / height + 0.6).toString();
//   }
//   if (sunDay) {
//     sunDay.style.opacity = (1 - yPos / height).toString();
//   }
//   if (sky) {
//     sky.style.opacity = Math.min((1 - yPos / height), 0.99).toString();
//   }
//   if (sunSet) {
//     sunSet.style.opacity = (yPos / height - 0.2).toString();
//   }

//   // Update stars opacity
//   const stars = document.getElementsByClassName('star');
//   for (let i = 0; i < stars.length; i++) {
//     (stars[i] as HTMLElement).style.opacity = (yPos / height - 0.6).toString();
//   }

//   // Update sun and horizon based on position
//   if (yPos > height / 2) {
//     if (sun) sun.style.opacity = Math.min((height - yPos) / (height / 2) + 0.2, 0.5).toString();
//     if (horizon) horizon.style.opacity = ((height - yPos) / (height / 2) + 0.2).toString();
//     if (reflectionMiddle) reflectionMiddle.style.opacity = ((height - yPos) / (height / 2) - 0.1).toString();
//   } else {
//     if (horizon) horizon.style.opacity = Math.min(yPos / (height / 2), 0.99).toString();
//     if (sun) sun.style.opacity = Math.min(yPos / (height / 2), 0.5).toString();
//     if (reflectionMiddle) reflectionMiddle.style.opacity = (yPos / (height / 2) - 0.1).toString();
//   }
// }

// function getGradientColors(elementId: AnimationElement, position: number): string {
//   // Simplified gradient colors that change based on sun position
//   switch(elementId) {
//     case 'sun':
//       return `rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%,rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%`;
//     case 'sunDay':
//       return `rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%,rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%`;
//     case 'sunSet':
//       return position > 0.5
//         ? `rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%,rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%`
//         : `rgba(254,255,255,0.0) 5%,rgba(236,255,0,0) 10%,rgba(253,50,41,0) 25%,rgba(243,0,0,0) 40%,rgba(93,0,0,0) 100%`;
//     case 'waterReflectionMiddle':
//       return position > 0.5
//         ? `rgba(247,177,72,1) 3%,rgba(248,175,65,1) 6%,rgba(207,62,30,0.4) 35%,rgba(176,91,48,0.1) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%`
//         : `rgba(247,177,72,0) 3%,rgba(248,175,65,0) 6%,rgba(207,62,30,0) 35%,rgba(176,91,48,0) 45%,rgba(141,88,47,0.0) 60%,rgba(116,82,63,0.0) 70%,rgba(44,65,68,0.0) 80%,rgba(7,19,31,0.0) 100%`;
//     default:
//       return '';
//   }
// }
