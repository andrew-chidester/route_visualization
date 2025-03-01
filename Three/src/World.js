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


let camera;
let renderer;
let scene;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        const cube = createCube("white", .5, .25, 1);
        cube.position.set(-4, 0.25, 16.75);

        const { mesh: road, curve: path } = createRoad(30, { sx: -4, sy: 0, sz: 15 }, { ex: -24, ey: 0, ez: 0 });

        followPath(cube, path);
        loop.updateables.push(cube);

        //followObject(camera, cube, 0, 50, 10);
        followObject(camera, cube, 0, 2, 15);
        loop.updateables.push(camera);

        
        const { sunLight, ambientLight } = createLights();

        scene.add(cube, road, sunLight, ambientLight);

        const resizer = new Resizer(container, camera, renderer);

        //This is used if renderering without an animation (also change in Resizer.js if changing)
        //When using an animation, this is just automatically done the frame after resizing

        /*resizer.onResize = () => {
            this.render();
        }*/

    }
    async init() {
        const stationModel = await loadModel('GasStation.glb');
        const stations = createPath(stationModel);

        const font = await loadFont();

        const text = createText('Cost: ', font, .75, .1, 'white');

        followObject(text, scene.children[0], -10, -2, 0);
        loop.updateables.push(text);

        scene.add(stations, text);
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