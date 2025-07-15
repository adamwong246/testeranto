# Official Color Palette

<div class="color-sampler">
  <div class="color-group">
    <h2>Primary Colors</h2>
    <div class="color-row">
      <div class="color-swatch" style="background-color: #ff6b6b; color: white;">
        <span class="hex">#ff6b6b</span>
        <span class="name">Coral Blush</span>
      </div>
      <div class="color-swatch" style="background-color: #4ecdc4; color: white;">
        <span class="hex">#4ecdc4</span>
        <span class="name">Mint Teal</span>
      </div>
      <div class="color-swatch" style="background-color: #E6B422; color: #292f36;">
        <span class="hex">#E6B422</span>
        <span class="name">Muted Gold</span>
      </div>
      <div class="color-swatch" style="background-color: #00B4A0; color: white;">
        <span class="hex">#00B4A0</span>
        <span class="name">Deep Teal</span>
      </div>
    </div>
  </div>

  <div class="color-group">
    <h2>Text & Background</h2>
    <div class="color-row">
      <div class="color-swatch" style="background-color: #292f36; color: white;">
        <span class="hex">#292f36</span>
        <span class="name">Midnight Ink</span>
      </div>
      <div class="color-swatch" style="background-color: #f1faee; color: #292f36;">
        <span class="hex">#f1faee</span>
        <span class="name">Pearl Mist</span>
      </div>
    </div>
  </div>

  <div class="color-group">
    <h2>Gradient Colors</h2>
    <div class="color-row">
      <div class="color-swatch" style="background-color: #0a0f1f; color: white;">
        <span class="hex">#0a0f1f</span>
        <span class="name">Deep Cosmos</span>
      </div>
      <div class="color-swatch" style="background-color: #1a2b50; color: white;">
        <span class="hex">#1a2b50</span>
        <span class="name">Twilight Navy</span>
      </div>
      <div class="color-swatch" style="background-color: #B07D85; color: white;">
        <span class="hex">#B07D85</span>
        <span class="name">Muted Rose</span>
      </div>
      <div class="color-swatch" style="background-color: #7fb3d5; color: white;">
        <span class="hex">#7fb3d5</span>
        <span class="name">Sky Whisper</span>
      </div>
    </div>
  </div>
</div>

<style>
.color-sampler {
  margin: 2rem 0;
  max-width: 800px;
}

.color-group {
  margin-bottom: 2rem;
}

.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.color-swatch {
  flex: 1;
  min-width: 150px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: translateY(-5px);
}

.hex {
  font-family: monospace;
  font-weight: bold;
  font-size: 1.1rem;
}

.name {
  font-style: italic;
  margin-top: 0.5rem;
}
</style>

## Usage Guidelines

- Use "Coral Blush" for primary actions and important elements
- "Mint Teal" works well for secondary actions and accents
- The gradient colors create the sunrise effect from dark to light
- "Muted Gold" and "Deep Teal" provide sophisticated accents
- "Midnight Ink" and "Pearl Mist" ensure good text contrast
