// Sample APM data for the application
export interface Service {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "unknown"
  availability: string
  responseTime: string
  throughput: string
  errorRate: string
  uptime: string
  description: string
  version: string
  environment: string
  hostedIn: string
  lastDeployed: string
  requests: string
  requestsTimeSeries?: number[]
  errorsTimeSeries?: number[]
  durationsTimeSeries?: number[]
}

export interface Metric {
  name: string
  value: string
  change: string
  trend: "up" | "down"
}

export interface Alert {
  id: number
  severity: "critical" | "warning" | "info"
  message: string
  time: string
  service?: string
}

export interface Dependency {
  name: string
  service: string
  status: "healthy" | "warning" | "critical"
  responseTime: string
  errorRate: string
}

export interface Trace {
  id: string
  operationName: string
  service: string
  duration: number
  timestamp: string
  status: "success" | "error" | "timeout"
  spans: Span[]
}

export interface Span {
  id: string
  operationName: string
  service: string
  duration: number
  startTime: number
  tags: Record<string, string>
  logs?: LogEntry[]
}

export interface LogEntry {
  timestamp: number
  level: "info" | "warn" | "error"
  message: string
}

export interface Event {
  id: string
  type: "deployment" | "alert" | "incident" | "recovery"
  message: string
  timestamp: string
  service: string
  severity?: "info" | "warning" | "critical"
}

// Sample Services Data
export const services: Service[] = [
  {
    id: "payment-service",
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
    lastDeployed: "2 hours ago",
    requests: "234/min",
    requestsTimeSeries: [180, 220, 190, 240, 200, 180, 160, 140, 120, 100, 90, 80, 70, 60, 50],
    errorsTimeSeries: [15, 18, 22, 28, 35, 40, 45, 50, 55, 60, 58, 52, 48, 45, 60],
    durationsTimeSeries: [800, 900, 1000, 1100, 1200, 1300, 1250, 1200, 1150, 1100, 1050, 1000, 950, 900, 1200]
  },
  {
    id: "user-service",
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
    lastDeployed: "1 day ago",
    requests: "847/min",
    requestsTimeSeries: [700, 720, 750, 780, 800, 820, 840, 860, 850, 870, 880, 860, 850, 840, 847],
    errorsTimeSeries: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    durationsTimeSeries: [140, 145, 150, 155, 160, 158, 156, 154, 152, 150, 148, 150, 152, 154, 156]
  },
  {
    id: "notification-service",
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
    lastDeployed: "6 hours ago",
    requests: "1.2k/min",
    requestsTimeSeries: [1100, 1150, 1200, 1250, 1300, 1280, 1220, 1180, 1150, 1100, 1050, 1000, 950, 900, 1200],
    errorsTimeSeries: [8, 10, 12, 15, 18, 20, 22, 18, 15, 12, 10, 8, 6, 8, 15],
    durationsTimeSeries: [280, 290, 300, 310, 320, 315, 312, 310, 308, 305, 300, 295, 290, 300, 312]
  },
  {
    id: "analytics-service",
    name: "analytics-service",
    status: "critical",
    availability: "45.2%",
    responseTime: "2.1s",
    throughput: "45/min",
    errorRate: "54.8%",
    uptime: "89.2%",
    description: "Real-time analytics and reporting service",
    version: "v2.3.1",
    environment: "production",
    hostedIn: "AWS ECS",
    lastDeployed: "3 hours ago",
    requests: "45/min",
    requestsTimeSeries: [80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 45],
    errorsTimeSeries: [35, 40, 45, 50, 55, 60, 58, 55, 52, 48, 45, 42, 40, 38, 55],
    durationsTimeSeries: [1800, 1900, 2000, 2100, 2200, 2150, 2100, 2050, 2000, 1950, 1900, 1850, 1800, 1900, 2100]
  },
  {
    id: "auth-service",
    name: "auth-service",
    status: "healthy",
    availability: "99.8%",
    responseTime: "89ms",
    throughput: "2.1k/min",
    errorRate: "0.2%",
    uptime: "99.95%",
    description: "Authentication and authorization service",
    version: "v1.5.3",
    environment: "production",
    hostedIn: "Serverless",
    lastDeployed: "5 days ago",
    requests: "2.1k/min",
    requestsTimeSeries: [1800, 1900, 2000, 2100, 2200, 2150, 2100, 2050, 2000, 1950, 2000, 2050, 2100, 2150, 2100],
    errorsTimeSeries: [2, 1, 2, 1, 3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2],
    durationsTimeSeries: [85, 87, 89, 91, 93, 92, 90, 88, 86, 84, 85, 87, 89, 90, 89]
  },
  {
    id: "search-service",
    name: "search-service",
    status: "healthy",
    availability: "98.7%",
    responseTime: "245ms",
    throughput: "567/min",
    errorRate: "1.3%",
    uptime: "99.2%",
    description: "Full-text search and indexing service",
    version: "v2.0.8",
    environment: "production",
    hostedIn: "ECS Cluster with EC2 auto-scaling",
    lastDeployed: "2 days ago",
    requests: "567/min",
    requestsTimeSeries: [500, 520, 540, 560, 580, 570, 565, 560, 555, 550, 545, 550, 560, 565, 567],
    errorsTimeSeries: [5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7],
    durationsTimeSeries: [230, 235, 240, 245, 250, 248, 245, 243, 240, 238, 235, 240, 243, 245, 245]
  },
  {
    id: "inventory-service",
    name: "inventory-service",
    status: "warning",
    availability: "89.2%",
    responseTime: "678ms",
    throughput: "123/min",
    errorRate: "10.8%",
    uptime: "97.8%",
    description: "Product inventory and stock management",
    version: "v1.9.4",
    environment: "production",
    hostedIn: "Serverless",
    lastDeployed: "4 hours ago",
    requests: "123/min",
    requestsTimeSeries: [150, 140, 135, 130, 125, 120, 115, 110, 105, 100, 95, 100, 110, 120, 123],
    errorsTimeSeries: [12, 14, 16, 18, 15, 13, 11, 9, 8, 10, 12, 14, 16, 15, 13],
    durationsTimeSeries: [620, 640, 660, 680, 700, 690, 678, 670, 665, 660, 650, 655, 665, 670, 678]
  },
  {
    id: "recommendation-service",
    name: "recommendation-service",
    status: "healthy",
    availability: "96.5%",
    responseTime: "423ms",
    throughput: "289/min",
    errorRate: "3.5%",
    uptime: "98.9%",
    description: "AI-powered product recommendation engine",
    version: "v3.2.1",
    environment: "production",
    hostedIn: "Lambda functions on AWS",
    lastDeployed: "1 day ago",
    requests: "289/min",
    requestsTimeSeries: [250, 260, 270, 280, 290, 295, 300, 295, 290, 285, 280, 275, 280, 285, 289],
    errorsTimeSeries: [8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 8, 9, 10, 11, 10],
    durationsTimeSeries: [400, 410, 420, 430, 440, 435, 423, 420, 418, 415, 410, 415, 420, 425, 423]
  }
]

