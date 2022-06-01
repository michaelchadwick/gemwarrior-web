/* dom */
/* grab references to dom elements */
/* global $, GemWarrior */

// DOM > main divs/elements
GemWarrior.dom = {
  "navOverlay": $('#nav-overlay'),
  "navContent": ('$nav-content'),
  "userInput": $('#userInput'),
  "output": $('#output'),
  "interface": $('#interface'),
  "stats": $('#interface #stats'),
  "statsLV": $('#interface #stats #level'),
  "statsXP": $('#interface #stats #xp'),
  "statsROX": $('#interface #stats #rox'),
  "statsHP": $('#interface #stats #hp'),
  "statsLOC": $('#interface #location #loc'),
  "keyboardInput": $('#keyboard-input')
}

// DOM > interactive elements
GemWarrior.dom.interactive = {
  "btnNav": $('#button-nav'),
  "btnNavClose": $('#button-nav-close'),
  "btnHelp": $('#button-help'),
  "btnSettings": $('#button-settings')
}
