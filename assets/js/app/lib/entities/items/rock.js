class Rock extends Item {
  constructor() {
    super()

    this.name         = 'rock'
    this.description  = 'A small, yet quite sharp, sedimentary pebble, suitable for tossing in amusement, and perhaps commerce.'
  }

  use() {
    return "You move the rock around in your hand for a moment, but you can't think of anything else to do with it right now."
  }
}