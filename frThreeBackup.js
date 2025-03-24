import * as THREE from './build/three.module.js';
import * as ORBIT from './build/OrbitControls.js';
import * as GLTF from './build/GLTFLoader.js';
import * as TEXT from './build/TextGeometry.js';
import * as FONT from './build/FontLoader.js';
import * as FR from './build/fixedRoute.js';

const loader = new FONT.FontLoader();
const loadedText = await loader.loadAsync('./fonts/helvetiker_regular.typeface.json');

const gltfloader = new GLTF.GLTFLoader();
const loadedData = await gltfloader.loadAsync('GasStation.glb');
const stationModel = loadedData.scene;
//console.log(loadedData.scene);

const scenePath = new THREE.Scene();
scenePath.background = new THREE.Color(0x999999);


let render = false;

//Where to place in html
const container = document.querySelector('#scene-container');


const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

container.append(renderer.domElement);

function reSize() {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.render(scenePath, camera);
}
window.addEventListener('resize', reSize);


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x999999);





const sunLight = new THREE.DirectionalLight('white', 3)
sunLight.position.set(5, 0, 50)


scene.add(sunLight);


const sliderMat = new THREE.MeshStandardMaterial();
sliderMat.color.set(0xFFFFFF)
const sliderGeo = new THREE.BoxGeometry(2, 4, 2);
const slider1 = new THREE.Mesh(sliderGeo, sliderMat);
slider1.position.set(-15, -5, 0);

const slider2 = new THREE.Mesh(sliderGeo, sliderMat);
slider2.position.set(0, -5, 0);

const slider3 = new THREE.Mesh(sliderGeo, sliderMat);
slider3.position.set(15, -5, 0);

scene.add(slider1, slider2, slider3);


const barMat = new THREE.MeshStandardMaterial();
barMat.color.set(0xEEEEEE)
const barGeo = new THREE.CylinderGeometry(.25, .25, 25);
const bar1 = new THREE.Mesh(barGeo, barMat);
bar1.position.set(-15, 0, 0);

const bar2 = new THREE.Mesh(barGeo, barMat);
bar2.position.set(0, 0, 0);

const bar3 = new THREE.Mesh(barGeo, barMat);
bar3.position.set(15, 0, 0);

scene.add(bar1, bar2, bar3);

const textMat = new THREE.MeshStandardMaterial();
textMat.color.set(0x000000)
let text1 = new TEXT.TextGeometry('Stations: 5', {
	font: loadedText,
	size: .75,
	depth: .1,
});
let textMesh1 = new THREE.Mesh(text1, textMat);
textMesh1.position.set(-17, 18, 0);

let text2 = new TEXT.TextGeometry('Capacity: 5', {
	font: loadedText,
	size: .75,
	depth: .1,
});
let textMesh2 = new THREE.Mesh(text2, textMat);
textMesh2.position.set(-2, 18, 0);

let text3 = new TEXT.TextGeometry('Average Cost: $2.50', {
	font: loadedText,
	size: .75,
	depth: .1,
});
let textMesh3 = new THREE.Mesh(text3, textMat);
textMesh3.position.set(12, 18, 0);


scene.add(textMesh1, textMesh2, textMesh3);


const buttonMat = new THREE.MeshStandardMaterial();
buttonMat.color.set(0xFFFFFF)
const buttonGeo = new THREE.BoxGeometry(12, 4, .1);
const button = new THREE.Mesh(buttonGeo, buttonMat);
button.position.set(0, -18, 0);

const btextMat = new THREE.MeshStandardMaterial();
btextMat.color.set(0x000000)
const btext = new TEXT.TextGeometry('Calculate Path', {
	font: loadedText,
	size: 1,
	depth: .1,
});
const buttonText = new THREE.Mesh(btext, btextMat);
buttonText.position.set(-4.5, -18.5, 0);

scene.add(button, buttonText);




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


let movement = 0.0;

window.addEventListener('mousemove', (event) => {
	// Convert mouse position to normalized device coordinates (-1 to +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

});

let id;
let selectedObject;
let buttonPressed = false;

