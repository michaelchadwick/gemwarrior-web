class Cloth extends Item {
  constructor(options = null) {
    super()

    this.name         = 'cloth'
    this.description  = options.description || "Leftovers from someone's shirt, most likely."
  }

  use() {
    return "This 100%-cotton shred of material feels soft, but isn't large enough to clothe you."
  }

  use_with(item_name) {
    let result

    const player_inventory = GemWarrior.world.player.inventory

    switch (item_name) {
      case 'stick':
        if (player_inventory.has_item(item_name)) {
          player_inventory.update_item_condition('stick', 'is_clothed', true)
          player_inventory.update_item_description('stick', `Fragment of a tree, wrapped in a <span class="noun">${this.name}</span> near the end.`)

          player_inventory.remove_item(this.name)

          result = `You wrap the end of the <span class="noun">${item_name}</span> with the <span class="noun">${this.name}</span>.`
        } else {
          result = `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

        break

      default:
        result = `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`

        break
    }

    return result
  }
}