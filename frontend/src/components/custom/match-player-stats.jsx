import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useParams } from "react-router-dom"
import { tableHeadersBySport } from "@/data/table-headers-data"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

export function MatchPlayerStats({team, data}) {
    const { sport } = useParams();  
    
    const [ searchInput, changeSearchInput] = useState("");
    
    const sportPlayers = team.toLowerCase() == 'teama' ? 
    data.teamAPlayers : data.teamBPlayers ;

    const tableDataSport = () => {
            const data =  searchInput ? sportPlayers.filter( p => p.toLowerCase().includes(searchInput.toLowerCase())) : sportPlayers ;

            return data
      }
    
    

    return (
        <>
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{data[team].toUpperCase()}</p>
            < Separator />
            { sportPlayers.length > 1 && (
                <Input type="text" className="w-2xs mt-3" placeholder="Search..." value={searchInput} 
                onChange={(e) => changeSearchInput(e.target.value)} />
            )}
          </div>
        
          <main className="border rounded-lg overflow-hidden ">
            <Table >
                    <TableHeader  className="bg-muted">
                    <TableRow>
                        {tableHeadersBySport[sport].map( header => (
                           <TableHead key={header.key} >{header.label}</TableHead>
                        ) )}
                        <TableHead key="actions">Actions</TableHead>

                    </TableRow>
                    </TableHeader>
                    <TableBody>
    
                      { sport == 'Arnis' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.matchesPlayed}</TableCell>
                                <TableCell>{player.wins}</TableCell>
                                <TableCell>{player.losses}</TableCell>
                                <TableCell>{player.totalPointsScored}</TableCell>
                                <TableCell>{player.penalties}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
    
                      { sport == 'Basketball' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.gamesPlayed}</TableCell>
                                <TableCell>{player.points}</TableCell>
                                <TableCell>{player.rebounds}</TableCell>
                                <TableCell>{player.assists}</TableCell>
                                <TableCell>{player.steals}</TableCell>
                                <TableCell>{player.blocks}</TableCell>
                                <TableCell>{player.fouls}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
    
                      { sport == 'Volleyball' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.setsPlayed}</TableCell>
                                <TableCell>{player.totalPoints}</TableCell>
                                <TableCell>{player.kills}</TableCell>
                                <TableCell>{player.blocks}</TableCell>
                                <TableCell>{player.aces}</TableCell>
                                <TableCell>{player.digs}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
    
                       { sport == 'TableTennis' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.matchesPlayed}</TableCell>
                                <TableCell>{player.wins}</TableCell>
                                <TableCell>{player.losses}</TableCell>
                                <TableCell>{player.setsWon}</TableCell>
                                <TableCell>{player.setsLost}</TableCell>
                                <TableCell>{player.pointsScored}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
    
                      { sport == 'Taekwondo' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.matchesPlayed}</TableCell>
                                <TableCell>{player.wins}</TableCell>
                                <TableCell>{player.losses}</TableCell>
                                <TableCell>{player.roundsWon}</TableCell>
                                <TableCell>{player.pointsScored}</TableCell>
                                <TableCell>{player.penalties}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
    
                      { sport == 'PickleBall' && (
                          tableDataSport()?.map( (player, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{player}</TableCell>
                                <TableCell>{player.gender}</TableCell>
                                <TableCell>{player.matchesPlayed}</TableCell>
                                <TableCell>{player.wins}</TableCell>
                                <TableCell>{player.losses}</TableCell>
                                <TableCell>{player.setsWon}</TableCell>
                                <TableCell>{player.setsLost}</TableCell>
                                <TableCell>{player.pointsScored}</TableCell>
                                <TableCell>
                                    <Button>Edit stats</Button>
                                </TableCell>
                            </TableRow>
                          ))
                      )} 
                      
                      { tableDataSport()?.length < 1 && (
                         <TableRow >
                           <TableCell  colSpan={tableHeadersBySport[sport].length} className="text-center">Name do not exist</TableCell>
                        </TableRow>
                      ) }

                    </TableBody>
            </Table>
          </main>
          
        </>
      ); 
}