// Sample Metrics Data
export const metrics: Record<string, Metric> = {
  responseTime: { name: "Avg Response Time", value: "245ms", change: "-12%", trend: "down" },
  throughput: { name: "Requests/min", value: "1,247", change: "+8%", trend: "up" },
  errorRate: { name: "Error Rate", value: "0.12%", change: "-45%", trend: "down" },
  uptime: { name: "Uptime", value: "99.98%", change: "+0.02%", trend: "up" },
}

// Sample Alerts Data
export const alerts: Alert[] = [
  {
    id: 1,
    severity: "critical",
    message: "High error rate in Analytics Service (54.8%)",
    time: "2 min ago",
    service: "analytics-service"
  },
  {
    id: 2,
    severity: "critical", 
    message: "Payment Service availability dropped below 80%",
    time: "5 min ago",
    service: "payment-service"
  },
  {
    id: 3,
    severity: "warning",
    message: "Increased response time in Notification Service",
    time: "15 min ago",
    service: "notification-service"
  },
  {
    id: 4,
    severity: "warning",
    message: "Inventory Service error rate above threshold",
    time: "23 min ago",
    service: "inventory-service"
  },
  {
    id: 5,
    severity: "info",
    message: "Deployment completed successfully for Auth Service",
    time: "1 hour ago",
    service: "auth-service"
  },
  {
    id: 6,
    severity: "info",
    message: "Auto-scaling triggered for Search Service",
    time: "2 hours ago",
    service: "search-service"
  }
]

// Sample Dependencies Data
export const dependencies: Dependency[] = [
  {
    name: "postgres-db",
    service: "payment-service",
    status: "critical",
    responseTime: "890ms",
    errorRate: "15.2%"
  },
  {
    name: "redis-cache",
    service: "user-service",
    status: "healthy",
    responseTime: "12ms",
    errorRate: "0.1%"
  },
  {
    name: "elasticsearch",
    service: "search-service",
    status: "warning",
    responseTime: "234ms",
    errorRate: "5.3%"
  },
  {
    name: "mongodb",
    service: "analytics-service",
    status: "critical",
    responseTime: "1.2s",
    errorRate: "25.8%"
  },
  {
    name: "rabbitmq",
    service: "notification-service",
    status: "warning",
    responseTime: "156ms",
    errorRate: "8.7%"
  },
  {
    name: "s3-bucket",
    service: "inventory-service",
    status: "healthy",
    responseTime: "45ms",
    errorRate: "0.3%"
  }
]

