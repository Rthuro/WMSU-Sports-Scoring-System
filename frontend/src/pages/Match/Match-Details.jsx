import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronsUpDown, Check } from "lucide-react";
import { PlayerCombobox } from '@/components/custom/Players-combobox';
import { PageSync } from '@/components/custom/PageSync';
import { useMatchStore } from '@/store/useMatchStore';
import { useEffect, useState } from 'react';
import { useSportsStore } from '@/store/useSportsStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useTeamStore } from '@/store/useTeamStore';
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList }
  from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { adminRoute, capitalizeFirstLetter } from '@/lib/helpers';
import toast from 'react-hot-toast';


export function MatchDetails() {
  const today = new Date().toISOString().split("T")[0];
  const { sport } = useParams();
  const navigate = useNavigate();
  const { formData, setFormData, addMatch } = useMatchStore();
  const { sports, fetchSports } = useSportsStore();
  const { players, fetchPlayersBySport } = usePlayerStore();
  const { teamsBySport, fetchTeamsBySport } = useTeamStore();

  const [is_team, setIsTeam] = useState(true);

  const sportData = sports.find((s) => s.name.toLowerCase() === sport?.toLowerCase());

  console.log("sports", sportData);
  // console.log("players", players);
  // console.log("teamsBySport", teamsBySport);

  useEffect(() => {
    if (sports.length === 0) {
      fetchSports();
    }
  }, [fetchSports, sports]);

  useEffect(() => {
    const sportData = sports.find((s) => s.name.toLowerCase() === sport?.toLowerCase());
    if (sportData) {
      fetchPlayersBySport(sportData.sport_id);
      fetchTeamsBySport(sportData.sport_id);
    }
  }, [sports, sport, fetchPlayersBySport, fetchTeamsBySport]);

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);

  const togglePlayerA = (aId) => {
    if (aId === selectedA) {
      setSelectedA(null);
      setFormData({
        ...formData,
        team_a_id: is_team ? null : formData.team_a_id,
        player_a_id: is_team ? formData.player_a_id : null
      });
    } else {
      setSelectedA(aId);
      setFormData({
        ...formData,
        ...(is_team ? { team_a_id: aId, player_a_id: null } : { player_a_id: aId, team_a_id: null })
      });
    }

  };

  const togglePlayerB = (bId) => {
    if (bId === selectedB) {
      setSelectedB(null);
      setFormData({
        ...formData,
        team_b_id: is_team ? null : formData.team_b_id,
        player_b_id: is_team ? formData.player_b_id : null
      });
    } else {
      setSelectedB(bId);
      setFormData({
        ...formData,
        ...(is_team ? { team_b_id: bId, player_b_id: null } : { player_b_id: bId, team_b_id: null })
      });
    }

  };

  const filterA = (is_team ? teamsBySport : players).filter(
    (item) => is_team
      ? item.team_id !== selectedB
      : item.player_id !== selectedB
  );

  const filterB = (is_team ? teamsBySport : players).filter(
    (item) => is_team
      ? item.team_id !== selectedA
      : item.player_id !== selectedA
  );

  const getSelectedALabel = () => {
    if (!selectedA) return `Select ${is_team ? "Team A" : "Player A"}`;
    const list = is_team ? teamsBySport : players;
    const item = list.find((i) => (is_team ? i.team_id : i.player_id) === selectedA);
    if (!item) return `Select ${is_team ? "Team A" : "Player A"}`;
    return is_team ? item.name : `${item.first_name} ${item.last_name}`;
  };

  const getSelectedBLabel = () => {
    if (!selectedB) return `Select ${is_team ? "Team B" : "Player B"}`;
    const list = is_team ? teamsBySport : players;
    const item = list.find((i) => (is_team ? i.team_id : i.player_id) === selectedB);
    if (!item) return `Select ${is_team ? "Team B" : "Player B"}`;
    return is_team ? item.name : `${item.first_name} ${item.last_name}`;
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();

    // Set sport_id and is_team synchronously before addMatch reads formData
    const updatedFormData = {
      ...formData,
      sport_id: sportData?.sport_id || null,
      is_team: is_team,
    };
    setFormData(updatedFormData);

    // addMatch handles its own toasts internally
    const result = await addMatch(e);
    if (result) {
      navigate(adminRoute(`Sports/${sport}/scoring?m-id=${result.match_id}`));
    }
  }
  // console.log("formData", formData);



  return <>
    <PageSync page="Match Details" />
    <div className="flex items-center justify-between">
      <button onClick={() => navigate(-1)} className="cursor-pointer" >
        <ArrowLeft />
      </button>
      <Button type="submit" form="createMatch" >Start Scoring</Button>
    </div>
    <div className='flex flex-col gap-3 border rounded-xl px-6 py-4 mx-auto max-w-[425px]'>
      <div className='flex flex-col gap-1'>
        <p className='text-lg font-semibold'>Start Match Scoring</p>
        <p className='text-muted-foreground text-sm'  >Fill in match details before proceeding to the scoring interface.
        </p>
      </div>
      <form onSubmit={handleAddMatch} id="createMatch">

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sport">Sport</Label>
            <Input id="sport" name="sport" defaultValue={sportData?.name}
              disabled />

          </div>
          <div className="grid gap-2">
            <Label htmlFor="matchName">
              Match name
              <span className='text-muted-foreground'>*</span>
            </Label>
            <Input id="matchName"
              name="matchName" placeholder="Match name"
              value={formData?.match_name}
              onChange={(e) => setFormData({ ...formData, match_name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="start_date">Match Date</Label>
            <Input id="start_date" name="start_date" type="date"
              value={formData?.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required min={today} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData?.location} className=""
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between border border-input px-3 py-2  shadow-xs rounded-md col-span-2">
            <div className="flex flex-col gap-1">
              <p className='font-medium'>Select team</p>
              <p className="text-muted-foreground text-sm">
                Display all teams under this sport.
              </p>
            </div>
            <Switch
              checked={is_team}
              onCheckedChange={(checked) => {
                setIsTeam(checked);
                setSelectedA(null);
                setSelectedB(null);
                setFormData({
                  ...formData,
                  is_team: checked,
                  team_a_id: null,
                  team_b_id: null,
                  player_a_id: null,
                  player_b_id: null
                })
              }}
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <Label htmlFor="player_teams">Team A</Label>
            <Popover open={openA} onOpenChange={setOpenA}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openA}
                  className="w-full justify-between"
                >
                  {getSelectedALabel()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${is_team ? "team" : "player"}...`} className="h-9" />
                  <CommandList>
                    <CommandEmpty>No {is_team ? "teams" : "players"} found.</CommandEmpty>
                    <CommandGroup>
                      {(is_team ? filterA : filterA)?.map((item) => {
                        const id = is_team ? item.team_id : item.player_id;
                        const label = is_team
                          ? capitalizeFirstLetter(item.name)
                          : `${capitalizeFirstLetter(item.first_name)} ${capitalizeFirstLetter(item.last_name)}`;
                        return (
                          <CommandItem
                            key={id}
                            value={id}
                            onSelect={() => togglePlayerA(id)}
                          >
                            {label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedA === id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 ">
            <Label htmlFor="player_teams">Team B</Label>
            <Popover open={openB} onOpenChange={setOpenB} >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openB}
                  className="w-full justify-between"
                >
                  {getSelectedBLabel()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${is_team ? "team" : "player"}...`} className="h-9" />
                  <CommandList>
                    <CommandEmpty>No {is_team ? "teams" : "players"} found.</CommandEmpty>
                    <CommandGroup>
                      {(is_team ? filterB : filterB)?.map((item) => {
                        const id = is_team ? item.team_id : item.player_id;
                        const label = is_team
                          ? capitalizeFirstLetter(item.name)
                          : `${capitalizeFirstLetter(item.first_name)} ${capitalizeFirstLetter(item.last_name)}`;
                        return (
                          <CommandItem
                            key={id}
                            value={id}
                            onSelect={() => togglePlayerB(id)}
                          >
                            {label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedB === id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

      </form>
    </div>



  </>
}
