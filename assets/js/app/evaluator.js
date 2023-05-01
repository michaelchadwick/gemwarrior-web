class Evaluator {
  construction() {
    console.log('[LOADED] /app/evaluator')
  }

  parse(command) {
    GemWarrior.config.history.push(command)
    GemWarrior.config.historyMarker = GemWarrior.config.history.length

    let cmds = command.split(' ')

    let verb = cmds[0].toLowerCase()
    let arg1 = cmds[1] ? cmds[1].toLowerCase() : null
    let arg2 = cmds[2] ? cmds[2].toLowerCase() : null
    let arg3 = cmds[3] ? cmds[3].toLowerCase() : null

    // if (arg1) {
    //   if (arg2) {
    //     arg1 = cmds.slice(1, 2)
    //   } else {
    //     arg1 = cmds.slice(1, cmds.length)
    //   }
    //   arg1 = arg1.filter((i) => !['a', 'the', 'my'].includes(i))
    //   arg1 = arg1.join(' ').toLowerCase()
    // }

    // if (arg2) {
    //   // arg2 = cmds.slice(2, cmds.length)
    //   // arg2 = arg2.filter((i) => !['a', 'the', 'my'].includes(i))
    //   // arg2 = arg2.join(' ').toLowerCase()
    // }

    // console.log(`parse(${verb}, ${arg1}, ${arg2}, ${arg3})`)

    switch (verb) {
      // self

      case 'character':
      case 'char':
      case 'c':
        GemWarrior.config.outText = GemWarrior.world.player.describe()

        break

      case 'inventory':
      case 'inven':
      case 'inv':
      case 'i':
        GemWarrior.config.outText = GemWarrior.world.player.inventory.describe_items()

        break

      case 'sit':
      case 'si':
        if (GemWarrior.world.player.status === 'sitting') {
          GemWarrior.config.outText = `You are already ${GemWarrior.world.player.status}.`
        } else {
          GemWarrior._avatarSit({ sound: true })
          GemWarrior.config.outText = 'You sit down.'
        }

        break

      case 'stand':
      case 'st':
        if (GemWarrior.world.player.status === 'standing') {
          GemWarrior.config.outText = `You are already ${GemWarrior.world.player.status}.`
        } else {
          GemWarrior._avatarStand({ sound: true })
          GemWarrior.config.outText = 'You stand up.'
        }

        break

      case 'sleep':
      case 'sl':
        if (GemWarrior.world.player.status == 'sleeping') {
          GemWarrior.config.outText = 'You are already resting.'
        } else {
          GemWarrior.world.player.status = 'sleeping'
          GemWarrior._avatarSleep(true)

          GemWarrior.config.outText = 'You lie down to rest.'
        }

        break

      // travel

      case 'go':
      case 'g':
        if (arg1) {
          GemWarrior.evaluator.parse(arg1)
        } else {
          GemWarrior.config.outText = 'You cannot just <span class="keyword">go</span> without a direction.'
        }

        break

      case 'north':
      case 'n':
        GemWarrior.config.outText = this._try_to_move_player('north')
        break

      case 'west':
      case 'w':
        GemWarrior.config.outText = this._try_to_move_player('west')
        break

      case 'south':
      case 's':
        GemWarrior.config.outText = this._try_to_move_player('south')
        break

      case 'east':
      case 'e':
        GemWarrior.config.outText = this._try_to_move_player('east')
        break

      // action

      case 'look':
      case 'ls':
      case 'l':
        if (!arg1) {
          GemWarrior.config.outText = GemWarrior.world.location.describe()
        } else {
          GemWarrior.config.outText = GemWarrior.world.describe_entity(GemWarrior.world.location, arg1)
        }

        break

      case 'pickup':
      case 'p':
      case 'take':
      case 't':
        if (!arg1) {
          GemWarrior.config.outText = ERROR_TAKE_PARAM_MISSING
        } else {
          GemWarrior.config.outText = GemWarrior.world.player.inventory.add_item(arg1, GemWarrior.world.location)
        }

        break

      case 'drop':
      case 'dr':
        if (!arg1) {
          GemWarrior.config.outText = ERROR_DROP_PARAM_MISSING
        } else {
          GemWarrior.config.outText = GemWarrior.world.player.inventory.drop_item(arg1)
        }

        break

      case 'use':
      case 'u':
        if (!arg1) {
          GemWarrior.config.outText = ERROR_USE_PARAM_MISSING
        } else {
          const player_inventory = GemWarrior.world.player.inventory
          const player_location = GemWarrior.world.location
          let result

          // using one item with another?
          if (arg2 == 'with') {
            if (arg3) {
              const item1_name = arg1
              const item2_name = arg3

              if (player_inventory.has_item(item1_name)) {
                const item1 = Object.values(player_inventory.items).filter(i => i.name == item1_name)[0]

                if (item1.useable) {
                  if (player_inventory.has_item(item2_name)) {
                    const item2 = Object.values(player_inventory.items).filter(i => i.name == item2_name)[0]

                    if (item2.useable) {
                      result = item1.use_with(item2_name)
                    } else {
                      result = ERROR_USE_WITH_PARAM_UNUSEABLE
                    }
                  }
                } else {
                  result = ERROR_USE_PARAM_UNUSEABLE
                }
              } else if (player_location.has_item(item1_name)) {
                const item1 = Object.values(player_location.items).filter(i => i.name == item1_name)[0]

                if (item1.useable) {
                  const item2 = Object.values(player_location.items).filter(i => i.name == item2_name)[0]

                  if (item2.useable) {
                    result = item1.use_with(item2_name)
                  } else {
                    result = ERROR_USE_WITH_PARAM_UNUSEABLE
                  }
                } else {
                  result = ERROR_USE_PARAM_UNUSEABLE
                }
              }
            } else {
              result = ERROR_USE_WITH_PARAM_MISSING
            }
          }
          // using one item
          else {
            const item_name = arg1

            if (player_inventory.has_item(item_name)) {
              const item = Object.values(player_inventory.items).filter(i => i.name == item_name)[0]

              if (item.useable) {
                if (item.number_of_uses) {
                  if (item.number_of_uses > 0) {
                    item.use()
                    item.number_of_uses -= 1

                    result = `>> ${item.name} can be used ${item.number_of_uses} more time(s).`
                  } else {
                    result = `>> ${item.name} cannot be used anymore.`
                  }
                } else if (item.consumable) {
                  GemWarrior.world.player.inventory.remove_item(item.name)

                  result = item.use()
                } else {
                  result = item.use()
                }
              } else {
                result = ERROR_USE_PARAM_UNUSEABLE
              }
            } else if (player_location.has_item(item_name)) {
              const item = Object.values(player_location.items).filter(i => i.name == item_name)[0]

              if (item.useable) {
                if (item.number_of_uses) {
                  if (item.number_of_uses > 0) {
                    item.use()
                    item.number_of_uses -= 1

                    result = `>> ${item.name} can be used ${item.number_of_uses} more time(s).`
                  } else {
                    result = `>> ${item.name} cannot be used anymore.`
                  }
                } else if (item.consumable) {
                  player_location.remove_item(item.name)

                  result = item.use()
                } else {
                  result = item.use()
                }
              } else {
                result = ERROR_USE_PARAM_UNUSEABLE
              }
            } else if (player_location.has_monster(item_name)) {
              const monster = Object.values(player_location.monsters_abounding).filter(m => m.name == item_name)[0]

              result = monster.use()
            } else if (player_location.has_boss(item_name)) {
              const boss = Object.values(player_location.bosses_abounding).forEach(b => b.name == item_name)[0]

              result = boss.use()
            } else {
              result = ERROR_USE_PARAM_INVALID
            }
          }

          GemWarrior.config.outText = result
        }

        break

      // meta

      case 'help':
      case 'h':
      case '?':
        GemWarrior.config.outText = GemWarrior._displayHelp()

        break

      case 'history':
      case 'hist':
        GemWarrior.config.outText = GemWarrior.__getHistoryDisplay()

        break

      case 'about':
      case 'a':
        GemWarrior.config.outText = GW_ABOUT_TEXT

        break

      case 'change':
      case 'ch':
        if (!arg1) {
          GemWarrior.config.outText = ERROR_CHANGE_PARAM_MISSING
        } else {
          switch(arg1) {
            case 'name':
              if (!arg2) {
                GemWarrior.config.outText = 'If you want to <span class="keyword">change</span> your <span class="noun">name</span>, you must indicate <em>what</em> you would like to change it to.'
              } else {
                GemWarrior.world.player.name = arg2.trim()

                GemWarrior.config.outText = `You are now known as <span class="noun">${arg2}</span>.`
              }

              break

            case 'debug_mode':
              if (!arg2) {
                GemWarrior.config.outText = 'If you want to <span class="keyword">change</span> <span class="argument">debug_mode</span>, you must indicate <em>what</em> you would like to change it to.'
              } else {
                if (arg2 == 'true') {
                  GemWarrior.options.debug_mode = true

                  GemWarrior.config.outText = `Gem Warrior's <span class="keyword">debug_mode</span> is now <span class="keyword true">true</span>`
                } else {
                  GemWarrior.options.debug_mode = false

                  GemWarrior.config.outText = `Gem Warrior's <span class="keyword">debug_mode</span> is now <span class="keyword false">false</span>`
                }
              }

              break

            default:
              GemWarrior.config.outText = `You cannot <span class="keyword">change</span> <span class="argument">${arg1}</span>...<em>yet</em>.`
              break
          }
        }

        break

      // fx

      case 'playbgm':
      case 'play':
      case 'pl':
        if (GemWarrior.settings.enableSound) {
          if (!GemWarrior.config.synth_bgm.playing) {
            if (GemWarrior.world.player.status == 'sleeping') {
              GemWarrior._playBGM('sleep')
            } else {
              GemWarrior._playBGM('main')
            }

            GemWarrior.config.outText = 'Playing background music.'
          } else {
            GemWarrior.config.outText = 'Background music is already playing.'
          }
        } else {
          GemWarrior.config.outText = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
        }

        break

      case 'stopbgm':
      case 'stop':
        if (GemWarrior.settings.enableSound) {
          if (GemWarrior.config.synth_bgm.playing) {
            GemWarrior._stopBGM()

            GemWarrior.config.outText = 'Background music has stopped.'
          } else {
            GemWarrior.config.outText = 'Background is not playing, so this has no effect.'
          }
        } else {
          GemWarrior.config.outText = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
        }

        break

      default:
        GemWarrior.config.outText = 'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

        break
    }

    return GemWarrior.config.outText
  }

  /* private */

  _try_to_move_player(direction) {
    if (GemWarrior.world.player.status !== 'sleeping') {
      if (GemWarrior.world.can_move_in_direction(direction)) {
        GemWarrior.world.player.go(direction)

        GemWarrior.dom.statsLOC.innerText = GemWarrior.world.location.name
        GemWarrior.world.location.checked_for_monsters = false

        GemWarrior.world.save()

        return GemWarrior.world.location.describe()
      } else {
        GemWarrior._playSFX('bonk')

        return 'Cannot move that way.'
      }
    } else {
      return 'You cannot move while sleeping.'
    }
  }
}