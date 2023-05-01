class Cloth extends Item {
  constructor() {
    super()

    this.name         = 'cloth'
    this.description  = "Leftovers from someone's shirt, most likely."
  }

  use() {
    return "This 100%-cotton shred of material feels soft, but isn't large enough to clothe you."
  }

  use_with(item_name) {
    switch (item_name) {
      case 'stick':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          GemWarrior.world.player.inventory.update_item_description('stick', `Fragment of a tree, now wrapped in a <span class="noun">${this.name}</span> near the end.`)

          GemWarrior.world.player.inventory.remove_item(this.name)

          return `You wrap the end of the <span class="noun">${item_name}</span> with the <span class="noun">${this.name}</span>.`
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }

      default:
        return `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`
    }
  }
}