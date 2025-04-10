import "./layout.css";
import React, {useState, useRef} from "react";
import { Stage, Layer, Rect} from 'react-konva';

export default function Layout({ children }) {

    const width = 1000;
    const height = 900;
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [previewSquare, setPreviewSquare] = useState(null);
    const [tiledSquares, setTiledSquares] = useState([]);

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
  
    const handleMouseDown = (e) => {
      const { x, y } = e.target.getStage().getPointerPosition();
      setStartPos({ x, y });
      setIsDrawing(true);
    };
    
    const handleMouseUp = () => {
        if (previewSquare) {
          const square = { ...previewSquare }; // use the exact preview position & size
          const tiles = tileAcrossStage(square);
          setTiledSquares(tiles);
          setPreviewSquare(null);
        }
        setIsDrawing(false);
      };
  
    const handleMouseMove = (e) => {
        if (!isDrawing) return;
      
        const { x, y } = e.target.getStage().getPointerPosition();
      
        const dx = x - startPos.x;
        const dy = y - startPos.y;
        const size = Math.min(Math.abs(dx), Math.abs(dy));
      
        const newX = dx < 0 ? startPos.x - size : startPos.x;
        const newY = dy < 0 ? startPos.y - size : startPos.y;
      
        setPreviewSquare({ x: newX, y: newY, size });
      };
  
      const tileAcrossStage = ({ x, y, size }) => {
      
        const tiles = [];
      
        // Calculate how many tiles we need in each direction
        const leftTiles = Math.ceil(x / size);
        const rightTiles = Math.ceil((width - x - size) / size);
        const upTiles = Math.ceil(y / size);
        const downTiles = Math.ceil((height - y - size) / size);
      
        for (let row = -upTiles; row <= downTiles; row++) {
          for (let col = -leftTiles; col <= rightTiles; col++) {
            tiles.push({
              x: x + col * size,
              y: y + row * size,
              size,
            });
          }
        }
      
        return tiles;
      };

      // ✅ Export handler
    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'tiled-squares.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
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

                                {/* Preview the square you're about to use for tiling */}
                                {previewSquare && (
                                    <Rect
                                        x={previewSquare.x}
                                        y={previewSquare.y}
                                        width={previewSquare.size}
                                        height={previewSquare.size}
                                        stroke="white"
                                        dash={[4, 2]}
          />
                                )}

                                {/* Final tiled pattern */}
                                {tiledSquares.map((sq, i) => (
                                    <Rect
                                        key={i}
                                        x={sq.x}
                                        y={sq.y}
                                        width={sq.size}
                                        height={sq.size}
                                        stroke="white"
                                        strokeWidth={1}
                                    />
                            ))}
                            </Layer>
                    </Stage>

                          {/* ✅ Export Button */}
                        <button onClick={handleExport} style={{ marginTop: '10px' }}>
                        Export as PNG
                        </button>
                </main>
            </div>
        </div>
    );
}