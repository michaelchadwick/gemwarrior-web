// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// name_generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/

class NameGenerator {
  constructor(type) {
    this.type = type
    this.name_set = {}
    this.chain_cache = {}
  }

  async get_name_set() {
    const names_promise = await fetch(`/assets/data/${this.type}_names.json`)
    const names_data = await names_promise.json()

    this.name_set = names_data

    return names_data
  }

  // generate single
  generate_name() {
    let chain = null

    // console.log('generate_name this.type', this.type)

    if (chain = this.markov_chain(this.type)) {
      return this.markov_name(chain)
    } else {
      return false
    }
  }

  // generate multiple
  generate_names(n_of = 1) {
    let list = []

    let i

    for (i = 0; i < n_of; i++) {
      list.push(this.generate_name(this.type))
    }

    return list
  }

  // get markov chain by type
  markov_chain(type) {
    let chain

    if (chain = this.chain_cache[type]) {
      return chain
    } else {
      let list

      if ((list = this.name_set[type]) && list.length) {
        let chain

        if (chain = this.construct_chain(list)) {
          this.chain_cache[type] = chain

          return chain
        }
      }
    }

    return false
  }

  // construct markov chain from list of names
  construct_chain(list) {
    let chain = {}
    let i

    for (i = 0; i < list.length; i++) {
      let names = list[i].split(/\s+/)

      chain = this.incr_chain(chain, 'parts', names.length)

      let j

      for (j = 0; j < names.length; j++) {
        let name = names[j]

        chain = this.incr_chain(chain, 'name_len', name.length)

        let c = name.substr(0,1)

        chain = this.incr_chain(chain,'initial',c)

        let string = name.substr(1)
        let last_c = c

        while (string.length > 0) {
          let c = string.substr(0,1)
          chain = this.incr_chain(chain,last_c,c)

          string = string.substr(1)
          last_c = c
        }
      }
    }
    return this.scale_chain(chain)
  }
  incr_chain(chain, key, token) {
    if (chain[key]) {
      if (chain[key][token]) {
        chain[key][token]++
      } else {
        chain[key][token] = 1
      }
    } else {
      chain[key] = {}
      chain[key][token] = 1
    }

    return chain
  }
  scale_chain(chain) {
    let table_len = {}

    Object.keys(chain).forEach(key => {
      table_len[key] = 0

      Object.keys(chain[key]).forEach(token => {
        let count = chain[key][token]
        let weighted = Math.floor(Math.pow(count,1.3))

        chain[key][token] = weighted
        table_len[key] += weighted
      })
    })

    chain['table_len'] = table_len

    return chain
  }

  // construct name from markov chain

  markov_name (chain) {
    let parts = this.select_link(chain,'parts')
    let names = []

    let i

    for (i = 0; i < parts; i++) {
      let name_len = this.select_link(chain,'name_len')
      let c = this.select_link(chain,'initial')
      let name = c
      let last_c = c

      while (name.length < name_len) {
        c = this.select_link(chain,last_c)

        if (! c) break

        name += c
        last_c = c
      }

      names.push(name)
    }

    return names.join(' ')
  }
  select_link (chain, key) {
    let len = chain['table_len'][key]

    if (!len) return false

    let idx = Math.floor(Math.random() * len)
    let tokens = Object.keys(chain[key])
    let acc = 0

    let i

    for (i = 0; i < tokens.length; i++) {
      let token = tokens[i]

      acc += chain[key][token]

      if (acc > idx) return token
    }
    return false
  }

}