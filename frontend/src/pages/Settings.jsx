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

export function Settings () {
    const { formData, setFormData, addDepartment, departments, fetchDepartments, deleteDepartment } = useDepartmentStore();

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleSubmitDepartment = async (e) => {
        const success = await addDepartment(e);
        if (success) {
            const closeBtn = document.querySelector('[data-slot="dialog-close"]');
            if (closeBtn) closeBtn.click();
            return;
        }
    }

    const handleDelete = async (e, id) => {
        const success = await deleteDepartment(e, id);
        if (success) {
            document.getElementById("departmentDeleteDialog").close();
            return;
        }
    }

    return (
        <main>
            <PageSync page="Settings" />
            <div className="flex items-center justify-between my-4">
                <p className=" text-2xl font-semibold ">Departments</p>
                <Dialog id="addDepartmentDialog">
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
                            
                            <div className="grid gap-3">
                                <Label htmlFor="logo">Logo</Label>
                                <Input id="logo" type="file"
                                name="logo" accept="image/*"
                                value={formData?.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
                                placeholder="Upload logo image"
                                />
                            </div>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="addDepartment">Add department</Button>
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
                                    <div>
                                        {capitalizeFirstLetter(department.name)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="mr-2" >
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
            
        </main>
    )
}