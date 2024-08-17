// GemWarrior object init
if (typeof GemWarrior === 'undefined') {
  var GemWarrior = {}
}

const GW_ENV_PROD_URL = ['gemwarrior.com', 'gemwarrior.neb.host', 'gw.neb.host']

GemWarrior.env = GW_ENV_PROD_URL.includes(document.location.hostname)
  ? 'prod'
  : 'local'

GemWarrior._logStatus = function (msg, arg = null) {
  if (GemWarrior.env == 'local') {
    if (arg) {
      console.log(msg, arg)
    } else {
      console.log(msg)
    }
  }
}

GemWarrior._logStatus('[LOADED] /GemWarrior')
