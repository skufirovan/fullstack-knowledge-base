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
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavArticles />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