// Sample Traces Data
export const traces: Trace[] = [
  {
    id: "trace-001",
    operationName: "POST /api/payments/process",
    service: "payment-service",
    duration: 1250,
    timestamp: "2024-12-16T10:30:15Z",
    status: "error",
    spans: [
      {
        id: "span-001",
        operationName: "validate_payment",
        service: "payment-service",
        duration: 45,
        startTime: 0,
        tags: { "http.method": "POST", "user.id": "12345" }
      },
      {
        id: "span-002", 
        operationName: "db.query",
        service: "postgres-db",
        duration: 890,
        startTime: 45,
        tags: { "db.statement": "SELECT * FROM payments WHERE id = ?", "db.type": "postgresql" }
      },
      {
        id: "span-003",
        operationName: "process_transaction",
        service: "payment-service", 
        duration: 315,
        startTime: 935,
        tags: { "transaction.id": "txn-789", "amount": "99.99" }
      }
    ]
  },
  {
    id: "trace-002",
    operationName: "GET /api/users/profile",
    service: "user-service",
    duration: 156,
    timestamp: "2024-12-16T10:29:45Z",
    status: "success",
    spans: [
      {
        id: "span-004",
        operationName: "authenticate_user",
        service: "auth-service",
        duration: 23,
        startTime: 0,
        tags: { "user.id": "67890", "auth.method": "jwt" }
      },
      {
        id: "span-005",
        operationName: "cache.get",
        service: "redis-cache",
        duration: 12,
        startTime: 23,
        tags: { "cache.key": "user:67890", "cache.hit": "true" }
      },
      {
        id: "span-006",
        operationName: "format_response",
        service: "user-service",
        duration: 121,
        startTime: 35,
        tags: { "response.size": "2.1kb" }
      }
    ]
  },
  {
    id: "trace-003",
    operationName: "POST /api/notifications/send",
    service: "notification-service",
    duration: 312,
    timestamp: "2024-12-16T10:28:30Z",
    status: "success",
    spans: [
      {
        id: "span-007",
        operationName: "validate_template",
        service: "notification-service",
        duration: 34,
        startTime: 0,
        tags: { "template.id": "welcome-email", "recipient.count": "1" }
      },
      {
        id: "span-008",
        operationName: "queue.publish",
        service: "rabbitmq",
        duration: 156,
        startTime: 34,
        tags: { "queue.name": "email-queue", "message.id": "msg-456" }
      },
      {
        id: "span-009",
        operationName: "send_email",
        service: "notification-service",
        duration: 122,
        startTime: 190,
        tags: { "email.provider": "sendgrid", "email.status": "delivered" }
      }
    ]
  }
]

// Sample Events Data
export const events: Event[] = [
  {
    id: "evt-001",
    type: "alert",
    message: "High error rate detected in Analytics Service",
    timestamp: "2024-12-16T10:28:00Z",
    service: "analytics-service",
    severity: "critical"
  },
  {
    id: "evt-002",
    type: "deployment",
    message: "Deployed version v2.1.4 to Payment Service",
    timestamp: "2024-12-16T08:15:00Z",
    service: "payment-service",
    severity: "info"
  },
  {
    id: "evt-003",
    type: "incident",
    message: "Database connection timeout in Payment Service",
    timestamp: "2024-12-16T10:25:00Z",
    service: "payment-service",
    severity: "critical"
  },
  {
    id: "evt-004",
    type: "recovery",
    message: "Search Service performance restored to normal levels",
    timestamp: "2024-12-16T09:45:00Z",
    service: "search-service",
    severity: "info"
  },
  {
    id: "evt-005",
    type: "deployment",
    message: "Deployed version v3.0.1 to Notification Service",
    timestamp: "2024-12-16T04:30:00Z",
    service: "notification-service",
    severity: "info"
  }
]

// Helper functions
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id)
}

export const getServicesByStatus = (status: Service["status"]): Service[] => {
  return services.filter(service => service.status === status)
}

export const getAlertsByService = (serviceId: string): Alert[] => {
  return alerts.filter(alert => alert.service === serviceId)
}

export const getDependenciesByService = (serviceId: string): Dependency[] => {
  return dependencies.filter(dep => dep.service === serviceId)
}

export const getTracesByService = (serviceId: string): Trace[] => {
  return traces.filter(trace => trace.service === serviceId)
}

export const getEventsByService = (serviceId: string): Event[] => {
  return events.filter(event => event.service === serviceId)
}

// Top services by fault rate
export const getTopServicesByFaultRate = (limit: number = 5): Array<{name: string, faultRate: string, color: string}> => {
  return services
    .map(service => ({
      name: service.name,
      faultRate: service.errorRate,
      color: parseFloat(service.errorRate) > 20 ? "bg-destructive" : 
             parseFloat(service.errorRate) > 5 ? "bg-warning" : "bg-success"
    }))
    .sort((a, b) => parseFloat(b.faultRate) - parseFloat(a.faultRate))
    .slice(0, limit)
}

// Top dependencies by fault rate  
export const getTopDependenciesByFaultRate = (limit: number = 5): Array<{name: string, service: string, faultRate: string, color: string}> => {
  return dependencies
    .map(dep => ({
      name: dep.name,
      service: dep.service,
      faultRate: dep.errorRate,
      color: parseFloat(dep.errorRate) > 15 ? "bg-destructive" :
             parseFloat(dep.errorRate) > 5 ? "bg-warning" : "bg-success"
    }))
    .sort((a, b) => parseFloat(b.faultRate) - parseFloat(a.faultRate))
    .slice(0, limit)
}