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
import sample_event_img from "@/assets/home/sample_img_bg.jpg"
import { useState, useEffect } from "react";
import { Loader2, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { usePublicStore } from "@/store/usePublicStore";
import { Textarea } from "@/components/ui/textarea";

export function ManageWebsite() {
    const {fetchArticles, articles, updateArticle} = usePublicStore();
    const [onOpenAddArticle, setOnOpenAddArticle] = useState(false);
    const [onOpenEditArticle, setOnOpenEditArticle] = useState(false);
    const [editWebsite, setEditWebsite] = useState(false);
    const {addArticle} = usePublicStore();

    const [formDataArticle, setFormDataArticle] = useState({
        title: "",
        content: "",
        link: "",
        image: "",
    });

    const [loader, setLoader] = useState(false);

    const handleAddArticle = async () => {
        setLoader(true);
        try {
            const result = await addArticle(formDataArticle);
            if (result.success) {
                setFormDataArticle({
                    title: "",
                    content: "",
                    link: "",
                    image: "",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOnOpenAddArticle(false);
            setLoader(false);
        }
    }
    const handleUpdateArticle = async () => {
        setLoader(true);
        try {
            const result = await updateArticle(formDataArticle);
            if (result.success) {
                setFormDataArticle({
                    title: "",
                    content: "",
                    link: "",
                    image: "",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOnOpenEditArticle(false);
            setLoader(false);
        }
    }
    useEffect(() => {
        fetchArticles();
    }, [fetchArticles])

    // console.log(articles)
    
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
                        <div className="border p-3 py-4 rounded-md">

                        <div className="flex items-center justify-between px-3">
                            <h3 className="text-lg font-semibold">Articles</h3>
                            <Button onClick={() => setOnOpenAddArticle(true)}>Add Article</Button>
                        </div>
                        <div className="flex flex-col space-y-6 px-3 mt-3">
                            { articles?.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground ">No articles found</p>
                                </div>
                            )}
                            {articles?.length > 0 && articles.map((article, index) => (
                                <section key={index} className="relative flex flex-col-reverse md:flex-row justify-between w-full h-fit md:min-h-72 md:max-h-80 rounded-2xl border border-zinc-200 overflow-hidden ">
                                    <div className="absolute top-2 right-2 flex items-center bg-red/90 rounded-md text-white px-1 " >
                                        <Button variant="icon" size="sm"
                                        onClick={() => {
                                            setFormDataArticle(article);
                                            setOnOpenEditArticle(true);
                                        }}
                                        ><Pencil /></Button>
                                        <Button variant="icon" size="sm"><Trash2 /></Button>
                                    </div>
                                <div className="p-5 flex flex-col justify-center gap-6 w-full md:w-[50%]">
                                    <div className="space-y-2">
                                        <p className="text-2xl lg:text-3xl tracking-wider font-freshman text-custom-secondary ">{article?.title}</p>
                                        <p className="text-sm lg:text-md"> {article?.content}</p>
                                        <p className="text-custom-secondary text-sm font-medium mt-3">{article?.created_at}</p>
                                    </div>
                                    <a href={article?.link} className="flex items-center font-semibold gap-2 bg-custom-secondary text-custom-primary w-fit py-2 px-4 rounded">View link <ArrowUpRight /> </a>
                                </div>
                                <img src={article?.image} alt="" srcset="" className=" object-cover object-center w-full md:w-[50%]" />
                            </section>
                            ))}
                     </div>
                        </div>

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
            <ArticleSheet sheetOpen={onOpenAddArticle} 
            setSheetOpen={setOnOpenAddArticle} 
            formData={formDataArticle} 
            setFormData={setFormDataArticle} 
            loader={loader} setLoader={setLoader} 
            handleAddArticle={handleAddArticle} />

            <ArticleEditSheet sheetOpen={onOpenEditArticle} 
            setSheetOpen={setOnOpenEditArticle} 
            formData={formDataArticle} 
            setFormData={setFormDataArticle} 
            loader={loader} setLoader={setLoader} 
            handleUpdateArticle={handleUpdateArticle} />
        </div>
    );
}

function ConfigureWebsite({sheetOpen, setSheetOpen}) {
    const [formData, setFormData] = useState({
        header_image: "",
    });
    const [loader, setLoader] = useState(false);
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
                <SheetFooter>
                    <Button
                    variant="outline"
                    onClick={() => setEditWebsite(false)}
                    >
                    Cancel
                    </Button>
                    <Button
                    type="submit"
                    // onClick={handleEditSubmit}
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
    );
}

function ArticleSheet({sheetOpen, setSheetOpen, formData, setFormData, loader, setLoader, handleAddArticle}) {
    
    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent className="overflow-y-auto min-w-[500px]">
                <SheetHeader>
                    <SheetTitle>Add Article</SheetTitle>
                    <SheetDescription>
                    Add a new article to the website.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Article title</Label>
                        <Input
                            id="title"
                            placeholder="Enter article title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Enter article content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="link">Link</Label>
                        <Input
                            id="link"
                            placeholder="Enter article link"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>
                    <div>
                        <ImageUpload
                            label="Article Image"
                            folder="articles"
                            defaultImage={formData.image}
                            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <Button
                    type="submit"
                    onClick={handleAddArticle}
                    className="bg-red text-white hover:bg-red/90"
                    disabled={loader}
                    >
                    {loader ? (
                        <Loader2 className=" h-4 w-4 animate-spin" />
                    ) : (
                        "Add Article"
                    )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function ArticleEditSheet({sheetOpen, setSheetOpen, formData, setFormData, loader, setLoader, handleUpdateArticle}) {
    
    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent className="overflow-y-auto min-w-[500px]">
                <SheetHeader>
                    <SheetTitle>Add Article</SheetTitle>
                    <SheetDescription>
                    Add a new article to the website.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Article title</Label>
                        <Input
                            id="title"
                            placeholder="Enter article title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Enter article content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="link">Link</Label>
                        <Input
                            id="link"
                            placeholder="Enter article link"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>
                    <div>
                        <ImageUpload
                            label="Article Image"
                            folder="articles"
                            defaultImage={formData.image}
                            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <Button
                    type="submit"
                    onClick={handleUpdateArticle}
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
    );
}