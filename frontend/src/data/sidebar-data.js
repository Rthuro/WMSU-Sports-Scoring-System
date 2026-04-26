import {
  IconChartBar,
  IconDashboard,
  IconCalendarEvent,
  IconBallBaseball,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconBrandAsana,
  IconUserSquare
} from "@tabler/icons-react";
import avatar from "../assets/avatar/avatar.jpeg"

export const sidebarData = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: IconDashboard,
      link: "Dashboard"
    },
    {
      title: "Manage Matches",
      url: "#",
      icon: IconBrandAsana,
      link: "ManageMatches"
    },
    {
      title: "Manage Events",
      url: "#",
      icon: IconCalendarEvent,
      link: "ManageEvents"
    },
    {
      title: "Manage Tournament",
      url: "#",
      icon: IconListDetails,
      link: "ManageTournament"
    },
    {
      title: "Sports",
      url: "#",
      icon: IconBallBaseball,
      link: "Sports"
    },
    {
      title: "Player Stats",
      url: "#",
      icon: IconChartBar,
      link: "PlayerStats"
    },
    {
      title: "Team Management",
      url: "#",
      icon: IconUsers,
      link: "TeamManagement"
    },
    {
      title: "Manage Admins",
      url: "#",
      icon: IconUserSquare,
      link: "ManageAdmins"
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      link: "Settings"
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      link: "GetHelp"
    },
  ],
};
