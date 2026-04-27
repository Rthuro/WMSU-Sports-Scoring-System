import {
  BarChart,
  LayoutDashboard,
  Calendar,
  Dribbble,
  HelpCircle,
  List,
  Settings,
  Users,
  Swords,
  UserSquare,
  AppWindow
} from "lucide-react";
import avatar from "../assets/avatar/avatar.jpeg"

export const sidebarData = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: LayoutDashboard,
      link: "Dashboard"
    },
    {
      title: "Manage Matches",
      url: "#",
      icon: Swords,
      link: "ManageMatches"
    },
    {
      title: "Manage Events",
      url: "#",
      icon: Calendar,
      link: "ManageEvents"
    },
    {
      title: "Manage Tournament",
      url: "#",
      icon: List,
      link: "ManageTournament"
    },
    {
      title: "Sports",
      url: "#",
      icon: Dribbble,
      link: "Sports"
    },
    {
      title: "Player Stats",
      url: "#",
      icon: BarChart,
      link: "PlayerStats"
    },
    {
      title: "Team Management",
      url: "#",
      icon: Users,
      link: "TeamManagement"
    },
    {
      title: "Manage Admins",
      url: "#",
      icon: UserSquare,
      link: "ManageAdmins"
    }, {
      title: "Manage Website",
      url: "#",
      icon: AppWindow,
      link: "ManageWebsite"
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      link: "Settings"
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
      link: "GetHelp"
    },
  ],
};
