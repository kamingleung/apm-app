"use client"

import * as React from "react"
import * as echarts from "echarts"

interface FaultRateTrendChartProps {
  data: number[]
  color?: string
}

export function FaultRateTrendChart({ data, color = "#3b82f6" }: FaultRateTrendChartProps) {
  const chartRef = React.useRef<HTMLDivElement>(null)
  const chartInstance = React.useRef<echarts.ECharts | null>(null)

  React.useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const option: echarts.EChartsOption = {
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      grid: {
        left: 0,
        right: 0,
        top: 4,
        bottom: 0,
      },
      xAxis: {
        type: "category",
        show: false,
        data: data.map((_, i) => i),
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          type: "line",
          data: data,
          smooth: true,
          symbol: "none",
          lineStyle: {
            color: color,
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}40` },
              { offset: 1, color: `${color}10` },
            ]),
          },
        },
      ],
    }

    chartInstance.current.setOption(option, true)

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    
    const resizeObserver = new ResizeObserver(handleResize)
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [data, color])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  return <div ref={chartRef} className="w-full h-full" />
}
