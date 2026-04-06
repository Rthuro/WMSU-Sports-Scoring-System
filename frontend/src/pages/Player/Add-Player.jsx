import { useParams, useNavigate } from "react-router-dom"
import { PageSync } from "@/components/custom/PageSync";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSportsStore } from "@/store/useSportsStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AddPlayer(){
    const { sport } = useParams();
    const navigate = useNavigate();
    const { sports, fetchSports } = useSportsStore();
    const {  addPlayer, setFormData, formData } = usePlayerStore();

    function capitalizeFirstLetter(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    useEffect(() => {
        fetchSports();
      }, [fetchSports]);

    const sportId =  sports.find(s => s.name.toLowerCase() === sport?.toLowerCase())?.sport_id ;
    const [selectedSport, setSport] = useState(sportId || "")

    const handleSubmitPlayer = async (e) => {
        const success = await addPlayer(e);
        if (success) {
            navigate(-1);
            return;
        }
    }


    return <>
        <PageSync page={`Add Varsity Player`} />
        <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="cursor-pointer" >
                <ArrowLeft />
            </button>
            <Button form="addPlayer">
                <Plus />
                Add Player
            </Button>
        </div>
        <div className="flex flex-col gap-6 border rounded-xl px-6 py-5 mx-auto">
            <form id="addPlayer" onSubmit={handleSubmitPlayer} className="flex flex-col gap-6">
                <div className='flex flex-col gap-1'>
                    <p className='text-xl font-bold'>Player Information</p>
                    <p className='text-muted-foreground text-sm'>Fill in player information.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="sport">Sport<span className='text-muted-foreground'>*</span></Label>
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
                                        setFormData({ ...formData, sport_id: val });
                                        setSport(val);
                                    }}>
                                    {sports?.map((s) => (
                                            <DropdownMenuRadioItem key={s.sport_id} value={s.sport_id}>
                                                {s.name}
                                            </DropdownMenuRadioItem>
                                    ))}
                                   
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex flex-col gap-2 ">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(e) => {
                                    setFormData({ ...formData, gender: e })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select gender">
                                        {formData.gender
                                            ? (formData.gender === "male" ? "Male" : "Female")
                                            : null}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="firstName">First Name <span className='text-muted-foreground'>*</span></Label>
                            <Input id="firstName"
                                name="firstName" placeholder="First name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="middleInitial">Middle Initial</Label>
                            <Input id="middleInitial"
                                name="middleInitial" placeholder="Middle initial"
                                value={formData.middle_initial}
                                onChange={(e) => setFormData({ ...formData, middle_initial: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lastName">Last Name<span className='text-muted-foreground'>*</span></Label>
                            <Input id="lastName"
                                name="lastName" placeholder="Last name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input id="studentId"
                                name="studentId" placeholder="Student ID"
                                value={formData.student_id}
                                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2 ">
                            <Label htmlFor="year">Photo</Label>
                            <Input id="photo" type="file"
                            accept="image/*"
                                value={formData.photo}
                                onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>
}