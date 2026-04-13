// import { sportsData } from "../../data/sports-data"
import { PageSync } from "@/components/custom/PageSync"
import { SportsCard } from "@/components/custom/sports-card"
import { Separator } from "@/components/ui/separator"
import { ScoringDialogue } from "@/components/custom/scoring-dialogue"
import { useSportsStore } from "@/store/useSportsStore"
import { RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { adminRoute } from "@/lib/helpers"

export function Sports() {
  const { sports, fetchSports } = useSportsStore();

  return (
    <main className="flex flex-col gap-6">
      <PageSync page="Sports" />
      {/* <SportsCard sports={sportsData} /> */}
      <div className="flex items-center self-end gap-3">
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
      <div className="flex flex-col gap-2">
        <h1 className=" text-xl font-semibold ">Sport Scoring</h1>
        <div className="p-4 rounded-md bg-red-50/40">
          <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-auto xl:flex xl:*:data-[slot=card]:w-2xs xl:flex-wrap">
            {sports.map((s) => (
              <ScoringDialogue key={s.sport_id} sport={s} />
            ))}

          </div>
        </div>
      </div>
    </main>

  )
}