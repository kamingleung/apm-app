"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { traces, type Trace, type Span } from "@/lib/sample-data"

interface TracesTabProps {
  className?: string
}

interface ExtendedSpan extends Span {
  traceId: string
  traceName: string
  traceStatus: string
}

export function TracesTab({ className }: TracesTabProps) {
  const [selectedSpan, setSelectedSpan] = React.useState<ExtendedSpan | null>(null)
  
  // Get all spans from all traces for the left panel
  const allSpans = React.useMemo((): ExtendedSpan[] => {
    return traces.flatMap(trace => 
      trace.spans.map(span => ({
        ...span,
        traceId: trace.id,
        traceName: trace.operationName,
        traceStatus: trace.status
      }))
    )
  }, [])

  // Select first span by default
  React.useEffect(() => {
    if (allSpans.length > 0 && !selectedSpan) {
      setSelectedSpan(allSpans[0])
    }
  }, [allSpans, selectedSpan])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success border-success/20"
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "timeout":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <main className={cn("@container h-full", className)}>
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        {/* Left Panel - Spans List */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <section className="h-full flex flex-col bg-card border-r border-border">
            <header className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Spans
                <Badge variant="outline" className="text-xs">
                  {allSpans.length}
                </Badge>
              </h2>
            </header>
            
            <div className="flex-1 overflow-auto">
              {allSpans.map((span) => (
                <article
                  key={`${span.traceId}-${span.id}`}
                  className={cn(
                    "p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedSpan?.id === span.id && selectedSpan?.traceId === span.traceId
                      ? "bg-muted border-l-4 border-l-primary"
                      : ""
                  )}
                  onClick={() => setSelectedSpan(span)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-muted-foreground">
                        Nov 13 @ 23:59:09.880
                      </time>
                      <Badge className={getStatusColor(span.traceStatus)}>
                        {span.duration}ms
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-foreground">
                        {span.service}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {span.operationName}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Span Details */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <section className="h-full flex flex-col bg-background">
            {selectedSpan ? (
              <>
                <header className="p-4 border-b border-border">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedSpan.service}: {selectedSpan.operationName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      SELECT "billing_service_billing"."id", "billing_service_billing"."owner_id", "billing_service_billing"."type", "billing_service_billing"."status"...
                    </p>
                  </div>
                </header>

                <div className="flex-1 p-4">
                  <Tabs defaultValue="overview" className="h-full">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="sql-query">SQL query</TabsTrigger>
                      <TabsTrigger value="query-metrics">Query metrics</TabsTrigger>
                      <TabsTrigger value="explain-plan">Explain plan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Span Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Service</span>
                              <span className="text-sm font-medium">{selectedSpan.service}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Operation</span>
                              <span className="text-sm font-medium">{selectedSpan.operationName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Duration</span>
                              <span className="text-sm font-medium">{selectedSpan.duration}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Start Time</span>
                              <span className="text-sm font-medium">{selectedSpan.startTime}ms</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Tags</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {Object.entries(selectedSpan.tags).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-muted-foreground">{key}</span>
                                <span className="text-sm font-medium">{value}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>

                      {selectedSpan.logs && selectedSpan.logs.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Logs</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedSpan.logs.map((log, index) => (
                                <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge 
                                      className={cn(
                                        "text-xs",
                                        log.level === "error" ? "bg-destructive/10 text-destructive" :
                                        log.level === "warn" ? "bg-warning/10 text-warning" :
                                        "bg-info/10 text-info"
                                      )}
                                    >
                                      {log.level}
                                    </Badge>
                                    <time className="text-xs text-muted-foreground">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </time>
                                  </div>
                                  <p className="text-foreground">{log.message}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="sql-query">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">SQL Query</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-muted/50 p-4 rounded text-sm overflow-auto">
                            <code>
                              {selectedSpan.tags["db.statement"] || "No SQL query available for this span"}
                            </code>
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="query-metrics">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Query Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Execution Time</span>
                                <span className="text-sm font-medium">{selectedSpan.duration}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Rows Affected</span>
                                <span className="text-sm font-medium">1</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="explain-plan">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Explain Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Explain plan data would be displayed here for database queries.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a span to view details</p>
              </div>
            )}
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}