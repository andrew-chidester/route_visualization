import { WebGLRenderer } from '../../build/three.module.js';

function createRenderer() {
    const renderer = new WebGLRenderer({antialias: true});

    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };