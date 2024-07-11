class Rock extends Item {
  constructor(options = null) {
    super()

    this.name = 'rock'
    this.description =
      options.description ||
      'A small, yet quite sharp, sedimentary pebble, suitable for tossing in amusement, and perhaps commerce.'
  }

  use() {
    return "You move the rock around in your hand for a moment, but you can't think of anything else to do with it right now."
  }

  use_with(item_name) {
    let result

    const player_inventory = GemWarrior.world.player.inventory

    switch (item_name) {
      case 'rock':
        if (player_inventory.has_item('stick')) {
          if (
            player_inventory.item_has_condition('stick', 'is_clothed') &&
            player_inventory.item_has_condition('stick', 'is_resined')
          ) {
            player_inventory.add_item('torch')
            player_inventory.remove_item('stick')

            result =
              'You start knocking the two <span class="noun">rock</span>s together. Eventually, you make a consistent spark and it leaps onto your <span class="noun">cloth</span>-wrapped and <span class="noun">resin</span>-soaked stick, lighting the end of the wood on fire, presenting you with a much-needed light source.<br /><br />You now have a <span class="noun">torch</span>.'

            setTimeout(() => GemWarrior._playSFX('big-get'), 600)
          } else {
            result = `You knock the two <span class="noun">${this.name}</span>s together, and you notice the spark singes the end of your <span class="noun">stick</span> a little, but then goes out.`
          }
        } else {
          GemWarrior.animate('flash', 1)

          result = `You knock the two <span class="noun">${this.name}</span>s together, noticing a sizeable spark emitting from where they collide, but otherwise nothing happens.`
        }

        break

      default:
        result = `You knock the <span class="noun">${this.name}</span> and <span class="noun">${item_name}</span> together, but nothing happens.`

        break
    }

    return result
  }
}
