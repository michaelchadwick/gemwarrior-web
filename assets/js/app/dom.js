/* dom */
/* grab references to dom elements */
/* global $, GemWarrior */

// DOM > main divs/elements
GemWarrior.dom = {
  'navOverlay': $('#nav-overlay'),
  'navContent': ('$nav-content'),
  'output': $('#output'),
  'interface': $('#interface'),
  'interactive': {},
  'stats': $('#interface #stats'),
  'statsLV': $('#interface #stats #level'),
  'statsXP': $('#interface #stats #xp'),
  'statsROX': $('#interface #stats #rox'),
  'statsHP': $('#interface #stats #hp'),
  'statsLOC': document.querySelector('#interface #location #loc'),
  'avatar': $('#interface #avatar')
}

// DOM > interactive elements
GemWarrior.dom.interactive = {
  'btnNav': $('#button-nav'),
  'btnNavClose': $('#button-nav-close'),
  'btnHelp': $('#button-help'),
  'btnSettings': $('#button-settings'),
  'cmdInput': $('#command-input'),
  'keyboard': $('#keyboard'),
  'keyboardInput': $('#keyboard-input')
}
