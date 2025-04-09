import "./layout.css";
import ImageUploader from "./ImageUploader";
import { useCallback, useState } from "react";

export default function Layout({ children }) {
    const [previewImageSrc, setPreviewImageSrc] = useState("");

    const handleCreateBase64 = useCallback(async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPreviewImageSrc(base64);
        e.target.value = "";
    }, []);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            if(!file) {
                alert("Please select an image");
            } else {
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
            }
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1 className="title-main">TTRPG</h1>
                <h2 className="title-sub">Grid Scaler</h2>
            </header>
            <div className="content">
                <aside className="sidebar">
                    <h3 className="side-title">MENU</h3>
                    <ul>
                        <li>
                            <input type="file"  className="hidden" id="fileUpload" accept="image/*" onChange={handleCreateBase64}/>
                            <label for="fileUpload" className="custom-button"> Upload
                            </label>
                        </li>
                        <li>Save</li>
                        <li>Option 1</li>
                        <li>...</li>
                    </ul>
                </aside>
                <main className="main-area">{children} 
                    <img src={previewImageSrc} className="picture"></img>
                </main>
            </div>
        </div>
    );
}