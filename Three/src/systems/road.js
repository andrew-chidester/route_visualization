import { CatmullRomCurve3, CubicBezierCurve3, BufferGeometry, MeshStandardMaterial, LineBasicMaterial, Line, Vector3, Group, Mesh, BufferAttribute, DoubleSide } from '../../build/three.module.js';


function createRoad(detail, { sx, sy, sz }, {ex, ey, ez }) {
    // create a geometry

    const startPoint = new Vector3(sx, sy, sz);
    const endPoint = new Vector3(ex, ey, ez);

    const controlPoint1 = new Vector3(startPoint.x, startPoint.y, (startPoint.z + endPoint.z) / 2);
    const controlPoint2 = new Vector3(endPoint.x, endPoint.y, (startPoint.z + endPoint.z) / 2);

    // Create a curve from the points
    //const curve = new CubicBezierCurve3(p1, p2, p3, p4);
    const curve = new CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

    const up = new Vector3(0, 1, 0);

    const vertices = new Float32Array(6 * (detail + 1));
    const indices = [];
    //const indices = [0,1,2,2,3,1];
    for (let i = 0.0; i <= detail; i += 1) {
        console.log(i);
        const midpoint = curve.getPoint(i / detail);
        
        const tangent = curve.getTangent(i / detail);
        const normal = new Vector3().crossVectors(tangent, up).normalize();

        const point1 = midpoint.clone().add(normal);
        console.log(point1);
        
        const point2 = midpoint.clone().sub(normal);
        console.log(point2);
        
        vertices[i * 6] = point1.x;
        vertices[i * 6 + 1] = point1.y;
        vertices[i * 6 + 2] = point1.z;

        vertices[i * 6 + 3] = point2.x;
        vertices[i * 6 + 4] = point2.y;
        vertices[i * 6 + 5] = point2.z;

        if (i < detail) {
            indices.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 2, i * 2 + 3, i * 2 + 1);
        }

        

        console.log(vertices);

    }

    // Generate the geometry from the curve
    //const geometry = new BufferGeometry().setFromPoints(curve.getPoints(50));
    const geometry = new BufferGeometry()
    geometry.setIndex(indices);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    console.log(geometry);

    // Create a material
    //const material = new LineBasicMaterial({ color: 0xff0000 });
    const material = new MeshStandardMaterial({ color: "red", side: DoubleSide});

    // Create the line object
    const line = new Line(geometry, material);


    const mesh = new Mesh(geometry, material)
    /*cube.tick = (delta) => {
    }*/

    console.log(curve);
    return { mesh, curve };
;
}

export { createRoad };



// Define points for the curve
