import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { useParams } from "react-router-dom"
import { tableHeadersBySport } from "@/data/table-headers-data"
import { sportPlayersStats } from "@/data/sports-data"

export function StatsFilterTable() {
  const { sport } = useParams();  

  const [sportsFilter, changeSportsFilter] = useState( sport || "All sports");
  // const [genderFilter, changeGenderFilter] = useState("All players");
  // const [sortOrder, setSortOrder] = useState("asc");
  const [ searchInput, changeSearchInput] = useState("");

  // const varsityData = sportsData.varsityTeam;

  // const allPlayers = Object.entries(varsityData).flatMap(([sport, data]) => {
  //   const men = data.men.map((name) => ({ name, sport, gender: "men" }));
  //   const women = data.women.map((name) => ({ name, sport, gender: "women" }));
  //   return [...men, ...women];
  // });

  const allPlayers = [ ...sportPlayersStats.arnis, ...sportPlayersStats.basketball, ...sportPlayersStats.volleyball, ...sportPlayersStats.tabletennis, ...sportPlayersStats.taekwondo, ...sportPlayersStats.pickleball ] 

  const sportPlayers = sportPlayersStats[sportsFilter.toLowerCase()] ;

  // const filteredPlayers = allPlayers.filter((player) => {
  //   const matchSport = sportsFilter === "All sports" || player.sport === sportsFilter.toLowerCase();
  //   const matchGender = genderFilter === "All players" || player.gender === genderFilter;
  //   return matchSport && matchGender;
  // });


  // Sort by name
  // const sortedPlayers = [...filteredPlayers].sort((a, b) => {
  //   return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  // });

  const tableDataSport = () => {
        const data = searchInput ? sportPlayers.filter( p => p.name.toLowerCase().includes(searchInput.toLowerCase())) : sportPlayers ;
        return data
  }

   const tableDataAllSport = () => {
        const data = searchInput ? allPlayers.filter( p => p.name.toLowerCase().includes(searchInput.toLowerCase())) : allPlayers ;
        return data
  }

  return (
    <>
      <div className="flex gap-3 ">
        <Input type="text" className="w-2xs" placeholder="Search..." value={searchInput} 
        onChange={(e) => changeSearchInput(e.target.value)} />

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between">
              {genderFilter} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="center">
            <DropdownMenuRadioGroup value={genderFilter} onValueChange={changeGenderFilter}>
              <DropdownMenuRadioItem value="All players">All players</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="men">Men</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="women">Women</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}

        { !sport && (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-56">
                {sportsFilter} <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuRadioGroup value={sportsFilter} onValueChange={changeSportsFilter}>
                {/* <DropdownMenuRadioItem value="All ">All sports</DropdownMenuRadioItem> */}
                {/* {Object.keys(varsityData).map((sport) => (
                    <DropdownMenuRadioItem key={sport} value={sport}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </DropdownMenuRadioItem>
                ))} */}

                { Object.keys(tableHeadersBySport).map( (sport) => (
                    <DropdownMenuRadioItem key={sport} value={sport}>
                    {sport}
                    </DropdownMenuRadioItem>
                ))}

                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        )}
       

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit justify-between">
              <Filter /> {sortOrder}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="end">
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
              <DropdownMenuRadioItem value="asc">Asc</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Desc</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    
      <main className="border rounded-lg overflow-hidden ">
        <Table >
                <TableHeader  className="bg-muted">
                <TableRow>
                    {tableHeadersBySport[sportsFilter].map( header => (
                       <TableHead key={header.key} >{header.label}</TableHead>
                    ) )}
                </TableRow>
                </TableHeader>
                {/* <TableBody>
                { tableData().length > 0 ? tableData().map((player, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        { !sport && (
                        <TableCell>{player.sport}</TableCell>
                        ) }
                        <TableCell>{player.gender}</TableCell>
                    </TableRow>
                )) : (
                     <TableRow >
                       <TableCell  colSpan={3} className="text-center">Name do not exist</TableCell>
                    </TableRow>
                )}
                </TableBody> */}
                <TableBody>
               
                  { sportsFilter == 'All sports' && (
                      tableDataAllSport().map( player => (
                        <TableRow key={player.name}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.sport}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                        </TableRow>
                      ))
                  )} 

                  { sportsFilter == 'Arnis' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.matchesPlayed}</TableCell>
                            <TableCell>{player.wins}</TableCell>
                            <TableCell>{player.losses}</TableCell>
                            <TableCell>{player.totalPointsScored}</TableCell>
                            <TableCell>{player.penalties}</TableCell>
                        </TableRow>
                      ))
                  )} 

                  { sportsFilter == 'Basketball' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.gamesPlayed}</TableCell>
                            <TableCell>{player.points}</TableCell>
                            <TableCell>{player.rebounds}</TableCell>
                            <TableCell>{player.assists}</TableCell>
                            <TableCell>{player.steals}</TableCell>
                            <TableCell>{player.blocks}</TableCell>
                            <TableCell>{player.fouls}</TableCell>
                        </TableRow>
                      ))
                  )} 

                  { sportsFilter == 'Volleyball' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.setsPlayed}</TableCell>
                            <TableCell>{player.totalPoints}</TableCell>
                            <TableCell>{player.kills}</TableCell>
                            <TableCell>{player.blocks}</TableCell>
                            <TableCell>{player.aces}</TableCell>
                            <TableCell>{player.digs}</TableCell>
                        </TableRow>
                      ))
                  )} 

                   { sportsFilter == 'TableTennis' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.matchesPlayed}</TableCell>
                            <TableCell>{player.wins}</TableCell>
                            <TableCell>{player.losses}</TableCell>
                            <TableCell>{player.setsWon}</TableCell>
                            <TableCell>{player.setsLost}</TableCell>
                            <TableCell>{player.pointsScored}</TableCell>
                        </TableRow>
                      ))
                  )} 

                  { sportsFilter == 'Taekwondo' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.matchesPlayed}</TableCell>
                            <TableCell>{player.wins}</TableCell>
                            <TableCell>{player.losses}</TableCell>
                            <TableCell>{player.roundsWon}</TableCell>
                            <TableCell>{player.pointsScored}</TableCell>
                            <TableCell>{player.penalties}</TableCell>
                        </TableRow>
                      ))
                  )} 

                  { sportsFilter == 'PickleBall' && (
                      tableDataSport()?.map( (player, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>{player.gender}</TableCell>
                            <TableCell>{player.matchesPlayed}</TableCell>
                            <TableCell>{player.wins}</TableCell>
                            <TableCell>{player.losses}</TableCell>
                            <TableCell>{player.setsWon}</TableCell>
                            <TableCell>{player.setsLost}</TableCell>
                            <TableCell>{player.pointsScored}</TableCell>
                        </TableRow>
                      ))
                  )} 
                  
                  { tableDataAllSport().length < 1  && (
                     <TableRow >
                       <TableCell  colSpan={ 3 } className="text-center">Name do not exist</TableCell>
                    </TableRow>
                  )}

                  { sport && tableDataSport().length < 1 && (
                     <TableRow >
                       <TableCell  colSpan={tableHeadersBySport[sportsFilter].length} className="text-center">Name do not exist</TableCell>
                    </TableRow>
                  ) }
                </TableBody>
        </Table>
      </main>
      
    </>
  );
}
