import { useNavigate, useSearchParams } from "react-router-dom";
import { PageSync } from "@/components/custom/PageSync";
import { ArrowLeft, Plus, Minus, Save, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSportsStore } from "@/store/useSportsStore";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/custom/ImageUpload";

export function EditSport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sportId = searchParams.get("id");

  const {
    fetchSportById,
    fetchSetRules,
    fetchScoringPoints,
    fetchPenalties,
    fetchStatsBySportId,
    fetchPositions,
    updateSportDetails,
    deleteSport
  } = useSportsStore();

  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    iconPath: "",
    scoringType: "",
    defaultSets: "",
    maxSets: "",
    maxScore: null,
    timePerSet: null,
    minPlayers: null,
    maxPlayers: null,
    useSetBasedScoring: false,
    hasPenaltyAffectsScore: false,
    hasSetLineUp: false,
    set_rules: [],
    scoring_points: [],
    penalties: [],
    stats: [],
    positions: [],
  });

  const [positions, setPositions] = useState([]);
  const [points, setPoints] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [penalty, setPenalty] = useState([]);
  const [timePerSet, setTimePerSet] = useState({
    minutes: null,
    seconds: null,
  });
  const [setRules, setSetRules] = useState([]);
  const [hasPosition, setHasPosition] = useState(false);

  // Parse interval string like "00:10:00" or "10 minutes 0 seconds"
  const parseInterval = (interval) => {
    if (!interval) return { minutes: 0, seconds: 0 };
    if (typeof interval === "string" && interval.includes(":")) {
      const parts = interval.split(":");
      return {
        minutes: parseInt(parts[1]) || 0,
        seconds: parseInt(parts[2]) || 0,
      };
    }
    const minMatch = String(interval).match(/(\d+)\s*min/);
    const secMatch = String(interval).match(/(\d+)\s*sec/);
    return {
      minutes: minMatch ? parseInt(minMatch[1]) : 0,
      seconds: secMatch ? parseInt(secMatch[1]) : 0,
    };
  };

  useEffect(() => {
    if (!sportId) {
        toast.error("Sport ID is required");
        navigate(-1);
        return;
    };
    async function loadSportData() {
      setLoading(true);
      try {
        const sport = await fetchSportById(sportId);
        if (!sport) {
          toast.error("Sport not found");
          navigate(-1);
          return;
        }

        const parsedTime = parseInterval(sport.timeperset);

        setTimePerSet(parsedTime);

        await fetchSetRules(sportId);
        await fetchScoringPoints(sportId);
        await fetchPenalties(sportId);
        await fetchStatsBySportId(sportId);
        await fetchPositions(sportId);

        setFormData({
          name: sport.name || "",
          iconPath: sport.icon_path || "",
          scoringType: sport.scoring_type || "",
          defaultSets: sport.default_sets || "",
          maxSets: sport.max_sets || "",
          maxScore: sport.max_score || null,
          timePerSet: sport.timeperset || null,
          minPlayers: sport.min_players || null,
          maxPlayers: sport.max_players || null,
          useSetBasedScoring: sport.use_set_based_scoring || false,
          hasPenaltyAffectsScore: sport.has_penalty_affects_score || false,
          hasSetLineUp: sport.has_set_lineup || false,
          scoring_points: [],
          stats: [],
          penalties: [],
          positions: [],
          set_rules: [],
        });
        
        const store = useSportsStore.getState();

        // Populate set rules
        const rules = (store.setRules || []).map((r) => {
          const t = parseInterval(r.time_limit);
          return {
            set_number: r.set_number,
            max_score: r.max_score || "",
            time: r.time_limit || "",
            minutes: t.minutes || "",
            seconds: t.seconds || "",
          };
        });

        setSetRules(
          rules.length
            ? rules
            : [
                {
                  set_number: null,
                  max_score: "",
                  time: "",
                  minutes: "",
                  seconds: "",
                },
              ],
        );

        setFormData(prev => ({ ...prev, set_rules: rules }));
        
        // Populate scoring points
        const pts = (store.scoringPoints || []).map((p) => String(p.point));
        setPoints(pts.length ? pts : [""]);

        setFormData(prev => ({ ...prev, scoring_points: pts }));

        // Populate penalties
        const pens = (store.penalties || []).map((p) => ({
          penalty_name: p.penalty_name || "",
          description: p.description || "",
          penalty_point: p.penalty_point || "",
          affects_score: p.affects_score || false,
          penalty_limit: p.penalty_limit || "",
        }));

        setPenalty(
          pens.length
            ? pens
            : [
                {
                  penalty_name: "",
                  description: "",
                  penalty_point: "",
                  affects_score: false,
                  penalty_limit: "",
                },
              ],
        );

        setFormData(prev => ({ ...prev, penalties: pens }));
        
        // Populate stats
        const pStats = (store.sportStats || [])
          .filter((s) => s.is_player_stat)
          .map((s) => s.stats_name);
        const tStats = (store.sportStats || [])
          .filter((s) => !s.is_player_stat)
          .map((s) => s.stats_name);
        setPlayerStats(pStats.length ? pStats : [""]);
        setTeamStats(tStats.length ? tStats : [""]);

        setFormData(prev => ({ ...prev, stats: buildStats(pStats, tStats) }));

        // Populate positions
        const pos = (store.positions || []).map((p) => p.position_name);
        setPositions(pos.length ? pos : [""]);
        setHasPosition(pos.length > 0);

        setFormData(prev => ({ ...prev, positions: pos }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load sport data");
      }
      setLoading(false);
    }
    loadSportData();
  }, [sportId]);

  const buildStats = (pStats = [], tStats = []) => {
    const clean1 = pStats
      .filter((s) => s.trim() !== "")
      .map((s) => ({ stats_name: s, is_player_stat: true }));
    const clean2 = tStats
      .filter((s) => s.trim() !== "")
      .map((s) => ({ stats_name: s, is_player_stat: false }));
    return [...clean1, ...clean2];
  };

  const handleTimeChange = (index, minutes, seconds) => {
    const time =
      minutes > 0 || seconds > 0 ? `${minutes} minutes ${seconds} seconds` : "";
    setSetRules((prev) => {
      const u = [...prev];
      u[index].time = time;
      return u;
    });
  };

  const handleChangePosition = (i, v) => {
    const u = [...positions];
    u[i] = v;
    setPositions(u);
    setFormData({ ...formData, positions: u.filter((p) => p.trim() !== "") });
  };
  const addPositionInput = () => setPositions([...positions, ""]);
  const handleChangePoints = (i, v) => {
    const u = [...points];
    u[i] = v;
    setPoints(u);
    setFormData({
      ...formData,
      scoring_points: u.filter((p) => p.trim() !== ""),
    });
  };
  const addPointInput = () => setPoints([...points, ""]);
  const addSetRule = () =>
    setSetRules((prev) => [
      ...prev,
      { set_number: null, max_score: "", minutes: "", seconds: "" },
    ]);
  const removeSetRule = (i) => {
    const u = setRules.filter((_, idx) => idx !== i);
    setSetRules(u);
    const f = u
      .filter(
        (r) =>
          r.set_number > 0 &&
          (r.max_score > 0 || r.minutes > 0 || r.seconds > 0),
      )
      .map((r) => ({
        set_number: r.set_number,
        max_score: r.max_score || null,
        time: r.time || null,
      }));
    setFormData({ ...formData, set_rules: f });
  };

  const updateSetRule = (index, field, value) => {
    const updated = setRules.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    setSetRules(updated);
    const filtered = updated
      .filter(
        (r) =>
          r.set_number > 0 &&
          (r.max_score > 0 || r.minutes > 0 || r.seconds > 0),
      )
      .map((r) => ({
        set_number: r.set_number,
        max_score: r.max_score || null,
        time: r.time || null,
      }));
    setFormData({ ...formData, set_rules: filtered });
  };

  const handleChangePlayerStats = (i, v) => {
    const u = [...playerStats];
    u[i] = v;
    setPlayerStats(u);
    setFormData({ ...formData, stats: buildStats(u, teamStats) });
  };
  const handleChangeTeamStats = (i, v) => {
    const u = [...teamStats];
    u[i] = v;
    setTeamStats(u);
    setFormData({ ...formData, stats: buildStats(playerStats, u) });
  };
  const addPlayerStatsInput = () => setPlayerStats([...playerStats, ""]);
  const addTeamStatsInput = () => setTeamStats([...teamStats, ""]);
  const addPenalty = () =>
    setPenalty([
      ...penalty,
      {
        penalty_name: "",
        description: "",
        penalty_point: "",
        affects_score: false,
        penalty_limit: "",
      },
    ]);
  const removePenalty = (i) => {
    const u = penalty.filter((_, idx) => idx !== i);
    setPenalty(u);
    const f = u.filter(
      (p) =>
        p.penalty_name.trim() !== "" &&
        p.description.trim() !== "" &&
        p.penalty_point > 0,
    );
    setFormData({
      ...formData,
      hasPenaltyAffectsScore: f.some((p) => p.affects_score),
      penalties: f,
    });
  };

  const updatePenalty = (index, field, value) => {
    const updated = penalty.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    setPenalty(updated);
    const filtered = updated.filter(
      (p) =>
        p.penalty_name.trim() !== "" &&
        p.description.trim() !== "" &&
        p.penalty_point > 0,
    );
    setFormData({
      ...formData,
      hasPenaltyAffectsScore: filtered.some((p) => p.affects_score),
      penalties: filtered,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const minP = Number(formData.minPlayers),
      maxP = Number(formData.maxPlayers);
    const defS = Number(formData.defaultSets),
      maxS = Number(formData.maxSets);
    if (defS < 1 || maxS < 1) {
      toast.error("Set should be greater than 0");
      return;
    }
    if (!(maxP > 0) || !(minP > 0)) {
      toast.error("Players should be greater than 0");
      return;
    }
    if (!formData.maxScore && !formData.timePerSet) {
      toast.error("Sport should either have maximum score or time limit");
      return;
    }
    if (!formData.scoringType) {
      toast.error("Sport scoring type is required");
      return;
    }
    if (!formData.scoring_points || formData.scoring_points.length < 1) {
      toast.error("Sport should have at least one scoring point");
      return;
    }

    // Build final payload
    const payload = {
      ...formData,
      iconPath: formData.iconPath || null,
      minPlayers: minP,
      maxPlayers: maxP,
      defaultSets: defS,
      maxSets: maxS,
      maxScore: formData.maxScore ? Number(formData.maxScore) : null,
      scoring_points: points.filter((p) => String(p).trim() !== "").map(Number),
      stats: buildStats(playerStats, teamStats),
      positions: hasPosition ? positions.filter((p) => p.trim() !== "") : [],
      penalties: penalty.filter(
        (p) => p.penalty_name.trim() !== "" && p.penalty_point > 0,
      ).map(p => ({
        ...p,
        penalty_point: Number(p.penalty_point),
        penalty_limit: p.penalty_limit ? Number(p.penalty_limit) : null
      })),
      set_rules: setRules
        .filter(
          (r) =>
            r.set_number > 0 &&
            (r.max_score > 0 || r.minutes > 0 || r.seconds > 0),
        )
        .map((r) => ({
          set_number: Number(r.set_number),
          max_score: r.max_score ? Number(r.max_score) : null,
          time: r.time || null,
        })),
    };

    setSaving(true);
    const success = await updateSportDetails(Number(sportId), payload);
    setSaving(false);
    if (success) navigate(-1);
  };

//   console.log(formData.scoring_points, "scoring points")

  const handleDeleteSport = async () => {
    setLoadingDelete(true);
    try {
      await deleteSport(Number(sportId));
      navigate(-1);
    } catch (error) {
      console.error("Error deleting sport:", error);
    } finally {
      setLoadingDelete(false);
    }
  };
  
  if (loading)
    return (
      <main>
        <PageSync page="Edit Sport" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin size-8 text-muted-foreground" />
        </div>
      </main>
    );

  return (
    <main>
      <PageSync page="Edit Sport" />
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <ArrowLeft />
        </button>
        <div className="flex items-center gap-4">
            <Button
            variant="outline"
            type="submit"
            form="editSport"
            disabled={saving}
            className="w-fit"
            >
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                Save Changes
            </Button>
            <Button
            variant="destructive"
            type="button"
            disabled={loadingDelete}
            onClick={handleDeleteSport}
            className="w-fit"
            >
                {loadingDelete ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Delete Sport
            </Button>
        </div>
        
      </div>
      <form
        id="editSport"
        onSubmit={handleSubmit}
        className="container max-w-8xl mx-auto px-4 flex flex-col gap-6 my-6 border rounded-xl py-6 shadow-md"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 col-span-3">
            <ImageUpload
              label="Sport Icon"
              folder="sports"
              defaultImage={formData.iconPath}
              onUploadSuccess={(url) =>
                setFormData({ ...formData, iconPath: url })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Sport Name <span className="text-muted-foreground">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter sport name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Scoring Type <span className="text-muted-foreground">*</span>
            </Label>
            <Select
              value={formData.scoringType}
              onValueChange={(e) =>
                setFormData({ ...formData, scoringType: e })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scoring type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="set">Set-Based</SelectItem>
                  <SelectItem value="round">Round-Based</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label>
              Default set <span className="text-muted-foreground">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Default set"
              value={formData.defaultSets}
              onChange={(e) =>
                setFormData({ ...formData, defaultSets: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Maximum set <span className="text-muted-foreground">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Maximum set"
              value={formData.maxSets}
              onChange={(e) =>
                setFormData({ ...formData, maxSets: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <p className="font-medium">Set score</p>
            <p className="text-muted-foreground text-sm">
              Sport should either have max score or time limit. Customize per
              set score and time limit in Set Rules tab.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Maximum Score</Label>
            <Input
              type="number"
              min="0"
              placeholder="Maximum score"
              value={formData.maxScore || ""}
              onChange={(e) =>
                setFormData({ ...formData, maxScore: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Time per set</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Minutes"
                value={timePerSet.minutes || ""}
                onChange={(e) => {
                  setTimePerSet({ ...timePerSet, minutes: e.target.value });
                  setFormData({
                    ...formData,
                    timePerSet:
                      e.target.value > 0
                        ? `${e.target.value} minutes ${timePerSet.seconds || 0} seconds`
                        : null,
                  });
                }}
              />
              <Input
                type="number"
                min="0"
                placeholder="Seconds"
                value={timePerSet.seconds || ""}
                onChange={(e) => {
                  setTimePerSet({ ...timePerSet, seconds: e.target.value });
                  setFormData({
                    ...formData,
                    timePerSet:
                      timePerSet.minutes > 0
                        ? `${timePerSet.minutes} minutes ${e.target.value || 0} seconds`
                        : null,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 col-span-2">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Scoring point(s)</p>
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
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const u = points.filter((_, i) => i !== index);
                      setPoints(u);
                      setFormData({
                        ...formData,
                        scoring_points: u.filter((p) => p.trim() !== ""),
                      });
                    }}
                  >
                    <Minus />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={addPointInput}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Minimum Players per match{" "}
              <span className="text-muted-foreground">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Minimum players"
              value={formData.minPlayers || ""}
              onChange={(e) =>
                setFormData({ ...formData, minPlayers: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>
              Maximum Players per match{" "}
              <span className="text-muted-foreground">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Maximum players"
              value={formData.maxPlayers || ""}
              onChange={(e) =>
                setFormData({ ...formData, maxPlayers: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between border border-input px-3 py-2 shadow-xs rounded-md">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Different player set lineup</p>
              <p className="text-muted-foreground text-sm">
                If sports has different players per set or round.
              </p>
            </div>
            <Switch
              checked={formData.hasSetLineUp}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, hasSetLineUp: checked })
              }
            />
          </div>
        </div>
        <p className="font-medium -mb-3">
          Customize sport{" "}
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
          <TabsContent value="setRules" className="flex flex-col gap-2 p-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Set Rules</p>
              <p className="text-muted-foreground text-sm">
                Set rules are used to define the rules for each set in a match.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {setRules.map((rule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 items-end border p-4 rounded-md"
                >
                  <p className="text-red-600 text-sm col-span-4">
                    {!rule.set_number
                      ? "Fill in required fields"
                      : rule.max_score < 1 &&
                          (rule.minutes < 1 || rule.seconds < 1)
                        ? "Set should either have maximum score or time limit"
                        : ""}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label>
                      Set number{" "}
                      <span className="text-muted-foreground">*</span>
                    </Label>
                    <Input
                      min="0"
                      type="number"
                      placeholder="Set number"
                      value={rule.set_number ?? ""}
                      onChange={(e) =>
                        updateSetRule(index, "set_number", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Maximum score</Label>
                    <Input
                      min="0"
                      type="number"
                      placeholder="Max score"
                      value={rule.max_score ?? ""}
                      onChange={(e) =>
                        updateSetRule(index, "max_score", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Time limit</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Minutes"
                        value={rule.minutes ?? ""}
                        onChange={(e) => {
                          handleTimeChange(
                            index,
                            e.target.value,
                            rule.seconds || 0,
                          );
                          updateSetRule(index, "minutes", e.target.value);
                        }}
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Seconds"
                        value={rule.seconds ?? ""}
                        onChange={(e) => {
                          handleTimeChange(
                            index,
                            rule.minutes || 0,
                            e.target.value,
                          );
                          updateSetRule(index, "seconds", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSetRule}
                    >
                      <Plus size={16} />
                    </Button>
                    {setRules.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeSetRule(index)}
                      >
                        <Minus size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="positions" className="flex flex-col gap-3 p-3">
            <div className="grid grid-cols-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Sport positions</p>
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
                      onChange={(e) =>
                        handleChangePosition(index, e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const u = positions.filter((_, i) => i !== index);
                        setPositions(u);
                        setFormData({
                          ...formData,
                          positions: u.filter((p) => p.trim() !== ""),
                        });
                      }}
                    >
                      <Minus />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPositionInput}
                >
                  <Plus />
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="stats" className="flex flex-col gap-3 p-3">
            <p className="font-medium">Player Stats</p>
            <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
              {playerStats.map((p, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Player stat ${index + 1}`}
                    value={p || ""}
                    onChange={(e) =>
                      handleChangePlayerStats(index, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const u = playerStats.filter((_, i) => i !== index);
                      setPlayerStats(u);
                      setFormData({
                        ...formData,
                        stats: buildStats(u, teamStats),
                      });
                    }}
                  >
                    <Minus />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPlayerStatsInput}
              >
                <Plus />
              </Button>
            </div>
            <p className="font-medium">Team Stats</p>
            <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
              {teamStats.map((p, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Team stat ${index + 1}`}
                    value={p || ""}
                    onChange={(e) =>
                      handleChangeTeamStats(index, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const u = teamStats.filter((_, i) => i !== index);
                      setTeamStats(u);
                      setFormData({
                        ...formData,
                        stats: buildStats(playerStats, u),
                      });
                    }}
                  >
                    <Minus />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTeamStatsInput}
              >
                <Plus />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="penalty" className="px-3 py-2">
            <div className="flex flex-col gap-3 mt-4">
              {penalty.map((p, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-end border p-4 rounded-md"
                >
                  <p className="text-red-600 text-sm col-span-3">
                    {!p.penalty_name || !p.description || !p.penalty_point
                      ? "Fill in required fields"
                      : ""}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Label>
                      Penalty name{" "}
                      <span className="text-muted-foreground">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Penalty name"
                      value={p.penalty_name}
                      onChange={(e) =>
                        updatePenalty(index, "penalty_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>
                      Description{" "}
                      <span className="text-muted-foreground">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Description"
                      value={p.description}
                      onChange={(e) =>
                        updatePenalty(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>
                      Point(s) <span className="text-muted-foreground">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Penalty Point(s)"
                      value={p.penalty_point}
                      onChange={(e) =>
                        updatePenalty(index, "penalty_point", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Penalty limit</p>
                      <p className="text-muted-foreground text-sm">
                        If team or player reach the penalty limit, they will be
                        disqualified.
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Penalty limit"
                      value={p.penalty_limit}
                      onChange={(e) =>
                        updatePenalty(index, "penalty_limit", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-input shadow-xs">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Penalty affects score</p>
                      <p className="text-muted-foreground text-sm">
                        If penalty deduct points from the score.
                      </p>
                    </div>
                    <Switch
                      checked={p.affects_score}
                      onCheckedChange={(checked) =>
                        updatePenalty(index, "affects_score", checked)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPenalty}
                    >
                      <Plus size={16} />
                    </Button>
                    {penalty.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removePenalty(index)}
                      >
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
  );
}
