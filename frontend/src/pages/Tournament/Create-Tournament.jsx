import { PageSync } from "@/components/custom/PageSync"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { ArrowLeft, ChevronsUpDown, Check, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTournamentStore } from "@/store/useTournamentStore2";
import { useEventStore } from "@/store/useEventStore";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore } from "@/store/useTeamStore";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"
import toast from "react-hot-toast";
import { TournamentBracketPreview, generateMockBracket } from "@/components/custom/TournamentBracketPreview";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { adminRoute } from "@/lib/helpers";

export function CreateTournament() {
    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sport = searchParams.get("sport");
    const eventId = searchParams.get("event-id");
    const [loader, setLoader] = useState(false);

    const { formData, setFormData, createTournament } = useTournamentStore();
    const { sports, fetchSports } = useSportsStore();
    const { events, fetchEvents } = useEventStore();
    const { teams, fetchTeams, fetchTeamsBySport, teamsBySport } = useTeamStore();

    const sportId = sports.find(s => s.name.toLowerCase() === sport?.toLowerCase())?.sport_id;
    const [selectedSport, setSport] = useState(sportId || "")
    const [selectedEvents, setEvents] = useState(eventId || "")
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [open, setOpen] = useState(false);

    const teamsDisplay = () => {

        if (selectedEvents && selectedSport) {
            return teams.filter(team => team.event_id === selectedEvents && team.sport_id === selectedSport);
        }

        if (selectedEvents) {
            return teams.filter(team => team.event_id === selectedEvents);
        }
        if (selectedSport) {
            return teamsBySport.filter(team => team.event_id === null);
        }
        return [];
    }

    const toggleTeam = (teamId) => {
        const isSelected = selectedTeams.includes(teamId);
        let updatedTeams;

        if (isSelected) {
            updatedTeams = selectedTeams.filter(t => t !== teamId);
        } else {
            updatedTeams = [...selectedTeams, teamId];
        }

        setSelectedTeams(updatedTeams);
        setFormData({
            ...formData,
            teams: updatedTeams
        });
    };

    useEffect(() => {
        fetchSports();
        fetchEvents();

        if (selectedSport) {
            fetchTeamsBySport(selectedSport);
        } else {
            fetchTeams();
        }
    }, [fetchSports, fetchEvents, fetchTeams, fetchTeamsBySport, selectedSport]);

    // Generate live preview when teams or bracket type changes
    const previewMatches = useMemo(() => {
        return generateMockBracket(selectedTeams, formData.bracketing, teams);
    }, [selectedTeams, formData.bracketing, teams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.teams.length < 2) {
            toast.error("Please select at least 2 teams for the tournament.");
            return;
        }

        const success = await createTournament(e);
        if (success) {
            navigate(-1);
        }
    };


    return (
        <section className="flex flex-col gap-6 ">
            <PageSync page="Create Tournament" />
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="cursor-pointer" >
                    <ArrowLeft />
                </button>
                <Button type="submit" className="mt-6" form="createTournament" disabled={loader} >
                    {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus />}
                    {loader ? "Creating Tournament" : "Create Tournament"}
                </Button>

            </div>
            <div className='flex flex-col gap-6 border rounded-xl px-6 py-5 w-[50vw] self-center'>
                <form onSubmit={handleSubmit} id="createTournament" className='grid grid-cols-2 gap-3'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-xl font-bold'>Tournament</p>
                        <p className='text-muted-foreground text-sm'  >Fill in tournament details.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="events">Events</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            {
                                                selectedEvents ?
                                                    capitalizeFirstLetter(events?.find(e => e.event_id === selectedEvents)?.name) : "Select event"
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
                                            <DropdownMenuRadioItem value="">
                                                No event
                                            </DropdownMenuRadioItem>
                                            {events?.map((e) => (
                                                <DropdownMenuRadioItem key={e.event_id} value={e.event_id}>
                                                    {e.name}
                                                </DropdownMenuRadioItem>
                                            ))}

                                            {events?.length === 0 && (
                                                <DropdownMenuRadioItem disabled>
                                                    No events available.
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
                                                    capitalizeFirstLetter(sports?.find(s => s.sport_id === selectedSport)?.name) : "Select Sport"
                                            }
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-60">
                                        <DropdownMenuRadioGroup
                                            value={selectedSport}
                                            onValueChange={(val) => {
                                                setFormData({
                                                    ...formData,
                                                    sport_id: val
                                                });
                                                setSport(val);
                                                setSelectedTeams([]);
                                            }}>
                                            {sports?.map((s) => (
                                                <DropdownMenuRadioItem key={s.sport_id} value={s.sport_id}>
                                                    {s.name}
                                                </DropdownMenuRadioItem>
                                            ))}
                                            {sports?.length === 0 && (
                                                <DropdownMenuRadioItem disabled>
                                                    No sports available.
                                                </DropdownMenuRadioItem>
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tournamentName">
                                    Tournament Name
                                    <span className='text-muted-foreground'>*</span>
                                </Label>
                                <Input id="tournamentName" name="tournamentName" defaultValue=""
                                    value={formData?.name}
                                    required
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value })
                                    }} />
                            </div>
                            <div className="grid gap-3 col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Event description" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" name="start_date" type="date"
                                    value={formData?.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required min={today} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" name="end_date" type="date"
                                    value={formData?.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required min={today} />
                            </div>
                        </div>
                    </div>
                    <Separator className="my-2 col-span-2" />
                    <div className="grid grid-cols-2 gap-4 col-span-2">
                        <div className="grid gap-3">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={formData?.location} className=""
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <ImageUpload
                                onUploadSuccess={(url) => setFormData({ ...formData, banner_image: url })}
                                defaultImage={formData?.banner_image}
                                label="Banner Image"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* BRACKETING & TEAMS SECTION */}
            <div className='flex flex-col gap-6 border rounded-xl px-6 py-5 mx-auto w-full'>
                <div className='flex flex-col gap-1'>
                    <p className='text-xl font-bold'>Teams & Bracketing</p>
                    <p className="text-muted-foreground text-sm">Select your bracket format and participating teams to generate the structure. </p>
                    <p className="text-red-700 text-sm italic font-medium mt-1">Note: Select event or sport to see available teams</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="bracketing">Bracketing Format</Label>
                        <Select
                            value={formData.bracketing}
                            onValueChange={(e) => {
                                setFormData({ ...formData, bracketing: e })
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select bracketing" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="single-elimination">Single Elimination</SelectItem>
                                    <SelectItem value="double-elimination">Double Elimination</SelectItem>
                                    <SelectItem value="round-robin">Round Robin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="teams" >
                            Teams ({teamsDisplay()?.length})
                            <span className="text-muted-foreground text-xs ml-2">Minimum of 2 teams</span>
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedTeams.length > 0 ? `${selectedTeams.length} teams selected` : "Select teams..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search team..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No teams found.
                                            <Link to={adminRoute(`TeamManagement/CreateTeam?sport=${sports?.find(s => s.sport_id === selectedSport)?.name}${selectedEvents ? `&event-id=${selectedEvents}` : ''}`)} className="text-blue-700 underline block mt-2">Create team now.</Link>
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {teamsDisplay()?.map((team) => (
                                                <CommandItem
                                                    key={team.team_id}
                                                    value={team.team_id}
                                                    onSelect={() => toggleTeam(team.team_id)}
                                                >
                                                    {capitalizeFirstLetter(team.name)}

                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedTeams.includes(team.team_id) ? "opacity-100" : "opacity-0"
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
                </div>

                {/* LIVE PREVIEW BOX */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Bracket Preview</h3>
                    <TournamentBracketPreview
                        bracketingType={formData.bracketing}
                        matches={previewMatches}
                        teams={teams}
                    />
                </div>
            </div>


        </section>
    );
}