/* constants */
/* set any global constants */
/* eslint-disable no-unused-vars */

const GW_SETTINGS_KEY = 'gemwarrior-settings'
const GW_STATE_KEY = 'gemwarrior-state'

const GW_ENV_PROD_URL = [
  'gemwarrior.com',
  'gemwarrior.neb.host',
  'gw.neb.host'
]

const GW_WORKER_JS_URL = '/assets/js/app/lib/worker.js'
const GW_WORLD_IHOT_JSON_URL = '/assets/data/world/ihot.json'
const GW_WORLD_JOOL_JSON_URL = '/assets/data/world/jool.json'
const GW_WORLD_IHOT_JOOL_JSON_URL = '/assets/data/world/ihot_jool.json'

const GW_SNAPBACK_DELAY = 500

const GW_COMMANDS = {
  'travel': [
    '(g)o',
    '(n)orth',
    '(e)ast',
    '(s)outh',
    '(w)est'
  ],
  'self': [
    '(c)haracter',
    '(i)nventory'
  ],
  'action': [
    '(l)ook',
    '(p)ickup',
    '(t)ake',
    '(th)row',
    '(u)se',
    '(si)t',
    '(st)and',
    '(sl)eep'
  ],
  'meta': [
    '(h)elp',
    '(hist)ory',
    '(a)bout'
  ],
  'fx': [
    '(pl)ay bgm',
    'stopbgm',
  ]
}

const GW_DEFAULTS = {
  'config': {
    'avatarWorker': null,
    'blinker': null,
    'history': [],
    'historyMarker': 0,
    'keyCommand': '',
    'outText': '',
    'synth_bgm': null,
    'synth_sfx': null
  },
  'settings': {
    'enableSound': false,
    'firstTime': true,
    'showAvatar': true,
    'soundBGMLevel': 0.1,
    'soundSFXLevel': 0.2,
    'textSize': '16'
  }
}

const CHAR_UPPER_POOL = [...Array(26)].map((val, i) => String.fromCharCode(i + 65))
const CHAR_LOWER_POOL = [...Array(26)].map((val, i) => String.fromCharCode(i + 97))
const CHAR_LOWER_VOWEL_POOL = ['a', 'e', 'i', 'o', 'u', 'y']

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {...GW_DEFAULTS.settings}

// config: only saved while game is loaded
GemWarrior.config = {...GW_DEFAULTS.config}
