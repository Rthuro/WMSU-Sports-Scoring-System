import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import usePageStore from "@/store/usePageStore";
import { Separator } from "./separator";
import { adminRoute } from "@/lib/helpers";

export function NavMain({ items }) {
  const { currentPage } = usePageStore();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <Separator className="my-2" />
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} to={`${adminRoute(item.link)}`}>
              <SidebarMenuItem key={item.title} >
                <SidebarMenuButton tooltip={item.title} className={currentPage.includes(item.title) ? 'bg-sidebar-border hover:bg-sidebar-border rounded' : 'rounded'}>
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
