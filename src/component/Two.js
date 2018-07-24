import React, { Component } from 'react';
// import logo from "../../public/img/logo.svg";
import '../App.scss';
import * as THREE from 'three';
const OrbitControls = require('three-orbitcontrols');
const TrackballControls = require('three-trackballcontrols');

import Box from 'grommet/components/Box';
let meshes = require('./meshes');

// document.body.appendChild(renderer.domElement);
let camera, controls, scene, renderer;
let geometry, material, mesh;
var raycaster, mouse;

let width, height;
var intersects, intersect;
let downIntersect, upIntersect;

let clickVector, clickFace;
var raycaster = new THREE.Raycaster(); //光线碰撞检测器
var mouse = new THREE.Vector2(); //存储鼠标坐标或者触摸坐标
var isRotating = false; //魔方是否正在转动
var intersect; //碰撞光线穿过的元素
var normalize; //触发平面法向量
var startPoint; //触发点
var movePoint;
var beginStatus = [];
var trackballControls; //视角控制器
//魔方转动的六个方向
const XLine = new THREE.Vector3(1, 0, 0); //X轴正方向
const XLineAd = new THREE.Vector3(-1, 0, 0); //X轴负方向
const YLine = new THREE.Vector3(0, 1, 0); //Y轴正方向
const YLineAd = new THREE.Vector3(0, -1, 0); //Y轴负方向
const ZLine = new THREE.Vector3(0, 0, 1); //Z轴正方向
const ZLineAd = new THREE.Vector3(0, 0, -1); //Z轴负方向
var minCubeIndex;

var transitions = {
	x: { y: 'z', z: 'y' },
	y: { x: 'z', z: 'x' },
	z: { x: 'y', y: 'x' }
};

let meshesArray;
let mesh2;
class Two extends Component {
	constructor(props) {
		super(props);

		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.animate = this.animate.bind(this);
		this.init = this.init.bind(this);
		this.getIntersects = this.getIntersects.bind(this);

		this.onMouseOut = this.onMouseOut.bind(this);
		this.startCube = this.startCube.bind(this);
		this.moveCube = this.moveCube.bind(this);
		this.stopCube = this.stopCube.bind(this);
		this.min = this.min.bind(this);
		this.getDirection = this.getDirection.bind(this);
		this.getBoxs = this.getBoxs.bind(this);
		this.rotateAnimation = this.rotateAnimation.bind(this);
		this.updateCubeIndex = this.updateCubeIndex.bind(this);
		this.rotateAroundWorldX = this.rotateAroundWorldX.bind(this);
		this.rotateAroundWorldY = this.rotateAroundWorldY.bind(this);
		this.rotateAroundWorldZ = this.rotateAroundWorldZ.bind(this);
	}

	componentDidMount() {
		console.log(window);

		/*     this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.material = material; */
		// this.cube = meshesArray;

		// this.mount.appendChild(this.renderer.domElement);
		// this.renderer.render(this.scene, this.camera);
		// this.start();
		this.init();
		this.animate();
		document.addEventListener(
			'mousedown',
			(e) => {
				this.startCube(e);
			},
			false
		); /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/
		document.addEventListener(
			'mouseup',
			(e) => {
				this.moveCube(e);
			},
			false
		); /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/ /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/
		/* 		document.addEventListener(
			'mouseup',
			(e) => {
				this.stopCube(e);
			},
			false
		); */
	}

	componentWillUnmount() {
		this.stop();
		this.mount.removeChild(this.renderer.domElement);
	}

	init() {
		width = window.innerWidth;
		height = window.innerHeight;

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		console.log(camera);

		camera.position.x = 10;
		camera.position.y = 10;
		camera.position.z = 30;
		// camera.position.set(10, 10, 30);
		camera.lookAt(scene.position);
		// camera.lookAt(scene.position);
		//console.log('cccc', controls);

		scene = new THREE.Scene();
		var light = new THREE.PointLight(0x8844ff, 5, 100);
		scene.add(light);

		meshesArray = meshes.create27Meshes(0.1);
		console.log(meshesArray);
		/* 		meshesArray.forEach((element) => {
					var box = new THREE.BoxHelper(element);
					// scene.add(edges);
					scene.add(element);
					scene.add(box);
					// scene.add(edges);
				}); */
		let ids = [];
		for (var i = 0; i < meshesArray.length; i++) {
			var item = meshesArray[i];
			beginStatus.push({
				x: item.position.x,
				y: item.position.y,
				z: item.position.z,
				cubeIndex: item.id
			});
			item.cubeIndex = item.id;
			ids.push(item.id);
			scene.add(meshesArray[i]);
		}
		minCubeIndex = this.min(ids).value;
		var cubegeo = new THREE.BoxGeometry(12, 12, 12);
		var hex = 0x000000;
		for (var i = 0; i < cubegeo.faces.length; i += 2) {
			cubegeo.faces[i].color.setHex(hex);
			cubegeo.faces[i + 1].color.setHex(hex);
		}
		var cubemat = new THREE.MeshBasicMaterial({
			vertexColors: THREE.FaceColors,
			opacity: 0,
			transparent: true
		});
		var cube = new THREE.Mesh(cubegeo, cubemat);
		cube.cubeType = 'coverCube';
		scene.add(cube);

		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		// renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor('#a3bdc0');
		document.body.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.update();
		trackballControls = new TrackballControls(camera);
		trackballControls.rotateSpeed = 1;
		trackballControls.panSpeed = 0;
		var clock = new THREE.Clock();
		var delta = clock.getDelta();
		trackballControls.update(delta);

		console.log('renderer domelement', renderer.domElement);
		console.log('scene', scene);
	}

