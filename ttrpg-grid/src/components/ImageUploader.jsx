import { useState } from "react";

export default function ImageUploader({ onImageSelected }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreviewUrl(imageURL);
            if (onImageSelected) {
                onImageSelected(imageURL);
            }
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem"}}>
            <input type="file"  className="hidden" id="fileUpload" accept="image/*"/>
            <label for="fileUpload" className="custom-button"> Upload</label>
            {previewUrl && (
                <>8
                    <h3>Preview</h3>
                    <img
                        src={previewUrl}
                        alt="Map Preview"
                        className="image-location"
                        style={{ maxWidth: "1000px", maxHeight: "1000px"}}
                    />
                </>
            )}
        </div>
    );
}