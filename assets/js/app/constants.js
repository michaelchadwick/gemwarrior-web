/* constants */
/* set any global constants */
/* eslint-disable no-unused-vars */

const GW_SETTINGS_KEY = 'gemwarrior-settings'
const GW_STATE_KEY = 'gemwarrior-state'

const GW_ENV_PROD_URL = [
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
    'player': {
      'level': 1,
      'xp': 0,
      'hp': 10,
      'rox': 2,
      'status': 'standing',
      'inventory': [
        'broken flashlight',
        'candlestick holder'
      ]
    },
    'avatarWorker': null,
    'blinker': null,
    'history': [],
    'historyMarker': 0,
    'keyCommand': '',
    'soundInterval': null,
    'synth_bgm': null,
    'synth_fx': null,
    'text': ''
  },
  'settings': {
    'textSize': '16',
    'playSound': false,
    'showAvatar': true
  }
}
