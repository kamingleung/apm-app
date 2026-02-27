"use client"

import * as React from "react"
import { 
  Settings, 
  Database, 
  Activity, 
  Server, 
  BarChart3,
  CheckCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Plus,
  Edit,
  Trash2
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock configuration data
const mockConfiguration = {
  traces: {
    configured: true,
    dataSource: "Jaeger",
    endpoint: "http://jaeger:14268/api/traces",
    status: "connected",
    lastSync: "2 minutes ago"
  },
  services: {
    configured: true,
    dataSource: "Prometheus",
    endpoint: "http://prometheus:9090",
    status: "connected", 
    lastSync: "1 minute ago"
  },
  metrics: {
    configured: false,
    dataSource: null,
    endpoint: null,
    status: "not_configured",
    lastSync: null
  }
}

const dataSourceTypes = {
  traces: [
    { value: "jaeger", label: "Jaeger", description: "Distributed tracing system" },
    { value: "zipkin", label: "Zipkin", description: "Distributed tracing system" },
    { value: "tempo", label: "Grafana Tempo", description: "High-scale distributed tracing backend" }
  ],
  services: [
    { value: "prometheus", label: "Prometheus", description: "Monitoring and alerting toolkit" },
    { value: "datadog", label: "Datadog", description: "Cloud monitoring service" },
    { value: "newrelic", label: "New Relic", description: "Application performance monitoring" }
  ],
  metrics: [
    { value: "prometheus", label: "Prometheus", description: "Monitoring and alerting toolkit" },
    { value: "influxdb", label: "InfluxDB", description: "Time series database" },
    { value: "elasticsearch", label: "Elasticsearch", description: "Search and analytics engine" }
  ]
}

export function APMConfiguration() {
  const [selectedDataSource, setSelectedDataSource] = React.useState<{
    type: 'traces' | 'services' | 'metrics' | null
    config: any
  }>({ type: null, config: null })

  const configuredCount = Object.values(mockConfiguration).filter(config => config.configured).length
  const totalCount = Object.keys(mockConfiguration).length
  const completionPercentage = (configuredCount / totalCount) * 100

  return (
    <div className="@container min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <header>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>APM</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Configuration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">APM Configuration</h1>
              <p className="text-muted-foreground">
                Configure data sources to power your APM experience
              </p>
            </div>
            <Badge className="bg-info/10 text-info border-info/20">
              <Settings className="w-3 h-3 mr-1" />
              Setup Required
            </Badge>
          </div>
        </header>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Configuration Progress
            </CardTitle>
            <CardDescription>
              {configuredCount} of {totalCount} data sources configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(completionPercentage)}% Complete</span>
                <span>{totalCount - configuredCount} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source Configuration Cards */}
        <div className="grid grid-cols-1 @lg:grid-cols-1 gap-6">
          <DataSourceCard
            title="Traces"
            description="Configure distributed tracing data source to track requests across services"
            icon={<Activity className="w-6 h-6" />}
            config={mockConfiguration.traces}
            onConfigure={() => setSelectedDataSource({ type: 'traces', config: mockConfiguration.traces })}
          />
          
          <DataSourceCard
            title="Services"
            description="Configure service discovery and health monitoring data source"
            icon={<Server className="w-6 h-6" />}
            config={mockConfiguration.services}
            onConfigure={() => setSelectedDataSource({ type: 'services', config: mockConfiguration.services })}
          />
          
          <DataSourceCard
            title="Metrics"
            description="Configure metrics collection for performance monitoring and alerting"
            icon={<Database className="w-6 h-6" />}
            config={mockConfiguration.metrics}
            onConfigure={() => setSelectedDataSource({ type: 'metrics', config: mockConfiguration.metrics })}
          />
        </div>

        {/* Configuration Dialog */}
        <ConfigurationDialog
          dataSource={selectedDataSource}
          onClose={() => setSelectedDataSource({ type: null, config: null })}
        />
      </div>
    </div>
  )
}

interface DataSourceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  config: any
  onConfigure: () => void
}

function DataSourceCard({ title, description, icon, config, onConfigure }: DataSourceCardProps) {
  const isConfigured = config.configured
  const statusConfig = {
    connected: { 
      badge: "bg-success/10 text-success border-success/20",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Connected"
    },
    error: { 
      badge: "bg-destructive/10 text-destructive border-destructive/20",
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Connection Error"
    },
    not_configured: { 
      badge: "bg-muted/50 text-muted-foreground border-muted",
      icon: <Clock className="w-3 h-3" />,
      text: "Not Configured"
    }
  }

  const status = statusConfig[config.status as keyof typeof statusConfig]

  return (
    <Card className={isConfigured ? "border-success/20" : "border-muted"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isConfigured ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge className={status.badge}>
            {status.icon}
            <span className="ml-1">{status.text}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isConfigured ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data Source</p>
                <p className="font-medium text-foreground">{config.dataSource}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Sync</p>
                <p className="font-medium text-foreground">{config.lastSync}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Endpoint</p>
              <p className="font-mono text-sm text-foreground bg-muted/30 px-2 py-1 rounded">
                {config.endpoint}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onConfigure}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Configuration
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm mb-4">
                No data source configured for {title.toLowerCase()}
              </p>
              <Button onClick={onConfigure}>
                <Plus className="w-4 h-4 mr-2" />
                Configure Data Source
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ConfigurationDialogProps {
  dataSource: {
    type: 'traces' | 'services' | 'metrics' | null
    config: any
  }
  onClose: () => void
}

function ConfigurationDialog({ dataSource, onClose }: ConfigurationDialogProps) {
  const [formData, setFormData] = React.useState({
    type: '',
    endpoint: '',
    apiKey: '',
    timeout: '30'
  })

  React.useEffect(() => {
    if (dataSource.type && dataSource.config) {
      setFormData({
        type: dataSource.config.dataSource?.toLowerCase() || '',
        endpoint: dataSource.config.endpoint || '',
        apiKey: '',
        timeout: '30'
      })
    }
  }, [dataSource])

  const isOpen = dataSource.type !== null
  const availableTypes = dataSource.type ? dataSourceTypes[dataSource.type] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure {dataSource.type ? dataSource.type.charAt(0).toUpperCase() + dataSource.type.slice(1) : ''} Data Source
          </DialogTitle>
          <DialogDescription>
            Set up your data source connection for {dataSource.type} monitoring
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Data Source Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value || '' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint URL</Label>
            <Input
              id="endpoint"
              placeholder="http://localhost:9090"
              value={formData.endpoint}
              onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key if required"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input
              id="timeout"
              type="number"
              placeholder="30"
              value={formData.timeout}
              onChange={(e) => setFormData(prev => ({ ...prev, timeout: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}