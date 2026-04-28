import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ImageUpload } from "@/components/custom/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageSync } from "@/components/custom/PageSync";

export function ManageWebsite() {
    return (
        <div>
            <PageSync page="Manage Website" />
            <main className="w-full ">
                <Tabs defaultValue="articles" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="configure">Configure Website</TabsTrigger>
                    </TabsList>
                    <TabsContent value="articles">
                        <Card>
                        <CardHeader>
                            <CardTitle>Articles</CardTitle>
                            <CardDescription>
                                Articles to be displayed on the website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            You have 12 active projects and 3 pending tasks.
                        </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="configure">
                        <Card>
                        <CardHeader>
                            <CardTitle>Configure Website</CardTitle>
                            <CardDescription>
                            Configure your website settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                        </CardContent>
                        </Card>
                    </TabsContent>
                    
                </Tabs>
            </main>
        </div>
    );
}

function ConfigureWebsite({sheetOpen, setSheetOpen}) {
    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Configure Website</SheetTitle>
                    <SheetDescription>
                    Configure your website settings.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3">
                    <div>
                        <ImageUpload
                            label="Change Header Background Image"
                            folder="website"
                            defaultImage={formData.header_image}
                            onUploadSuccess={(url) => setFormData({ ...formData, header_image: url })}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}