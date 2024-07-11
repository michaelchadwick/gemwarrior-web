// /assets/js/app/lib/misc/player_levels.js
// Stats table for each level the player can reach

// TODO: actually implement leveling system

class PlayerLevels {
  static get_level_stats(level) {
    switch (level) {
      case 1:
        return {
          level: 1,
          xp_start: 0,
          hp_max: 30,
          atk_lo: 1,
          atk_hi: 2,
          defense: 1,
          dexterity: 3,
          special_abilities: null,
        }
      case 2:
        return {
          level: 2,
          xp_start: 50,
          hp_max: 35,
          atk_lo: 2,
          atk_hi: 3,
          defense: 3,
          dexterity: 4,
          special_abilities: 'rocking_vision',
        }
      case 3:
        return {
          level: 3,
          xp_start: 120,
          hp_max: 45,
          atk_lo: 3,
          atk_hi: 5,
          defense: 5,
          dexterity: 6,
          special_abilities: 'gleam',
        }
      case 4:
        return {
          level: 4,
          xp_start: 250,
          hp_max: 55,
          atk_lo: 5,
          atk_hi: 6,
          defense: 6,
          dexterity: 8,
          special_abilities: 'rock_slide',
        }
      case 5:
        return {
          level: 5,
          xp_start: 600,
          hp_max: 70,
          atk_lo: 7,
          atk_hi: 8,
          defense: 8,
          dexterity: 9,
          special_abilities: 'graniton',
        }
      case 6:
        return {
          level: 6,
          xp_start: 1000,
          hp_max: 85,
          atk_lo: 8,
          atk_hi: 10,
          defense: 10,
          dexterity: 11,
          special_abilities: 'stone_face',
        }
      case 7:
        return {
          level: 7,
          xp_start: 1500,
          hp_max: 100,
          atk_lo: 10,
          atk_hi: 12,
          defense: 13,
          dexterity: 14,
          special_abilities: 'breakthru',
        }
      default:
        return {
          level: 8,
          xp_start: 10000,
          hp_max: 200,
          atk_lo: 50,
          atk_hi: 100,
          defense: 50,
          dexterity: 100,
          special_abilities: nil,
        }
    }
  }

  static check_level(xp) {
    if (xp < 50) return 1
    else if (xp < 120) return 2
    else if (xp < 250) return 3
    else if (xp < 600) return 4
    else if (xp < 1000) return 5
    else if (xp < 1500) return 6
    else if (xp < 10000) return 7
    else return 8
  }

  static get_ability_description(ability) {
    switch (ability) {
      case 'rocking_vision': // LV2
        return 'Allows you to see the enemy hit points while in battle.'
      case 'gleam': // LV3
        return 'The map now shows every place in Jool, whether you have been there or not.'
      case 'rock_slide': // LV4
        return "Adds a random boost to the player's attack in battle."
      case 'graniton': // LV5
        return 'Chance to be much more accurate in your attacks.'
      case 'stone_face': // LV6
        return 'Chance to auto-win in battle against any non-boss monster (does not work in arena or if ambushed).'
      case 'breakthru':
        return 'Teleport to any location, given that you can remember its name.'
      default:
        return "Unsure, but it's probably cool!"
    }
  }
}
