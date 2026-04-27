import { PageSync } from "@/components/custom/PageSync"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator";
import { useEventStore } from "@/store/useEventStore";
import { useTeamStore } from "@/store/useTeamStore";
import { useSportsStore } from "@/store/useSportsStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { cn } from "@/lib/utils"
import { capitalizeFirstLetter } from "@/lib/helpers";
import { ImageUpload } from "@/components/custom/ImageUpload";

export function CreateTeam() {

    const [ searchParams ] = useSearchParams();
    const sport  = searchParams.get("sport");
    const eventId  = searchParams.get("event-id");
    const navigate = useNavigate();

    const { players, fetchPlayersBySport } = usePlayerStore();
    const { sports, fetchSports } = useSportsStore();
    const { events, fetchEvents } = useEventStore();
    const { addTeam, setFormData, formData } = useTeamStore();
    const { departments, fetchDepartments } = useDepartmentStore();

    const sportId =  sports.find(s => s.name.toLowerCase() === sport?.toLowerCase())?.sport_id ;
    const [selectedSport, setSport] = useState(sportId || "")
    const [selectedEvents, setEvents] = useState(eventId || "")
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [ selectedDepartment, setSelectedDepartment ] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchEvents();
        fetchSports();
        fetchPlayersBySport(selectedSport);
        fetchDepartments();
    }, [fetchSports, fetchEvents, fetchPlayersBySport, selectedSport, fetchDepartments]);

    const [open, setOpen] = useState(false)
    
   const togglePlayer = (playerId) => {
        const isSelected = selectedPlayers.includes(playerId);
        let updatedPlayers;

        if (isSelected) {
            updatedPlayers = selectedPlayers.filter(p => p !== playerId);
        } else {
            updatedPlayers = [...selectedPlayers, playerId];
        }

        setSelectedPlayers(updatedPlayers);
        setFormData({
            ...formData,
            players: updatedPlayers
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            const success = await addTeam(e); 
            if (success) {
               navigate(-1);
               return;
            }
        } catch (err) {
            console.log(err)
        } finally{
            setLoading(false);
        }
    };

    const diplaySelectedPlayers = (selected_players) => {
        if (selected_players.length === 0) {
            return "No selected players.";
        }
        const displayPlayers = selected_players.map( p => 
            players.find( player => player.player_id === p)
        )
        return displayPlayers.map(player => (player?.first_name + " " + player?.last_name)).join(", ");
    }

    console.log(selectedPlayers)

    return (
        <section className="flex flex-col gap-6 ">
            <PageSync page="Create Team" />
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="cursor-pointer" id="backButton" >
                    <ArrowLeft />
                </button>
                <Button form="createTeam" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                    Create Team
                </Button>
            </div>
            <div className="flex flex-col gap-6 border rounded-xl px-6 py-5 mx-auto">
            <form  onSubmit={handleSubmit} id="createTeam" className='grid gap-3'>
                <div className='flex flex-col gap-1'>
                    <p className='text-xl font-bold'>Team Information</p>
                    <p className='text-muted-foreground text-sm'>Fill in team information.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="events">Events</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {
                                    selectedEvents ?
                                    capitalizeFirstLetter(events?.find(e => e.event_id === selectedEvents)?.name)  : "Select event"
                                    }
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60">
                                <DropdownMenuRadioGroup 
                                value={selectedEvents}  
                                onValueChange={(val) => {
                                    setFormData({ ...formData, event_id: val });
                                    setEvents(val);
                                }}>
                                {events?.map((e) => (
                                        <DropdownMenuRadioItem key={e.event_id} value={e.event_id}>
                                            {e.name}
                                        </DropdownMenuRadioItem>
                                ))}
                                <DropdownMenuRadioItem key={"Not Set"} value={null}>
                                    Not Set
                                </DropdownMenuRadioItem>
                                { events?.length === 0 && (
                                    <DropdownMenuRadioItem disabled>  
                                        No events available.
                                    </DropdownMenuRadioItem>
                                )}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="events">Departments</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" >
                                    { selectedDepartment ?
                                    capitalizeFirstLetter(departments?.find(d => d.department_id === selectedDepartment)?.name) : "Select Department"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60">
                                <DropdownMenuRadioGroup 
                                value={selectedDepartment}  
                                onValueChange={(val) => {
                                    setFormData({ ...formData, department_id: val });
                                    setSelectedDepartment(val);
                                }}>
                                {departments?.map((d) => (
                                        <DropdownMenuRadioItem key={d.department_id} value={d.department_id}>
                                            {capitalizeFirstLetter(d.name)}
                                        </DropdownMenuRadioItem>
                                ))}
                                <DropdownMenuRadioItem key={"Not Set"} value={null}>
                                    Not Set
                                </DropdownMenuRadioItem>
                                { departments?.length === 0 && (
                                    <DropdownMenuRadioItem disabled>  
                                        No departments available.
                                    </DropdownMenuRadioItem>
                                )}
                                
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sport">
                            Sports
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" 
                                disabled={sport}>
                                    {
                                    selectedSport ?
                                    capitalizeFirstLetter(sports?.find(s => s.sport_id === selectedSport)?.name)  : "Select Sport"
                                    }
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60">
                                <DropdownMenuRadioGroup 
                                value={selectedSport}  
                                onValueChange={(val) => {
                                    setFormData({ 
                                        ...formData, 
                                        sport_id: val,
                                        players: []
                                    });
                                    setSport(val);
                                    setSelectedPlayers([]);
                                }}>
                                {sports?.map((s) => (
                                        <DropdownMenuRadioItem key={s.sport_id} value={s.sport_id}>
                                            {s.name}
                                        </DropdownMenuRadioItem>
                                ))}
                                    { sports?.length === 0 && (
                                    <DropdownMenuRadioItem disabled>  
                                        No sports available.
                                    </DropdownMenuRadioItem>
                                )}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col gap-2 ">
                        <Label htmlFor="player_teams">Team players</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                                >
                                Select players
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                <CommandInput placeholder="Search player..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No players found.</CommandEmpty>
                                    <CommandGroup>
                                    {players.map((player) => (
                                        <CommandItem
                                        key={player.player_id}
                                        value={player.player_id}
                                        onSelect={() => togglePlayer(player.player_id)}
                                        >
                                            {capitalizeFirstLetter(player.first_name)} &nbsp; 
                                        {capitalizeFirstLetter(player.last_name)}
                                            
                                        <Check
                                                className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedPlayers.includes(player.player_id) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </CommandList>
                                </Command>
                            </PopoverContent>
                            </Popover>
                    </div>
                
                    <div className="flex flex-col col-span-2 gap-1 bg-muted p-3 rounded-md border border-gray-200">
                        <Label htmlFor="shortName">Selected Players </Label>
                        <p className='text-muted-foreground text-sm'>{diplaySelectedPlayers(selectedPlayers)}</p>
                    </div>
                <Separator className="my-2 col-span-2"/>   

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="teamName">
                            Team name
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input id="teamName"
                            name="teamName" placeholder="Team name"
                            value={formData?.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="shortName">Short name</Label>
                        <Input id="shortName"
                            name="shortName" placeholder="Short name"
                            value={formData?.short_name}
                            onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <ImageUpload
                            label="Banner image"
                            folder="teams"
                            defaultImage={formData.banner_image}
                            onUploadSuccess={(url) =>
                            setFormData({ ...formData, banner_image: url })
                            }
                        />
                    </div>
                </div>             
            </form>
            </div>
        </section>
    )
}