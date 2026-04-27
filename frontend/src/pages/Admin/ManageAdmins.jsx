import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";
import { PageSync } from "@/components/custom/PageSync";
import {
    ArrowLeft, Eye, Trash2, Plus, Loader2
} from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogTrigger, DialogFooter, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter
} from "@/components/ui/sheet";
import { EditableTextInput } from "@/components/custom/EditableTextInput";
import { adminRoute, formatDateNumber } from "@/lib/helpers";
import toast from "react-hot-toast";

import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { Separator } from "@/components/ui/separator";

export function ManageAdmins() {
    const navigate = useNavigate();
    const { admins, loading, fetchAdmins, createAdmin, googleCreateAdmin, updateAdmin, deleteAdmin } = useAdminStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        firstName: "",
        lastName: "",
        middle_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [editFormData, setEditFormData] = useState({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        profile_image: ""
    });

    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    useEffect(() => {
        if (selectedAdmin) {
            setEditFormData({
                first_name: selectedAdmin.first_name || "",
                last_name: selectedAdmin.last_name || "",
                middle_name: selectedAdmin.middle_name || "",
                email: selectedAdmin.email || "",
                profile_image: selectedAdmin.profile_image || ""
            });
        }
    }, [selectedAdmin]);

    const handleManualCreate = async (e) => {
        e.preventDefault();
        
        if (createFormData.password !== createFormData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (createFormData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setCreateLoading(true);
        const success = await createAdmin({
            firstName: createFormData.firstName,
            lastName: createFormData.lastName,
            middle_name: "",
            email: createFormData.email,
            passwordHash: createFormData.password,
            role: "admin"
        });
        setCreateLoading(false);

        if (success) {
            setIsCreateDialogOpen(false);
            setCreateFormData({
                firstName: "",
                lastName: "",
                middleName: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
        }
    };

    const handleGoogleCreate = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const success = await googleCreateAdmin(idToken);
            if (success) {
                setIsCreateDialogOpen(false);
            }
        } catch (error) {
            console.error("Google sign-up error:", error);
            toast.error("Failed to create admin with Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleViewProfile = (admin) => {
        setSelectedAdmin(admin);
        setIsProfileSheetOpen(true);
    };

    const handleEditField = (field, value) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
    };

    const [saveLoader, setSaveLoader] = useState(false);
    const handleSaveProfile = async () => {
        if (!selectedAdmin) return;
        setSaveLoader(true);

        try {
            const success = await updateAdmin(selectedAdmin.account_id, {
                firstName: editFormData.first_name,
                lastName: editFormData.last_name,
                middleName: editFormData.middle_name,
                email: editFormData.email,
                profileImage: editFormData.profile_image
            });

            if (success) {
                fetchAdmins();
                setSelectedAdmin(prev => ({
                    ...prev,
                    first_name: editFormData.first_name,
                    last_name: editFormData.last_name,
                    middle_name: editFormData.middle_name,
                    email: editFormData.email,
                    profile_image: editFormData.profile_image
                }));
            }
        } catch (error) {
            console.error("Error updating admin:", error);
        } finally {
            setSaveLoader(false);
        }
        
    };

    const handleDeleteAdmin = async () => {
        if (!selectedAdmin) return;

        setDeleteLoading(true);
        const success = await deleteAdmin(selectedAdmin.account_id);
        setDeleteLoading(false);

        if (success) {
            setIsDeleteDialogOpen(false);
            setIsProfileSheetOpen(false);
            setSelectedAdmin(null);
        }
    };

    const openDeleteDialog = (admin) => {
        setSelectedAdmin(admin);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 pb-12 w-full max-w-6xl mx-auto">
            <PageSync page="Manage Admins" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="cursor-pointer">
                        <ArrowLeft />
                    </button>
                    <p className="text-lg font-semibold text-muted-foreground">Back</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Plus size={16} />
                            Create Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Admin Account</DialogTitle>
                            <DialogDescription>
                                Add a new admin to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleManualCreate} >
                            <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh] -mr-2 pr-3 pl-2">
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleGoogleCreate}
                                        disabled={googleLoading}
                                    >
                                        {googleLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                        )}
                                        Use Google Account
                                    </Button>
                                    
                                </div>
                                
                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={createFormData.firstName}
                                            onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={createFormData.lastName}
                                            onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createFormData.email}
                                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={createFormData.password}
                                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={createFormData.confirmPassword}
                                        onChange={(e) => setCreateFormData({ ...createFormData, confirmPassword: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                
                            </div>

                            <DialogFooter>
                                <Button type="submit"
                                    variant="destructive"
                                    className="w-full" disabled={createLoading}>
                                        {createLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Create Account
                                    </Button>
                            </DialogFooter>

                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border overflow-hidden rounded-lg">
                <Table>
                    <TableHeader  className="bg-muted">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead >Email</TableHead>
                            <TableHead >Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : admins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                    No admins found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.account_id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={admin.profile_image} alt={admin.first_name} />
                                                <AvatarFallback className="bg-red text-white text-xs">
                                                    {admin.first_name?.[0]}{admin.last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{admin.first_name} {admin.last_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{admin.email}</TableCell>
                                    <TableCell >
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewProfile(admin)}
                                            >
                                                <Eye className=" h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => openDeleteDialog(admin)}
                                                variant="destructive" size="sm">
                                                <Trash2 className=" h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={isProfileSheetOpen} onOpenChange={setIsProfileSheetOpen}>
                <SheetContent className="overflow-y-auto min-w-[450px]">
                    <SheetHeader>
                        <SheetTitle>Admin Profile</SheetTitle>
                        <SheetDescription>
                            View and edit admin information.
                        </SheetDescription>
                    </SheetHeader>
                    {selectedAdmin && (
                        <div className="grid gap-6 px-4 pb-4">
                            <ImageUpload
                                    label="Profile Image"
                                    folder="admins"
                                    defaultImage={editFormData.profile_image}
                                    onUploadSuccess={(url) => handleEditField('profile_image', url)}
                                />

                            {/* <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={editFormData.profile_image} alt={editFormData.first_name} className="object-cover" />
                                    <AvatarFallback className="text-3xl bg-red text-white">
                                        {editFormData.first_name?.[0]}{editFormData.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                
                            </div> */}

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>First Name</Label>
                                    <EditableTextInput
                                        value={editFormData.first_name}
                                        onSave={(value) => handleEditField('first_name', value)}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Middle Name</Label>
                                    <EditableTextInput
                                        value={editFormData.middle_name}
                                        onSave={(value) => handleEditField('middle_name', value)}
                                        placeholder="Enter middle name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Last Name</Label>
                                    <EditableTextInput
                                        value={editFormData.last_name}
                                        onSave={(value) => handleEditField('last_name', value)}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <EditableTextInput
                                        value={editFormData.email}
                                        onSave={(value) => handleEditField('email', value)}
                                        placeholder="Enter email"
                                    />
                                </div>
                                {selectedAdmin.created_at && (
                                    <div className="grid gap-2">
                                        <Label className="text-muted-foreground">Created At</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDateNumber(selectedAdmin.created_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <SheetFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsProfileSheetOpen(false)}>Close</Button>
                        <Button 
                            className="bg-red hover:bg-red/90" 
                            onClick={handleSaveProfile}
                            disabled={saveLoader}
                        >
                            {saveLoader && <Loader2 size={16} className="animate-spin mr-2" />}
                            {saveLoader ? "Saving..." : "Save Changes"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Admin</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedAdmin?.first_name} {selectedAdmin?.last_name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteAdmin}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}