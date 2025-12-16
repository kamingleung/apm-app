"use client"

import * as React from "react"
import Link from "next/link"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Server, 
  TrendingUp,
  MoreHorizontal,
  Filter,
  Search,
  BarChart3
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
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data for services with highest fault rates
const topFaultServices = [
  { name: "payment-service", faultRate: "100%", color: "bg-destructive" },
  { name: "notification-service", faultRate: "53.41%", color: "bg-destructive" },
  { name: "user-service", faultRate: "32.16%", color: "bg-warning" },
  { name: "analytics-service", faultRate: "30.84%", color: "bg-warning" },
  { name: "auth-service", faultRate: "25.47%", color: "bg-warning" },
]

// Mock data for dependencies with highest fault rates
const topFaultDependencies = [
  { name: "redis-cache", service: "customer-service", faultRate: "100%", color: "bg-destructive" },
  { name: "postgres-db", service: "payment-service", faultRate: "50%", color: "bg-destructive" },
  { name: "elasticsearch", service: "search-service", faultRate: "44.12%", color: "bg-warning" },
  { name: "mongodb", service: "analytics-service", faultRate: "43.68%", color: "bg-warning" },
  { name: "rabbitmq", service: "notification-service", faultRate: "41.23%", color: "bg-warning" },
]

// Mock data for all services
const allServices = [
  {
    name: "payment-service",
    sliStatus: "Not Compatible",
    availability: "74.4%",
    application: "-",
    hostedIn: "AWS ECS",
    status: "critical"
  },
  {
    name: "user-service", 
    sliStatus: "Create SLO",
    availability: "99.9%",
    application: "-",
    hostedIn: "Kubernetes cluster on AWS",
    status: "healthy"
  },
  {
    name: "notification-service",
    sliStatus: "Create SLO", 
    availability: "87.3%",
    application: "NotificationApp",
    hostedIn: "ECS Auto Scaling group on AWS",
    status: "warning"
  },
  {
    name: "analytics-service",
    sliStatus: "Create SLO",
    availability: "100%",
    application: "-", 
    hostedIn: "AWS ECS",
    status: "healthy"
  },
  {
    name: "auth-service",
    sliStatus: "Healthy",
    availability: "100%",
    application: "-",
    hostedIn: "Serverless",
    status: "healthy"
  },
  {
    name: "search-service",
    sliStatus: "Create SLO",
    availability: "100%",
    application: "NotificationApp",
    hostedIn: "ECS Cluster with EC2 auto-scaling",
    status: "healthy"
  },
  {
    name: "inventory-service",
    sliStatus: "Create SLO", 
    availability: "89.2%",
    application: "-",
    hostedIn: "Serverless",
    status: "warning"
  },
  {
    name: "recommendation-service",
    sliStatus: "Create SLO",
    availability: "100%",
    application: "-",
    hostedIn: "Lambda functions on AWS",
    status: "healthy"
  }
]

export function ServicesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="@container min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">APM</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Services</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              Show more
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Top Services and Dependencies */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          {/* Services by Highest Fault Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Services by highest fault rate (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground text-sm">Service</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground text-sm">Fault rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFaultServices.map((service) => (
                      <tr key={service.name} className="border-b hover:bg-muted/5">
                        <td className="py-2 px-3">
                          <span className="text-sm text-foreground font-medium">{service.name}</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground">{service.faultRate}</span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${service.color}`}
                                style={{ width: service.faultRate }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Dependencies by Highest Fault Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dependency paths with highest fault rate (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground text-sm">Remote service</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground text-sm">Service</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground text-sm">Fault rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFaultDependencies.map((dep) => (
                      <tr key={dep.name} className="border-b hover:bg-muted/5">
                        <td className="py-2 px-3">
                          <span className="text-sm text-foreground font-medium">{dep.name}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-sm text-muted-foreground">{dep.service}</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground">{dep.faultRate}</span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${dep.color}`}
                                style={{ width: dep.faultRate }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Services ({filteredServices.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search all filters"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">SLI status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Service Availability</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Application</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hosted in</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, index) => (
                    <ServiceRow key={service.name} service={service} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Rows per page: 10
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">1 of 1</span>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Operations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Operations by Metric (Showing data from last 3 hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Traffic Operations (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Traffic chart visualization</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Fault Operations (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Fault rate chart visualization</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Latency Operations (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Latency chart visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Dependencies Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Dependencies (Showing data from last 3 hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Traffic Dependencies (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dependencies traffic chart</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Fault Dependencies (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dependencies fault chart</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4 text-foreground">High-Latency Dependencies (Top 5)</h4>
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dependencies latency chart</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ServiceRow({ service }: { service: typeof allServices[0] }) {
  const getStatusBadge = (status: string) => {
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

  const getSLIBadge = (sliStatus: string) => {
    switch (sliStatus) {
      case "Healthy":
        return "bg-success/10 text-success border-success/20"
      case "Create SLO":
        return "bg-info/10 text-info border-info/20"
      case "Not Compatible":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <tr className="border-b hover:bg-muted/5">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: service.status === 'healthy' ? 'rgb(34 197 94)' : 
                              service.status === 'warning' ? 'rgb(234 179 8)' : 
                              'rgb(239 68 68)' 
            }}
          />
          <Link 
            href={`/services/${service.name}`}
            className="font-medium text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all cursor-pointer"
          >
            {service.name}
          </Link>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge className={getSLIBadge(service.sliStatus)}>
          {service.sliStatus}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <span className="text-foreground">{service.availability}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-muted-foreground">{service.application}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-muted-foreground">{service.hostedIn}</span>
      </td>
      <td className="py-3 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">More options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Service</DropdownMenuItem>
            <DropdownMenuItem>View Logs</DropdownMenuItem>
            <DropdownMenuItem>Configure Alerts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}