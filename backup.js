import * as THREE from './build/three.module.js';
import * as ORBIT from './build/OrbitControls.js';
import * as GLTF from './build/GLTFLoader.js';
import * as TEXT from './build/TextGeometry.js';
import * as FONT from './build/FontLoader.js';

import * as FR from './build/fixedRoute.js';

const loader = new FONT.FontLoader();
loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {

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


	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x999999);
	const scenePath = new THREE.Scene();
	scenePath.background = new THREE.Color(0x999999);
	



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
		font: font,
		size: .75,
		depth: .1,
	});
	let textMesh1 = new THREE.Mesh(text1, textMat);
	textMesh1.position.set(-17, 18, 0);

	let text2 = new TEXT.TextGeometry('Capacity: 5', {
		font: font,
		size: .75,
		depth: .1,
	});
	let textMesh2 = new THREE.Mesh(text2, textMat);
	textMesh2.position.set(-2, 18, 0);

	let text3 = new TEXT.TextGeometry('Average Cost: $2.50', {
		font: font,
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
		font: font,
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


			// Calculate objects intersecting the ray
			const intersects = raycaster.intersectObjects(scene.children);

			// Do something with the intersections
			if (intersects.length > 0) {
				//console.log(intersects[0]); // Logs the intersection point

				movement = intersects[0].object.position.y - intersects[0].point.y;

				
				selectedObject = intersects[0].object;

				if ((selectedObject == button || selectedObject == buttonText) && !buttonPressed) {
					buttonPressed = true;
					renderPath();
					renderer.setAnimationLoop(null);
				}

				console.log(selectedObject);
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

	function animate() {

		//console.log("renderering");

		let interp = THREE.MathUtils.lerp(0, 0 - movement, 0.6);
		if (selectedObject != undefined && (selectedObject == slider1 || selectedObject == slider2 || selectedObject == slider3)) {
			selectedObject.position.y += interp;
			if (selectedObject.position.y < -10) selectedObject.position.y = -10;
			if (selectedObject.position.y > 10) selectedObject.position.y = 10;


			if (selectedObject == slider1) {
				textMesh1.geometry.dispose();
				stations = Math.floor((selectedObject.position.y + 10));
				textMesh1.geometry = new TEXT.TextGeometry('Stations: ' + stations, { font: font, size: .75, depth: .1, });
			}

			if (selectedObject == slider2) {
				textMesh2.geometry.dispose();
				capacity = ((selectedObject.position.y + 10)).toFixed(2);
				textMesh2.geometry = new TEXT.TextGeometry('Capacity: ' + capacity, { font: font, size: .75, depth: .1, });
			}

			if (selectedObject == slider3) {
				textMesh3.geometry.dispose();
				fuelCost = ((selectedObject.position.y + 10) / 2).toFixed(2);
				textMesh3.geometry = new TEXT.TextGeometry('Average Cost: $' + fuelCost, { font: font, size: .75, depth: .1, });
			}
		}
		movement += interp;

		renderer.render(scene, camera);
		movement = 0.0;
	}
	renderer.setAnimationLoop(animate);




	function renderPath() {

		const fuelprices = FR.generate_random_array(stations, fuelCost - 1, fuelCost + 1);

		//console.log(fuelprices);

		const distances = FR.generate_random_array(stations - 1, 1.5, 5);

		let totalDistance = 0;
		for (let i = 0; i < stations - 1; i++) {
			totalDistance += distances[i];
		}
		console.log(totalDistance);

		let squeeze = 1;
		if (totalDistance > 40) {
			squeeze = 40 / totalDistance;
		}

		//console.log(distances);

		const optimalPath = FR.DP_Refueling_FT(stations, capacity, fuelprices, distances);

		//console.log(optimalPath[0]);

		const greedyPath = FR.GreedyRefueling(stations, capacity, fuelprices, distances);

		console.log(greedyPath);







		//camera.position.set(-11, 2, -6);
		//camera.rotation.set(0,THREE.MathUtils.degToRad(240),0);


		const stationLocs = new THREE.Group();
		const distText = new THREE.Group();




		

		let dist = -totalDistance * squeeze;


		for (let i = 0; i < stations; i++) {
			const materialTop = new THREE.MeshStandardMaterial();
			const materialBottom = new THREE.MeshStandardMaterial();


			//const geometry = new THREE.PlaneGeometry( 1, 1 );
			//const geometry = new THREE.BoxGeometry( 1, 1, 1 );


			const text = new TEXT.TextGeometry('$' + String(fuelprices[i].toFixed(2)), {
				font: font,
				size: .75,
				depth: 0,
			});

			const textMesh = new THREE.Mesh(text, materialTop);
			textMesh.position.set(dist - 1.5, 9.5, 0);

			const textMesh2 = new THREE.Mesh(text, materialBottom);
			textMesh2.position.set(dist - 1.5, -10, 0);



			const geometry = new THREE.PlaneGeometry(1, 1);
			const mesh = new THREE.Mesh(geometry, materialTop);
			mesh.position.set(dist, 7, 0);
			const mesh2 = new THREE.Mesh(geometry, materialBottom);
			mesh2.position.set(dist, -7, 0);

			if (i < stations - 1) {
				dist += (distances[i] * 2) * squeeze;
			}

			stationLocs.add(textMesh, mesh, textMesh2, mesh2);
		}

		dist = (-totalDistance + distances[0] - .5) * squeeze;
		for (let i = 0; i < stations - 1; i++) {
			const material = new THREE.MeshStandardMaterial();
			material.color.set(0xFFFF00)
			const text = new TEXT.TextGeometry(String(distances[i].toFixed(2)), {
				font: font,
				size: .75,
				depth: 0,
			});

			const textMesh = new THREE.Mesh(text, material);
			textMesh.position.set(dist, 0, 0);
			if (i < stations - 2) {
				dist += (distances[i] + distances[i + 1]) * squeeze;
			}

			distText.add(textMesh);
		}

		for (let i = 0; i < optimalPath[0].length; i++) {
			console.log(optimalPath[0][i]);
			//console.log(stationLocs.children[optimalPath[0][i]])
			stationLocs.children[optimalPath[0][i] * 4].material.color.set(0xFF0000);
		}

		const textMat = new THREE.MeshStandardMaterial();
		textMat.color.set(0xFFFFFF)

		const optimalTextGeo = new TEXT.TextGeometry('Optimal path cost: $' + String(optimalPath[1].toFixed(2)), {
			font: font,
			size: 2,
			depth: 0,
		});
		const optimalText = new THREE.Mesh(optimalTextGeo, textMat);
		optimalText.position.set(-18, 15, 0);



		for (let i = 0; i < greedyPath[0].length; i++) {
			stationLocs.children[greedyPath[0][i] * 4 + 2].material.color.set(0x0000FF);
		}

		const greedyTextGeo = new TEXT.TextGeometry('Greedy path cost: $' + String(greedyPath[1].toFixed(2)), {
			font: font,
			size: 2,
			depth: 0,
		});
		const greedyText = new THREE.Mesh(greedyTextGeo, textMat);
		greedyText.position.set(-18, -16, 0);



		const roadMat = new THREE.MeshStandardMaterial();
		roadMat.color.set(0x222222);
		const roadGeo = new THREE.PlaneGeometry(100, 10);
		const road = new THREE.Mesh(roadGeo, roadMat);
		road.position.set(0, .25, -1);

		const sideMat = new THREE.MeshStandardMaterial();
		sideMat.color.set(0xAAAAAA);
		const sideGeo = new THREE.PlaneGeometry(150, 25);
		const sidewalk = new THREE.Mesh(sideGeo, sideMat);
		sidewalk.position.set(0, .25, -2);



		scenePath.add(stationLocs, distText, optimalText, greedyText, road, sidewalk, sunLight);


		function reSize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.render(scenePath, camera);
		}
		window.addEventListener('resize', reSize);


		renderer.render(scenePath, camera);


	}
});