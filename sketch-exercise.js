const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const settings = {
  dimensions: [2048,2048]
};
random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  const colorCount = random.rangeFloor(1,6);
  const palette = random.shuffle(random.pick(palettes).slice(0,colorCount));
  console.log(palette);
  const createGrid = () => {
    const points = [];
    const count = 6;
    for( let x = 0; x<count; x++) {
      for( let y = 0; y<count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1); // 0 to 1
        const v = count <= 1 ? 0.5 : y / (count - 1); // 0 to 1        
        const radius = Math.abs(random.noise2D(u,v))*0.22+0.05;
        const rotation = Math.abs(random.noise2D(u,v))*-0.2;
            points.push({
              position: [ u, v],
              radius: radius,
              color: random.pick(palette),
              rotation: rotation,
            }
          );
      }
    }
    return points;
  };
  
  const points = createGrid().filter(()=>random.value() > 0.4);
  const margin = 200;
  console.log(points);

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0,0,width,height);
    points.forEach(data => {
      const {
        position,
        rotation,
        radius,
        color
      } = data;
      const [u,v] = position;
      const x = lerp(margin, width-margin,u);
      const y = lerp(margin, height-margin,v);
      
      // context.beginPath();
      // context.arc( x, y, radius*width, 0, Math.PI * 2, false);
      // context.lineWidth = '10';
      context.save();
      context.fillStyle = color;
      context.font = `${radius*width}px "Arial"`;
      context.translate(x,y);
      context.rotate(rotation);
      context.fillText('=',0,0);
      context.restore();
      
      //context.fill();
    });
  };
};

canvasSketch(sketch, settings);
