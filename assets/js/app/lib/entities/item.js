// /assets/js/app/lib/entities/item.js
// Item base class

class Item extends Entity {
  constructor() {
    super()

    this.name = 'item'
    this.description = 'An item.'
    this.is_armor = false
    this.is_weapon = false

    // console.log('[LOADED] /app/lib/entities/item')
  }

  use() {
    return `You attempt to use the <span class='keyword'>${this.name}</span>, but it does not do anything, as item usage has not been coded yet.`
  }
}