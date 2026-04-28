import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { PageSync } from "@/components/custom/PageSync";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarClock, ArrowRight, Ellipsis, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEventStore } from "@/store/useEventStore";
import { Link, useNavigate } from "react-router-dom";
import { formatDateNumber } from "@/lib/helpers";
import sample_bg from "../../assets/sample.jpg";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { adminRoute } from "@/lib/helpers";

export function ManageEvents() {
    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();
    const { addEvent, formData, setFormData, events, fetchEvents } = useEventStore();

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const res = await addEvent(e);
        if (res) {
            navigate(`/ManageEvents/${res}`);
        }
    };
    return (
        <main className="flex flex-col gap-6">
            <PageSync page="Manage Events" />
            <Button variant="outline" className="w-fit flex self-end" onClick={fetchEvents}>
                <RefreshCw className="size-4" />
                Refresh
            </Button>
            <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
                <Dialog >
                    <form onSubmit={handleAddEvent} id="addEvent">
                        <DialogTrigger asChild>
                            <Card className="bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer ">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 tabular-nums ">
                                        <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                            <CalendarClock className="size-5 " />
                                        </div>
                                        <div>
                                            <p className="text-lg @[250px]/card:text-xl font-semibold">
                                                {events.length}
                                            </p>
                                            <p className="text-accent-foreground text-sm font-normal">Event(s)</p>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardFooter className="flex-col flex gap-3">
                                    <Separator />
                                    <div className="flex items-center justify-between w-full text-red text-sm">
                                        <p>Create Event</p>
                                        <ArrowRight className="size-4 " />
                                    </div>
                                </CardFooter>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create Event</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new event.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="-mx-4 grid grid-cols-2 gap-4 no-scrollbar max-h-[50vh] overflow-y-auto px-3">
                                <div className="grid gap-3 col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Event name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required />
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
                                <div className="grid gap-3">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" placeholder="Event location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-3 col-span-2">
                                    <ImageUpload
                                        onUploadSuccess={(url) => setFormData({ ...formData, banner_image: url })}
                                        defaultImage={formData?.banner_image}
                                        label="Banner Image"
                                        folder="events"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" form="addEvent">Create Event</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
            <Separator />
            <p className=" text-2xl font-semibold ">Events(s)</p>
            <div className="grid grid-cols-3 gap-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Link to={adminRoute(`ManageEvents/${event.event_id}`)} key={event.event_id}>
                            <Card className="bg-white shadow border border-gray-100 hover:shadow-lg py-3">
                                <CardHeader className="px-3">
                                    <CardTitle className="flex flex-col gap-2">
                                        <img src={event?.banner_image || sample_bg} alt="" srcset=""
                                            className="rounded-lg h-36 object-cover object-center" />
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-lg font-semibold">{event.name}</p>
                                            <Ellipsis className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 text-blue-500 border border-blue-200 rounded-lg p-3">
                                                <CalendarClock className="size-5" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 text-sm">
                                                <p className="text-gray-600 font-semibold">{formatDateNumber(event.start_date)} - {formatDateNumber(event.end_date)}</p>
                                                <p className=" flex items-center gap-1 text-gray-500 font-normal">
                                                    <MapPin className="inline size-3" />
                                                    {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    </CardTitle>

                                </CardHeader>
                            </Card>
                        </Link>

                    ))
                ) : (
                    <p>No events created yet.</p>
                )}
            </div>
        </main>
    );
}