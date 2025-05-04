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

    // Firefly properties
    const fireflies: {
      x: number
      y: number
      size: number
      brightness: number
      speed: number
      angle: number
      glowIntensity: number
    }[] = []

    // Create fireflies
    const countRatio = 6
    const fireflyCount = Math.floor(
      (dimensions.width * dimensions.height) / 10000 / countRatio,
    )
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 1 + 0.4,
        brightness: Math.min(Math.random() + 0.5, 1),
        speed: 0.2 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2,
        glowIntensity: 0.5 + Math.random() * 0.5,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fireflies.forEach((firefly) => {
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
    return () => cancelAnimationFrame(animationId)
  }, [dimensions])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  )
}
