class ExplainerVideo extends HTMLElement {
  constructor({ width = 560, height = 315, autoPlay = true } = {}) {
    super();
    
    const shadow = this.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.backgroundColor = '#2d3748';
    container.style.borderRadius = '8px';
    container.style.overflow = 'hidden';
    
    // Create canvas for animation
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    
    shadow.appendChild(container);
    
    // Simple animation demo - will be replaced with actual video scenes
    const ctx = canvas.getContext('2d');
    let frame = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw pulsing Testeranto logo
      ctx.fillStyle = '#4299e1';
      const size = 100 + Math.sin(frame * 0.05) * 20;
      ctx.beginPath();
      ctx.arc(width/2, height/2, size, 0, Math.PI * 2);
      ctx.fill();
      
      frame++;
      if (autoPlay) requestAnimationFrame(animate);
    };
    
    animate();
  }
}

customElements.define('explainer-video', ExplainerVideo);
