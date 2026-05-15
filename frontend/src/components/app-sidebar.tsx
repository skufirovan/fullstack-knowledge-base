import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { LogoIcon } from './logo-icon'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useCategories()

  if (isLoading) return <div>Загрузка</div>

  if (!data || data.length === 0) return

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LogoIcon />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.map(category => (
          <Collapsible
            key={category.name}
            title={category.name}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {category.name}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.articles &&
                      category.articles.map(article => (
                        <SidebarMenuItem key={article.id}>
                          <SidebarMenuButton asChild>
                            <Link to={`${category.slug}/${article.slug}`}>
                              {article.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
