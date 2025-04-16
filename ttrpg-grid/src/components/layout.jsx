//Importing outside files and initializing react and react-konva
import "./layout.css";
import React, {useState, useRef, useEffect} from "react";
import { Stage, Layer, Rect} from 'react-konva';

export default function Layout({ children }) {

    //Initializing variables 
    const width = 1000;
    const height = 900;
    const stageRef = useRef(null);
    const [image, setImage] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [previewSquare, setPreviewSquare] = useState(null);
    const [gridSquares, setGridSquares] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
     
    //Process to upload an image. This will grab the first image selected by a user and convert to base64 data url.
    //This allows us to use the image as a local source and set img variable. 
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            setImage(img);
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
  
    //Process to determine when the mouse is clicked. It will store the exact x and y location as well as begin drawing. 
    const handleMouseDown = (e) => {
      const { x, y } = e.target.getStage().getPointerPosition();
      setStartPos({ x, y });
      setIsDrawing(true);
    };
    
    //Process of determining when mouse click is over. First it will determine exact location and size of the preview square. 
    //Then it will generate and fill the stage will squares. Once that happens, it will remove the preview square and stop drawing. 
    const handleMouseUp = () => {  
      if (previewSquare) {
          const square = { ...previewSquare }; 
          const tiles = squaresAcrossStage(square);
          setGridSquares(tiles);
          setPreviewSquare(null);
        }
        setIsDrawing(false);
      };
  
      //Process of determining when the mouse is moving and the final location. This will get the current pointer position
      //and then will determine the direction the user is moving. A ternary operator is used to determine the new location. 
      //Once this is found, it is established as the preview. 
    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      
      const { x, y } = e.target.getStage().getPointerPosition();
      
      const dx = x - startPos.x;
      const dy = y - startPos.y;
      
      //Calculating perfect square. 
      const size = Math.min((Math.abs(dx), Math.abs(dy)));
      
      //Ternary operator.
      const newX = dx < 0 ? startPos.x - size : startPos.x;
      const newY = dy < 0 ? startPos.y - size : startPos.y;
      
      setPreviewSquare({ x: newX, y: newY, size });
    };
  
    //Process to determine the number squares that will fill the grid. First it calcualtes how many squares fit in each direction. 
    //Then it creates a loop where it will push a new square in all directions.
    const squaresAcrossStage = ({ x, y, size }) => {
      
      const squares = [];
      
      //Calculate number of squares in each direction and rounds up to nearest integer. 
      const offsetX = (canvasSize.width - image.width * scale) / 2;
      const offsetY = (canvasSize.height - image.height * scale) / 2;

      const leftSquares = Math.ceil((x - offsetX) / size);
      const rightSquares = Math.ceil((offsetX + image.width * scale - (x + size)) / size);
      const upSquares = Math.ceil((y - offsetY) / size);
      const downSquares = Math.ceil((offsetY + image.height * scale - (y + size)) / size);
      
      //Nested for loop, first determines vertical distance then horizontal distance. Then pushes square in array. 
      for (let row = -upSquares; row <= downSquares; row++) {
        for (let col = -leftSquares; col <= rightSquares; col++) {
          squares.push({
            x: x + col * size,
            y: y + row * size,
            size,
          });
        }
      }
      
      return squares;
    };

    //Process to create a button that will allow the user to export the image. This will create a screenshot, a temp anchor, 
    //name the file for the user, and create a data url for the user to click. 
    const handleExport = () => {
      if (!image) return;
    
      const scale = Math.min(
        canvasSize.width / image.width,
        canvasSize.height / image.height
      );
    
      const x = (canvasSize.width - image.width * scale) / 2;
      const y = (canvasSize.height - image.height * scale) / 2;
      const width = image.width * scale;
      const height = image.height * scale;
    
      const uri = stageRef.current.toDataURL({
        x,
        y,
        width,
        height,
        pixelRatio: 2 // optional, for higher quality
      });
    
      const link = document.createElement('a');
      link.download = 'TTRPGScaledMap.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useEffect(() => {
      const updateCanvasSize = () => {
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      window.addEventListener("resize", updateCanvasSize);
      updateCanvasSize();
      return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    let scale = 1;
    if (image) {
      scale = Math.min(
        canvasSize.width / image.width,
        canvasSize.height / image.height
      );
    }

    return (
        <div className="app-container">
            {/*Creating header for the site.  */}
            <header className="header">
                <h1 className="title-main">TTRPG</h1>
                <h2 className="title-sub">Grid Scaler</h2>
            </header>
            {/*Creating the sidebar with the upload and save button. */}
            <div className="content">
                <aside className="sidebar">
                    <h3 className="side-title">MENU</h3>
                    <ul>
                        <li>
                            <input type="file"  className="hidden" id="fileUpload" accept="image/*" onChange={handleImageUpload}/>
                            <label for="fileUpload" className="custom-button"> Upload
                            </label>
                        </li>
                        <li>
                            <button onClick={handleExport} className="custom-button" margin-top = "5px" > Save </button>
                        </li>
                    </ul>
                </aside>
                    <main className="main-area">{children}
                      <div style={{ minWidth: canvasSize.width }}>
                        {/*Creating the main stage for canvas. Setting up width, height and assigning variables for mouse clicks and movement. */}
                        <Stage 
                            width={canvasSize.width} 
                            height={canvasSize.height}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            {/*Adding layer to canvas. First layer will be users map and will act as a background.  */}
                            <Layer>
                                {image && (
                                    <Rect
                                      x={(canvasSize.width - image.width * scale) / 2}
                                      y={(canvasSize.height - image.height * scale) / 2}
                                      width={image.width * scale}
                                      height={image.height * scale}
                                      fillPatternImage={image}
                                      fillPatternScaleX={scale}
                                      fillPatternScaleY={scale}
                                    />
                                )}

                                {/* This layer will create the preview for the square. Allows user to know where placement will be.*/}
                                {previewSquare && (
                                    <Rect
                                        x={previewSquare.x}
                                        y={previewSquare.y}
                                        width={previewSquare.size}
                                        height={previewSquare.size}
                                        stroke="white"
                                    />
                                )}

                                {/* Final layer will add the square grid based on users location */}
                                {gridSquares.map(square => (
                                    <Rect
                                        x={square.x}
                                        y={square.y}
                                        width={square.size}
                                        height={square.size}
                                        stroke="white"
                                    />
                                ))}
                            </Layer>
                        </Stage>
                      </div>  
                </main>
            </div>
        </div>
    );
}