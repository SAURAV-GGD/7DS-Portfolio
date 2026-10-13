import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = '7ds_perf_quality'

/**
 * Hardware-adaptive performance detection and user quality controller.
 * Auto-detects low-end devices, mobile screens, or constrained GPUs,
 * and allows users to toggle between "High" and "Smooth (Performance)" modes.
 */
export function usePerformanceQuality() {
  const [qualityMode, setQualityMode] = useState(() => {
    if (typeof window === 'undefined') return 'auto'
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'high' || saved === 'smooth') return saved
    return 'auto'
  })

  // Detect low-tier hardware capabilities
  const isHardwareConstrained = useMemo(() => {
    if (typeof window === 'undefined') return false
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const cores = navigator.hardwareConcurrency || 8
    const memory = navigator.deviceMemory || 8 // GB
    // Constrained if mobile or <= 4 cores or <= 4GB RAM
    return isMobile || cores <= 4 || memory <= 4
  }, [])

  // Effective mode based on hardware and user override
  const isSmoothMode = qualityMode === 'smooth' || (qualityMode === 'auto' && isHardwareConstrained)

  const toggleQualityMode = useCallback(() => {
    setQualityMode((prev) => {
      const next = prev === 'smooth' || (prev === 'auto' && isHardwareConstrained) ? 'high' : 'smooth'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [isHardwareConstrained])

  // Compute optimized 3D and rendering parameters
  const config = useMemo(() => {
    if (isSmoothMode) {
      return {
        isSmoothMode: true,
        qualityLabel: 'SMOOTH (60 FPS)',
        dpr: [1, 1.15],
        enableDepthOfField: false,
        enableBloom: true,
        bloomIntensity: 0.4,
        fireRaymarchSteps: 8,
        fireTurbulenceOctaves: 2,
        activeRoomDistance: 24,
        fireCullDistance: 32,
      }
    }
    return {
      isSmoothMode: false,
      qualityLabel: 'HIGH FIDELITY',
      dpr: [1, 1.5],
      enableDepthOfField: true,
      enableBloom: true,
      bloomIntensity: 0.55,
      fireRaymarchSteps: 12,
      fireTurbulenceOctaves: 2,
      activeRoomDistance: 32,
      fireCullDistance: 42,
    }
  }, [isSmoothMode])

  return {
    qualityMode,
    isSmoothMode,
    toggleQualityMode,
    config,
  }
}
