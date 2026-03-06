import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Add Expense", url: "/add-expense", icon: PlusCircle },
];

interface AppSidebarProps {
  onLogout: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-[hsl(var(--sidebar-bg))]">
        <div className="px-4 py-6">
          {!collapsed && (
            <h1 className="text-lg font-bold text-[hsl(var(--sidebar-active))] font-[var(--font-display)]">
              💰 Smart Tracker
            </h1>
          )}
          {collapsed && <span className="text-xl">💰</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-fg))] opacity-60 text-xs uppercase tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-[hsl(var(--sidebar-fg))] hover:bg-[hsl(var(--sidebar-accent))] rounded-lg transition-colors"
                      activeClassName="bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-active))] font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[hsl(var(--sidebar-bg))]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="text-[hsl(var(--sidebar-fg))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