	renderscence() {
		var delta = clock.getDelta();
		trackballControls.update(delta);
		renderer.clear();
		renderer.render(scene, camera);
		requestAnimationFrame(renderscence);
	}

	startCube(event) {
		// console.log(event);
		intersect = null;
		startPoint = null;
		this.getIntersects(event);
		if (intersect) {
			controls.enableRotate = false;
		}
		if (!isRotating && intersect) {
			startPoint = intersect.point;
			trackballControls.enabled = false;
		} else {
			trackballControls.enabled = true;
		}
	}

	stopCube() {
		intersect = null;
		startPoint = null;
		controls.enableRotate = true;
	}

	moveCube(event) {
		// is angle is too small
		this.getIntersects(event);
		if (intersect) {
			controls.enableRotate = false;
			if (!isRotating && startPoint) {
				movePoint = intersect.point;
				if (!movePoint.equals(startPoint)) {
					isRotating = true;
					var sub = movePoint.sub(startPoint);
					var direction = this.getDirection(sub);
					var elements = this.getBoxs(intersect, direction);
					var startTime = new Date().getTime();
					var that = this;
					requestAnimationFrame(function(timestamp) {
						that.rotateAnimation(elements, direction, timestamp, 0, 0);
						that.stopCube();
					});
				}
			}
		}
		event.preventDefault();
	}

