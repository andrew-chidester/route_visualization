import { Group } from '../../build/three.module.js';

function createPath(mesh, stations) {

    const stationMesh = new Group();
    stationMesh.add(mesh);

    for (let i = 0; i < 10; i++) {
        const clonedStation = mesh.clone();
        clonedStation.position.z = stations[i].x;
        clonedStation.position.x = stations[i].y;
        stationMesh.add(clonedStation);
    }

    return stationMesh;
}

export { createPath };