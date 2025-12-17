"use client"

import * as React from "react"
import Link from "next/link"
import { 
  AlertTriangle, 
  Clock, 
  Database, 
  Server, 
  TrendingUp,
  MoreHorizontal,
  Filter,
  Search,
  BarChart3
} from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { InlineChart } from "@/components/ui/inline-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTable, SortableHeader } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

import { services, getTopServicesByFaultRate, getTopDependenciesByFaultRate, Service } from "@/lib/sample-data"

// Convert throughput from per minute to per second
const convertToPerSecond = (throughput: string) => {
  const match = throughput.match(/^([\d,]+(?:\.\d+)?)(\/min|k\/min)$/)
  if (!match) return throughput
  
  const [, value, unit] = match
  const numValue = parseFloat(value.replace(',', ''))
  
  if (unit === 'k/min') {
    const perSecond = (numValue * 1000) / 60
    return perSecond >= 1000 ? `${(perSecond / 1000).toFixed(1)}k/s` : `${Math.round(perSecond)}/s`
  } else {
    const perSecond = numValue / 60
    return perSecond >= 1000 ? `${(perSecond / 1000).toFixed(1)}k/s` : `${Math.round(perSecond)}/s`
  }
}

// Column definitions for the services table
const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    size: 250,
    minSize: 180,
    cell: ({ row }) => {
      const service = row.original
      return (
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
      )
    },
  },
  {
    accessorKey: "environment",
    header: ({ column }) => (
      <SortableHeader column={column}>Environment</SortableHeader>
    ),
    size: 140,
    minSize: 110,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("environment")}</span>
    ),
  },
  {
    accessorKey: "hostedIn",
    header: ({ column }) => (
      <SortableHeader column={column}>Hosted in</SortableHeader>
    ),
    size: 220,
    minSize: 160,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("hostedIn")}</span>
    ),
  },
  {
    accessorKey: "throughput",
    header: ({ column }) => (
      <SortableHeader column={column}>Requests</SortableHeader>
    ),
    size: 180,
    minSize: 140,
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium">
            {convertToPerSecond(service.throughput)}
          </span>
          {service.requestsTimeSeries && (
            <InlineChart 
              data={service.requestsTimeSeries} 
              width={60} 
              height={20}
            />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "errorRate",
    header: ({ column }) => (
      <SortableHeader column={column}>Errors</SortableHeader>
    ),
    size: 160,
    minSize: 120,
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium">{service.errorRate}</span>
          {service.errorsTimeSeries && (
            <InlineChart 
              data={service.errorsTimeSeries} 
              width={60} 
              height={20}
            />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "responseTime",
    header: ({ column }) => (
      <SortableHeader column={column}>Durations</SortableHeader>
    ),
    size: 170,
    minSize: 130,
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium">{service.responseTime}</span>
          {service.durationsTimeSeries && (
            <InlineChart 
              data={service.durationsTimeSeries} 
              width={60} 
              height={20}
            />
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableResizing: false,
    size: 80,
    cell: ({ row }) => {
      const service = row.original
      return (
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
      )
    },
  },
]

export function ServicesPage() {

  const topFaultServices = getTopServicesByFaultRate(5)
  const topFaultDependencies = getTopDependenciesByFaultRate(5)

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Service</TableHead>
                    <TableHead className="text-right">Fault rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFaultServices.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell>
                        <span className="text-sm text-foreground font-medium">{service.name}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-muted-foreground">{service.faultRate}</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${service.color}`}
                              style={{ width: service.faultRate }}
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

          {/* Dependencies by Highest Fault Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dependency paths with highest fault rate (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Remote service</TableHead>
                    <TableHead className="text-left">Service</TableHead>
                    <TableHead className="text-right">Fault rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFaultDependencies.map((dep) => (
                    <TableRow key={dep.name}>
                      <TableCell>
                        <span className="text-sm text-foreground font-medium">{dep.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{dep.service}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-muted-foreground">{dep.faultRate}</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${dep.color}`}
                              style={{ width: dep.faultRate }}
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

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Services ({services.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={services} 
              searchKey="name"
              searchPlaceholder="Search services..."
            />
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
