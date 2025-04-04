import { useState } from 'react'
import Layout from './components/layout';
import ImageUploader from "./components/ImageUploader";
import './style.css';

function App() {
  {/*const [imageURL, setImageURL] = useState(null)*/}

  return (
    <Layout>
      < ImageUploader />
      {/*<h1 style={{textAlign: "center" }}>TTRPG Grid Scaler</h1>*/}
      {/*<ImageUploader onImageSelected={setImageURL} />*/}
    </Layout>
  );
}

export default App
