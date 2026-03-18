import { useState, useEffect } from 'react'
import * as THREE from 'three'

/**
 * CORS-safe texture loader with cancellation support.
 * Prevents setState after unmount via cancelled flag.
 */
export function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(url, (tex) => {
      if (cancelled) return
      tex.minFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    }, undefined, () => {})
    return () => { cancelled = true }
  }, [url])

  return texture
}
