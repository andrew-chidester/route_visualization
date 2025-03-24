import { BoxGeometry, Mesh, MeshStandardMaterial, MathUtils } from '../../build/three.module.js';


function createCube(MaterialColor, height=2, width=2, length=2) {
    // create a geometry
    const geometry = new BoxGeometry(height, width, length);

    // create a default (white) Basic material
    const material = new MeshStandardMaterial({ color: MaterialColor });

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);
    

    /*cube.tick = (delta) => {
    }*/

    return cube;
}

export { createCube };