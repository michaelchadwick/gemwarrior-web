# Gem Warrior (web)

A web version of the [Gem Warrior](https://github.com/michaelchadwick/gemwarrior) RubyGem.

```shell
/-+-+-+ +-+-+-+-+-+-+-\
|G|E|M| |W|A|R|R|I|O|R|
\-+-+-+ +-+-+-+-+-+-+-/
```

<small>logo courtesy of [ascii generator](http://www.network-science.de/ascii/)</small>

**Gem Warrior** is a text adventure that takes place in the land of **Jool**, where randomized fortune is just as likely as *mayhem*.

You take up the mantle of [RANDOM NAME HERE], a gifted young acolyte who has been tasked by the queen herself, **Ruby**, to venture off into the unknown to recapture a **Shiny Thing<sup>tm</sup>** that holds great power within its crystallized boundaries. Unfortunately, it was stolen recently by a crazed madperson named **Emerald**, bent on using its frightening power for **Evil**. You are **Good**, obviously, and the rightful caretaker of such power, but he will not give it up willingly, and has cursed all the creatures of the land into doing his bidding, which is largely tearing you limb from limb.

Start in your poor, super lame cottage, where you live alone, subsisting off the sale of polished rocks you scavenge all day for in the neighboring caves. Once tasked with your quest, travel throughout the land of Jool, eventually reaching the sky tower that Emerald resides in with his stolen goods, laughing to himself, occasionally.

As you travel you will discover sights and sounds of the land, all of which are new to you because you don't really get out much. Visit towns with merchants willing to trade coin for wares they bought off of other adventurers who didn't last the previous attempts at thwartion. Sleep in a tent (or on the ground, if that's all that's available) to regain your enumerated status points, which are conveniently located in your peripheral vision (i.e. the console window). Eventually, if you're skilled, you'll reach **Emerald's Sky Tower**, part him from his **ShinyThing<sup>tm</sup>**, and then do what is "right".

## Main Commands

`> (c)haracter`               - character check for weapon/armor/status
`> (i)nventory`               - check your inventory
`> (si)t`                     - change status to sitting
`> (st)and`                   - change status to standing
`> (sl)eep`                   - change status to sleeping
<!--`> rest`                  - take a load off and replenish hp-->

`> (l)ook      [object]`      - look at current location and its items and monsters
`> (t)ake      [object]`      - take an item from the current location
`> (dr)op      [object]`      - drop an item to the current location
`> (u)se       [object]`      - use an item from your inventory or current location (use 'with' or 'on' to combine with other item)

`> (g)o        [direction]`   - go in a direction, if possible (north|east|south|west work as shortcuts)
<!--`> (eq)uip [object]`    - designate an item in your inventory your weapon-->
<!--`> (uneq)uip   [object]`    - stop using an item in your inventory as your weapon-->
<!--`> (d)rop      [object]`    - drop an item from your inventory-->
<!--`> (at)ack    [monster]`   - attack a monster-->

`> (h)elp`                    - display available commands
`> (hist)ory`                 - display command history
`> (a)bout`                   - display information about the creator of GemWarrior
`> (ch)ange    [attribute]`   - change some things about yourself or the game

## Subsystems

### Avatar

Uses a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) to change your avatar (if you so choose to display it) and its characteristics.

### Audio

Uses [webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth) for making noise.

### Favicon

Uses SVGs from [icones.netlify.app](https://icones.netlify.app/collection/all).

### Storage

Uses [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) to save your adventure's records.

## Contributing

Clone repo and get to messing with things. It's all HTML, CSS, and JS (with some jQuery).
