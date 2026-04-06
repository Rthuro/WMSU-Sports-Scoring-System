import {
  IconChartBar,
  IconDashboard,
  IconCalendarEvent,
  IconBallBaseball,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import avatar from "../assets/avatar/avatar.jpeg"

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: avatar,
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: IconDashboard,
      link: ""
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
      link:"ManageTournament"
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
      link:"TeamManagement"
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      link:"Settings"
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      link: "GetHelp"
    },
  ],
};
