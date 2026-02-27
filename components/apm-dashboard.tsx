"use client"

import * as React from "react"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  TrendingUp, 
  AlertCircle,
  Search,
  ArrowUpRight
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  { 
    id: 1, 
    severity: "High", 
    title: "frontend-proxy latency spiked",
    message: "Latency spike of Payment service in pet-clinic-frontend-java correlates with database query execution time increase.",
    time: "2 min ago" 
  },
  { 
    id: 2, 
    severity: "High", 
    title: "frontend-proxy latency spiked",
    message: "Latency spike of Payment service in pet-clinic-frontend-java correlates with database query execution time increase.",
    time: "15 min ago" 
  },
  { 
    id: 3, 
    severity: "High", 
    title: "frontend-proxy latency spiked",
    message: "Latency spike of Payment service in pet-clinic-frontend-java correlates with database query execution time increase.",
    time: "1 hour ago" 
  },
  { 
    id: 4, 
    severity: "High", 
    title: "frontend-proxy latency spiked",
    message: "Latency spike of Payment service in pet-clinic-frontend-java correlates with database query execution time increase.",
    time: "3 hours ago" 
  },
]

const suggestedQueries = [
  "Instrument more data",
  "Invite users",
  "Create alerts for my services",
  "What happened during the last deployment",
  "Show critical alerts for payment service"
]

const topServicesByFaultRate = [
  { service: "frontend-proxy", faultRate: 58.62 },
  { service: "checkout", faultRate: 58.45 },
  { service: "frontend", faultRate: 55.03 },
  { service: "flagd", faultRate: 24.49 },
]

const topDependencyPaths = [
  { dependency: "checkout", service: "frontend", faultRate: 100.00 },
  { dependency: "recommendation", service: "frontend", faultRate: 100.00 },
  { dependency: "frontend", service: "frontend-proxy", faultRate: 57.83 },
  { dependency: "product-reviews", service: "frontend", faultRate: 47.06 },
]

export function APMDashboard() {
  const [timeRange, setTimeRange] = React.useState("15m")
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <div 
      className="@container min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: "url('/landing_bg.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          {/* Header with Logo */}
          <header className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="mb-6">
              <img 
                src="/opensearch_mark_on_light.svg" 
                alt="Observability" 
                className="h-11 w-auto"
              />
            </div>
            
            {/* Search Bar */}
            <div className="w-full max-w-3xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ask OpenSearch"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 h-12 text-base bg-background"
                />
                <Button 
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Suggested Queries */}
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-background hover:bg-accent"
                    onClick={() => setSearchQuery(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          </header>

          {/* Tabs */}
          <Tabs defaultValue="insights" className="w-full">
            <TabsList>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
              <TabsTrigger value="application-map">
                Application map
              </TabsTrigger>
              <TabsTrigger value="services">
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-6">
              {/* Related Alerts */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">14 related alerts</h2>
                <p className="text-sm text-muted-foreground mb-4">4 High 5 Medium</p>
                
                <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4">
                  {mockAlerts.map((alert) => (
                    <Card key={alert.id} className="bg-card border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-semibold">
                            {alert.title}
                          </CardTitle>
                          <Badge className="bg-destructive text-destructive-foreground">
                            {alert.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {alert.message}
                        </p>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          View more
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Services Status */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">3/40 services are unhealthy</h2>
                
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
                  {/* Top services by fault rate */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top services by fault rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topServicesByFaultRate.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-primary font-normal"
                              >
                                {item.service}
                              </Button>
                              <span className="text-sm text-foreground font-medium">
                                {item.faultRate.toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${item.faultRate}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top dependency paths by fault rate */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top dependency paths by fault rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topDependencyPaths.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-primary font-normal"
                                >
                                  {item.dependency}
                                </Button>
                                <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-primary font-normal"
                                >
                                  {item.service}
                                </Button>
                              </div>
                              <span className="text-sm text-foreground font-medium">
                                {item.faultRate.toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${item.faultRate}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="application-map">
              <div className="text-center py-12 text-muted-foreground">
                <p>Application map view coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="text-center py-12 text-muted-foreground">
                <p>Services view coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
