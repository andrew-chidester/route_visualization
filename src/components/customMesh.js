import { GLTFLoader } from '../../build/GLTFLoader.js';


async function loadModel(file) {

    const loader = new GLTFLoader();

    const customData = await loader.loadAsync(file)

    const customModels = customData.scene

    /*customModels.tick = (delta) => {
    }*/

    return customModels;
}

export { loadModel };