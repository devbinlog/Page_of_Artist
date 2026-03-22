import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Canvas-based fallback texture ──────────────────────────────────────────
// Generated when external image fails CORS or 404.
// Shared singleton so it's only created once per session.
let _fallback: THREE.Texture | null = null

function getFallbackTexture(): THREE.Texture {
  if (_fallback) return _fallback

  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Dark gradient background
  const g = ctx.createLinearGradient(0, 0, 0, size)
  g.addColorStop(0, '#0f1f40')
  g.addColorStop(1, '#1a3060')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(79,125,243,0.12)'
  ctx.lineWidth = 1
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
  }

  // Music note icon (centred)
  ctx.fillStyle = 'rgba(108,142,255,0.35)'
  ctx.font = 'bold 96px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('♪', size / 2, size / 2)

  // Soft outer ring
  const ring = ctx.createRadialGradient(size / 2, size / 2, 60, size / 2, size / 2, 128)
  ring.addColorStop(0, 'rgba(79,125,243,0)')
  ring.addColorStop(1, 'rgba(79,125,243,0.18)')
  ctx.fillStyle = ring
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  _fallback = tex
  return tex
}

// ─── Texture settings ────────────────────────────────────────────────────────
function applySettings(tex: THREE.Texture) {
  tex.minFilter    = THREE.LinearFilter
  tex.magFilter    = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.colorSpace   = THREE.SRGBColorSpace
  // anisotropy: cap at 16 — improves quality at oblique angles
  // renderer is not available here; use a safe constant
  tex.anisotropy   = 16
  tex.needsUpdate  = true
}

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * CORS-safe texture loader.
 * • Tries URL with crossOrigin='anonymous'
 * • On failure → returns a canvas-generated fallback texture (never null after load attempt)
 * • Cleans up on unmount / URL change
 */
export function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    if (!url) {
      setTexture(getFallbackTexture())
      return
    }

    // Reset while new URL loads
    setTexture(null)

    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    loader.load(
      url,
      (tex) => {
        if (cancelledRef.current) return
        applySettings(tex)
        console.log('[Texture] ✓', url)
        setTexture(tex)
      },
      undefined,
      () => {
        if (cancelledRef.current) return
        console.warn('[Texture] ✗ CORS/404 →', url, '→ using fallback')
        setTexture(getFallbackTexture())
      },
    )

    return () => {
      cancelledRef.current = true
    }
  }, [url])

  return texture
}
