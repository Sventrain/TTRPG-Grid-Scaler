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
            <h2>Upload Map to Add Scaling</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
                <>
                    <h3>Preview</h3>
                    <img
                        src={previewUrl}
                        alt="Map Preview"
                        style={{ maxWidth: "500px", marginTop: "1rem"}}
                    />
                </>
            )}
        </div>
    );
}