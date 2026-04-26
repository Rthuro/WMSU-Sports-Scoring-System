import { useNavigate } from 'react-router-dom';
import { PageSync } from '@/components/custom/PageSync';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useSportsStore } from '@/store/useSportsStore';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import toast from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';

export function CreateSport() {
    const navigate = useNavigate();
    const { formData, setFormData, addSport, checkSportsExists } = useSportsStore();
    const [hasSetLineUp, setHasSetLineup] = useState(false);
    const [hasPosition, setHasPosition] = useState(false);
    const [positions, setPositions] = useState(["", ""]);
    const [points, setPoints] = useState(["", ""]);
    const [playerStats, setPlayerStats] = useState(["", ""]);
    const [teamStats, setTeamStats] = useState(["", ""]);
    const [penalty, setPenalty] = useState([
        { penalty_name: "", description: "", penalty_point: null, affects_score: false, penalty_limit: null }
    ]);
    const [timePerSet, setTimePerSet] = useState({ minutes: null, seconds: null });

    const [setRules, setSetRules] = useState([
        { set_number: null, max_score: null, time: '', minutes: '', seconds: '' }
    ]);

    // Format stats
    const buildStats = (playerStats = [], teamStats = []) => {
        const cleanPlayerStats = playerStats
            .filter(stat => stat.trim() !== "")
            .map(stat => ({ stats_name: stat, is_player_stat: true }));

        const cleanTeamStats = teamStats
            .filter(stat => stat.trim() !== "")
            .map(stat => ({ stats_name: stat, is_player_stat: false }));

        return [...cleanPlayerStats, ...cleanTeamStats];
    };

    const handleTimeChange = (index, minutes, seconds) => {
        const formattedTime = minutes > 0 || seconds > 0 ? `${minutes} minutes ${seconds} seconds` : '';
        setSetRules(prevRules => {
            const updated = [...prevRules];
            updated[index].time = formattedTime;
            return updated;
        });
    };

    const handleChangePosition = (index, value) => {
        const updated = [...positions];
        updated[index] = value;
        setPositions(updated);
        const filterUpdated = updated.filter(p => p.trim() !== "");
        setFormData({
            ...formData,
            positions: filterUpdated
        });
    };

    const addPositionInput = () => {
        setPositions([...positions, ""]);
    };

    const handleChangePoints = (index, value) => {
        const updated = [...points];
        updated[index] = value;
        setPoints(updated);
        const filterUpdated = updated.filter(p => p.trim() !== "");
        setFormData({
            ...formData,
            scoring_points: filterUpdated
        });
    };

    const addPointInput = () => {
        setPoints([...points, ""]);
    };


    const addSetRule = () => {
        setSetRules((prev) => [
            ...prev,
            { set_number: null, max_score: '', minutes: '', seconds: '' },
        ]);
    };

    const removeSetRule = (index) => {
        const updated = setRules.filter((_, i) => i !== index);
        setSetRules(updated);
        const filteredRules = updated.filter(rule =>
            rule.set_number > 0 && (rule.max_score > 0 || rule.minutes > 0 || rule.seconds > 0))
        const fixDataArr = filteredRules.map(rule => ({
            set_number: rule.set_number,
            max_score: rule.max_score || null,
            time: rule.time || null,
        }));
        setFormData({
            ...formData,
            set_rules: fixDataArr,
        });
    };

    const updateSetRule = (index, field, value) => {
        const updatedRules = setRules.map((rule, i) =>
            i === index ? { ...rule, [field]: value } : rule
        );
        setSetRules(updatedRules);
        const filteredRules = updatedRules.filter(rule =>
            rule.set_number > 0 && (rule.max_score > 0 || rule.minutes > 0 || rule.seconds > 0))
        const fixDataArr = filteredRules.map(rule => ({
            set_number: rule.set_number,
            max_score: rule.max_score || null,
            time: rule.time || null,
        }));
        setFormData({
            ...formData,
            set_rules: fixDataArr,
        });
    };

    const handleChangePlayerStats = (index, value) => {
        const updated = [...playerStats];
        updated[index] = value;
        setPlayerStats(updated);
        setFormData({
            ...formData,
            stats: buildStats(updated, teamStats)
        });
    };

    const handleChangeTeamStats = (index, value) => {
        const updated = [...teamStats];
        updated[index] = value;
        setTeamStats(updated);
        setFormData({
            ...formData,
            stats: buildStats(playerStats, updated)
        });
    };

    const addPlayerStatsInput = () => {
        setPlayerStats([...playerStats, ""]);
    };

    const addTeamStatsInput = () => {
        setTeamStats([...teamStats, ""]);
    };

    const addPenalty = () => {
        setPenalty([
            ...penalty,
            { penalty_name: "", description: "", penalty_points: "", affects_score: false, penalty_limit: "" },
        ]);
    };

    const removePenalty = (index) => {
        const updated = penalty.filter((_, i) => i !== index);
        setPenalty(updated);
        const filterUpdated = updated.filter(p => p.penalty_name.trim() !== "" && p.description.trim() !== "" && p.penalty_point !== 0);
        setFormData({
            ...formData,
            hasPenaltyAffectsScore: filterUpdated.some(p => p.affects_score),
            penalties: filterUpdated
        });
    };

    const updatePenalty = (index, field, value) => {
        const updated = penalty.map((penalty, i) =>
            i === index ? { ...penalty, [field]: value } : penalty
        )
        setPenalty(updated);
        const filterUpdated = updated.filter(p => p.penalty_name.trim() !== "" && p.description.trim() !== "" && p.penalty_point > 0);

        setFormData({
            ...formData,
            hasPenaltyAffectsScore: filterUpdated.some(p => p.affects_score),
            penalties: filterUpdated
        });
    };

    const handleSubmit = (e) => {
        const minPlayers = Number(formData.minPlayers);
        const maxPlayers = Number(formData.maxPlayers);
        const defaultSets = Number(formData.defaultSets);
        const maxSets = Number(formData.maxSets);

        if (defaultSets < 1 || maxSets < 1) {
            toast.error("Set should be greater than 0");
            return;
        }

        if (!(maxPlayers > 0) || !(minPlayers > 0)) {
            toast.error("Players should be greater than 0");
            return;

        }

        if (!formData.maxScore && !formData.timePerSet) {
            toast.error("Sport should either have maximum score or time limit");
            return;
        }

        if (formData.scoringType === "") {
            toast.error("Sport scoring type is required");
            return;
        }

        if (!formData.scoring_points || formData.scoring_points.length < 1) {
            toast.error("Sport should have at least one scoring point");
            return;
        }

        addSport(e);

        setPoints(["", ""]);
        setPositions(["", ""]);
        setPlayerStats(["", ""]);
        setTeamStats(["", ""]);
        setPenalty([
            { penalty_name: "", description: "", penalty_point: "", affects_score: false, penalty_limit: "" }
        ]);
        setTimePerSet({ minutes: null, seconds: null });
        setSetRules([
            { set_number: null, max_score: '', time: '', minutes: '', seconds: '' }
        ]);

        navigate(-1);

    };

    return (
        <main >
            <PageSync page="Create Sport" />
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)} className="cursor-pointer" >
                    <ArrowLeft />
                </button>
                <Button type="submit" form="createSport" className="w-fit">
                    <Plus />
                    Create Sport
                </Button>
            </div>
            <form id="createSport" onSubmit={handleSubmit} className='container max-w-8xl mx-auto px-4 flex flex-col gap-6 my-6 border rounded-xl py-6 shadow-md'>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sportIcon">Sport Icon</Label>
                        <Input id="sportIcon" type="file"
                            value={formData.iconPath}
                            onChange={(e) => setFormData({ ...formData, iconPath: e.target.files[0] })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label >Sport Name
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input type="text" placeholder="Enter sport name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onBlur={() => {
                                if (formData.name.trim() !== "") {
                                    checkSportsExists()
                                }
                            }}
                            required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label >Scoring Type
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Select
                            value={formData.scoringType}
                            onValueChange={(e) => {
                                setFormData({ ...formData, scoringType: e })

                            }}
                        >
                            <SelectTrigger >
                                <SelectValue placeholder="Select scoring type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="set" >Set-Based</SelectItem>
                                    <SelectItem value="round">Round-Based</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Default set
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input type="number" min="0" placeholder="Default set"
                            value={formData.defaultSets}
                            onChange={(e) => setFormData({ ...formData, defaultSets: e.target.value })}
                            required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Maximum set
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input type="number" min="0" placeholder="Maximum set"
                            value={formData.maxSets}
                            onChange={(e) => setFormData({ ...formData, maxSets: e.target.value })}
                            required />
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <p className='font-medium'>Set score</p>
                        <p className="text-muted-foreground text-sm">
                            Sport should either have max score or time limit. Customize per set score and time limit in Set Rules tab.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Maximum Score
                        </Label>
                        <Input type="number" min="0" placeholder="Maximum set"
                            value={formData.maxScore}
                            onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Time per set </Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" min="0" placeholder="Minutes"
                                value={timePerSet.minutes || null}
                                onChange={(e) => {
                                    setTimePerSet({ ...timePerSet, minutes: e.target.value })
                                    setFormData({
                                        ...formData,
                                        timePerSet: e.target.value > 0 ? `${e.target.value} minutes ${timePerSet.seconds || 0} seconds` : null
                                    })
                                }}
                            />
                            <Input type="number" min="0" placeholder="Seconds"
                                value={timePerSet.seconds || null}
                                onChange={(e) => {
                                    setTimePerSet({ ...timePerSet, seconds: e.target.value })
                                    setFormData({
                                        ...formData,
                                        timePerSet: timePerSet.minutes > 0 ? `${timePerSet.minutes} minutes ${e.target.value || 0} seconds` : null
                                    })
                                }}
                            />
                        </div>
                        <p className={`${timePerSet.minutes !== "" && timePerSet.minutes < 1 ? "flex text-red-600 text-sm" : "hidden"}`}>
                            {timePerSet.minutes < 1 ? "Time per set minutes should be greater than 0" : ""}</p>
                    </div>
                    <div className="flex flex-col gap-3 col-span-2">
                        <div className="flex flex-col gap-1">
                            <p className='font-medium'>Scoring point(s)</p>
                            <p className="text-muted-foreground text-sm">
                                Add sport scoring points
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                            {points.map((p, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder={`Score ${index + 1}`}
                                        value={p}
                                        onChange={(e) => handleChangePoints(index, e.target.value)}
                                    />

                                    <Button type="button" variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const updatePoints = points.filter((_, i) => i !== index);
                                            setPoints(updatePoints);
                                            setFormData({
                                                ...formData,
                                                scoring_points: updatePoints.filter(p => p.trim() !== "")
                                            });

                                        }}>
                                        <Minus />
                                    </Button>
                                </div>

                            ))}
                            <Button type="button" variant="outline" className="w-fit" onClick={addPointInput}>
                                <Plus />
                            </Button>
                        </div>

                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label >Minimum Players per match
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input type="number" min="0" placeholder="Minimum players"
                            value={formData.minPlayers}
                            onChange={(e) => setFormData({ ...formData, minPlayers: e.target.value })}
                            required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label >Maximum Players per match
                            <span className='text-muted-foreground'>*</span>
                        </Label>
                        <Input type="number" min="0" placeholder="Maximum players"
                            value={formData.maxPlayers}
                            onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                            required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border border-input px-3 py-2  shadow-xs rounded-md">
                        <div className="flex flex-col gap-1">
                            <p className='font-medium'>Different player set lineup</p>
                            <p className="text-muted-foreground text-sm">
                                If sports has different players per set or round.
                            </p>
                        </div>
                        <Switch
                            checked={formData.hasSetLineUp}
                            onCheckedChange={(checked) => {
                                setHasSetLineup(checked)
                                setFormData({ ...formData, hasSetLineUp: checked })
                            }}
                        />
                    </div>
                </div>
                <p className='font-medium -mb-3'>Customize sport
                    <span className="text-sm text-muted-foreground ml-1">(Optional)</span>
                </p>
                <Separator />
                <Tabs defaultValue="setRules">
                    <TabsList>
                        <TabsTrigger value="setRules">Set Rules</TabsTrigger>
                        <TabsTrigger value="positions">Sport Positions</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="penalty">Penalty</TabsTrigger>
                    </TabsList>
                    <TabsContent value="setRules" className="flex flex-col gap-2 p-3 ">
                        <div className="flex flex-col gap-1">
                            <p className='font-medium'>Set Rules</p>
                            <p className="text-muted-foreground text-sm">
                                Set rules are used to define the rules for each set in a match.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 mt-4">
                            {setRules.map((rule, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 items-end border p-4 rounded-md">
                                    <p className='text-red-600 text-sm col-span-4'>{!rule.set_number ? "Fill in required fields" : rule.max_score < 1 && (rule.minutes < 1 || rule.seconds < 1) ? "Set should either have maximum score or time limit" : ""}</p>
                                    <div className="flex flex-col gap-2">
                                        <Label>Set number
                                            <span className='text-muted-foreground'>*</span>
                                        </Label>
                                        <Input min="0" type="number" placeholder="Set number"
                                            value={rule.set_number ?? ""}
                                            onChange={(e) =>
                                                updateSetRule(index, "set_number", e.target.value)
                                            } />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Maximum score</Label>
                                        <Input min="0" type="number" placeholder="Max score"
                                            value={rule.max_score ?? ""}
                                            onChange={(e) => updateSetRule(index, "max_score", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Time limit</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" min="0" placeholder="Minutes" value={rule.minutes ?? ""}
                                                onChange={e => {
                                                    handleTimeChange(index, e.target.value, rule.seconds || 0)
                                                    updateSetRule(index, "minutes", e.target.value)
                                                }}
                                            />
                                            <Input type="number" min="0" placeholder="Seconds" value={rule.seconds ?? ""}
                                                onChange={e => {
                                                    handleTimeChange(index, rule.minutes || 0, e.target.value)
                                                    updateSetRule(index, "seconds", e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={addSetRule} >
                                            <Plus size={16} />
                                        </Button>
                                        {setRules.length > 1 && (
                                            <Button type="button" variant="destructive" onClick={() => removeSetRule(index)} >
                                                <Minus size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="positions" className="flex flex-col gap-3 p-3 ">
                        <div className="grid grid-cols-2  ">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <p className='font-medium'>Sport positions</p>
                                    <p className="text-muted-foreground text-sm">
                                        If sport has different positions.
                                    </p>
                                </div>
                                <Switch
                                    checked={hasPosition}
                                    onCheckedChange={(checked) => setHasPosition(checked)}
                                />
                            </div>
                        </div>
                        {hasPosition && (
                            <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                                {positions.map((p, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder={`Position ${index + 1}`}
                                            value={p}
                                            onChange={(e) => handleChangePosition(index, e.target.value)}
                                        />

                                        <Button type="button" variant="destructive"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const updatedPositions = positions.filter((_, i) => i !== index);
                                                setPositions(updatedPositions);
                                                setFormData({
                                                    ...formData,
                                                    positions: updatedPositions.filter(p => p.trim() !== "")
                                                })
                                            }}>
                                            <Minus />
                                        </Button>
                                    </div>

                                ))}

                                <Button type="button" variant="outline" onClick={addPositionInput}>
                                    <Plus />
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="stats" className="flex flex-col gap-3 p-3 ">
                        <p className='font-medium'>Player Stats</p>
                        <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                            {playerStats.map((p, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Player stat ${index + 1}`}
                                        value={p || ""}
                                        onChange={(e) => handleChangePlayerStats(index, e.target.value)}
                                    />

                                    <Button type="button" variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const updatePlayerStat = playerStats.filter((_, i) => i !== index);
                                            setPlayerStats(updatePlayerStat);
                                            setFormData({
                                                ...formData,
                                                stats: buildStats(updatePlayerStat, teamStats)
                                            });
                                        }}>
                                        <Minus />
                                    </Button>
                                </div>

                            ))}
                            <Button type="button" variant="outline" onClick={addPlayerStatsInput}>
                                <Plus />
                            </Button>
                        </div>
                        <p className='font-medium'>Team Stats</p>
                        <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                            {teamStats.map((p, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Team stat ${index + 1}`}
                                        value={p || ""}
                                        onChange={(e) => handleChangeTeamStats(index, e.target.value)}
                                    />

                                    <Button type="button" variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const updateTeamStat = teamStats.filter((_, i) => i !== index);
                                            setTeamStats(updateTeamStat);
                                            setFormData({
                                                ...formData,
                                                stats: buildStats(playerStats, updateTeamStat)
                                            });
                                        }}>
                                        <Minus />
                                    </Button>
                                </div>

                            ))}
                            <Button type="button" variant="outline" onClick={addTeamStatsInput}>
                                <Plus />
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="penalty" className=" px-3 py-2 ">
                        <div className="flex flex-col gap-3 mt-4">
                            {penalty.map((p, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 items-end border p-4 rounded-md">
                                    <p className='text-red-600 text-sm col-span-3'>{!p.penalty_name || !p.description || !p.penalty_point ? "Fill in required fields" : ""}</p>
                                    <div className="flex flex-col gap-2">
                                        <Label>Penalty name
                                            <span className='text-muted-foreground'>*</span>
                                        </Label>
                                        <Input type="text" placeholder="Penalty name"
                                            value={p.penalty_name}
                                            onChange={(e) => updatePenalty(index, "penalty_name", e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Description
                                            <span className='text-muted-foreground'>*</span>
                                        </Label>
                                        <Input type="text" placeholder="Description" value={p.description}
                                            onChange={(e) => updatePenalty(index, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Point(s)
                                            <span className='text-muted-foreground'>*</span>
                                        </Label>
                                        <Input type="number" min="0" placeholder="Penalty Point(s)" value={p.penalty_point}
                                            onChange={(e) => updatePenalty(index, "penalty_point", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-1">
                                            <p className='font-medium'>Penalty limit</p>
                                            <p className="text-muted-foreground text-sm">
                                                If team or player reach the penalty limit, they will be disqualified.
                                            </p>
                                        </div>
                                        <Input type="number" min="0" placeholder="Penalty limit"
                                            value={p.penalty_limit}
                                            onChange={(e) => updatePenalty(index, "penalty_limit", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-input shadow-xs">
                                        <div className="flex flex-col gap-1">
                                            <p className='font-medium'>Penalty affects score</p>
                                            <p className="text-muted-foreground text-sm">
                                                If penalty deduct points from the score.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.penalties[index]?.affects_score}
                                            onCheckedChange={(checked) => {
                                                updatePenalty(index, "affects_score", checked)
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button type="button" variant="outline" onClick={addPenalty} >
                                            <Plus size={16} />
                                        </Button>
                                        {penalty.length > 1 && (
                                            <Button type="button" variant="destructive" onClick={() => removePenalty(index)} >
                                                <Minus size={16} />
                                            </Button>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>


            </form>
        </main>
    )
}