import { Clock } from '../../build/three.module.js';
const clock = new Clock();
class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updateables = [];
    }
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick()
            this.renderer.render(this.scene, this.camera);
        });
    }
    stop() { }
    tick() {
        const delta = clock.getDelta();
        for (let obj of this.updateables) {
            obj.tick(delta);
        }

    }
}

export { Loop };