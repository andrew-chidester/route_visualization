import { Group } from '../../build/three.module.js';

function createPath(mesh) {

    const stations = new Group();
    stations.add(mesh);

    for (let i = 0; i < 10; i++) {
        const clonedStation = mesh.clone();
        clonedStation.position.z = i * -33.5;
        stations.add(clonedStation);
    }

    return stations;
}

export { createPath };