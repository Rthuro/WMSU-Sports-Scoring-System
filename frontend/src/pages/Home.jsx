import React from "react"
import { Button } from "@/components/ui/button"
import { IconCirclePlus } from "@tabler/icons-react"
import { Plus, ArrowUpRight } from "lucide-react"
import { PageSync } from "@/components/custom/PageSync"
import { SportsCard } from "@/components/custom/sports-card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import { DataSync } from "@/components/custom/DataSync"
import { useSportsStore } from "@/store/useSportsStore"
import { useTournamentStore } from "@/store/useTournamentStore2"
import { adminRoute } from "@/lib/helpers"

export function Home() {
  const { fetchSports, sports } = useSportsStore();
  const { tournaments } = useTournamentStore();

  return (
    <main className="flex flex-col gap-6">
      <DataSync />
      <PageSync page="Home" />
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" className="w-fit flex self-end" onClick={fetchSports}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
        <Link to={adminRoute("Sports/CreateSport")}>
          <Button>
            <Plus />
            Create Sport
          </Button>
        </Link>
      </div>

      <SportsCard sports={sports} />
      <Separator />

      <div className="flex justify-between">
        <p className=" text-2xl font-semibold ">Tournament(s)</p>
        <Link to={adminRoute("ManageTournament/CreateTournament")}>
          <Button variant="outline">
            <IconCirclePlus />
            Create Tournament
          </Button>
        </Link>
      </div>
      <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
        {tournaments.length > 0 ? tournaments?.map(t => (
          <Link key={t.tournament_id}
            to={adminRoute(`ManageTournament/Tournament?t-id=${t.tournament_id}`)}
            data-slot="card" className="flex items-start justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
            <div className="flex flex-col items-start justify-between ">
              <p className="text-lg font-bold tabular-nums text-red">
                {t.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {sports.find(s => s.sport_id == t.sport_id)?.name || "Sport Name"}
              </p>
            </div>
            <div className="bg-red-50 text-red/80 border border-red-200 rounded-lg p-2">
              <ArrowUpRight className="size-5 " />
            </div>
          </Link>
        )) : (
          <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">No tournaments available for this event.</p>
        )}
      </div>
    </main>
  )
}
