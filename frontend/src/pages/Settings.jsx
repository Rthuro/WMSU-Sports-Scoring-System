import { PageSync } from '@/components/custom/PageSync';
import { Plus, Trash2, Edit3Icon, TriangleAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { capitalizeFirstLetter } from '@/lib/helpers';
import { useEffect } from 'react';
import { ImageUpload } from '@/components/custom/ImageUpload';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Settings () {
    const { formData, setFormData, addDepartment, departments, fetchDepartments, deleteDepartment, updateDepartment } = useDepartmentStore();
    const [editFormData, setEditFormData] = useState({
        id: "",
        name: "",
        abbreviation: "",
        logo: null
    })
    const [sheetOpen, setSheetOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [delLoader, setDelLoader] = useState(false)

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleSubmitDepartment = async (e) => {
        setLoading(true)
        try {
            const success = await addDepartment(e);
            if (success) {
                setDialogOpen(false);
                return;
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (e, id) => {
        setDelLoader(true)
        try {
            const success = await deleteDepartment(e, id);
            if (success) {
                document.getElementById("departmentDeleteDialog").close();
                return;
            }
        } catch (error) {
            console.log(error)
        } finally {
            setDelLoader(false)
        }
    }

    const handleSaveDepartmentEdit = async (e) => {
        if (!editFormData?.id) {
            console.error("No department ID provided");
            return;
        }

        setLoading(true);
        try {
            const success = await updateDepartment(e, editFormData);
            if (success) {
                fetchDepartments();
                setSheetOpen(false);
                setEditFormData({
                    id: "",
                    name: "",
                    abbreviation: "",
                    logo: null
                });
            }
        } catch (error) {
            console.error("Error saving department:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <PageSync page="Settings" />
            <div className="flex items-center justify-between my-4">
                <p className=" text-2xl font-semibold ">Departments</p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
                    <DialogTrigger asChild>
                        <Button type="button" className="w-fit">
                            <Plus />
                            Add  Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Department</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new department.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitDepartment} id='addDepartment' className="grid grid-cols-2 gap-4">
                            <div className="grid gap-3 col-span-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Event name" 
                                value={formData.name ?? ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required />
                            </div>
                            <div className="grid gap-3 col-span-2">
                                <Label htmlFor="description">Abbreviation</Label>
                                <Input id="abbreviation" name="abbreviation" placeholder="Abbreviation" 
                                value={formData.abbreviation  ?? ""}
                                onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                                />
                            </div>
                            
                            <div className="grid gap-3 col-span-2">
                                <ImageUpload
                                    label="Department Logo"
                                    folder="departments"
                                    defaultImage={formData.logo}
                                    onUploadSuccess={(url) => setFormData({ ...formData, logo: url })}
                                />
                            </div>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="addDepartment" disabled={loading}>{loading ? "Adding department..." : "Add department"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <section className="border rounded-lg overflow-hidden">
                <Table >
                    <TableHeader  className="bg-muted">
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments?.map((department) => (
                            <TableRow key={department.department_id}>
                                <TableCell className="font-medium ">
                                    <div className='flex items-center gap-3'>
                                        <Avatar className="size-9">
                                            <AvatarImage src={department.logo} alt={department.abbreviation} />
                                            <AvatarFallback>{department.abbreviation}</AvatarFallback>
                                        </Avatar>
                                        <p>{department.name} {department.abbreviation && `(${department.abbreviation})`}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="mr-2" 
                                    onClick={() => {
                                        setEditFormData({
                                            id: department.department_id,
                                            name: department.name,
                                            abbreviation: department.abbreviation,
                                            logo: department.logo
                                        })
                                        setSheetOpen(true);
                                    }}>
                                        <Edit3Icon className=" h-4 w-4" />
                                    </Button>
                                    <Dialog id="departmentDeleteDialog">
                                        <DialogTrigger asChild >
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className=" h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className=" w-96 space-y-2">
                                            <DialogHeader>
                                                <div className="bg-red-50 rounded-full p-3 w-fit mx-auto mb-2 flex items-center justify-center">
                                                    <Trash2 className="size-6 text-red-500 " />
                                                </div>
                                                
                                                <DialogTitle className="text-center">Are you sure?</DialogTitle>
                                                <DialogDescription className="text-center text-sm">
                                                    Are you sure you want to delete this department? <br/> This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-4">
                                                <DialogClose asChild>
                                                    <Button variant="outline" size="lg" className="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                               
                                                <Button variant="destructive" size="lg" className="cursor-pointer" 
                                                onClick={ (e) => handleDelete(e, department.department_id)}>
                                                    Confirm
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="overflow-y-auto min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Edit Department</SheetTitle>
                        <SheetDescription>
                            Update the department details below.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 px-4 pb-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-match-name">Name</Label>
                            <Input
                                value={editFormData?.name || null}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-match-name">Abbreviation</Label>
                            <Input
                                id="edit-match-name"
                                value={editFormData.abbreviation}
                                onChange={(e) => setEditFormData({ ...editFormData, abbreviation: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                             <ImageUpload
                                label="Department Logo"
                                folder="departments"
                                defaultImage={editFormData.logo}
                                onUploadSuccess={(url) => setEditFormData({ ...editFormData, logo: url })}
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={(e) => handleSaveDepartmentEdit(e, editFormData)} className="w-full" variant="outline" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </main>
    )
}