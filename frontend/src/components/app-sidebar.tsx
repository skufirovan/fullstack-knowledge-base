import { useCategories } from '@/hooks/use-categories'
import { AppSpinner } from './app-spinner'
import { Logo } from './logo'
import { NavArticles } from './nav-articles'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from './ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useCategories()

  if (isLoading) return <AppSpinner />
  if (!data || data.length === 0) return

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavArticles />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
