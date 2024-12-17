import React, { useState } from 'react';

const ColoringGame = () => {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);

  const colors = [
    '#FF0000', // Raudona
    '#0000FF', // Mėlyna
    '#008000', // Žalia
    '#FFA500', // Oranžinė
    '#800080', // Violetinė
    '#000000'  // Juoda
  ];

  const handleMouseDown = (e) => {
    const svg = e.target.closest('svg');
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    setIsDrawing(true);
    setPaths(prev => [...prev, {
      color: currentColor,
      points: [`M${svgPoint.x},${svgPoint.y}`]
    }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const svg = e.target.closest('svg');
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    setPaths(prev => {
      const newPaths = [...prev];
      const lastPath = newPaths[newPaths.length - 1];
      lastPath.points.push(`L${svgPoint.x},${svgPoint.y}`);
      return newPaths;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    setPaths([]);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Spalvinimo Žaidimas</h2>
      
      <div className="flex space-x-2 mb-4">
        {colors.map(color => (
          <button 
            key={color} 
            onClick={() => setCurrentColor(color)}
            className={`w-10 h-10 rounded-full ${currentColor === color ? 'border-4 border-black' : ''}`}
            style={{backgroundColor: color}}
          />
        ))}
        <button 
          onClick={clearDrawing} 
          className="bg-white border p-2 rounded flex items-center"
        >
          Išvalyti
        </button>
      </div>

      <svg 
        width="600" 
        height="400" 
        className="bg-white border-2 border-gray-300"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <image 
          href="/api/placeholder/600/400" 
          width="600" 
          height="400" 
          preserveAspectRatio="none"
        />
        {paths.map((path, index) => (
          <path
            key={index}
            d={path.points.join(' ')}
            fill="none"
            stroke={path.color}
            strokeWidth="3"
          />
        ))}
      </svg>
    </div>
  );
};

export default ColoringGame;
