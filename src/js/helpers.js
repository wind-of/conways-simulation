import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function initialization() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const orbit = new OrbitControls(camera, renderer.domElement);
  camera.position.set(10, 15, -22);
  orbit.update();

  return { 
    renderer, 
    scene, 
    camera,
    orbit
  }
}

export function aliveCellFactory() {
  return horizontalPlaneMesh({ 
    height: 1, 
    width: 1, 
    material: {
      side: THREE.DoubleSide,
      transparent: true
    }
  })
} 

export function horizontalPlaneMesh({ height, width, material }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, width, height),
    new THREE.MeshBasicMaterial(material)
  )
  mesh.rotateX(-Math.PI / 2)
  return mesh
}

export function checkRendererAspect(renderer, camera) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

export function isCellAlive(matrix, { x, z }) {
  return !matrix[Math.round(x)][Math.round(z)]
}

export function initializeFieldControls(length) {
  const matrix = Array.from({ length }, () => Array(length).fill(0));
  const index = (d) => length / 2 + Math.floor(d)
  const set = (x, z, v) => matrix[index(x)][index(z)] = v
  const get = (x, z) => matrix[index(x)] && matrix[index(x)][index(z)] || 0
  return {
    matrix,
    revive({ x, z }) {
      set(x, z, 1)
    },
    kill({ x, z }) {
      set(x, z, 0)
    },
    isAlive({ x, z }) {
      return !!get(x, z)
    },
    shouldRevive({ x, z }) {
      let count = (
        get({ x: x - 1, z: z - 1 }) +
        get({ x: x - 1, z }) + 
        get({ x: x - 1, z: z + 1 }) +
        get({ x: x, z: z - 1 }) + 
        get({ x: x, z: z + 1 }) +
        get({ x: x - 1, z: z - 1 }) +
        get({ x, z: z - 1}) + 
        get({ x: x + 1, z: z - 1 })
      )
      console.log(count)
    }
  }
}

export function highlightOpacityFunction(time) {
  return Math.max(.2, (Math.cos(time / 180) + 1) / 2)
}