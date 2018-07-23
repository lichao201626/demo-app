import * as THREE from "three";
// 27个块
function create27Meshes(coefficient) {
    let res = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 9; j++) {
            let cube = createSamllCubes();
            cube.position.x = (-6 + 4 / 2) + (j % 3) * 4;
            cube.position.y = (6 - 4 / 2) - parseInt(j / 3) * 4;
            cube.position.z = (6 - 4 / 2) - i * 4;
            res.push(cube)
        }
    }

    return res;
}

//生成一个小立方体
function createSamllCubes() {
    //三阶魔方有8个角色块，12个棱色块，6个中心块，红橙相对，蓝绿相对，黄白相对，
    var colors = ['#0000CC', '#006600',
        '#FFFF33', '#FFFFFF',
        '#FF0000', '#FF6600'];
    var materials = [];
    var sixFaces = [];
    var geometry = new THREE.BoxGeometry(4, 4, 4);
    for (var i = 0; i < 6; i++) {
        sixFaces.push(faces(colors[i]));
    }
    for (var i = 0; i < 6; i++) {
        var texture = new THREE.Texture(sixFaces[i]);
        texture.needsUpdate = true;
        materials.push(new THREE.MeshBasicMaterial({
            map: texture
        }));
    }
    var cubeMaterials = new THREE.MeshFaceMaterial(materials);
    var samllCube = new THREE.Mesh(geometry, materials);
    //scene.add(samllCube);
    return samllCube;
}
//生成画布
function faces(faceColor) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillRect(0, 0, 256, 256);
    context.rect(16, 16, 224, 224);
    context.lineJoin = 'round';
    context.lineWidth = 16;
    context.fillStyle = faceColor;
    context.strokeStyle = faceColor;
    context.stroke();
    context.fill();
    return canvas;
}
module.exports.create27Meshes = create27Meshes;