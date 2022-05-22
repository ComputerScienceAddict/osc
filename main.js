
import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


const raycaster = new THREE.Raycaster(); 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

console.log(gsap);
console.log(scene);

renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//const geometry = new THREE.BoxGeometry(1,1,1);
const planeGeometry = new THREE.PlaneGeometry(19,19,17,17);
//const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const planeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true});

console.log(planeGeometry);
//const mesh = new THREE.Mesh(geometry,material);
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
//console.log(planeMesh.geometry.attributes.position.array);
const {array} = planeMesh.geometry.attributes.position

const randomValues = [];

for(let i = 0; i < planeMesh.geometry.attributes.position.array.length; i++){
  if(i % 3 === 0){
  const x = array[i];
  const y = array[i+1];
  const z = array[i+2];

  array[i] = x + (Math.random() - 0.5);
  array[i + 1] = y + (Math.random() - 0.5);
  array[i + 2] = z + Math.random();
  console.log(array[i]);
  }
  randomValues.push(Math.random());

}

function addStar(){
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

planeMesh.geometry.attributes.position.randomValues = randomValues;

planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;

const colors = [];
for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
  colors.push(0,0.19,0.4);

}
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors),3));

new OrbitControls(camera,renderer.domElement);


//scene.add(mesh);
scene.add(planeMesh);
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(0, 0, 1);
scene.add(light);
camera.position.z = 5;

const mouse = {
  x: undefined,
  y: undefined
}



let frame = 0;

function animate(){
  requestAnimationFrame(animate);

  
  renderer.render(scene,camera);


  raycaster.setFromCamera(mouse, camera);

  frame += 0.01
  //const Array = planeMesh.geometry.attributes.position.array;
  //const OriginalPosition = planeMesh.geometry.attributes.position.originalPosition;
  //const RandomValues = planeMesh.geometry.attributes.position.randomValues;

  const {array, 
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position;
  for(let i = 0; i < array.length; i+= 3){
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) *0.003;

    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i]) *0.003;

    
 }
 planeMesh.geometry.attributes.position.needsUpdate = true;





  const intersects = raycaster.intersectObject(planeMesh);
  if(intersects.length > 0){
    //console.log(intersects[0].face);
    //console.log(intersects[0].object.geometry.attributes.color.setX(0, 0));
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0);
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0);
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0);
    intersects[0].object.geometry.attributes.color.needsUpdate = true;


    const initialColor ={
      r:0,
      g:0.19,
      b:0.4
    }
    const hoverColor ={
      r:0.1,
      g:0.5,
      b:1
    }
    
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () =>{
      intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, hoverColor.r);
      intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a, hoverColor.g);
      intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a, hoverColor.b);

      intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, hoverColor.r);
      intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b, hoverColor.g);
      intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b, hoverColor.b);
      
      intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, hoverColor.r);
      intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c, hoverColor.g);
      intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c, hoverColor.b);
      intersects[0].object.geometry.attributes.color.needsUpdate = true;
      }
    })
    
  }
  //mesh.rotation.x += .01;
  //mesh.rotation.y += .01;
  //planeMesh.rotation.x += .01;
}

animate();

addEventListener('mousemove', (event) =>{
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;


})
