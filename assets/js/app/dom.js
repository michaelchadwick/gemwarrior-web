/* /assets/js/app/dom.js */
/* grab references to dom elements */
/* global GemWarrior */

// DOM > main divs/elements
GemWarrior.dom = {
  'navOverlay': document.getElementById('nav-overlay'),
  'navContent': document.getElementById('nav-content'),
  'header': document.querySelector('header'),
  'logContainer': document.getElementById('log-container'),
  'output': document.getElementById('output'),
  'btnNav': document.getElementById('button-nav'),
  'btnNavClose': document.getElementById('button-nav-close'),
  'btnHelp': document.getElementById('button-help'),
  'btnFeedback': document.getElementById('button-feedback'),
  'btnSettings': document.getElementById('button-settings'),
  'interface': document.getElementById('interface'),
  'cmdInput': document.getElementById('command-input'),
  'cliForm': document.querySelector('#cli form'),
  'keyboard': document.getElementById('keyboard'),
  'keyboardButtons': document.querySelectorAll('#keyboard button'),
  'keyboardInput': document.getElementById('keyboard-input'),
  'stats': document.getElementById('stats'),
  'statsNM': document.getElementById('name'),
  'statsLV': document.getElementById('level'),
  'statsXP': document.getElementById('xp'),
  'statsROX': document.getElementById('rox'),
  'statsHP': document.getElementById('hp'),
  'statsLOC': document.getElementById('loc'),
  'avatar': document.getElementById('avatar')
}

console.log('[LOADED] /app/dom')
