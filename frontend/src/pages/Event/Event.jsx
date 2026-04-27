import {
  ArrowLeft,
  MapPin,
  Edit3Icon,
  Plus,
  ArrowUpRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageSync } from "@/components/custom/PageSync";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import sample_bg from "../../assets/sample.jpg";
import { formatDateToString } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { useTournamentStore } from "@/store/useTournamentStore2";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore } from "@/store/useTeamStore";
import { adminRoute } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { Separator } from "@/components/ui/separator";
import { formatDateForInput } from "@/lib/helpers";

export function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, fetchEvents, updateEvent, getEventById, deleteEvent } = useEventStore();
  const { tournaments, fetchTournaments } = useTournamentStore();
  const { sports, fetchSports } = useSportsStore();
  const { teams, fetchTeams } = useTeamStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    banner_image: "",
  });

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchEvents();
    fetchTeams();
    fetchSports();
  }, [fetchEvents, fetchTeams, fetchSports, fetchTournaments]);

  const eventData = events.find((e) => e.event_id === eventId);
  const eventTeams = teams.filter((team) => team.event_id === eventId);
  const eventTournaments = tournaments.filter(
    (tournament) => tournament.event_id === eventId,
  );

  useEffect(() => {
    if (eventData) {
      setEditFormData({
        name: eventData.name,
        description: eventData.description,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        location: eventData.location,
        banner_image: eventData.banner_image,
      });
    }
  }, [eventData]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await updateEvent(eventId, editFormData);
      if (res) {
        await getEventById(eventId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditDialogOpen(false);
      setLoader(false);
    }
  };

  const handleDeleteEvent = async (e, id) => {
    e.preventDefault();
    setDeleteLoader(true);
    try {
      const res = await deleteEvent(id);
      if (res) {
        await fetchEvents();
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate(-1);
      setDialogOpen(false);
      setDeleteLoader(false);
    }
  };

  return (
    <main className="flex flex-col gap-6">
      <PageSync page="Event Details" />
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className=" cursor-pointer ">
          <ArrowLeft />
        </button>
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(true)}
          disabled={loader}
        >
          {loader ? (
            <Loader2 className=" h-4 w-4 animate-spin" />
          ) : (
            <Edit3Icon className=" h-4 w-4" />
          )}
          {loader ? "Updating..." : "Edit Event"}
        </Button>
      </div>

      <div
        className="relative bg-cover bg-center w-full h-[280px] rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${eventData?.banner_image || sample_bg})` }}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-50"></div>
        <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center gap-2 drop-shadow-lg">
          <h1 className="text-white text-3xl font-bold">
            {eventData?.name || "Event Name"}
          </h1>

          <p className="text-white flex items-center gap-2">
            {eventData?.start_date
              ? formatDateToString(eventData.start_date)
              : "Start Date"}
            <span>-</span>
            {eventData?.end_date
              ? formatDateToString(eventData.end_date)
              : " End Date"}
          </p>
          <p className="text-white flex items-center gap-1">
            <MapPin className="inline size-4" />
            {eventData?.location || "Event Location"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className=" text-xl font-semibold ">Teams competing</p>
          <Link to={adminRoute(`TeamManagement/CreateTeam`)}>
            <Button variant="outline">
              <Plus />
              Add Team
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {eventTeams ? (
            eventTeams?.map((team) => (
              <Link
                key={team.team_id}
                to={adminRoute(
                  `ManageTeam?type=${team.event_id ? "tournament" : "regular"}&id=${team.team_id}`,
                )}
              >
                <div className="flex flex-col rounded-full py-2 px-4 border text-red-800 bg-red-100/60 border-red-100 shadow-red-50 shadow-lg  hover:shadow-red-100 cursor-pointer w-fit">
                  <p className="text-sm font-medium tabular-nums ">
                    {team.name}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">
              No teams available for this event.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <p className=" text-xl font-semibold ">Tournament(s)</p>
        <Link to={adminRoute(`ManageTournament/CreateTournament`)}>
          <Button variant="outline">
            <Plus />
            Create Tournament
          </Button>
        </Link>
      </div>

      <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
        {eventTournaments?.length > 0 ? (
          eventTournaments?.map((t) => (
            <Link
              key={t.tournament_id}
              to={adminRoute(
                `ManageTournament/Tournament?t-id=${t.tournament_id}`,
              )}
              data-slot="card"
              className="flex items-center justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer"
            >
              <div className="flex flex-col items-start justify-between ">
                <p className="text-lg font-bold tabular-nums text-red">
                  {t.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {sports.find((s) => s.sport_id == t.sport_id)?.name ||
                    "Sport Name"}
                </p>
              </div>
              <div className="bg-red-50 text-red/80 border border-red-200 rounded-lg p-2">
                <ArrowUpRight className="size-5 " />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">
            No tournaments available for this event.
          </p>
        )}
      </div>

      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
          >
            <Edit3Icon size={16} />
            Edit Information
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="overflow-y-auto min-w-[480px]">
          <SheetHeader>
            <SheetTitle>Edit Event Information</SheetTitle>
            <SheetDescription>
              Update the event details here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-3 py-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formatDateForInput(editFormData.start_date)}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      start_date: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formatDateForInput(editFormData.end_date)}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      end_date: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <ImageUpload
                label="Event Banner"
                folder="events"
                defaultImage={editFormData.banner_image}
                onUploadSuccess={(url) =>
                  setEditFormData({ ...editFormData, banner_image: url })
                }
              />
            </div>
            <Separator />
          </form>
          <div className="flex flex-col gap-3 border border-red-200 bg-red-50 px-2 py-3 rounded-md items-center mx-3">
              <p className="text-center text-sm uppercase tracking-wide font-semibold">
                Danger Zone
              </p>
              <p className="text-center text-xs text-red-600 max-w-72">
                Deleting this event will also delete all the tournaments and
                teams data associated with it.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="w-full"
                variant="destructive"
              >
                Delete Event
              </Button>
            </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleEditSubmit}
              className="bg-red text-white hover:bg-red/90"
              disabled={loader}
            >
              {loader ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className=" w-96 space-y-2">
          <DialogHeader>
            <div className="bg-red-50 rounded-full p-3 w-fit mx-auto mb-2 flex items-center justify-center">
              <Trash2 className="size-6 text-red-500 " />
            </div>

            <DialogTitle className="text-center">Are you sure?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Are you sure you want to delete this event? <br /> This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              size="lg"
              className="cursor-pointer"
              onClick={(e) => handleDeleteEvent(e, eventData.event_id)}
              disabled={deleteLoader}
            >
              {deleteLoader ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
