import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  FileText,
  Settings,
  Plug,
  Bug,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Incidents', url: '/incidents', icon: AlertCircle },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Runbooks', url: '/runbooks', icon: BookOpen },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Config', url: '/config', icon: Settings },
  { title: 'Integrations', url: '/integrations', icon: Plug },
  { title: 'Debug', url: '/debug', icon: Bug },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'opacity-0' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 transition-smooth hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
