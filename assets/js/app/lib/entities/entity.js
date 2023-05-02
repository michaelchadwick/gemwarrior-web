// /assets/js/app/lib/entities/entity.js
// Base class for a describable object

class Entity {
  constructor() {
    this.name           = 'entity'
    this.description    = 'An entity.'
    this.useable        = true
    this.useable_battle = false
    this.talkable       = false
    this.consumable     = false
    this.takeable       = true
    this.equippable     = false
    this.equipped       = false
    this.used           = false
    this.used_again     = false
    this.number_of_uses = null

    // console.log('[LOADED] /app/lib/entities/entity')
  }

  describe() {
    return this.description
  }

  describe_detailed() {
    let result = '<pre>'
    result += `
${this.name_display()} [<code>${this.name}</code>]
'${this.description}'
    `

    for (const prop in this) {
      if (prop !== 'name' && prop !== 'description') {
        result += `
${prop.toUpperCase()}? ${this[prop] == true ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}`
      }
    }

    result += `</pre>`

    return result
  }

  name_display() {
    return this.name[0].toUpperCase() + this.name.slice(1)
  }

  use() {
    return `The <span class='keyword'>${this.name}</span> does not appear to be useable.`
  }

  use_with(item_name) {
    return `You are not able to use the <span class="noun">${this.name}</span> with <span class="noun">${item_name}</span>.`
  }
}