/* /assets/js/app/lib/constants/errors.js */
/* global error constants */
/* eslint-disable no-unused-vars */

const ERROR_COMMAND_INVALID                 = 'That is not something the game yet understands.'

const ERROR_LOOK_AT_PARAM_MISSING           = 'You cannot just "look at". You gotta choose something to look at.'
const ERROR_DESCRIBE_ENTITY_INVALID         = 'You do not see that here, there, or anywhere.'

const ERROR_TALK_PARAM_INVALID              = 'Are you talking to yourself? That person is not here.'
const ERROR_TALK_PARAM_UNTALKABLE           = 'That cannnot be conversed with.'
const ERROR_TALK_TO_PARAM_MISSING           = 'You cannot just "talk to". You gotta choose someone to talk to.'

const ERROR_GO_PARAM_MISSING                = 'Just wander aimlessly? A direction would be nice.'
const ERROR_GO_PARAM_INVALID                = 'Something tells you that is not a way to go.'

const ERROR_DIRECTION_PARAM_INVALID         = 'You cannot go to that place.'
const ERROR_ATTACK_PARAM_MISSING            = 'You cannot just "attack". You gotta choose something to attack.'
const ERROR_ATTACK_PARAM_INVALID            = 'That monster does not exist here or can\'t be attacked.'

const ERROR_BREAKTHRU_PARAM_MISSING         = 'You cannot just "breakthru". You gotta specify a location name.'
const ERROR_BREAKTHRU_PARAM_INVALID         = 'You cannot breakthru to that place.'
const ERROR_BREAKTHRU_INEXPERIENCED         = 'You are not experienced enough to perform that feat.'

const ERROR_TAKE_PARAM_MISSING              = 'You cannot just "take". You gotta choose something to take.'

const ERROR_USE_PARAM_MISSING               = 'Use <em>what</em>, exactly?'
const ERROR_USE_PARAM_INVALID               = 'You cannot use that, as it does not exist here or in your inventory.'
const ERROR_USE_PARAM_UNUSEABLE             = 'That is not useable.'

const ERROR_USE_WITH_PARAM_MISSING          = 'Use it with <em><strong>what</strong></em>, exactly?'
const ERROR_USE_WITH_PARAM_INVALID          = 'You cannot use it with <em>that</em>, as <em>that</em> does not exist here or in your inventory.'
const ERROR_USE_WITH_PARAM_UNUSEABLE        = '<em>That</em> is not useable with the other thing.'

const ERROR_DROP_PARAM_MISSING              = 'You cannot just "drop". You gotta choose something to drop.'

const ERROR_EQUIP_PARAM_MISSING             = 'You cannot just "equip". You gotta choose something to equip.'
const ERROR_UNEQUIP_PARAM_MISSING           = 'You cannot just "unequip". You gotta choose something to unequip.'

const ERROR_CHANGE_PARAM_MISSING            = 'You cannot just "change". You gotta choose something to change. Current options are <span class="argument">name</span> and <span class="argument">debug_mode</span>.'
const ERROR_CHANGE_PARAM_INVALID            = 'You cannot change that...yet.'

const ERROR_LIST_PARAM_MISSING              = 'You cannot just "list". You gotta choose something to list.'
const ERROR_LIST_PARAM_INVALID              = 'You cannot list that...yet.'

const ERROR_DEBUG_STAT_PARAM_MISSING        = 'You cannot just "change stats". You gotta choose a stat to change.'
const ERROR_DEBUG_STAT_PARAM_INVALID        = 'You cannot change that stat...yet.'
const ERROR_DEBUG_STAT_INV_PARAM_INVALID    = 'You cannot add that to your inventory...yet.'
const ERROR_DEBUG_GLOBAL_VAR_INVALID        = 'That global variable does not exist.'
const ERROR_DEBUG_TELEPORT_PARAMS_MISSING   = 'You cannot just "teleport". You gotta specify an x AND y coordinate, at least.'
const ERROR_DEBUG_TELEPORT_PARAMS_NEEDED    = 'You cannot just "teleport" to an x coordinate without a y coordinate.'
const ERROR_DEBUG_TELEPORT_PARAMS_INVALID   = 'You cannot teleport there...yet.'

const ERROR_ITEM_REMOVE_INVALID             = 'Your inventory does not contain that item, so you cannot drop it.'
const ERROR_ITEM_ADD_UNTAKEABLE             = 'That would be great if you could take that, wouldn\'t it? Huh!'
const ERROR_ITEM_ADD_INVALID                = 'That item cannot be taken or does not exist.'
const ERROR_ITEM_DESCRIBE_INVALID           = 'That does not seem to be in the inventory.'
const ERROR_ITEM_EQUIP_INVALID              = 'You do not possess anything called that to equip.'
const ERROR_ITEM_EQUIP_NONARMAMENT          = 'That item cannot be equipped.'
const ERROR_ITEM_UNEQUIP_INVALID            = 'You do not possess anything called that to unequip.'
const ERROR_ITEM_UNEQUIP_NONARMAMENT        = 'That item cannot be unequipped.'
