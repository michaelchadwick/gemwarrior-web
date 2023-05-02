class Torch extends Item {
  constructor() {
    super()

    this.name         = 'torch'
    this.description  = 'An illuminating piece of wood with fire at the end.'
  }

  use() {
    const location = GemWarrior.world.location
    let result

    if (location.coords == GW_IHOT_EXIT_POINT) {
      if (location.has_item('indentation')) {
        result = `You wave the ${this.name} around, trying to see anything of note. You <em>think</em> you see something odd in the nearby wall, but can't be sure.`
      } else {
        result = `You wave the ${this.name} around, trying to see anything of note, but you just see darkness and stone.`
      }
    } else {
      result = `You wave the ${this.name} around, trying to see anything of note, but you just see darkness and stone.`
    }

    return result
  }

  use_with(item_name) {
  }
}