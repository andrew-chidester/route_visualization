import { DirectionalLight, HemisphereLight } from '../../build/three.module.js';

function createLights() {
    const sunLight = new DirectionalLight('white', 3);
    sunLight.position.set(5, 0, 50);

    const ambientLight = new HemisphereLight('white', 'darkslategrey', .5);

    return { sunLight, ambientLight };
}

export { createLights };