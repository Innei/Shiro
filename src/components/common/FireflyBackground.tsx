'use client'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useIsDark } from '~/hooks/common/use-is-dark'
import { isClientSide } from '~/lib/env'

export const FireflyBackground: FC = () => {
  const isDark = useIsDark()
  if (!isDark) return null
  return <FireflyBackgroundImpl />
}

const FireflyBackgroundImpl: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireflyRef = useRef<
    {
      x: number
      y: number
      size: number
      brightness: number
      speed: number
      angle: number
      glowIntensity: number
    }[]
  >([])
  const [dimensions, setDimensions] = useState(() =>
    isClientSide
      ? {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : { width: 0, height: 0 },
  )

  useIsomorphicLayoutEffect(() => {
    // Get canvas dimensions based on window size
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial dimensions
    updateDimensions()

    // Update on resize
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas to full dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize fireflies if they don't exist yet
    if (fireflyRef.current.length === 0) {
      const countRatio = 6
      const fireflyCount = Math.floor(
        (dimensions.width * dimensions.height) / 10000 / countRatio,
      )

      for (let i = 0; i < fireflyCount; i++) {
        // Calculate position with bias towards edges
        let x, y

        // Determine if this firefly should be near the edges
        // Higher probability (80%) for edge placement
        const isEdge = Math.random() < 0.8

        if (isEdge) {
          // Place near edges - 40% horizontal edges, 40% vertical edges
          const isHorizontalEdge = Math.random() < 0.5

          if (isHorizontalEdge) {
            // Near top or bottom edge
            x = Math.random() * dimensions.width
            const isTopEdge = Math.random() < 0.5
            const edgeDistance = 0.25 * dimensions.height // 25% from top/bottom
            y = isTopEdge
              ? Math.random() * edgeDistance
              : dimensions.height - Math.random() * edgeDistance
          } else {
            // Near left or right edge
            y = Math.random() * dimensions.height
            const isLeftEdge = Math.random() < 0.5
            const edgeDistance = 0.25 * dimensions.width // 25% from left/right
            x = isLeftEdge
              ? Math.random() * edgeDistance
              : dimensions.width - Math.random() * edgeDistance
          }
        } else {
          // For the remaining 20%, place with reduced density in center
          // Using a wider distribution but with reduced probability
          x = Math.random() * dimensions.width
          y = Math.random() * dimensions.height

          // Skip some fireflies in the center reading area
          const centerX = dimensions.width / 2
          const centerY = dimensions.height / 2
          const centerWidth = dimensions.width * 0.5 // 50% of width as center
          const centerHeight = dimensions.height * 0.6 // 60% of height as center

          // Skip if in center area (reduced density)
          if (
            Math.abs(x - centerX) < centerWidth / 2 &&
            Math.abs(y - centerY) < centerHeight / 2 &&
            Math.random() < 0.7 // 70% chance to skip fireflies in center
          ) {
            // Try again with this iteration
            i--
            continue
          }
        }

        fireflyRef.current.push({
          x,
          y,
          size: Math.random() * 1 + 0.4,
          brightness: Math.min(Math.random() + 0.5, 1),
          speed: 0.2 + Math.random() * 0.3,
          angle: Math.random() * Math.PI * 2,
          glowIntensity: 0.5 + Math.random() * 0.5,
        })
      }
    } else {
      // For window resize: adjust firefly positions to stay within bounds
      // while maintaining their relative positions
      const oldWidth = canvas.width
      const oldHeight = canvas.height

      fireflyRef.current.forEach((firefly) => {
        // Keep relative position but ensure within new bounds
        // For x coordinate
        const relativeX = firefly.x / oldWidth
        firefly.x = relativeX * dimensions.width

        // For y coordinate
        const relativeY = firefly.y / oldHeight
        firefly.y = relativeY * dimensions.height
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fireflyRef.current.forEach((firefly) => {
        // Update firefly position
        firefly.angle += (Math.random() - 0.5) * 0.1
        firefly.x += Math.cos(firefly.angle) * firefly.speed
        firefly.y += Math.sin(firefly.angle) * firefly.speed

        // Bounce off edges
        if (firefly.x < 0 || firefly.x > dimensions.width) {
          firefly.angle = Math.PI - firefly.angle
        }
        if (firefly.y < 0 || firefly.y > dimensions.height) {
          firefly.angle = -firefly.angle
        }

        // Pulsating effect
        firefly.brightness = Math.abs(
          Math.sin((Date.now() / 1000) * firefly.glowIntensity),
        )

        // Draw firefly with gradient glow
        const gradient = ctx.createRadialGradient(
          firefly.x,
          firefly.y,
          0,
          firefly.x,
          firefly.y,
          firefly.size * 5,
        )

        const alpha = firefly.brightness
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.3})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(firefly.x, firefly.y, firefly.size * 5, 0, Math.PI * 2)
        ctx.fill()

        // Draw firefly core
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${firefly.brightness})`
        ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [dimensions])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  )
}
