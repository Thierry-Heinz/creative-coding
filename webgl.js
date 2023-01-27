// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  dimensions: [512,512],
  fps: 24,
  duration: 4, // in sec
  // Get a WebGL canvas rather than 2D
  context: "webgl",

  attributes: {antialias:true}
};

const sketch = ({ context }) => {
  // Create a renderer
  
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("hsl(0,0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  //camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
   const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry(1,1,1);


  const palette = random.shuffle(random.pick(palettes));
const fragmentShader = `
  void main() {
    gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5);
  }
`;


  for (let i = 0; i < 30; i++) {    
    const mesh = new THREE.Mesh(
      box,
      new THREE.ShaderMaterial({
        fragmentShader,
        //color: random.pick(palette),
       /*  roughness: 0.75,
        flatShading: true, */
      })
    );
    mesh.position.set(
     random.range(-1,1),
     random.range(-1,1),
     random.range(-1,1),
     ); 
     mesh.scale.set(
      random.range(-1,1),
      random.range(-1,1),
      random.range(-1,1),
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

scene.add(new THREE.AmbientLight('hsl(0,0%,40%'));

const light = new THREE.DirectionalLight('white', 1);
light.position.set(2,2,4).multiplyScalar(1);
scene.add(light);

/*   scene.add(new THREE.AmbientLight('#59314f'));

  const light = new THREE.PointLight('#45caf7', 1, 15.5);
  light.position.set(2,2,-4).multiplyScalar(1.5);
  scene.add(light);
 */


  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2;
      
      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      
      // Near/Far
      camera.near = -100;
      camera.far = 100;
      
      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      
      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
    
      const t = Math.sin(playhead * Math.PI) ;
      scene.rotation.y  = eases.expoInOut(t);
      scene.rotation.z = eases.quintInOut(t);
      //mesh.rotation.y = time *(20*Math.PI /180);
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