window.addEventListener('mousedown', (event) => {

	id = setInterval(() => {
		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children);

		// Do something with the intersections
		if (intersects.length > 0) {
			//console.log(intersects[0]);

			movement = intersects[0].object.position.y - intersects[0].point.y;


			selectedObject = intersects[0].object;

			if ((selectedObject == button || selectedObject == buttonText) && !buttonPressed) {
				buttonPressed = true;
				renderPath();
				//renderer.setAnimationLoop(null);
				renderer.setAnimationLoop(moveTruck);

			}

			//console.log(selectedObject);
			//console.log(movement);
		}
	}, 1);
});
window.addEventListener('mouseup', (event) => {
	clearInterval(id);
	buttonPressed = false;

});

let stations = 5;
let capacity = 5.0;
let fuelCost = 2.5;

function UpdateBars() {

	//console.log("renderering");

	let interp = THREE.MathUtils.lerp(0, 0 - movement, 0.6);
	if (selectedObject != undefined && (selectedObject == slider1 || selectedObject == slider2 || selectedObject == slider3)) {
		selectedObject.position.y += interp;
		if (selectedObject.position.y < -10) selectedObject.position.y = -10;
		if (selectedObject.position.y > 10) selectedObject.position.y = 10;


		if (selectedObject == slider1) {
			textMesh1.geometry.dispose();
			stations = Math.floor((selectedObject.position.y + 10));
			textMesh1.geometry = new TEXT.TextGeometry('Stations: ' + stations, { font: loadedText, size: .75, depth: .1, });
		}

		if (selectedObject == slider2) {
			textMesh2.geometry.dispose();
			capacity = ((selectedObject.position.y + 10)).toFixed(2);
			textMesh2.geometry = new TEXT.TextGeometry('Capacity: ' + capacity, { font: loadedText, size: .75, depth: .1, });
		}

		if (selectedObject == slider3) {
			textMesh3.geometry.dispose();
			fuelCost = ((selectedObject.position.y + 10) / 2).toFixed(2);
			textMesh3.geometry = new TEXT.TextGeometry('Average Cost: $' + fuelCost, { font: loadedText, size: .75, depth: .1, });
		}
	}
	movement += interp;

	renderer.render(scene, camera);
	movement = 0.0;
}
renderer.setAnimationLoop(UpdateBars);


const truckGeometry = new THREE.BoxGeometry(.5, .25, 1);
const truckMaterial = new THREE.MeshStandardMaterial();
const truckMesh = new THREE.Mesh(truckGeometry, truckMaterial);
scenePath.add(truckMesh);
truckMesh.position.set(-4, 0.25, 16.75);

const fuelGeo = new THREE.BoxGeometry(1, 8, 1);
const fuelMat = new THREE.MeshStandardMaterial();
fuelMat.color.set(0xFF0000);
const fuelMesh = new THREE.Mesh(fuelGeo, fuelMat);
scenePath.add(fuelMesh);

const vertices = fuelGeo.attributes.position.array;

for (let i = 0; i < vertices.length; i += 3) {
	//vertices[i] += x;     // x-coordinate
	vertices[i + 1] += 4; // y-coordinate
	//vertices[i + 2] += z; // z-coordinate
}
fuelGeo.attributes.position.needsUpdate = true;


fuelMesh.position.set(-15, -5, 12);
fuelMesh.rotation.x = THREE.MathUtils.degToRad(-10);


const textFMat = new THREE.MeshStandardMaterial();
textFMat.color.set(0x000000)
let fuelText = new TEXT.TextGeometry('Fuel', {
	font: loadedText,
	size: .75,
	depth: .1,
});
let fuelTextMesh = new THREE.Mesh(fuelText, textFMat);
fuelTextMesh.position.set(-16, -6.5, 12);
fuelTextMesh.rotation.x = THREE.MathUtils.degToRad(-10);
scenePath.add(fuelTextMesh);

const textCMat = new THREE.MeshStandardMaterial();
textCMat.color.set(0x000000)
let costText = new TEXT.TextGeometry('Cost: $0.00', {
	font: loadedText,
	size: .75,
	depth: .1,
});
let costTextMesh = new THREE.Mesh(costText, textCMat);
costTextMesh.position.set(-17.5, -8, 12);
costTextMesh.rotation.x = THREE.MathUtils.degToRad(-10);
scenePath.add(costTextMesh);




let forward = true;
let waitTime = 0;
let filled = false;

let pathReady = false;

let optimalPath;

