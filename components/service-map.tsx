"use client"

import { useState, useEffect } from "react"
import { 
  Database, 
  Server, 
  Cloud, 
  Zap,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface ServiceNode {
  id: string
  name: string
  type: "service" | "database" | "cache" | "queue" | "external"
  status: "healthy" | "warning" | "critical"
  x: number
  y: number
  connections: string[]
}

interface ServiceMapProps {
  serviceName: string
}

// Mock service topology data - in a real app, this would come from an API
const getServiceTopology = (serviceName: string): ServiceNode[] => {
  const topologies: Record<string, ServiceNode[]> = {
    "payment-service": [
      {
        id: "payment-service",
        name: "payment-service",
        type: "service",
        status: "critical",
        x: 400,
        y: 200,
        connections: ["postgres-db", "redis-cache", "user-service", "notification-service"]
      },
      {
        id: "user-service",
        name: "user-service", 
        type: "service",
        status: "healthy",
        x: 200,
        y: 100,
        connections: ["auth-service", "redis-cache"]
      },
      {
        id: "notification-service",
        name: "notification-service",
        type: "service", 
        status: "warning",
        x: 600,
        y: 100,
        connections: ["rabbitmq", "email-gateway"]
      },
      {
        id: "auth-service",
        name: "auth-service",
        type: "service",
        status: "healthy",
        x: 100,
        y: 50,
        connections: []
      },
      {
        id: "postgres-db",
        name: "PostgreSQL",
        type: "database",
        status: "critical",
        x: 300,
        y: 350,
        connections: []
      },
      {
        id: "redis-cache",
        name: "Redis Cache",
        type: "cache",
        status: "warning",
        x: 500,
        y: 350,
        connections: []
      },
      {
        id: "rabbitmq",
        name: "RabbitMQ",
        type: "queue",
        status: "warning",
        x: 700,
        y: 250,
        connections: []
      },
      {
        id: "email-gateway",
        name: "Email Gateway",
        type: "external",
        status: "healthy",
        x: 750,
        y: 50,
        connections: []
      }
    ],
    "user-service": [
      {
        id: "user-service",
        name: "user-service",
        type: "service",
        status: "healthy",
        x: 400,
        y: 200,
        connections: ["auth-service", "redis-cache", "postgres-db"]
      },
      {
        id: "auth-service",
        name: "auth-service",
        type: "service",
        status: "healthy",
        x: 200,
        y: 100,
        connections: ["jwt-service"]
      },
      {
        id: "jwt-service",
        name: "JWT Service",
        type: "external",
        status: "healthy",
        x: 100,
        y: 50,
        connections: []
      },
      {
        id: "postgres-db",
        name: "PostgreSQL",
        type: "database",
        status: "healthy",
        x: 300,
        y: 350,
        connections: []
      },
      {
        id: "redis-cache",
        name: "Redis Cache",
        type: "cache",
        status: "healthy",
        x: 500,
        y: 350,
        connections: []
      }
    ],
    "notification-service": [
      {
        id: "notification-service",
        name: "notification-service",
        type: "service",
        status: "warning",
        x: 400,
        y: 200,
        connections: ["rabbitmq", "email-gateway", "sms-gateway", "push-gateway"]
      },
      {
        id: "rabbitmq",
        name: "RabbitMQ",
        type: "queue",
        status: "warning",
        x: 300,
        y: 350,
        connections: []
      },
      {
        id: "email-gateway",
        name: "Email Gateway",
        type: "external",
        status: "healthy",
        x: 200,
        y: 100,
        connections: []
      },
      {
        id: "sms-gateway",
        name: "SMS Gateway",
        type: "external",
        status: "healthy",
        x: 600,
        y: 100,
        connections: []
      },
      {
        id: "push-gateway",
        name: "Push Gateway",
        type: "external",
        status: "healthy",
        x: 500,
        y: 350,
        connections: []
      }
    ]
  }

  return topologies[serviceName] || [
    {
      id: serviceName,
      name: serviceName,
      type: "service",
      status: "healthy",
      x: 400,
      y: 200,
      connections: []
    }
  ]
}

const getNodeIcon = (type: ServiceNode["type"]) => {
  switch (type) {
    case "service":
      return Server
    case "database":
      return Database
    case "cache":
      return Zap
    case "queue":
      return Clock
    case "external":
      return Cloud
    default:
      return Server
  }
}

const getStatusColor = (status: ServiceNode["status"]) => {
  switch (status) {
    case "healthy":
      return "bg-success text-success-foreground border-success"
    case "warning":
      return "bg-warning text-warning-foreground border-warning"
    case "critical":
      return "bg-destructive text-destructive-foreground border-destructive"
    default:
      return "bg-muted text-muted-foreground border-muted"
  }
}

const getStatusIcon = (status: ServiceNode["status"]) => {
  switch (status) {
    case "healthy":
      return CheckCircle
    case "warning":
      return AlertTriangle
    case "critical":
      return AlertTriangle
    default:
      return Server
  }
}

export function ServiceMap({ serviceName }: ServiceMapProps) {
  const [nodes, setNodes] = useState<ServiceNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    const topology = getServiceTopology(serviceName)
    setNodes(topology)
  }, [serviceName])

  const renderConnection = (from: ServiceNode, to: ServiceNode) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Calculate arrow position (80% along the line)
    const arrowX = from.x + dx * 0.8
    const arrowY = from.y + dy * 0.8
    
    // Calculate arrow rotation
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return (
      <g key={`${from.id}-${to.id}`}>
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.6"
        />
        <g transform={`translate(${arrowX}, ${arrowY}) rotate(${angle})`}>
          <polygon
            points="-8,-4 0,0 -8,4"
            fill="hsl(var(--border))"
            opacity="0.6"
          />
        </g>
      </g>
    )
  }

  const renderNode = (node: ServiceNode) => {
    const Icon = getNodeIcon(node.type)
    const StatusIcon = getStatusIcon(node.status)
    const isSelected = selectedNode === node.id
    const isMainService = node.id === serviceName

    return (
      <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
        {/* Node background */}
        <circle
          cx="0"
          cy="0"
          r={isMainService ? "45" : "35"}
          fill="hsl(var(--card))"
          stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
          strokeWidth={isSelected ? "3" : "2"}
          className="cursor-pointer transition-all hover:stroke-primary"
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
        />
        
        {/* Main service highlight ring */}
        {isMainService && (
          <circle
            cx="0"
            cy="0"
            r="50"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.5"
          />
        )}
        
        {/* Node icon */}
        <foreignObject x="-12" y="-12" width="24" height="24">
          <Icon className="w-6 h-6 text-foreground" />
        </foreignObject>
        
        {/* Status indicator */}
        <foreignObject x="15" y="-20" width="16" height="16">
          <div className={cn(
            "w-4 h-4 rounded-full flex items-center justify-center",
            getStatusColor(node.status)
          )}>
            <StatusIcon className="w-2.5 h-2.5" />
          </div>
        </foreignObject>
        
        {/* Node label */}
        <text
          x="0"
          y={isMainService ? "60" : "50"}
          textAnchor="middle"
          className="fill-foreground text-sm font-medium"
        >
          {node.name}
        </text>
        
        {/* Node type label */}
        <text
          x="0"
          y={isMainService ? "75" : "65"}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          {node.type}
        </text>
      </g>
    )
  }

  const mainService = nodes.find(node => node.id === serviceName)
  const connectedNodes = nodes.filter(node => 
    mainService?.connections.includes(node.id) || node.id === serviceName
  )

  return (
    <main className="@container w-full h-full">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        {/* Service Map Visualization */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <section className="h-full bg-card">
            <div className="p-6 h-full">
              <div className="relative w-full h-full min-h-[500px] bg-muted/20 rounded-lg overflow-hidden">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 400"
                  className="absolute inset-0"
                >
                  {/* Render connections */}
                  {mainService && mainService.connections.map(connectionId => {
                    const targetNode = nodes.find(n => n.id === connectionId)
                    if (targetNode) {
                      return renderConnection(mainService, targetNode)
                    }
                    return null
                  })}
                  
                  {/* Render nodes */}
                  {connectedNodes.map(renderNode)}
                </svg>
                
                {/* Legend */}
                <div className="absolute top-4 right-4 bg-card border rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span>Healthy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span>Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span>Critical</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Service Details Panel */}
        <ResizablePanel defaultSize={30} minSize={25}>
          <aside className="h-full bg-background border-l border-border">
            {/* Panel Header */}
            <header className="p-4 border-b border-border bg-card">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedNode ? (
                  (() => {
                    const node = nodes.find(n => n.id === selectedNode)
                    if (!node) return "Service Details"
                    
                    const Icon = getNodeIcon(node.type)
                    return (
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span>{node.name}</span>
                        <Badge className={cn(
                          "text-xs ml-auto",
                          node.status === "healthy" && "bg-success/10 text-success border-success/20",
                          node.status === "warning" && "bg-warning/10 text-warning border-warning/20",
                          node.status === "critical" && "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {node.status}
                        </Badge>
                      </div>
                    )
                  })()
                ) : (
                  "Service Details"
                )}
              </h2>
            </header>

            {/* Panel Content */}
            <div className="p-4 space-y-4 h-full overflow-auto">
              <Card>
                <CardContent className="p-4">
                  {selectedNode ? (
                    <div className="space-y-3">
                      {(() => {
                        const node = nodes.find(n => n.id === selectedNode)
                        if (!node) return null
                        
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type</span>
                              <span className="capitalize">{node.type}</span>
                            </div>
                            {node.connections.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">Connections</span>
                                <div className="mt-1 space-y-1">
                                  {node.connections.map(connId => {
                                    const connNode = nodes.find(n => n.id === connId)
                                    return connNode ? (
                                      <div key={connId} className="text-xs bg-muted/50 rounded px-2 py-1">
                                        {connNode.name}
                                      </div>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click on a node to view details
                    </p>
                  )}
                </CardContent>
              </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Topology Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Services</span>
                  <span>{nodes.filter(n => n.type === "service").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dependencies</span>
                  <span>{nodes.filter(n => n.type !== "service").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections</span>
                  <span>{mainService?.connections.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}