import "./layout.css";
import { useCallback, useState, useEffect, useRef } from "react";
import Konva from 'konva';
import { Stage, Layer, Rect, Circle } from 'react-konva';

export default function Layout({ children }) {

    const width = 1000;
    const height = 900;
    
    // Handler to reset background position on stage drag
    const handleDragMove = () => {
      if (backgroundRef.current) {
        backgroundRef.current.absolutePosition({ x: 0, y: 0 });
      }
    };
  
    const [image, setImage] = useState(null);
    const stageRef = useRef(null);
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            setImage(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
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
                            <input type="file"  className="hidden" id="fileUpload" accept="image/*" onChange={handleImageUpload}/>
                            <label for="fileUpload" className="custom-button"> Upload
                            </label>
                        </li>
                        <li>Save</li>
                        <li>Option 1</li>
                        <li>...</li>
                    </ul>
                </aside>
                    <main className="main-area">{children}
                        <Stage 
                            width={width} 
                            height={height}
                            ref={stageRef}
                            onDragMove={handleDragMove}
                        >
        
                            <Layer>
                                {image && (
                                    <Rect
                                        width={width}
                                        height={height}
                                        fillPatternImage={image}
                                        fillPatternScaleX={width/image.width}
                                        fillPatternScaleY={height/image.height}
                                    />
                                )}
        
                                {/* Demo shape */}
                                    <Circle
                                        x={width / 2}
                                        y={height / 2}
                                        radius={100}
                                        draggable
                                        fill="red"
                                    />
                            </Layer>
                    </Stage>

                </main>
            </div>
        </div>
    );
}