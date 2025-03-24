import * as THREE from './build/three.module.js';
import * as ORBIT from './build/OrbitControls.js';
import * as GLTF from './build/GLTFLoader.js';




//Where to place in html
const container = document.querySelector('#scene-container');


const camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {antialias:true} );
renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.physicallyCorrectLights = true;

container.append( renderer.domElement );

console.log(window.devicePixelRatio)


const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');



const sunLight = new THREE.DirectionalLight('white', 3)
sunLight.position.set(-10,20,0)

const ambientLight = new THREE.HemisphereLight('white', 'darkslategrey', .5);


const loader = new GLTF.GLTFLoader();

const loadedData = await loader.loadAsync('LowPolyTruck.glb');



console.log(loadedData);

const truck = loadedData.scene.children[0];
const road1 = loadedData.scene.children[1];
const road2 = road1.clone();
road2.position.z = road1.position.z + 159.411;



const geometry = new THREE.PlaneGeometry( 20, 500 );
const material = new THREE.MeshStandardMaterial({color: 0x333333});
console.log(material);
const ground = new THREE.Mesh( geometry, material );
ground.rotation.x = THREE.MathUtils.degToRad(-90)
ground.position.y = -1.3
ground.position.x = 7


scene.add( truck, road1, road2, sunLight, ambientLight );

camera.position.set(-11, 2, -6);
camera.rotation.set(0,THREE.MathUtils.degToRad(240),0);



/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('uv-test-bw.jpg',);

const material = new THREE.MeshStandardMaterial();
material.map = texture;

const cube = new THREE.Mesh( geometry, material );

scene.add( cube, sunLight, ambientLight );

camera.position.z = 5;

*/




function reSize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
}
window.addEventListener('resize', reSize);


/*
const controls = new ORBIT.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
*/

const clock = new THREE.Clock()

function animate() {
	const delta = clock.getDelta();
	const rps = THREE.MathUtils.degToRad(30);

	road1.position.z -= 10 * delta;
	road2.position.z -= 10 * delta;
	
	if(road1.position.z < -50)
	{
		road1.position.z = road2.position.z + 159.411;
	}
	if(road2.position.z < -50)
	{
		road2.position.z = road1.position.z + 159.411;
	}

	console.log(road1.position.z);
	console.log(road2.position.z);


	//cube.rotation.x += rps * delta;
	//cube.rotation.y += rps * delta;

	//controls.update();

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
