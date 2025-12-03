#!/usr/bin/env node

import blessed from 'blessed';

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: 'Testeranto TUI',
  cursor: {
    artificial: true,
    shape: 'line',
    blink: true,
    color: 'white'
  }
});

// Create a menu box
const menuBox = blessed.list({
  top: 0,
  left: 0,
  width: '100%',
  height: '25%',
  label: ' Commands ',
  keys: true,
  vi: true,
  mouse: true,
  border: { type: 'line' },
  style: {
    selected: { bg: 'blue', fg: 'white' },
    item: { fg: 'white' },
    border: { fg: 'cyan' }
  },
  items: [
    'Run tests',
    'Build project',
    'Development mode',
    'Watch mode',
    'Exit'
  ]
});

// Create a log box for output
const logBox = blessed.log({
  top: '25%',
  left: 0,
  width: '100%',
  height: '65%',
  label: ' Output ',
  border: { type: 'line' },
  style: { 
    border: { fg: 'green' },
    scrollbar: { bg: 'yellow' }
  },
  scrollable: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollbar: {
    ch: ' ',
    track: { bg: 'gray' }
  }
});

// Create a status bar
const statusBar = blessed.box({
  top: '90%',
  left: 0,
  width: '100%',
  height: '10%',
  content: ' Status: Ready | Use arrow keys, Enter, q to quit ',
  style: { bg: 'magenta', fg: 'white' },
  border: { type: 'line' },
  align: 'center',
  valign: 'middle'
});

// Append elements to screen
screen.append(menuBox);
screen.append(logBox);
screen.append(statusBar);

// Handle menu selection
menuBox.on('select', (item, index) => {
  const commands = [
    { name: 'run', action: 'Running tests...' },
    { name: 'build', action: 'Building project...' },
    { name: 'dev', action: 'Starting development mode...' },
    { name: 'watch', action: 'Starting watch mode...' },
    { name: 'exit', action: 'Exiting...' }
  ];
  
  const selected = commands[index];
  logBox.log(`{cyan-fg}${new Date().toLocaleTimeString()}{/cyan-fg} ${selected.action}`);
  statusBar.setContent(` Status: Executing ${selected.name}... `);
  screen.render();
  
  if (selected.name === 'exit') {
    setTimeout(() => {
      process.exit(0);
    }, 500);
  } else {
    // Simulate some work
    setTimeout(() => {
      logBox.log(`{green-fg}${new Date().toLocaleTimeString()}{/green-fg} ${selected.name} completed.`);
      statusBar.setContent(' Status: Ready | Use arrow keys, Enter, q to quit ');
      screen.render();
    }, 1500);
  }
});

// Handle key events
screen.key(['q', 'C-c'], () => {
  process.exit(0);
});

// Focus on the menu
menuBox.focus();

// Initial render
screen.render();

// Handle screen resize
screen.on('resize', () => {
  screen.render();
});

// Handle errors
process.on('uncaughtException', (err) => {
  logBox.log(`{red-fg}Uncaught exception: ${err.message}{/red-fg}`);
  screen.render();
});

process.on('unhandledRejection', (reason, promise) => {
  logBox.log(`{red-fg}Unhandled rejection at: ${promise}, reason: ${reason}{/red-fg}`);
  screen.render();
});

// Cleanup on exit
process.on('exit', () => {
  screen.destroy();
});
