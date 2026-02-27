"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Server, 
  AlertTriangle, 
  Settings, 
  Activity,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Overview",
    href: "/",
    icon: BarChart3,
    description: "Application performance dashboard"
  },
  {
    title: "Services",
    href: "/services", 
    icon: Server,
    description: "Service health and monitoring"
  },
  {
    title: "SLOs",
    href: "/slo",
    icon: AlertTriangle,
    badge: "3",
    description: "Service Level Objectives and monitoring"
  },
  {
    title: "Traces",
    href: "/traces",
    icon: Activity,
    description: "Distributed tracing and performance"
  },
  {
    title: "Configuration",
    href: "/configuration",
    icon: Settings,
    description: "APM data source configuration"
  }
]

const bottomNavigationItems = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "2"
  },
  {
    title: "Search",
    href: "/search",
    icon: Search
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const pathname = usePathname()

  return (
    <nav className={cn(
      "flex flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image 
              src="/opensearch_mark_on_light.svg" 
              alt="OpenSearch" 
              width={32} 
              height={32}
              className="flex-shrink-0"
            />
            <div>
              <h2 className="font-semibold text-foreground">OpenSearch</h2>
              <p className="text-xs text-muted-foreground">Observability</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        {!isCollapsed && (
          <div className="my-4 px-3">
            <div className="h-px bg-border" />
          </div>
        )}


      </div>

      {/* Bottom Navigation */}
      <div className="p-2 border-t">
        <div className="space-y-1">
          {bottomNavigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge className="bg-info/10 text-info border-info/20 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@company.com</p>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}