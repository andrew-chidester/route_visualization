import { Quaternion, Vector3 } from '../../build/three.module.js';


function followPath(mesh, path) {

    let distanceTraveled = 0.0;

    mesh.tick = (delta) => {
        if (distanceTraveled < 1.0) {
            const midpoint = path.getPoint(distanceTraveled);
            const tangent = path.getTangent(distanceTraveled).normalize();


            const forward = new Vector3(0, 0, 1);
            const rotationAxis = new Vector3().crossVectors(forward, tangent).normalize();

            const radians = Math.acos(forward.dot(tangent));
            const quat = new Quaternion().setFromAxisAngle(rotationAxis, radians);


            mesh.position.copy(midpoint);
            mesh.quaternion.copy(quat);
            //mesh.lookAt(tangent);
            distanceTraveled += 0.0025;
        }
    }

    return;
}

export { followPath };