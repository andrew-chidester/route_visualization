import { Vector3 } from '../../build/three.module.js';

function followObject(follower, target, xOffset, yOffset, zOffset) {
    const startingPosition = target.position;

    const offsetVector = new Vector3(xOffset, yOffset, zOffset);

    follower.position.copy(startingPosition).add(offsetVector);

    //follower.rotation.x += -1;


    follower.tick = (delta) => {
        const followVector = new Vector3().copy(offsetVector)
        followVector.applyAxisAngle(new Vector3(0, 1, 0), -target.rotation.y);
        follower.position.copy(startingPosition).add(followVector);
        follower.rotation.y = -target.rotation.y;
        
    }
}

export { followObject };