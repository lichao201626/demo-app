import React, { Component } from 'react';
// import logo from "../../public/img/logo.svg";
import '../App.scss';
import * as THREE from 'three';
import Box from 'grommet/components/Box';
let meshes = require('./meshes');

// document.body.appendChild(renderer.domElement);
var camera, scene, renderer;
var geometry, material, mesh;
let mesh2;
class Two extends Component {
	constructor(props) {
		super(props);

		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.animate = this.animate.bind(this);
		this.init = this.init.bind(this);
	}

	componentDidMount() {
		console.log(window);

		/*     this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.material = material; */
		// this.cube = cubes;

		// this.mount.appendChild(this.renderer.domElement);
		// this.renderer.render(this.scene, this.camera);
		// this.start();
		this.init();
		this.animate();
	}

	componentWillUnmount() {
		this.stop();
		this.mount.removeChild(this.renderer.domElement);
	}

	init() {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.03, 10);
		camera.position.x = 0.4;
		camera.position.y = 0.4;
		camera.position.z = 1.4;
		// camera.lookAt(scene.position);

		scene = new THREE.Scene();
		var light = new THREE.PointLight(0x8844ff, 5, 100);
		scene.add(light);

		let meshesArray = meshes.create27Meshes(0.1);
		console.log(meshesArray);
		meshesArray.forEach((element) => {
			var box = new THREE.BoxHelper(element);
			// scene.add(edges);
			scene.add(element);
			scene.add(box);
			// scene.add(edges);
		});
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
		// renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffffff, 1.0);
		document.body.appendChild(renderer.domElement);
	}

	animate() {
		requestAnimationFrame(this.animate);
		scene.children.forEach((child) => {
			if (child.type == 'Mesh') {
				// console.log(child);
				// child.rotateX(Math.PI / 2);
				child.rotation.x += 0.01;
			}
		});
		// mesh.rotateX(Math.PI / 2);
		// mesh.rotation.x += 0.01;
		// mesh.rotation.y += 0.02;

		// mesh2.rotation.x += 0.01;
		// mesh2.rotation.y += 0.02;
		// camera.position.y -= 0.002;
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
