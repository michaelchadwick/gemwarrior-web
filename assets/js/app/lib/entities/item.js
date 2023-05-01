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

  describe_detailed() {
    return `<pre>
${this.name_display()} [<code>${this.name}</code>]
'${this.description}'
ARMOR?      ${this.is_armor ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
WEAPON?     ${this.is_weapon ? '<span class="keyword true">true</span>' : '<span class="keyword false">false</span>'}
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

  use() {
    return `You attempt to use the <span class='keyword'>${this.name}</span>, but it does not do anything, as item usage has not been coded yet.`
  }
}