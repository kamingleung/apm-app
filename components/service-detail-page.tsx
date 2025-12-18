"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  TrendingUp,
  BarChart3,
  Zap,
  Database,
  Settings,
  GitBranch,
  Search
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TracesTab } from "@/components/traces-tab"

interface ServiceDetailPageProps {
  serviceName: string
}

// Mock service data - in a real app, this would come from an API
const getServiceData = (serviceName: string) => {
  const services = {
    "payment-service": {
      name: "payment-service",
      status: "critical",
      availability: "74.4%",
      responseTime: "1.2s",
      throughput: "234/min",
      errorRate: "25.6%",
      uptime: "99.1%",
      description: "Handles all payment processing and transaction management",
      version: "v2.1.4",
      environment: "production",
      hostedIn: "AWS ECS",
      lastDeployed: "2 hours ago"
    },
    "user-service": {
      name: "user-service",
      status: "healthy",
      availability: "99.9%",
      responseTime: "156ms",
      throughput: "847/min",
      errorRate: "0.1%",
      uptime: "99.98%",
      description: "User authentication and profile management service",
      version: "v1.8.2",
      environment: "production",
      hostedIn: "Kubernetes cluster on AWS",
      lastDeployed: "1 day ago"
    },
    "notification-service": {
      name: "notification-service",
      status: "warning",
      availability: "87.3%",
      responseTime: "312ms",
      throughput: "1.2k/min",
      errorRate: "12.7%",
      uptime: "98.5%",
      description: "Email, SMS, and push notification delivery service",
      version: "v3.0.1",
      environment: "production",
      hostedIn: "ECS Auto Scaling group on AWS",
      lastDeployed: "6 hours ago"
    }
  }

  return services[serviceName as keyof typeof services] || {
    name: serviceName,
    status: "unknown",
    availability: "N/A",
    responseTime: "N/A",
    throughput: "N/A",
    errorRate: "N/A",
    uptime: "N/A",
    description: "Service information not available",
    version: "N/A",
    environment: "N/A",
    hostedIn: "N/A",
    lastDeployed: "N/A"
  }
}

export function ServiceDetailPage({ serviceName }: ServiceDetailPageProps) {
  const service = getServiceData(serviceName)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success/10 text-success border-success/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Server className="w-4 h-4" />
    }
  }

  return (
    <div className="@container min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    APM
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link href="/services" className="transition-colors hover:text-foreground">
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{serviceName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{serviceName}</h1>
              {service.status !== "unknown" && (
                <Badge className={getStatusColor(service.status)}>
                  {getStatusIcon(service.status)}
                  <span className="ml-1 capitalize">{service.status}</span>
                </Badge>
              )}
            </div>
            {/* {service.description !== "Service information not available" && (
              <p className="text-muted-foreground">{service.description}</p>
            )} */}
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="px-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="operations">Service operations</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="service-map">Service map</TabsTrigger>
            <TabsTrigger value="traces">Traces</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview">
            <div className="space-y-6">
        {/* Service Overview */}
        <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{service.availability}</div>
                <p className="text-sm text-muted-foreground">Availability</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{service.responseTime}</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{service.throughput}</div>
                <p className="text-sm text-muted-foreground">Requests/min</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{service.errorRate}</div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Information and Performance Charts */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="text-foreground font-medium">{service.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment</span>
                <span className="text-foreground font-medium">{service.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hosted in</span>
                <span className="text-foreground font-medium">{service.hostedIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last deployed</span>
                <span className="text-foreground font-medium">{service.lastDeployed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-foreground font-medium">{service.uptime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="@lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics (Last 24 hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Performance chart visualization would go here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Response time, throughput, and error rate trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events and Dependencies */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">High error rate detected</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Response time increased</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Deployment completed</p>
                    <p className="text-xs text-muted-foreground">{service.lastDeployed}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm text-foreground">PostgreSQL Database</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm text-foreground">Redis Cache</span>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/20">Degraded</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm text-foreground">External API</span>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
            </div>
          </TabsContent>

          {/* Service Operations Tab Content */}
          <TabsContent value="operations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Service Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Service operations view</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Operation performance, endpoints, and metrics
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dependencies Tab Content */}
          <TabsContent value="dependencies">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Service Dependencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Dependencies analysis</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upstream and downstream service dependencies
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Map Tab Content */}
          <TabsContent value="service-map">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Service Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Service topology map</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Visual representation of service relationships
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traces Tab Content */}
          <TabsContent value="traces">
            <div className="space-y-6">
              <Card>
                <CardContent className="h-[calc(100vh-224px)] p-0">
                  <TracesTab />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}