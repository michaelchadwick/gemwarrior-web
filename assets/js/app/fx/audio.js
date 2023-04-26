/* AUDIO */
/* global GemWarrior */
/* eslint-disable no-unused-vars */

GemWarrior._initSynths = function() {
  console.log('[INITIALIZING] synths')

  if (!GemWarrior.config.synth_bgm) {
    // initialize synth_bgm instance
    GemWarrior.config.synth_bgm = new WebAudioTinySynth({
      debug: 1,
      loop: 1,
      masterVol: GemWarrior.settings.soundBGMLevel,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  GemWarrior.config.synth_bgm.setLoop(1)
  GemWarrior.config.synth_bgm.setMasterVol(GemWarrior.settings.soundBGMLevel)
  GemWarrior.config.synth_bgm.setProgram(0, 2)

  if (GemWarrior.config.synth_bgm) {
    console.log('* synth_bgm initialized!')
  } else {
    console.error('* synth_bgm could not be initialized')
  }

  if (!GemWarrior.config.synth_sfx) {
    // initialize synth_bgm instance
    GemWarrior.config.synth_sfx = new WebAudioTinySynth({
      debug: 0,
      loop: 0,
      quality: 1, // 0: chiptune, 1: FM
      reverbLev: 0.5,
      useReverb: 1,
      voices: 8
    })
  }

  if (GemWarrior.config.synth_sfx) {
    console.log('* synth_sfx initialized!')
  } else {
    console.error('* synth_sfx could not be initialized')
  }
}
GemWarrior._playBGM = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-bgm-${action}.mid`

    GemWarrior.config.synth_bgm.loadMIDIUrl(filename)

    setTimeout(() => {
      // console.log('_playBGM()', filename)

      // setInterval(() => {
      //   console.log('synth_bgm.playStatus()',
      //     GemWarrior.config.synth_bgm.getPlayStatus()
      //   )
      // }, 1000)

      GemWarrior.config.synth_bgm.playMIDI()
    }, 20)
  }
}
GemWarrior._stopBGM = function() {
  GemWarrior.config.synth_bgm.stopMIDI()
}

GemWarrior._playSFX = function(action) {
  if (GemWarrior.settings.enableSound) {
    const filename = `/assets/audio/gw-sfx-${action}.mid`

    GemWarrior.config.synth_sfx.loadMIDIUrl(filename)
    GemWarrior.config.synth_sfx.setLoop(0)
    GemWarrior.config.synth_sfx.setMasterVol(GemWarrior.settings.soundSFXLevel)
    GemWarrior.config.synth_sfx.setProgram(0, 3)

    setTimeout(() => {
      // console.log('_playSFX()', filename)

      // setInterval(() => {
      //   console.log('playStatus', GemWarrior.config.synth_bgm.getPlayStatus(), GemWarrior.config.synth_bgm)
      // }, 1000)

      GemWarrior.config.synth_sfx.playMIDI()
    }, 20)
  }
}

GemWarrior.__isBGMPlaying = function() {
  return GemWarrior.config.synth_bgm.playing
}
