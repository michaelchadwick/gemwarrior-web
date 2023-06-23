/* /app/lib/misc/audio */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

GemWarrior._initSynths = function() {
  // console.log('[INITIALIZING] synths')

  if (!GemWarrior.config.synthBGM) {
    // initialize synthBGM instance
    GemWarrior.config.synthBGM = new WebAudioTinySynth({
      debug: 1,
      loop: 1,
      masterVol: GemWarrior.settings.soundBGMLevel,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  GemWarrior.config.synthBGM.setLoop(1)
  GemWarrior.config.synthBGM.setMasterVol(GemWarrior.settings.soundBGMLevel)
  GemWarrior.config.synthBGM.setProgram(0, 2)

  if (GemWarrior.config.synthBGM) {
    // console.log('* synthBGM initialized!')
  } else {
    console.error('* synthBGM could not be initialized')
  }

  if (!GemWarrior.config.synthSFX) {
    // initialize synthBGM instance
    GemWarrior.config.synthSFX = new WebAudioTinySynth({
      debug: 0,
      loop: 0,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  if (GemWarrior.config.synthSFX) {
    // console.log('* synthSFX initialized!')
  } else {
    console.error('* synthSFX could not be initialized')
  }

  console.log('[LOADED] /app/lib/misc/audio(synths)')
}

// BackGround Music
GemWarrior._playBGM = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-bgm-${action}.mid`

    GemWarrior.config.synthBGM.loadMIDIUrl(filename)

    setTimeout(() => {
      // console.log('_playBGM()', filename)

      // setInterval(() => {
      //   console.log('synthBGM.playStatus()',
      //     GemWarrior.config.synthBGM.getPlayStatus()
      //   )
      // }, 1000)

      GemWarrior.config.synthBGM.playMIDI()
    }, 20)
  }
}
GemWarrior._stopBGM = function() {
  GemWarrior.config.synthBGM.stopMIDI()
}

// Sound eFfects
GemWarrior._playSFX = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-sfx-${action}.mid`

    GemWarrior.config.synthSFX.loadMIDIUrl(filename)
    GemWarrior.config.synthSFX.setLoop(0)
    GemWarrior.config.synthSFX.setMasterVol(GemWarrior.settings.soundSFXLevel)
    GemWarrior.config.synthSFX.setProgram(0, 3)

    setTimeout(() => {
      // console.log('_playSFX()', filename)

      // setInterval(() => {
      //   console.log('playStatus', GemWarrior.config.synthBGM.getPlayStatus(), GemWarrior.config.synthBGM)
      // }, 1000)

      GemWarrior.config.synthSFX.playMIDI()
    }, 20)
  }
}

// Flags
GemWarrior._isBGMPlaying = function() {
  return GemWarrior.config.synthBGM ? GemWarrior.config.synthBGM.playing : false
}