	rotateAnimation(elements, direction, currentstamp, startstamp, laststamp) {
		var totalTime = 500;
		if (startstamp === 0) {
			startstamp = currentstamp;
			laststamp = currentstamp;
		}
		if (currentstamp - startstamp >= totalTime) {
			currentstamp = startstamp + totalTime;
			isRotating = false;
			startPoint = null;
			this.updateCubeIndex(elements);
		}
		switch (direction) {
			//绕z轴顺时针
			case 0.1:
			case 1.2:
			case 2.4:
			case 3.3:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldZ(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			//绕z轴逆时针
			case 0.2:
			case 1.1:
			case 2.3:
			case 3.4:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldZ(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			//绕y轴顺时针
			case 0.4:
			case 1.3:
			case 4.3:
			case 5.4:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldY(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			//绕y轴逆时针
			case 1.4:
			case 0.3:
			case 4.4:
			case 5.3:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldY(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			//绕x轴顺时针
			case 2.2:
			case 3.1:
			case 4.1:
			case 5.2:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldX(elements[i], 90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			//绕x轴逆时针
			case 2.1:
			case 3.2:
			case 4.2:
			case 5.1:
				for (var i = 0; i < elements.length; i++) {
					this.rotateAroundWorldX(elements[i], -90 * Math.PI / 180 * (currentstamp - laststamp) / totalTime);
				}
				break;
			default:
				break;
		}
		if (currentstamp - startstamp < totalTime) {
			var that = this;
			requestAnimationFrame(function(timestamp) {
				that.rotateAnimation(elements, direction, timestamp, startstamp, currentstamp);
			});
		}
	}

	//更新位置索引
	updateCubeIndex(elements) {
		for (var i = 0; i < elements.length; i++) {
			var temp1 = elements[i];
			for (var j = 0; j < beginStatus.length; j++) {
				var temp2 = beginStatus[j];
				if (
					Math.abs(temp1.position.x - temp2.x) <= 2 &&
					Math.abs(temp1.position.y - temp2.y) <= 2 &&
					Math.abs(temp1.position.z - temp2.z) <= 2
				) {
					temp1.cubeIndex = temp2.cubeIndex;
					break;
				}
			}
		}
	}
	//绕着世界坐标系的某个轴旋转
	rotateAroundWorldY(obj, rad) {
		var x0 = obj.position.x;
		var z0 = obj.position.z;
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad);
		obj.quaternion.premultiply(q);
		//obj.rotateY(rad);
		obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
		obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
	}

	rotateAroundWorldZ(obj, rad) {
		var x0 = obj.position.x;
		var y0 = obj.position.y;
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad);
		obj.quaternion.premultiply(q);
		//obj.rotateZ(rad);
		obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
		obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
	}
	rotateAroundWorldX(obj, rad) {
		var y0 = obj.position.y;
		var z0 = obj.position.z;
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad);
		obj.quaternion.premultiply(q);
		//obj.rotateX(rad);
		obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
		obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
	}
	getIntersects(event) {
		if (event.touches) {
			var touch = event.touches[0];
			mouse.x = touch.clientX / width * 2 - 1;
			mouse.y = -(touch.clientY / height) * 2 + 1;
		} else {
			mouse.x = event.clientX / width * 2 - 1;
			mouse.y = -(event.clientY / height) * 2 + 1;
		}
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length) {
			try {
				console.log(intersects);
				if (intersects[0].object.cubeType === 'coverCube') {
					intersect = intersects[1];
					normalize = intersects[0].face.normal;
				} else {
					intersect = intersects[0];
					normalize = intersects[1].face.normal;
				}
			} catch (err) {
				//nothing
			}
		}
	}
	//根据方向获得运动元素
	getBoxs(target, direction) {
		var targetId = target.object.cubeIndex;
		targetId = targetId - minCubeIndex;
		var numI = parseInt(targetId / 9);
		var numJ = targetId % 9;
		var boxs = [];
		let cubes = meshesArray;
		//根据绘制时的规律判断 no = i*9+
		console.log(cubes, 'cubes');
		switch (direction) {
			//绕z轴
			case 0.1:
			case 0.2:
			case 1.1:
			case 1.2:
			case 2.3:
			case 2.4:
			case 3.3:
			case 3.4:
				for (var i = 0; i < cubes.length; i++) {
					var tempId = cubes[i].cubeIndex - minCubeIndex;
					if (numI === parseInt(tempId / 9)) {
						boxs.push(cubes[i]);
					}
				}
				break;
			//绕y轴
			case 0.3:
			case 0.4:
			case 1.3:
			case 1.4:
			case 4.3:
			case 4.4:
			case 5.3:
			case 5.4:
				for (var i = 0; i < cubes.length; i++) {
					var tempId = cubes[i].cubeIndex - minCubeIndex;
					if (parseInt(numJ / 3) === parseInt((tempId % 9) / 3)) {
						boxs.push(cubes[i]);
					}
				}
				break;
			//绕x轴
			case 2.1:
			case 2.2:
			case 3.1:
			case 3.2:
			case 4.1:
			case 4.2:
			case 5.1:
			case 5.2:
				for (var i = 0; i < cubes.length; i++) {
					var tempId = cubes[i].cubeIndex - minCubeIndex;
					if ((tempId % 9) % 3 === numJ % 3) {
						boxs.push(cubes[i]);
					}
				}
				break;
			default:
				break;
		}
		console.log('boxes', boxs);
		return boxs;
	}
	//获取数组中的最小值
	min(arr) {
		var min = arr[0];
		var no = 0;
		for (var i = 1; i < arr.length; i++) {
			if (arr[i] < min) {
				min = arr[i];
				no = i;
			}
		}
		return { no: no, value: min };
	}
	//获得旋转方向
	getDirection(vector3) {
		var direction;
		//判断差向量和x、y、z轴的夹角
		//判断差向量和x、y、z轴的夹角
		var xAngle = vector3.angleTo(XLine);
		var xAngleAd = vector3.angleTo(XLineAd);
		var yAngle = vector3.angleTo(YLine);
		var yAngleAd = vector3.angleTo(YLineAd);
		var zAngle = vector3.angleTo(ZLine);
		var zAngleAd = vector3.angleTo(ZLineAd);
		var minAngle = this.min([ xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd ]).value; //最小夹角
		console.log([ xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd ]);
		console.log(minAngle);
		console.log(normalize);
		switch (minAngle) {
			case xAngle:
				direction = 0; //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
				if (normalize.equals(YLine)) {
					direction = direction + 0.1; //绕z轴顺时针
				} else if (normalize.equals(YLineAd)) {
					direction = direction + 0.2; //绕z轴逆时针
				} else if (normalize.equals(ZLine)) {
					direction = direction + 0.3; //绕y轴逆时针
				} else {
					direction = direction + 0.4; //绕y轴顺时针
				}
				break;
			case xAngleAd:
				direction = 1; //向x轴反方向旋转90度
				if (normalize.equals(YLine)) {
					direction = direction + 0.1; //绕z轴逆时针
				} else if (normalize.equals(YLineAd)) {
					direction = direction + 0.2; //绕z轴顺时针
				} else if (normalize.equals(ZLine)) {
					direction = direction + 0.3; //绕y轴顺时针
				} else {
					direction = direction + 0.4; //绕y轴逆时针
				}
				break;
			case yAngle:
				direction = 2; //向y轴正方向旋转90度
				if (normalize.equals(ZLine)) {
					direction = direction + 0.1; //绕x轴逆时针
				} else if (normalize.equals(ZLineAd)) {
					direction = direction + 0.2; //绕x轴顺时针
				} else if (normalize.equals(XLine)) {
					direction = direction + 0.3; //绕z轴逆时针
				} else {
					direction = direction + 0.4; //绕z轴顺时针
				}
				break;
			case yAngleAd:
				direction = 3; //向y轴反方向旋转90度
				if (normalize.equals(ZLine)) {
					direction = direction + 0.1; //绕x轴顺时针
				} else if (normalize.equals(ZLineAd)) {
					direction = direction + 0.2; //绕x轴逆时针
				} else if (normalize.equals(XLine)) {
					direction = direction + 0.3; //绕z轴顺时针
				} else {
					direction = direction + 0.4; //绕z轴逆时针
				}
				break;
			case zAngle:
				direction = 4; //向z轴正方向旋转90度
				if (normalize.equals(YLine)) {
					direction = direction + 0.1; //绕x轴顺时针
				} else if (normalize.equals(YLineAd)) {
					direction = direction + 0.2; //绕x轴逆时针
				} else if (normalize.equals(XLine)) {
					direction = direction + 0.3; //绕y轴顺时针
				} else {
					direction = direction + 0.4; //绕y轴逆时针
				}
				break;
			case zAngleAd:
				direction = 5; //向z轴反方向旋转90度
				if (normalize.equals(YLine)) {
					direction = direction + 0.1; //绕x轴逆时针
				} else if (normalize.equals(YLineAd)) {
					direction = direction + 0.2; //绕x轴顺时针
				} else if (normalize.equals(XLine)) {
					direction = direction + 0.3; //绕y轴逆时针
				} else {
					direction = direction + 0.4; //绕y轴顺时针
				}
				break;
			default:
				break;
		}
		console.log('direction', direction);
		return direction;
	}
	isMouseOverCube(mouseX, mouseY) {
		/* 		var directionVector = new THREE.Vector3();

		//Normalise mouse x and y
		var x = (mouseX / SCREEN_WIDTH) * 2 - 1;
		var y = -(mouseY / SCREEN_HEIGHT) * 2 + 1;

		directionVector.set(x, y, 1);

		projector.unprojectVector(directionVector, camera);
		directionVector.sub(camera.position);
		// directionVector.normalize();
		raycaster.set(camera.position, directionVector);

		return raycaster.intersectObjects(allCubes, true).length > 0;
 */
	}

	//Return the axis which has the greatest maginitude for the vector v
	principalComponent(v) {
		var maxAxis = 'x',
			max = Math.abs(v.x);
		if (Math.abs(v.y) > max) {
			maxAxis = 'y';
			max = Math.abs(v.y);
		}
		if (Math.abs(v.z) > max) {
			maxAxis = 'z';
			max = Math.abs(v.z);
		}
		return maxAxis;
	}
	onMouseOut(e) {
		console.log('on mouse out', e);
		// remember the last cube
	}
	animate() {
		requestAnimationFrame(this.animate);
		/* 		scene.children.forEach((child) => {
			if (child.type == 'Mesh') {
				// console.log(child);
				// child.rotateX(Math.PI / 2);
				child.rotation.x += 0.01;
			}
		}); */
		// mesh.rotateX(Math.PI / 2);
		// mesh.rotation.x += 0.01;
		// mesh.rotation.y += 0.02;

		// mesh2.rotation.x += 0.01;
		// mesh2.rotation.y += 0.02;
		// camera.position.y -= 0.002;
		// controls.update();
		renderer.render(scene, camera);
	}
	start() {
		if (!this.frameId) {
			this.frameId = requestAnimationFrame(this.animate);
		}
	}

	stop() {
		cancelAnimationFrame(this.frameId);
	}

	render() {
		return (
			<div
				style={{ width: '100 %', height: '100 %' }}
				ref={(mount) => {
					this.mount = mount;
				}}
			/>
		);
	}
}

export default Two;
