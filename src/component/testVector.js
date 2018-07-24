var THREE = require('three');
const XLine = new THREE.Vector3(1, 0, 0); //X轴正方向
const test = new THREE.Vector3(1, -1, 0);

if (XLine.equals(test)) {
	console.log('aaaaaaaaaaaa');
}
