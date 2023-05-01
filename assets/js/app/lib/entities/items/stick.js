class Stick extends Item {
  constructor() {
    super()

    this.name         = 'stick'
    this.description  = 'Fragment of a tree.'
    this.is_clothed   = false
    this.is_fueled    = false
    this.is_torch     = false
  }

  use() {
    return `The ${this.name} might poke someone's eye out, if need be, but there be no need.`
  }

  use_with(item_name) {
    switch (item_name) {
      case 'bucket':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          const bucket = GemWarrior.world.player.inventory.items.filter(i => i.name == item_name)[0]

          if (this.is_clothed) {
            if (bucket.is_filled_with_resin) {
              this.is_wet = true
              this.description = 'Fragment of a tree, wrapped in a <span class="noun">cloth</span> near the end, and wet with <span class="noun">resin</span>.'

              return `You poke the <span class="noun">cloth</span>-wrapped <span class="noun">${this.name}</span> into the <span class="noun">bucket</span> filled with <span class="noun">resin</span>, making the end of the <span class="noun">${this.name}</span> wet and drippy.`
            } else {
              return `You poke the <span class="noun">cloth</span>-wrapped <span class="noun">${this.name}</span> into the empty <span class="noun">bucket</span>, and it makes a hollow thud.`
            }
          } else if (bucket.is_filled_with_resin) {
            return `You poke the ${this.name} into the <span class="noun">bucket</span> filled with <span class="noun">resin</span>, but it doesn't do much.`
          } else {
            return `You poke the <span class="noun">${this.name}</span> into the empty <span class="noun">bucket</span> filled with <span class="noun">resin</span>. Some of the <span class="noun">resin</span> makes its way onto the <span class="noun">${this.name}</span>, but nothing is absorbed.`
          }
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }
      case 'cloth':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          if (!this.is_clothed) {
            this.is_clothed = true
            this.description = 'Fragment of a tree, wrapped in a <span class="noun">cloth</span> near the end.'

            return `You wrap the end of the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span>.`
          } else {
            return `The <span class="noun">${this.name}</span> is already wrapped with <span class="noun">${item_name}</span>.`
          }
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }
      default:
        return `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`
    }
  }
}