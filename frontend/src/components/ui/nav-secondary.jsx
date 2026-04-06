import * as React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import usePageStore from "@/store/usePageStore";
import { Link } from "react-router-dom";

export function NavSecondary({ items, ...props }) {
   const {currentPage } = usePageStore();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} to={`/${item.link}`}>
              <SidebarMenuItem key={item.title} >
                <SidebarMenuButton tooltip={item.title} className={currentPage.includes(item.title) ? 'bg-sidebar-border hover:bg-sidebar-border rounded': 'rounded'}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
