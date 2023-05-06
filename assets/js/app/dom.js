/* /assets/js/app/dom.js */
/* grab references to dom elements */
/* global $, GemWarrior */

// DOM > main divs/elements
GemWarrior.dom = {
  'navOverlay': $('#nav-overlay'),
  'navContent': ('$nav-content'),
  'output': $('#output'),
  'interface': $('#interface'),
  'interactive': {
    'btnNav': $('#button-nav'),
    'btnNavClose': $('#button-nav-close'),
    'btnHelp': $('#button-help'),
    'btnSettings': $('#button-settings'),
    'cmdInput': $('#command-input'),
    'keyboard': $('#keyboard'),
    'keyboardInput': $('#keyboard-input')
  },
  'stats': $('#interface #stats'),
  'statsNM': $('#interface #stats #name'),
  'statsLV': $('#interface #stats #level'),
  'statsXP': $('#interface #stats #xp'),
  'statsROX': $('#interface #stats #rox'),
  'statsHP': $('#interface #stats #hp'),
  'statsLOC': document.querySelector('#interface #location #loc'),
  'avatar': $('#interface #avatar')
}

console.log('[LOADED] /app/dom')
