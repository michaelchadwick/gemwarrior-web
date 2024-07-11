class Creature extends Entity {
  constructor() {
    super()

    this.name = 'creature'
    this.description = 'A creature.'
    this.face = 'face-y'
    this.hands = 'handsy'
    this.mood = 'moody'
    this.level = 1
    this.xp = 0
    this.hp_cur = 10
    this.hp_max = 10
    this.atk_lo = 1
    this.atk_hi = 1
    this.defense = 1
    this.dexterity = 1
    this.inventory = new Inventory([])
    this.talkable = true
    this.used = false

    // console.log('[LOADED] /app/lib/entities/creature')
  }

  describe() {
    return this.description
  }

  use() {
    return 'That creature does not seem to want to talk to you right now.'
  }
}
