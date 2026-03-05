"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import * as echarts from "echarts"

interface Alert {
  id: number
  severity: string
  title: string
  message: string
  time: string
}

interface AlertDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alerts: Alert[]
  selectedAlertId?: number
}

export function AlertDetailsModal({ 
  open, 
  onOpenChange, 
  alerts,
  selectedAlertId 
}: AlertDetailsModalProps) {
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null)
  const [activeTab, setActiveTab] = React.useState("overview")
  const chartRef = React.useRef<HTMLDivElement>(null)

  // Set initial selected alert
  React.useEffect(() => {
    if (selectedAlertId) {
      const alert = alerts.find(a => a.id === selectedAlertId)
      if (alert) {
        setSelectedAlert(alert)
      }
    } else if (alerts.length > 0) {
      setSelectedAlert(alerts[0])
    }
  }, [selectedAlertId, alerts, open])

  // Initialize chart
  React.useEffect(() => {
    if (!chartRef.current || !selectedAlert || !open) return

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!chartRef.current) return
      
      const chart = echarts.init(chartRef.current)

      // Generate sample data for error rate over time
      const now = Date.now()
      const data = []
      for (let i = 60; i >= 0; i--) {
        const time = new Date(now - i * 60000) // 60 minutes of data
        const errorRate = i > 45 ? Math.random() * 5 + 3 : Math.random() * 15 + 20 // Spike in last 15 min
        data.push([time, parseFloat(errorRate.toFixed(2))])
      }

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const param = params[0]
            return `${param.marker} ${param.seriesName}<br/>${new Date(param.value[0]).toLocaleTimeString()}: ${param.value[1]}%`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: (value: number) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        },
        yAxis: {
          type: 'value',
          name: 'Error Rate (%)',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: 'Error Rate',
            type: 'line',
            smooth: true,
            data: data,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
                { offset: 1, color: 'rgba(239, 68, 68, 0.05)' }
              ])
            },
            lineStyle: {
              color: 'rgb(239, 68, 68)',
              width: 2
            },
            itemStyle: {
              color: 'rgb(239, 68, 68)'
            },
            markLine: {
              silent: true,
              lineStyle: {
                color: 'rgb(234, 179, 8)',
                type: 'dashed'
              },
              data: [
                {
                  yAxis: 20,
                  label: {
                    formatter: 'Threshold: 20%',
                    position: 'end'
                  }
                }
              ]
            }
          }
        ]
      }

      chart.setOption(option)

      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.dispose()
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [selectedAlert, open])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20"
      case "Low":
        return "bg-info/10 text-info border-info/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getRootCause = (alert: Alert) => {
    // Map alert titles to specific root causes
    const rootCauseMap: Record<string, string> = {
      "Payment Service database timeout": 
        "Database connection pool exhaustion due to increased traffic following recent deployment. The service is unable to acquire connections fast enough to handle incoming requests, resulting in timeout errors.",
      
      "API Gateway rate limit exceeded": 
        "Sudden traffic spike from a specific client or bot activity overwhelming the rate limiter. The /api/checkout endpoint is receiving 3x normal traffic, likely from a misconfigured retry mechanism or automated testing script.",
      
      "User Service authentication failures": 
        "JWT signing key rotation occurred without proper grace period, causing tokens signed with the old key to fail validation. This affects users with active sessions created before the key rotation.",
      
      "Notification Service queue backlog": 
        "Third-party email provider (SendGrid) experiencing degraded performance, causing message processing to slow down. The queue is accumulating faster than messages can be delivered, with average processing time increased from 200ms to 2.5s.",
      
      "Analytics Service memory usage high": 
        "Memory leak in the data aggregation pipeline, likely from unbounded cache growth. The service is retaining processed event data in memory without proper eviction, causing gradual memory consumption increase over time.",
      
      "Cache Service hit rate degraded": 
        "Recent deployment changed cache key generation logic, causing cache misses for previously cached data. Additionally, increased traffic is causing more frequent cache evictions due to memory pressure on the Redis cluster."
    }

    return rootCauseMap[alert.title] || "Root cause analysis in progress. Initial investigation suggests potential resource constraints or configuration issues. Check recent deployments and infrastructure changes."
  }

  const getRecommendedActions = (alert: Alert) => {
    // Map alert titles to specific recommended actions
    const actionsMap: Record<string, string[]> = {
      "Payment Service database timeout": [
        "Increase database connection pool size in application configuration",
        "Review recent deployment changes and consider rollback if necessary",
        "Scale up service instances to distribute connection load",
        "Monitor database query performance and optimize slow queries"
      ],
      
      "API Gateway rate limit exceeded": [
        "Identify the source IP/client causing the traffic spike",
        "Implement stricter rate limiting rules for the affected endpoint",
        "Add request throttling and exponential backoff to client applications",
        "Consider implementing CAPTCHA or bot detection mechanisms"
      ],
      
      "User Service authentication failures": [
        "Extend JWT validation to accept both old and new signing keys temporarily",
        "Communicate with users about re-authentication requirements",
        "Review key rotation procedures to include proper grace periods",
        "Monitor authentication logs for patterns and affected user segments"
      ],
      
      "Notification Service queue backlog": [
        "Contact SendGrid support to verify their service status",
        "Implement circuit breaker pattern to prevent queue overflow",
        "Scale up notification service workers to increase processing capacity",
        "Consider implementing a secondary email provider as fallback"
      ],
      
      "Analytics Service memory usage high": [
        "Restart the analytics service to clear accumulated memory",
        "Review and implement proper cache eviction policies (LRU/TTL)",
        "Add memory profiling to identify specific leak sources",
        "Scale vertically by increasing container memory limits"
      ],
      
      "Cache Service hit rate degraded": [
        "Rollback the recent deployment that changed cache key logic",
        "Pre-warm the cache with frequently accessed data",
        "Increase Redis cluster memory allocation to reduce evictions",
        "Review cache key generation logic for consistency"
      ]
    }

    return actionsMap[alert.title] || [
      "Review service logs for error patterns and stack traces",
      "Check recent configuration or deployment changes",
      "Monitor resource utilization (CPU, memory, network)",
      "Escalate to on-call engineer if issue persists"
    ]
  }

  const getRelatedEvents = (alert: Alert) => {
    // Map alert titles to related events summary
    const eventsMap: Record<string, { count: number; summary: string }> = {
      "Payment Service database timeout": {
        count: 847,
        summary: "Database connection errors, timeout exceptions, and failed transaction logs detected across multiple service instances."
      },
      
      "API Gateway rate limit exceeded": {
        count: 1243,
        summary: "429 rate limit responses, blocked requests from suspicious IPs, and retry attempt logs from the checkout endpoint."
      },
      
      "User Service authentication failures": {
        count: 523,
        summary: "JWT validation errors, token expiration events, and authentication failure logs from affected user sessions."
      },
      
      "Notification Service queue backlog": {
        count: 2156,
        summary: "Queue depth warnings, message processing delays, SendGrid API timeout errors, and failed delivery attempts."
      },
      
      "Analytics Service memory usage high": {
        count: 342,
        summary: "Out of memory warnings, garbage collection events, heap allocation spikes, and container restart logs."
      },
      
      "Cache Service hit rate degraded": {
        count: 678,
        summary: "Cache miss events, eviction logs, Redis memory pressure warnings, and key lookup failures."
      }
    }

    return eventsMap[alert.title] || {
      count: 0,
      summary: "No related events found for this alert."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] w-full h-[85vh] sm:h-[90vh] p-0"
        showCloseButton={true}
      >
        <main className="@container h-full flex flex-col overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">Alert Details</DialogTitle>
          </DialogHeader>

          <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
            {/* Left Panel - Alerts List */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <section className="h-full flex flex-col bg-card border-r border-border overflow-hidden">
                <header className="p-3 sm:p-4 border-b border-border flex-shrink-0">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                    Alerts
                    <Badge variant="outline" className="text-xs">
                      {alerts.length}
                    </Badge>
                  </h2>
                </header>
                
                <div className="flex-1 overflow-y-auto min-h-0">
                  {alerts.map((alert) => (
                    <article
                      key={alert.id}
                      className={cn(
                        "p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedAlert?.id === alert.id
                          ? "bg-muted border-l-4 border-l-primary"
                          : ""
                      )}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <time className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </time>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-sm text-foreground">
                            {alert.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Alert Details */}
            <ResizablePanel defaultSize={65} minSize={40}>
              <section className="h-full flex flex-col bg-background overflow-hidden">
                {selectedAlert ? (
                  <>
                    <header className="p-3 sm:p-4 border-b border-border flex-shrink-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                          <h2 className="text-base sm:text-xl font-semibold text-foreground truncate">
                            {selectedAlert.title}
                          </h2>
                        </div>
                        <Button variant="default" size="sm" className="flex-shrink-0">
                          Start investigation
                        </Button>
                      </div>
                    </header>

                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <TabsList className="flex-shrink-0">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="timeline">Timeline</TabsTrigger>
                          <TabsTrigger value="related">Related Events</TabsTrigger>
                          <TabsTrigger value="actions">Actions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 flex-1 overflow-y-auto mt-4">
                          <section>
                            <h3 className="text-base font-semibold mb-3">Description</h3>
                            <p className="text-sm text-foreground mb-3">
                              {selectedAlert.message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Likely root cause:</span> {getRootCause(selectedAlert)}
                            </p>
                          </section>

                          <section>
                            <h3 className="text-base font-semibold mb-3">Error Rate Trend</h3>
                            <div ref={chartRef} className="w-full h-[300px]" />
                          </section>

                          <section>
                            <h3 className="text-base font-semibold mb-3">Recommended Actions</h3>
                            <ul className="space-y-2">
                              {getRecommendedActions(selectedAlert).map((action, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          <section className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <h3 className="text-base font-semibold mb-2">Related Events</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {getRelatedEvents(selectedAlert).count} events
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {getRelatedEvents(selectedAlert).summary}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveTab("related")}
                                className="flex-shrink-0"
                              >
                                Show events
                              </Button>
                            </div>
                          </section>

                          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
                            <section>
                              <h3 className="text-base font-semibold mb-3">Alert Information</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Severity</span>
                                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                                    {selectedAlert.severity}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status</span>
                                  <span className="text-sm font-medium">Active</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">First Detected</span>
                                  <span className="text-sm font-medium">{selectedAlert.time}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Alert ID</span>
                                  <span className="text-sm font-medium font-mono">#{selectedAlert.id}</span>
                                </div>
                              </div>
                            </section>

                            <section>
                              <h3 className="text-base font-semibold mb-3">Impact</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Affected Services</span>
                                  <span className="text-sm font-medium">1</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Error Rate</span>
                                  <span className="text-sm font-medium">25.6%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Requests Affected</span>
                                  <span className="text-sm font-medium">~60/min</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Duration</span>
                                  <span className="text-sm font-medium">2 hours</span>
                                </div>
                              </div>
                            </section>
                          </div>
                        </TabsContent>

                        <TabsContent value="timeline" className="mt-4">
                          <section>
                            <h3 className="text-base font-semibold mb-4">Alert Timeline</h3>
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-destructive" />
                                  <div className="w-px h-full bg-border" />
                                </div>
                                <div className="flex-1 pb-4">
                                  <time className="text-xs text-muted-foreground">2 min ago</time>
                                  <p className="text-sm font-medium mt-1">Alert triggered</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Error rate exceeded threshold of 20%
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-warning" />
                                  <div className="w-px h-full bg-border" />
                                </div>
                                <div className="flex-1 pb-4">
                                  <time className="text-xs text-muted-foreground">15 min ago</time>
                                  <p className="text-sm font-medium mt-1">Performance degradation detected</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Response time increased by 40%
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-info" />
                                </div>
                                <div className="flex-1">
                                  <time className="text-xs text-muted-foreground">2 hours ago</time>
                                  <p className="text-sm font-medium mt-1">Deployment completed</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Version v2.1.4 deployed to production
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>
                        </TabsContent>

                        <TabsContent value="related" className="mt-4">
                          <section>
                            <h3 className="text-base font-semibold mb-4">Related Events</h3>
                            <p className="text-sm text-muted-foreground">
                              No related events found for this alert.
                            </p>
                          </section>
                        </TabsContent>

                        <TabsContent value="actions" className="mt-4">
                          <section>
                            <h3 className="text-base font-semibold mb-4">Available Actions</h3>
                            <p className="text-sm text-muted-foreground">
                              Action configuration coming soon.
                            </p>
                          </section>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Select an alert to view details</p>
                  </div>
                )}
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </DialogContent>
    </Dialog>
  )
}
