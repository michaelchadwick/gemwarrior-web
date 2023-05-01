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
    return `<pre>
${this.name_display()} [<code>${this.name}</code>]
'${this.description}'
TAKEABLE?   ${this.takeable ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
USEABLE?    ${this.useable ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
TALKABLE?   ${this.talkable ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
CONSUMABLE? ${this.consumable ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
EQUIPPABLE? ${this.equippable ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
EQUIPPED?   ${this.equipped ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
USED?       ${this.used ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
USED AGAIN? ${this.used_again ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
USES LEFT?  ${this.number_of_uses}
    </pre>`
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