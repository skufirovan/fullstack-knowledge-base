import { BookPlus, GalleryHorizontal, LogOut, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '@/hooks/use-user'
import { useAuthSession } from '@/lib/auth-context'
import { articlePolicy } from '@/lib/types/article'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { user, isAdmin } = useUser()
  const { logout } = useAuthSession()

  const canCreate = articlePolicy.canCreate(user)

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {canCreate && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <Link to="/create-article">
                  <BookPlus />
                  Создать статью
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <Link to="/create-user">
                  <UserPlus />
                  Создать пользователя
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {canCreate && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <Link to="/mediateka">
                  <GalleryHorizontal />
                  Медиатека
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={logout}>
              <LogOut />
              Выйти
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
