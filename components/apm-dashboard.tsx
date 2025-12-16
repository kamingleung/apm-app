"use client"

import * as React from "react"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  TrendingUp, 
  Users, 
  Zap,
  BarChart3,
  Eye,
  AlertCircle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Mock data for the dashboard
const mockMetrics = {
  responseTime: { value: "245ms", change: "-12%", trend: "down" as const },
  throughput: { value: "1,247", change: "+8%", trend: "up" as const },
  errorRate: { value: "0.12%", change: "-45%", trend: "down" as const },
  uptime: { value: "99.98%", change: "+0.02%", trend: "up" as const },
}

const mockServices = [
  { name: "API Gateway", status: "healthy", responseTime: "89ms", requests: "2.1k/min" },
  { name: "User Service", status: "healthy", responseTime: "156ms", requests: "847/min" },
  { name: "Payment Service", status: "warning", responseTime: "312ms", requests: "234/min" },
  { name: "Notification Service", status: "healthy", responseTime: "67ms", requests: "1.2k/min" },
  { name: "Analytics Service", status: "error", responseTime: "1.2s", requests: "45/min" },
]

const mockAlerts = [
  { id: 1, severity: "critical", message: "High error rate in Analytics Service", time: "2 min ago" },
  { id: 2, severity: "warning", message: "Increased response time in Payment Service", time: "15 min ago" },
  { id: 3, severity: "info", message: "Deployment completed successfully", time: "1 hour ago" },
]

export function APMDashboard() {
  return (
    <main className="@container min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">APM Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your application performance in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </header>

        {/* Key Metrics */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Key Metrics</h2>
          <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4">
            <MetricCard
              title="Avg Response Time"
              value={mockMetrics.responseTime.value}
              change={mockMetrics.responseTime.change}
              trend={mockMetrics.responseTime.trend}
              icon={<Clock className="w-5 h-5" />}
            />
            <MetricCard
              title="Requests/min"
              value={mockMetrics.throughput.value}
              change={mockMetrics.throughput.change}
              trend={mockMetrics.throughput.trend}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <MetricCard
              title="Error Rate"
              value={mockMetrics.errorRate.value}
              change={mockMetrics.errorRate.change}
              trend={mockMetrics.errorRate.trend}
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            <MetricCard
              title="Uptime"
              value={mockMetrics.uptime.value}
              change={mockMetrics.uptime.change}
              trend={mockMetrics.uptime.trend}
              icon={<Activity className="w-5 h-5" />}
            />
          </div>
        </section>

        {/* Services and Alerts Grid */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Services Status */}
          <section className="@lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Services Status</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Microservices Health
                </CardTitle>
                <CardDescription>
                  Real-time status of all application services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServices.map((service, index) => (
                    <ServiceRow key={index} service={service} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Alerts */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Alerts</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Latest notifications and incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Performance Charts Placeholder */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Performance Trends</h2>
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Response Time Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Traffic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Geographic map would go here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon 
}: { 
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}) {
  const isPositive = trend === "up"
  const changeColor = title.includes("Error") 
    ? (trend === "down" ? "text-success" : "text-destructive")
    : (isPositive ? "text-success" : "text-destructive")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">{icon}</div>
          <Badge 
            variant="secondary" 
            className={`${changeColor} bg-transparent border-0 p-0 text-xs font-medium`}
          >
            {change}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ServiceRow({ service }: { service: typeof mockServices[0] }) {
  const statusConfig = {
    healthy: { 
      badge: "bg-success/10 text-success border-success/20",
      icon: <CheckCircle className="w-3 h-3" />
    },
    warning: { 
      badge: "bg-warning/10 text-warning border-warning/20",
      icon: <AlertTriangle className="w-3 h-3" />
    },
    error: { 
      badge: "bg-destructive/10 text-destructive border-destructive/20",
      icon: <AlertCircle className="w-3 h-3" />
    }
  }

  const config = statusConfig[service.status as keyof typeof statusConfig]

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-current" 
             style={{ color: service.status === 'healthy' ? 'rgb(34 197 94)' : 
                             service.status === 'warning' ? 'rgb(234 179 8)' : 
                             'rgb(239 68 68)' }} />
        <div>
          <p className="font-medium text-foreground">{service.name}</p>
          <p className="text-sm text-muted-foreground">{service.requests}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{service.responseTime}</span>
        <Badge className={config.badge}>
          {config.icon}
          <span className="ml-1 capitalize">{service.status}</span>
        </Badge>
      </div>
    </div>
  )
}

function AlertItem({ alert }: { alert: typeof mockAlerts[0] }) {
  const severityConfig = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20"
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <Badge className={severityConfig[alert.severity as keyof typeof severityConfig]}>
        {alert.severity}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{alert.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
      </div>
    </div>
  )
}