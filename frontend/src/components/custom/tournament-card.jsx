import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { adminRoute } from "@/lib/helpers";

export function TournamentCard({ tournament }) {
    return <>
        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
            {tournament?.map(t => (
                <Link key={t.tournamentId}
                    to={adminRoute(`ManageTournament/Tournament?t-id=${t.tournamentId}`)}
                    data-slot="card" className="flex items-center justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
                    <div className="flex flex-col items-start justify-between ">
                        <p className="text-lg font-bold tabular-nums text-red">
                            {t.name}
                        </p>
                        <p className="text-muted-foreground text-sm">{t.sportName}</p>
                    </div>
                    <div className="bg-red-50 text-red/80 border border-red-200 rounded-lg p-2">
                        <ArrowUpRight className="size-5 " />
                    </div>
                </Link>
            ))}
        </div>
    </>
}