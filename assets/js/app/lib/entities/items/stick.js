class Stick extends Item {
  constructor(options = null) {
    super()

    this.name = 'stick'
    this.description = options.description || 'Fragment of a tree.'
    this.is_clothed = options.is_clothed || false
    this.is_resined = options.is_resined || false
  }

  use() {
    return `The ${this.name} might poke someone's eye out, if need be, but there be no need.`
  }

  use_with(item_name) {
    let result

    const player_inventory = GemWarrior.world.player.inventory

    switch (item_name) {
      case 'bucket':
        if (player_inventory.has_item(item_name)) {
          const bucket = player_inventory.items.filter((i) => i.name == item_name)[0]

          if (this.is_clothed) {
            if (bucket.is_filled_with_resin) {
              if (!this.is_resined) {
                this.is_resined = true

                this.description =
                  'Fragment of a tree, wrapped in a <span class="noun">cloth</span> near the end, and wet with <span class="noun">resin</span>.'

                result = `You poke the <span class="noun">cloth</span>-wrapped <span class="noun">${this.name}</span> into the <span class="noun">bucket</span> filled with <span class="noun">resin</span>, making the end of the <span class="noun">${this.name}</span> wet and drippy.`
              } else {
                result = `The <span class="noun">${this.name}</span>'s <span class="noun">cloth</span>-wrapped end is already doused in enough <span class="noun">resin</span>.`
              }
            } else {
              result = `You poke the <span class="noun">cloth</span>-wrapped <span class="noun">${this.name}</span> into the empty <span class="noun">bucket</span>, and it makes a hollow thud.`
            }
          } else if (bucket.is_filled_with_resin) {
            result = `You poke the ${this.name} into the <span class="noun">bucket</span> filled with <span class="noun">resin</span>, but it doesn't do much.`
          } else {
            result = `You poke the <span class="noun">${this.name}</span> into the empty <span class="noun">bucket</span> filled with <span class="noun">resin</span>. Some of the <span class="noun">resin</span> makes its way onto the <span class="noun">${this.name}</span>, but nothing is absorbed.`
          }
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      case 'cloth':
        if (player_inventory.has_item(item_name)) {
          if (!this.is_clothed) {
            this.is_clothed = true

            player_inventory.remove_item('cloth')

            this.description = `Fragment of a tree, wrapped in a <span class="noun">${item_name}</span> near the end.`

            result = `You wrap the end of the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span>.`
          } else {
            result = `The <span class="noun">${this.name}</span> is already wrapped with <span class="noun">${item_name}</span>.`
          }
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      default:
        result = `You are not able to use the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span>.`

        break
    }

    return result
  }
}
