import { Mesh, MeshStandardMaterial } from '../../build/three.module.js';
import { FontLoader } from '../../build/FontLoader.js';
import { TextGeometry } from '../../build/TextGeometry.js';


async function loadFont() {
    const loader = new FontLoader();
    const loadedFont = await loader.loadAsync('./fonts/helvetiker_regular.typeface.json');
    return loadedFont;
}

function createText(text, loadedFont, size, depth, materialColor) {

    const textGeometry = new TextGeometry(text, { font: loadedFont, size: size, depth: depth });

    const textMaterial = new MeshStandardMaterial({ color: materialColor });

    const textMesh = new Mesh(textGeometry, textMaterial);

    /*customModels.tick = (delta) => {
    }*/

    return textMesh;
}

function changeText(oldMesh, newText) {
    oldMesh.geometry = new TextGeometry(newText, oldMesh.geometry.parameters.options);

    return;
}

export { loadFont, createText, changeText };

