import * as THREE from "three";
// 27个块
function create27Meshes(coefficient) {
    let res = [];
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                // console.log([x, y, z]);
                let geometry, material, mesh;
                geometry = new THREE.BoxGeometry(coefficient, coefficient, coefficient);
                material = new THREE.MeshNormalMaterial({
                    vertexColors: THREE.FaceColors
                    // Shading: THREE.SmoothShading,
                    // Colors: THREE.VertexColors
                });

                mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = x * coefficient;
                mesh.position.y = y * coefficient;
                mesh.position.z = z * coefficient;
                res.push(mesh);
            }
        }
    }
    return res;
}
module.exports.create27Meshes = create27Meshes;