import { Outlet } from 'react-router-dom'
import { AppBreadcrumb, AppSidebar } from '@/components'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export function MainPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2" />
          <AppBreadcrumb />
        </header>
        <Toaster />
        <section className="h-full p-6">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
