/* /assets/js/app/lib/constants/general.js */
/* general global constants */
/* eslint-disable no-unused-vars */

const GW_SETTINGS_KEY = 'gemwarrior-settings'
const GW_WORLD_KEY = 'gemwarrior-world'

const GW_ENV_PROD_URL = [
  'gemwarrior.com',
  'gemwarrior.neb.host',
  'gw.neb.host'
]

const GW_WORKER_JS_URL = '/assets/js/app/worker.js'
const GW_WORLD_IHOT_JSON_URL = '/assets/data/world/ihot.json'
const GW_WORLD_JOOL_JSON_URL = '/assets/data/world/jool.json'
const GW_WORLD_IHOT_JOOL_JSON_URL = '/assets/data/world/ihot_jool.json'

const GW_IHOT_SW = { x: 0, y: 0, z:0 }
const GW_IHOT_EXIT_POINT = { x: 2, y: 2, z:0 }
const GW_IHOT_MAX_ROX = 10
const GW_SNAPBACK_DELAY = 500
const GW_NAME_LENGTH_MAX = 10

const GW_COMMANDS = {
  'self': [
    '(c)haracter',
    '(i)nventory',
    '(si)t',
    '(st)and',
    '(sl)eep'
  ],
  'travel': [
    '(g)o',
    '(n)orth',
    '(e)ast',
    '(s)outh',
    '(w)est'
  ],
  'action': [
    '(l)ook',
    '(g)et/(p)ickup/(t)ake',
    '(d)rop',
    '(u)se [with/on]'
  ],
  'meta': [
    '(h)elp',
    '(com)mands',
    '(hist)ory',
    '(ab)bout',
    '(ch)ange'
  ],
  'fx': [
    '(play)bgm',
    '(stop)bgm'
  ]
}

const GW_DEFAULTS = {
  'config': {
    'avatarWorker': null,
    'blinker': null,
    'debugMode': false,
    'keyCommand': '',
    'synthBGM': null,
    'synthSFX': null,
    'textOutput': '',
    'worldSave': true
  },
  'settings': {
    'enableAnimation': true,
    'enableSound': false,
    'enableTypewriter': false,
    'firstTime': true,
    'hasChangedName': false,
    'history': [],
    'historyMarker': 0,
    'showAvatar': true,
    'soundBGMLevel': 0.1,
    'soundSFXLevel': 0.2,
    'textSize': '16'
  }
}

const GW_DIRECTIONS = {
  North: 'north',
  East: 'east',
  South: 'south',
  West: 'west'
}

const GW_DANGER_LEVEL = {
  none: 0,
  low: 15,
  moderate: 30,
  high: 55,
  assured: 100
}

const CHAR_UPPER_POOL = [...Array(26)].map((val, i) => String.fromCharCode(i + 65))
const CHAR_LOWER_POOL = [...Array(26)].map((val, i) => String.fromCharCode(i + 97))
const CHAR_LOWER_VOWEL_POOL = ['a', 'e', 'i', 'o', 'u', 'y']

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'

const PROGRAM_NAME                          = 'Gem Warrior'

const LEVEL_UP_TEXT                         = '** LEVEL UP! **'
const REST_FULL_TEXT                        = '** HMMMM **'
const REST_NOT_FULL_TEXT                    = '** ZZZZZ **'

const VOWELS                                = 'aeiou'

const GW_ABOUT_TEXT = `<strong>${PROGRAM_NAME} (Web)</strong> was programmed by <a class='glow-transition' href='https://michaelchadwick.info' target='_blank'>Michael Chadwick</a>, an all right kind of person entity. This webapp is based on <a class='glow-transition' href='https://github.com/michaelchadwick/gemwarrior' target='_blank'>${PROGRAM_NAME}</a>, a <a class='glow-transition' href='https://rubygems.org' target='_blank'>Ruby gem</a> (because I was <em>really</em> into Ruby at some point and thought to myself "I should make a game. I guess I'll use the language I'm really into right now. I'm sure it's totally portable.")<br /><br />

<em><strong>Narrator</strong>: It actually wasn't very portable at all.</em>`
