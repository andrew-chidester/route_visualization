import { Group, MeshBasicMaterial } from '../../build/three.module.js';

function createPath(mesh, stations, route) {

    const stationMesh = new Group();
    stationMesh.add(mesh);

    for (let i = 0; i < 10; i++) {
        const clonedStation = mesh.clone();
        clonedStation.position.z = stations[i].x;
        clonedStation.position.x = stations[i].y;

        if (route.includes(i)) {
            clonedStation.children[0].material = new MeshBasicMaterial({ color: "red" });
            clonedStation.position.y += 0.05;
        }

        stationMesh.add(clonedStation);
    }

    return stationMesh;
}

export { createPath };