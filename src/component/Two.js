import React, { Component } from "react";
// import logo from "../../public/img/logo.svg";
import "../App.scss";
import * as THREE from "three";
import Box from "grommet/components/Box";

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

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let geometry2 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material2 = new THREE.MeshNormalMaterial();
    mesh2 = new THREE.Mesh(geometry2, material2);
    // mesh2.position();
    // mesh2.position.set(new THREE.Vector3(1, 1, 1));
    mesh2.position.x = 0.3;
    scene.add(mesh2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

  }

  animate() {

    requestAnimationFrame(this.animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    mesh2.rotation.x += 0.01;
    mesh2.rotation.y += 0.02;

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

  /*   animate() {
      // this.cube.rotation.x += 0.01;
      //this.cube.rotation.y += 0.01;
  
      this.renderScene();
      this.frameId = window.requestAnimationFrame(this.animate);
    } */

  /*   renderScene() {
      this.renderer.render(this.scene, this.camera);
    } */
  // style={{ width: "400px", height: "400px" }}
  /*   <div
    style={{ width: "100%", height: "1000%" }}
    ref={mount => {
      this.mount = mount;
    }}
  /> */
  render() {
    return (
      <div
        style={{ width: "100 %", height: "100 %" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Two;
