import { useState } from 'react'
import ImageUploader from "./components/ImageUploader";
import './style.css';

function App() {
  const [imageURL, setImageURL] = useState(null)

  return (
    <>
      <h1 style={{textAlign: "center" }}>TTRPG Grid Scaler</h1>
      <ImageUploader onImageSelected={setImageURL} />
    </>
  );
}

export default App