let currentFuel;
let distances;
let missingFuel;
let fillTime;
let currentCost = 0.0;
let stationCost = 0.0;
let fuelprices;
let lastFilled = 0;
function moveTruck() {

	if (pathReady) {
		let roadNumber = Math.floor(-(truckMesh.position.z - 33.5) / 33.5) + 1;
		let stationNumber = Math.floor(-(truckMesh.position.z - 16.5) / 33.5) + 1;

		//console.log(distances[roadNumber-1]);

		if (forward) {
			truckMesh.position.z -= 0.5;
			camera.position.z -= 0.5;
			fuelMesh.position.z -= 0.5;
			fuelTextMesh.position.z -= 0.5;
			costTextMesh.position.z -= 0.5;
			currentFuel -= (distances[roadNumber - 1] / 67);

		}
		else {
			waitTime += 1;
			currentFuel += missingFuel / fillTime;
			currentCost += stationCost / fillTime;
			if (waitTime >= fillTime) {
				waitTime = 0;
				forward = true;
				if (stationNumber == stations - 1) {
					renderer.setAnimationLoop(null);
				}
			}
		}
		//console.log(currentFuel);
		fuelMesh.scale.y = currentFuel / capacity;
		costTextMesh.geometry = new TEXT.TextGeometry('Cost: $' + currentCost.toFixed(2), { font: loadedText, size: .75, depth: .1 });



		let roadPosition = -(truckMesh.position.z - 16.5) % 33.5;
		//console.log(stationNumber);
		//console.log(roadPosition);

		if (optimalPath[0].includes(stationNumber)) {
			if (roadPosition > 3 && roadPosition <= 6) {

				truckMesh.rotation.y += THREE.MathUtils.degToRad(-2);
			}
			if (roadPosition > 9 && roadPosition <= 12) {

				truckMesh.rotation.y += THREE.MathUtils.degToRad(2);
			}

			if (roadPosition > 18.5 && roadPosition <= 21.5) {

				truckMesh.rotation.y += THREE.MathUtils.degToRad(2);
			}
			if (roadPosition > 24.5 && roadPosition <= 27.5) {

				truckMesh.rotation.y += THREE.MathUtils.degToRad(-2);
			}



			if (roadPosition >= 5 && roadPosition <= 11) {
				truckMesh.position.x = -4 + (roadPosition - 5) * 0.583;
				filled = false;
			}
			if (roadPosition >= 20.5 && roadPosition <= 26.5) {
				truckMesh.position.x = -0.5 - (roadPosition - 20.5) * 0.583;
			}
			if (roadPosition >= 16.25 && roadPosition < 16.75 && !filled) {
				forward = false;
				filled = true;

				missingFuel = (capacity - currentFuel);
				fillTime = Math.floor(missingFuel * 100 / capacity);

				//currentCost += missingFuel * fuelprices[stationNumber];
				stationCost = 0.0;
				for (let i = lastFilled; i < stationNumber; i++) {
					stationCost += distances[i] * fuelprices[stationNumber];
				}

				lastFilled = stationNumber;
			}
		}

		renderer.render(scenePath, camera);
	}
}

function renderPath() {

	fuelprices = FR.generate_random_array(stations, fuelCost - 1, fuelCost + 1);

	//console.log(fuelprices);

	distances = FR.generate_random_array(stations - 1, 1, 5);

	//console.log(distances);

	let totalDistance = 0;
	for (let i = 0; i < stations - 1; i++) {
		totalDistance += distances[i];
	}
	//console.log(totalDistance);

	let squeeze = 1;
	if (totalDistance > 40) {
		squeeze = 40 / totalDistance;
	}

	//console.log(distances);

	optimalPath = FR.DP_Refueling_FT(stations, capacity, fuelprices, distances);

	console.log(optimalPath);

	const greedyPath = FR.GreedyRefueling(stations, capacity, fuelprices, distances);

	currentFuel = capacity;

	camera.position.set(-4, 3, 30);


	//camera.rotation.y = THREE.MathUtils.degToRad(-20);
	camera.rotation.x = THREE.MathUtils.degToRad(-10);
	//camera.rotation.set(THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(0))


	const stationLocs = new THREE.Group();
	const distText = new THREE.Group();

	let dist = -totalDistance * squeeze;



	const ambientLight = new THREE.HemisphereLight('white', 'darkslategrey', .5);


	for (let i = 0; i < stations - 1; i++) {
		let newStation = stationModel.clone();
		newStation.position.z = i * -33.5;
		scenePath.add(newStation);
	}

	scenePath.add(sunLight, ambientLight);

	console.log('ready');

	pathReady = true;

}