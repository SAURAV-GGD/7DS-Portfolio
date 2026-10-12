import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Procedural Web Audio API sound generator for the 7DS Wasteland.
 * Generates cinematic atmospheric drone + desert wind noise without external MP3 files.
 */
export function useAtmosphericAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const ctxRef = useRef(null)
  const masterGainRef = useRef(null)
  const droneOscRef = useRef(null)
  const noiseSourceRef = useRef(null)

  const initAudio = useCallback(() => {
    if (ctxRef.current) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    ctxRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.connect(ctx.destination)
    masterGainRef.current = masterGain

    // 1. Deep Sub-bass Cinematic Drone (52 Hz - G#1)
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(52, ctx.currentTime)

    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(52.5, ctx.currentTime) // slight detune beat

    const droneFilter = ctx.createBiquadFilter()
    droneFilter.type = 'lowpass'
    droneFilter.frequency.setValueAtTime(110, ctx.currentTime)
    droneFilter.Q.setValueAtTime(3.0, ctx.currentTime)

    const droneGain = ctx.createGain()
    droneGain.gain.setValueAtTime(0.22, ctx.currentTime)

    osc1.connect(droneFilter)
    osc2.connect(droneFilter)
    droneFilter.connect(droneGain)
    droneGain.connect(masterGain)

    osc1.start()
    osc2.start()
    droneOscRef.current = osc1

    // 2. Wasteland Wind Noise Generator
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'bandpass'
    windFilter.frequency.setValueAtTime(280, ctx.currentTime)
    windFilter.Q.setValueAtTime(1.8, ctx.currentTime)

    const windGain = ctx.createGain()
    windGain.gain.setValueAtTime(0.14, ctx.currentTime)

    whiteNoise.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(masterGain)

    whiteNoise.start()
    noiseSourceRef.current = whiteNoise
  }, [])

  const toggleSound = useCallback(() => {
    if (!ctxRef.current) {
      initAudio()
    }
    const ctx = ctxRef.current
    if (!ctx || !masterGainRef.current) return

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const targetGain = isPlaying ? 0 : 0.65
    masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
    masterGainRef.current.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 1.2)
    setIsPlaying(!isPlaying)
  }, [initAudio, isPlaying])

  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close().catch(() => {})
      }
    }
  }, [])

  return { isPlaying, toggleSound }
}
