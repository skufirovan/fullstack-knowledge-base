import { ChevronRight, Book, BookDashed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/use-categories'
import { AppSpinner } from './app-spinner'
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from './ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar'

export function NavArticles() {
  const { data, isLoading } = useCategories()

  if (isLoading) return <AppSpinner />
  if (!data || data.length === 0) return

  return (
    <>
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
                    category.articles.map(article => {
                      const icon =
                        article.status === 'published' ? (
                          <Book />
                        ) : (
                          <BookDashed />
                        )
                      return (
                        <SidebarMenuItem key={article.id}>
                          <SidebarMenuButton asChild>
                            <Link to={`${category.slug}/${article.slug}`}>
                              {icon} {article.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  )
}
