class Resin extends Item {
  constructor() {
    super()

    this.name         = 'resin'
    this.description  = "A small flask of what appears to be tree bark resin."
  }

  use() {
    return "You open the flask and take a whiff. It smells smoky."
  }

  use_with(item_name) {
    switch (item_name) {
      case 'bucket':
        if (GemWarrior.world.player.inventory.has_item(item_name)) {
          GemWarrior.world.player.inventory.update_item_description('bucket', `A small metal container, filled with tree bark <span class="noun">${this.name}</span>.`)

          GemWarrior.world.player.inventory.remove_item(this.name)

          return `You fill the <span class="noun">${item_name}</span> with <span class="noun">${this.name}</span> and discard the bottle.`
        } else {
          return `Your possessions do not include <span class="noun">${item_name}</span>, so you can't use the <span class="noun">${this.name}</span> with it.`
        }
      default:
        return `You are not able to use the <span class="noun">${this.name}</span> with ${item_name}.`
    }
  }
}