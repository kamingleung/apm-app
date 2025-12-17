import * as React from "react"
import { cn } from "@/lib/utils"

interface InlineChartProps {
  data: number[]
  width?: number
  height?: number
  className?: string
  color?: string
}

export function InlineChart({ 
  data, 
  width = 80, 
  height = 24, 
  className,
  color
}: InlineChartProps) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  // Calculate trend direction (compare first and last values)
  const firstValue = data[0]
  const lastValue = data[data.length - 1]
  const isUpwardTrend = lastValue > firstValue

  // Use hardcoded colors that are guaranteed to work
  const trendColor = color || (isUpwardTrend ? '#ef4444' : '#22c55e') // red-500 : green-500

  // Create SVG path for line chart with proper coordinates
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 4) + 2 // Add padding
    const y = ((value - min) / range) * (height - 4) + 2 // Add padding and flip Y
    return [x, y]
  })

  // Create line path using L commands for better compatibility
  const linePath = `M ${points[0][0]},${points[0][1]} ` + 
    points.slice(1).map(([x, y]) => `L ${x},${y}`).join(' ')

  return (
    <div className={cn("inline-block bg-muted/20 rounded", className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Line chart */}
        <path
          d={linePath}
          fill="none"
          stroke={trendColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}