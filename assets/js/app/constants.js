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

const GW_WORLD_JSON = '/assets/data/ihot.json'

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
    'player': {
      'hp': 10,
      'inventory': [
        'broken flashlight',
        'candlestick holder'
      ],
      'inventory_checks': 0,
      'level': 1,
      'rox': 2,
      'status': 'standing',
      'xp': 0
    },
    'soundInterval': null,
    'synth_bgm': null,
    'synth_sfx': null,
    'text': ''
  },
  'settings': {
    'enableSound': false,
    'firstTime': true,
    'showAvatar': true,
    'soundBGMLevel': 10,
    'soundSFXLevel': 20,
    'textSize': '16'
  }
}

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'

// settings: saved in LOCAL STORAGE
GemWarrior.settings = {...GW_DEFAULTS.settings}

// config: only saved while game is loaded
GemWarrior.config = {...GW_DEFAULTS.config}
