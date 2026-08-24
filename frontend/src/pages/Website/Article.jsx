import { usePublicStore } from "@/store/usePublicStore";
import MarkdownEditor from "@/components/custom/MarkdownEditor";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InitialUploadImage } from "@/components/custom/InitialUploadImage";
import { useImageUpload } from "@/store/useImageUpload";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function Article() {
    const { findArticle, articleTypes, fetchArticleTypes, addArticle, deleteArticle, updateArticle } = usePublicStore();
    const {uploadImage} = useImageUpload();
    const { articleId, mode } = useSearchParams();
    const [loader, setLoader] = useState(false);
    
    const article = findArticle(articleId);
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticleTypes();
    }, [fetchArticleTypes]);

    const [edited, setEdited] = useState(false);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    const [formData, setFormData] = useState( mode == "edit" ? 
        {   title: article.title,
            content: article.content,
            image: article.image,
            articleType_id: article.articleType_id,
            date: article.date,
        } : 
        {
            title: "",
            content: "",
            image: "",
            articleType_id: "",
            date: "",
        });

    

    const checkIfEdited = () => {
        const isEdited = Object.entries(formData).some(
            ([key, value]) => value !== article[key]
        );
        setEdited(isEdited);
    }

    const checkEmptyFields = () => {
        const isEmpty = Object.entries(formData).some(
            ([key, value]) => value == null || String(value).trim() === ""
        );
        setAllFieldsFilled(!isEmpty);
    }

    const cancelChanges = () => {
        setFormData({
            title: article.title,
            content: article.content,
            image: article.image,
            articleType_id: article.articleType_id,
            date: article.date,
        })
    }

    const handleAddArticle = async () => {
        checkEmptyFields();
        
        if(allFieldsFilled){
            setLoader(true);
        try {
            const img_formData = new FormData();
            img_formData.append("image", formData.image);
            img_formData.append("folder", "articles");

            const image_res = await uploadImage(img_formData);

            if(image_res.status == "success"){

                const result = await addArticle({
                    ...formData,
                    image: image_res.url,
                });

                if (result.success) {
                    setFormData({
                        title: "",
                        content: "",
                        image: "",
                        articleType_id: "",
                        date: null,
                    });
                }

            } else {
                toast.error("Image Storage Error");
                return;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
        } else {
            toast.error("Please fill in all the fields");
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
                    articleType_id: "",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setOnOpenEditArticle(false);
            setLoader(false);
        }
    }

    const handleDeleteArticle = (article_id) => {
        toast.promise(
            deleteArticle(article_id),
            {
                loading: "Deleting article...",
                success: "Article deleted successfully",
                error: "Failed to delete article",
            }
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Button
                onClick={() => navigate(-1)}>
                    <ArrowLeft/>
                </Button>
                {
                    mode == "edit" ? (
                        <div className="flex items-center gap-2">
                          {edited && (
                                <div className="flex items-center gap-2">
                                    <Button variant="default"
                                        onClick={handleUpdateArticle}
                                        disabled={loader}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button variant="outline"
                                        onClick={cancelChanges}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}  
                        <Button variant="destructive"
                            onClick={() => handleDeleteArticle(articleId)}
                        >
                            Delete
                        </Button>
                        </div>
                        
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="default"
                                onClick={()=> handleAddArticle()}
                                disabled={!allFieldsFilled}
                            >
                                {loader ? (
                                    <Loader2 className="animate-spin"/>
                                ) : (
                                    "Add Article"
                                )}
                            </Button>
                        </div>
                    )
                }
            </div>
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="articleType_id">Article Type</Label>
                    <Select
                        value={formData.articleType_id || ""}
                        onValueChange={(value) => {
                            setFormData({ ...formData, articleType_id: value });
                            if(mode == "edit"){
                                checkIfEdited();
                            } else {
                                checkEmptyFields();
                            }
                        }}
                    >
                        <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Select article type" />
                        </SelectTrigger>
                        <SelectContent>
                            {articleTypes?.map((type) => (
                                <SelectItem key={type.id} value={type.articletype_id}>
                                    {type.article_type
                                    }
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        placeholder="Enter date"
                        value={formData.date}
                        onChange={(e) => 
                            {
                                setFormData({ ...formData, date: e.target.value });
                                if(mode == "edit"){
                                    checkIfEdited();
                                } else {
                                checkEmptyFields();
                                }
                            }
                        }
                    />
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Article title</Label>
                <Input
                    id="title"
                    placeholder="Enter article title"
                    value={formData.title}
                    onChange={(e) => 
                        {
                            setFormData((data) => ({
                                ...data,
                                title: e.target.value
                            }));
                            
                            if(mode == "edit"){
                                checkIfEdited();
                            } else {
                               checkEmptyFields();
                            }
                        }}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <MarkdownEditor 
                    value={formData.content} 
                    onChange={(e) => 
                        {
                            setFormData((data) => ({
                                ...data,
                                content: e
                            }));
                            if(mode == "edit"){
                                checkIfEdited();
                            } else {
                                checkEmptyFields();
                            }
                        }}
                />
            </div>

            
            <div className="flex flex-col gap-2">
                <InitialUploadImage
                    label="Article Image"
                    defaultImage={formData.image?.name}
                    onUpload={(file) => 
                        {   setFormData({ ...formData, image: file });
                            if(mode == "edit"){
                                checkIfEdited();
                            } else {
                                checkEmptyFields();
                            }
                        }}
                />
            </div>
        </div>
    )
}
