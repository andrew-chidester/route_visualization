import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';
import { loadModel } from './components/customMesh.js'
import { loadFont, createText, changeText } from './components/customText.js'
import { createPath } from './components/stations.js'

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js'
import { followPath } from './systems/vehicle.js'
import { followObject } from './systems/follow.js'
import { createRoad } from './systems/road.js'
import { createNetwork } from './systems/network.js'

import { Group, MeshBasicMaterial, DoubleSide } from '../build/three.module.js';

import { generate_random_array, OpenRoute } from '../build/openRoute.js';



let camera;
let renderer;
let scene;
let loop;

const { stations, edges } = createNetwork();
console.log(stations[0].x);

const FindRoute = OpenRoute(stations, edges, 10, 200, generate_random_array(10, 3, 5));
const stops = FindRoute.getRefuelingStations(0, 9);
const route = FindRoute.getFullPath(0, 9);
console.log(stops);
console.log(route);

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        
        const cube = createCube("white", .5, .25, 1);
        cube.position.set(-4, 0.25, 16.75);


        

        const roads = new Group();

        const paths = []

        for (const [station, edge] of Object.entries(edges)) {
            //console.log(station);
            //console.log(edge);

            for (const e of edge) {
                //console.log(e);
                const sx = stations[station].y;
                const sz = stations[station].x;
                const ex = stations[e].y;
                const ez = stations[e].x;

                
                const { mesh: road, curve: path } = createRoad(30, { sx: sx, sy: 0, sz: sz }, { ex: ex, ey: 0, ez: ez });
                //console.log([+station, e]);

                roads.add(road);
            }
        }

        for (const e of route) {
            const sx = stations[e[0]].y;
            const sz = stations[e[0]].x;
            const ex = stations[e[1]].y;
            const ez = stations[e[1]].x;
            const { mesh: road, curve: path } = createRoad(30, { sx: sx, sy: 0, sz: sz }, { ex: ex, ey: 0, ez: ez });
            road.material = new MeshBasicMaterial({ color: "red", side: DoubleSide });
            road.position.y += 0.05
            paths.push(path);

            roads.add(road);
        }
        

        followPath(cube, paths);
        loop.updateables.push(cube);

        followObject(camera, cube, 0, 150, 50);
        //followObject(camera, cube, 0, 2, 15);
        //loop.updateables.push(camera);

        
        const { sunLight, ambientLight } = createLights();

        scene.add(cube, roads, sunLight, ambientLight);

        const resizer = new Resizer(container, camera, renderer);

        //This is used if renderering without an animation (also change in Resizer.js if changing)
        //When using an animation, this is just automatically done the frame after resizing

        /*resizer.onResize = () => {
            this.render();
        }*/

    }
    async init() {

        const stationModel = await loadModel('circle.glb');

        const stationMeshes = createPath(stationModel, stations, stops);

        console.log(stationMeshes);

        const font = await loadFont();

        //const text = createText('Cost: ', font, .75, .1, 'white');

        //followObject(text, scene.children[0], -10, -2, 0);
        //loop.updateables.push(text);
        //scene.add(text);

        scene.add(stationMeshes);
    }
    render() {
        renderer.render(scene, camera);
    }
    start() {
        loop.start();
    }
    stop() {
        loop.stop();
    }
}

export { World };