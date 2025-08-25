import React from "react";
import { FormInline, FormInput, FormLabel } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

interface ImageUploaderProps {
    label: string;
    imageWidth: number;
    imageHeight: number;
    imageEnBase64: string | null;
    onImageChange: (base64: string | null) => void; // Le type est maintenant un string (Base64)
}

const ImageUploader: React.FC<ImageUploaderProps> = ({imageHeight, imageWidth, label, onImageChange, imageEnBase64 }) => {
    // const [imagePreview, setImagePreview] = useState<string | null>(null); // Aperçu de l'image en Base64

    // Fonction de gestion du téléchargement d'image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
    
        if (file) {
            const reader = new FileReader();
    
            reader.onload = () => {
                const base64String = reader.result as string;
    
                // Créer une image temporaire pour vérifier les dimensions
                const img = new Image();
                img.onload = () => {
                    if (img.width === imageWidth && img.height === imageHeight) {
                        // Dimensions valides
                        onImageChange(base64String); // Envoie l'image au parent
                    } else {
                        // Dimensions invalides
                        alert("L'image doit avoir une taille de 474 x 315 pixels.");
                        onImageChange(null); // Réinitialise
                    }
                };
                img.onerror = () => {
                    alert("Erreur lors du chargement de l'image.");
                    onImageChange(null);
                };
    
                img.src = base64String; // Charger l'image temporairement
            };
    
            reader.readAsDataURL(file); // Lire le fichier comme Base64
        } else {
            onImageChange(null); // Réinitialise si aucun fichier n'est sélectionné
        }
    };
    

    // Fonction de suppression de l'image
    const handleRemoveImage = () => {
        onImageChange(null);
    };

    return (
        <FormInline className="flex-col items-start mt-10 xl:flex-row mb-2">
            <FormLabel className="w-full xl:w-64 xl:!mr-10">
                <div className="text-left">
                    <div className="flex items-center">
                        <div className="font-medium">{label}<span className="text-red-600"> *</span></div>
                    </div>
                    <div className="mt-3 text-xs leading-relaxed text-slate-500">
                        .webp ({imageWidth} x {imageHeight} pixels recommandé)
                    </div>
                </div>
            </FormLabel>

            {/* Colonne pour l'aperçu de l'image */}
            <div className="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                <div className="grid grid-cols-10 gap-5 pl-4 pr-5">
                    {imageEnBase64 ? (
                        <div className="relative col-span-12 h-16 w-16 image-fit zoom-in">
                            <img className="rounded-md" alt="Aperçu de l'image" src={imageEnBase64} />
                            <div
                                onClick={handleRemoveImage}
                                content="Remove this image?"
                                className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                            >
                                <Lucide icon="X" className="w-4 h-4" />
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                            <Lucide icon="Image" className="w-4 h-4 mr-2" />
                            <div className="mr-1 text-primary cursor-pointer">Charger l'image</div>
                            <FormInput
                                id="horizontal-form-1"
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>
            </div>
        </FormInline>
    );
};

export default ImageUploader;
