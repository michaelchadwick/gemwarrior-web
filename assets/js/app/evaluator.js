/* /assets/js/app/evaluator.js */
/* take input and give output */
/* global GemWarrior */

class Evaluator {
  construction() {
    console.log('[LOADED] /app/evaluator')
  }

  process(command) {
    GemWarrior.settings.history.push(command)
    GemWarrior.settings.historyMarker = GemWarrior.settings.history.length

    GemWarrior._saveSetting('history', GemWarrior.settings.history)
    GemWarrior._saveSetting('historyMarker', GemWarrior.settings.historyMarker)

    let cmds = command.split(' ')

    let verb = cmds[0].toLowerCase()
    let arg1 = cmds[1] ? cmds[1] : null
    let arg2 = cmds[2] ? cmds[2] : null
    let arg3 = cmds[3] ? cmds[3] : null

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

    switch (verb) {
      // self

      case 'character':
      case 'char':
      case 'c':
        GemWarrior.config.textOutput = GemWarrior.world.player.describe()

        break

      case 'inventory':
      case 'inven':
      case 'inv':
      case 'i':
        GemWarrior.config.textOutput = GemWarrior.world.player.inventory.describe_items()

        break

      case 'sit':
      case 'si':
        if (GemWarrior.world.player.status === 'sitting') {
          GemWarrior.config.textOutput = `You are already ${GemWarrior.world.player.status}.`
        } else {
          GemWarrior._avatarSit({ sound: true })
          GemWarrior.config.textOutput = 'You sit down.'
        }

        break

      case 'stand':
      case 'st':
        if (GemWarrior.world.player.status === 'standing') {
          GemWarrior.config.textOutput = `You are already ${GemWarrior.world.player.status}.`
        } else {
          GemWarrior._avatarStand({ sound: true })
          GemWarrior.config.textOutput = 'You stand up.'
        }

        break

      case 'sleep':
      case 'sl':
        if (GemWarrior.world.player.status == 'sleeping') {
          GemWarrior.config.textOutput = 'You are already resting.'
        } else {
          GemWarrior.world.player.status = 'sleeping'
          GemWarrior._avatarSleep(true)

          GemWarrior.config.textOutput = 'You lie down to rest.'
        }

        break

      // travel

      case 'go':
        if (arg1) {
          const direction = arg1.toLowerCase()

          if (Object.values(GW_DIRECTIONS).includes(arg1)) {
            GemWarrior.evaluator.process(arg1)
          } else {
            GemWarrior.config.textOutput = `You cannot go in a "${direction}" direction.`
          }
        } else {
          GemWarrior.config.textOutput =
            'You cannot just <span class="keyword">go</span> without a <em>direction</em>.'
        }

        break

      case 'north':
      case 'n':
        GemWarrior.config.textOutput = this._try_to_move_player('north')
        break

      case 'west':
      case 'w':
        GemWarrior.config.textOutput = this._try_to_move_player('west')
        break

      case 'south':
      case 's':
        GemWarrior.config.textOutput = this._try_to_move_player('south')
        break

      case 'east':
      case 'e':
        GemWarrior.config.textOutput = this._try_to_move_player('east')
        break

      // action

      case 'look':
      case 'ls':
      case 'l':
        if (!arg1) {
          if (GemWarrior.config.debugMode) {
            GemWarrior.config.textOutput = GemWarrior.world.location.describe_detailed()
          } else {
            GemWarrior.config.textOutput = GemWarrior.world.location.describe()
          }
        } else {
          GemWarrior.config.textOutput = GemWarrior.world.describe_entity(
            GemWarrior.world.location,
            arg1.toLowerCase()
          )
        }

        break

      case 'get':
      case 'g':
      case 'pickup':
      case 'p':
      case 'take':
      case 't':
        if (!arg1) {
          GemWarrior.config.textOutput = ERROR_TAKE_PARAM_MISSING
        } else {
          GemWarrior.config.textOutput = GemWarrior.world.player.inventory.add_item(
            arg1.toLowerCase(),
            GemWarrior.world.location
          )
        }

        break

      case 'drop':
      case 'dr':
        if (!arg1) {
          GemWarrior.config.textOutput = ERROR_DROP_PARAM_MISSING
        } else {
          GemWarrior.config.textOutput = GemWarrior.world.player.inventory.drop_item(
            arg1.toLowerCase()
          )
        }

        break

      case 'use':
      case 'u':
        let result

        if (!arg1) {
          result = ERROR_USE_PARAM_MISSING
        } else {
          const player_inventory = GemWarrior.world.player.inventory
          const player_location = GemWarrior.world.location

          // using one item with another?
          if (arg2 && (arg2.toLowerCase() == 'with' || arg2.toLowerCase() == 'on')) {
            if (arg3) {
              const item1_name = arg1.toLowerCase()
              const item2_name = arg3.toLowerCase()

              if (player_inventory.has_item(item1_name)) {
                const item1 = Object.values(player_inventory.items).filter(
                  (i) => i.name == item1_name
                )[0]

                if (item1.useable) {
                  if (player_inventory.has_item(item2_name)) {
                    const item2 = Object.values(player_inventory.items).filter(
                      (i) => i.name == item2_name
                    )[0]

                    if (item2.useable) {
                      GemWarrior._playSFX('use-with')

                      result = item1.use_with(item2_name)
                    } else {
                      result = ERROR_USE_WITH_PARAM_UNUSEABLE
                    }
                  } else {
                    result = ERROR_USE_WITH_PARAM_MISSING
                  }
                } else {
                  result = ERROR_USE_PARAM_UNUSEABLE
                }
              } else if (player_location.has_item(item1_name)) {
                const item1 = Object.values(player_location.items).filter(
                  (i) => i.name == item1_name
                )[0]

                if (item1.useable) {
                  if (player_inventory.has_item(item2_name)) {
                    const item2 = Object.values(player_location.items).filter(
                      (i) => i.name == item2_name
                    )[0]

                    if (item2.useable) {
                      GemWarrior._playSFX('use-with')

                      result = item1.use_with(item2_name)
                    } else {
                      result = ERROR_USE_WITH_PARAM_UNUSEABLE
                    }
                  } else {
                    result = ERROR_USE_WITH_PARAM_MISSING
                  }
                } else {
                  result = ERROR_USE_PARAM_UNUSEABLE
                }
              } else {
                result = ERROR_USE_PARAM_INVALID
              }
            } else {
              result = ERROR_USE_WITH_PARAM_MISSING
            }
          }
          // using one item
          else {
            const item_name = arg1.toLowerCase()

            if (player_inventory.has_item(item_name)) {
              const item = Object.values(player_inventory.items).filter(
                (i) => i.name == item_name
              )[0]

              if (item.useable) {
                GemWarrior._playSFX('use')

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
              const item = Object.values(player_location.items).filter(
                (i) => i.name == item_name
              )[0]

              if (item.useable) {
                GemWarrior._playSFX('use')

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
              const monster = Object.values(player_location.monsters_abounding).filter(
                (m) => m.name == item_name
              )[0]

              result = monster.use()
            } else if (player_location.has_boss(item_name)) {
              const boss = Object.values(player_location.bosses_abounding).forEach(
                (b) => b.name == item_name
              )[0]

              result = boss.use()
            } else {
              result = ERROR_USE_PARAM_INVALID
            }
          }
        }

        GemWarrior.world.save()

        GemWarrior.config.textOutput = result

        break

      // meta

      case 'help':
      case 'h':
      case '?':
        GemWarrior.config.textOutput = GemWarrior._displayHelp()

        break

      case 'commands':
      case 'com':
        GemWarrior.config.textOutput = GemWarrior._displayCommands()

        break

      case 'history':
      case 'hist':
        GemWarrior.config.textOutput = GemWarrior.__getHistoryDisplay()

        break

      case 'about':
      case 'ab':
        GemWarrior.config.textOutput = GW_ABOUT_TEXT

        break

      case 'change':
      case 'ch':
        if (!arg1) {
          GemWarrior.config.textOutput = ERROR_CHANGE_PARAM_MISSING
        } else {
          switch (arg1.toLowerCase()) {
            case 'name':
              if (!arg2) {
                GemWarrior.config.textOutput = `If you want to <span class="keyword">${verb}</span> your <span class="noun">${arg1}</span>, you must indicate <em>what</em> you would like to change it to.`
              } else if (arg2.length > GW_NAME_LENGTH_MAX) {
                GemWarrior.config.textOutput = `That name is too long. Try again with something fewer than ${GW_NAME_LENGTH_MAX} characters.`
              } else {
                GemWarrior.world.player.name = arg2.trim()

                GemWarrior.config.textOutput = `You are now known as <span class="noun">${arg2}</span>.`

                GemWarrior._saveSetting('hasChangedName', true)

                GemWarrior.world.save()
              }

              break

            case 'debug':
              if (!arg2) {
                GemWarrior.config.textOutput = `If you want to <span class="keyword">${verb}</span> <span class="noun">${arg1}</span>, you must indicate <em>what</em> you would like to change it to.`
              } else {
                if (arg2.toLowerCase() == 'true') {
                  GemWarrior.config.debugMode = true

                  GemWarrior.config.textOutput = `${PROGRAM_NAME}'s <span class="keyword">${arg1}</span> is now <span class="keyword true">true</span>`
                } else {
                  GemWarrior.config.debugMode = false

                  GemWarrior.config.textOutput = `${PROGRAM_NAME}'s <span class="keyword">${arg1}</span> is now <span class="keyword false">false</span>`
                }
              }

              break

            default:
              GemWarrior.config.textOutput = `You cannot <span class="keyword">${verb}</span> <span class="argument">${arg1}</span>...<em>yet</em>.`
              break
          }
        }

        break

      // fx

      case 'playbgm':
      case 'play':
        if (GemWarrior.settings.enableSound) {
          if (!GemWarrior.config.synthBGM.playing) {
            if (GemWarrior.world.player.status == 'sleeping') {
              GemWarrior._playBGM('sleep')
            } else {
              GemWarrior._playBGM('main')
            }

            GemWarrior.config.textOutput = 'Playing moody, enchanting background music.'
          } else {
            GemWarrior.config.textOutput = 'Background music is already playing.'
          }
        } else {
          GemWarrior.config.textOutput = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
        }

        break

      case 'stopbgm':
      case 'stop':
        if (GemWarrior.settings.enableSound) {
          if (GemWarrior.config.synthBGM.playing) {
            GemWarrior._stopBGM()

            GemWarrior.config.textOutput = 'Background music has stopped.'
          } else {
            GemWarrior.config.textOutput = 'Background is not playing, so this has no effect.'
          }
        } else {
          GemWarrior.config.textOutput = `Sound is not enabled. Check the <button class="inline"><i class="fa-solid fa-gear"></i></button> icon.`
        }

        break

      default:
        GemWarrior.config.textOutput =
          'That command isn\'t recognized. Type <span class="keyword">help</span> for valid commands.'

        break
    }

    return GemWarrior.config.textOutput
  }

  /* private */

  _try_to_move_player(direction) {
    if (GemWarrior.world.player.status !== 'sleeping') {
      if (GemWarrior.world.can_move_in_direction(direction)) {
        GemWarrior.world.player.go(direction)

        GemWarrior.dom.statsLOC.innerText = GemWarrior.world.location.name
        GemWarrior.world.location.checked_for_monsters = false

        GemWarrior.world.save()

        return `You go <span class="keyword">${direction}</span>.<br /><br />${GemWarrior.world.location.describe()}`
      } else {
        GemWarrior._playSFX('bonk')

        return ERROR_GO_PARAM_INVALID
      }
    } else {
      return 'You cannot move while sleeping.'
    }
  }
}
