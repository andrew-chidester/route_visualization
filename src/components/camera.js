import { PerspectiveCamera } from '../../build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        50, // fov = Field Of View
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        1000, // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(1, 2, 10);

    return camera;
}



export { createCamera };