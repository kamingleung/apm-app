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
import { AlertDetailsModal } from "@/components/alert-details-modal"
import { FaultRateTrendChart } from "@/components/ui/fault-rate-trend-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    title: "Payment Service database timeout",
    message: "Database connection pool exhausted. Multiple queries timing out after 30s. Immediate attention required.",
    time: "2 min ago" 
  },
  { 
    id: 2, 
    severity: "High", 
    title: "API Gateway rate limit exceeded",
    message: "Rate limiting triggered for /api/checkout endpoint. 429 responses increased by 340% in the last 10 minutes.",
    time: "15 min ago" 
  },
  { 
    id: 3, 
    severity: "High", 
    title: "User Service authentication failures",
    message: "JWT validation errors spiked to 15% of requests. Token expiration or signing key mismatch detected.",
    time: "1 hour ago" 
  },
  { 
    id: 4, 
    severity: "Medium", 
    title: "Notification Service queue backlog",
    message: "Message queue depth increased to 10k+ messages. Processing rate is slower than ingestion rate.",
    time: "3 hours ago" 
  },
  { 
    id: 5, 
    severity: "Medium", 
    title: "Analytics Service memory usage high",
    message: "Memory consumption exceeded 85% threshold. Consider scaling horizontally or optimizing data aggregation.",
    time: "5 hours ago" 
  },
  { 
    id: 6, 
    severity: "Medium", 
    title: "Cache Service hit rate degraded",
    message: "Redis cache hit rate dropped from 92% to 67%. Possible cache eviction or key expiration issues.",
    time: "6 hours ago" 
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
  { 
    service: "checkout", 
    faultRate: 58.8, 
    trendData: [45, 48, 52, 55, 58, 60, 59, 58, 57, 58, 59, 60, 59, 58.5, 58.8] 
  },
  { 
    service: "frontend", 
    faultRate: 24.5, 
    trendData: [18, 20, 22, 25, 28, 26, 24, 23, 24, 25, 26, 25, 24, 24.2, 24.5] 
  },
  { 
    service: "payment-gateway", 
    faultRate: 12.3, 
    trendData: [8, 9, 10, 11, 13, 15, 14, 13, 12, 11, 12, 13, 12.5, 12.8, 12.3] 
  },
  { 
    service: "recommendation", 
    faultRate: 5.7, 
    trendData: [2, 3, 4, 5, 6, 7, 6.5, 6, 5.5, 5, 5.2, 5.5, 5.8, 5.9, 5.7] 
  },
  { 
    service: "frontend-proxy", 
    faultRate: 0.8, 
    trendData: [0.2, 0.3, 0.5, 0.6, 0.8, 1.0, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 0.85, 0.8] 
  },
]

const topDependencyPaths = [
  { 
    dependency: "checkout", 
    service: "frontend", 
    faultRate: 100.0,
    trendData: [95, 96, 97, 98, 99, 100, 100, 99, 98, 99, 100, 100, 99, 99.5, 100]
  },
  { 
    dependency: "recommendation", 
    service: "frontend", 
    faultRate: 100.0,
    trendData: [92, 94, 96, 98, 99, 100, 100, 100, 99, 98, 99, 100, 100, 100, 100]
  },
  { 
    dependency: "frontend", 
    service: "frontend-proxy", 
    faultRate: 57.8,
    trendData: [48, 50, 52, 54, 56, 58, 59, 58, 57, 56, 57, 58, 58.5, 58, 57.8]
  },
  { 
    dependency: "product-reviews", 
    service: "frontend", 
    faultRate: 47.1,
    trendData: [38, 40, 42, 45, 47, 49, 48, 47, 46, 45, 46, 47, 47.5, 47.2, 47.1]
  },
  { 
    dependency: "cart-service", 
    service: "checkout", 
    faultRate: 32.4,
    trendData: [25, 27, 29, 31, 33, 35, 34, 33, 32, 31, 32, 33, 32.8, 32.5, 32.4]
  },
]

export function APMDashboard() {
  const [timeRange, setTimeRange] = React.useState("15m")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [alertModalOpen, setAlertModalOpen] = React.useState(false)
  const [selectedAlertId, setSelectedAlertId] = React.useState<number | undefined>()

  return (
    <div 
      className="@container min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: "url('/landing_bg.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundColor: "rgba(255, 255, 255, 0.65)", backgroundBlendMode: 'lighten'}}
    >
      <div className="min-h-screen backdrop-blur-sm">
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
                
                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="flex gap-4 pb-4">
                    {mockAlerts.map((alert) => (
                      <Card key={alert.id} className="bg-card border flex-shrink-0 w-[320px]">
                        <CardHeader className="pb-1">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold">
                              {alert.title}
                            </CardTitle>
                            <Badge className="bg-destructive text-destructive-foreground">
                              {alert.severity}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-1">
                          <p className="text-sm text-muted-foreground mb-3">
                            {alert.message}
                          </p>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary"
                            onClick={() => {
                              setSelectedAlertId(alert.id)
                              setAlertModalOpen(true)
                            }}
                          >
                            View more
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                    <CardContent className="px-6 pb-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px] pl-0">Service</TableHead>
                            <TableHead className="text-right pr-0">Avg. failure ratio</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topServicesByFaultRate.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="pl-0">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-primary font-normal"
                                >
                                  {item.service}
                                </Button>
                              </TableCell>
                              <TableCell className="pr-0">
                                <div className="flex items-center justify-end gap-3">
                                  <span className="text-sm text-foreground font-medium min-w-[50px] text-right">
                                    {item.faultRate.toFixed(1)}%
                                  </span>
                                  <div className="w-[120px] h-[30px]">
                                    <FaultRateTrendChart 
                                      data={item.trendData}
                                      color="#ef4444"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Top dependency paths by fault rate */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top dependency paths by fault rate</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px] pl-0">Dependency path</TableHead>
                            <TableHead className="text-right pr-0">Avg. failure ratio</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topDependencyPaths.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="pl-0">
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
                              </TableCell>
                              <TableCell className="pr-0">
                                <div className="flex items-center justify-end gap-3">
                                  <span className="text-sm text-foreground font-medium min-w-[50px] text-right">
                                    {item.faultRate.toFixed(1)}%
                                  </span>
                                  <div className="w-[120px] h-[30px]">
                                    <FaultRateTrendChart 
                                      data={item.trendData}
                                      color="#ef4444"
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

      {/* Alert Details Modal */}
      <AlertDetailsModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        alerts={mockAlerts}
        selectedAlertId={selectedAlertId}
      />
    </div>
  )
}
