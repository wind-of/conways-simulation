import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ALIVE_CELL_VALUE = 1
const DEAD_CELL_VALUE = 0

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

export function fullyTerminateMesh(scene, mesh) {
  scene.remove(mesh)
  mesh.geometry.dispose()
  mesh.material.dispose()
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

export function cloneMesh(mesh, { x, z }) {
	const newMesh = mesh.clone()
	newMesh.position.set(x, 0, z)
	return newMesh
}

export const positionToKey = ({ x, z }) => `x${x};z${z}`

export const normilizeIndex = (d, max) => max / 2 + Math.round(d) - 1
export const reverseNormilizeIndex = (d, max) =>  d - max / 2 + .5
export const normilizeCoordinates = ({ x, z }, max) => ({
  x: normilizeIndex(x, max),
  z: normilizeIndex(z, max)
})
export const reverseNormilizeCoordinates = ({ x, z }, max) =>  ({
  x: reverseNormilizeIndex(x, max),
  z: reverseNormilizeIndex(z, max)
})

const randomArray = (length) => Array.from({ length }, () => Math.round(Math.random()))

export function initializeFieldControls(matrixSize) {
  const matrix = Array.from({ length: matrixSize }, () => randomArray(matrixSize));
  
  const objects = {}
  const index = (d) => normilizeIndex(d, matrixSize)
  const set = (x, z, v) => matrix[index(x)][index(z)] = v
  const get = (x, z) => matrix[index(x)] && matrix[index(x)][index(z)] || 0
  
  const revive = ({ x, z }) => set(x, z, ALIVE_CELL_VALUE)
  const kill = ({ x, z }) => set(x, z, DEAD_CELL_VALUE)
  const isAlive = ({ x, z }) => !!get(x, z)

  const shouldBeAlive = ({ x, z }) => {
    const isCellAlive = isAlive({ x, z })
    const count = (
      get(x - 1, z - 1) +
      get(x - 1, z) + 
      get(x - 1, z + 1) +
      get(x, z - 1) + 
      get(x, z + 1) +
      get(x + 1, z - 1) +
      get(x + 1, z) + 
      get(x + 1, z + 1)
    )
    return isCellAlive 
      ? count > 1 && count < 4 
      : count === 3
  }
  let changes = []

  return {
    matrix,
    objects,

    revive,
    kill,
    isAlive,
    
    saveObject(mesh) {
      const key = positionToKey(mesh.position)
      objects[key] = mesh
    },
    getObject(position) {
      return objects[positionToKey(position)]
    },
    removeObject(position) {
      objects[positionToKey(position)] = null
    },
    applyChanges() {
      changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
      changes = []
    },
    iterate(coordinates) {
      const position = reverseNormilizeCoordinates(coordinates, matrixSize)
      const isCellAlive = isAlive(position)
      if(shouldBeAlive(position)) {
        return !isCellAlive && changes.push({ position, value: ALIVE_CELL_VALUE })
      } else {
        return isCellAlive && changes.push({ position, value: DEAD_CELL_VALUE })
      }
    },
    display(scene, aliveCellMesh) {
      for(let x = 0; x < matrixSize; x++)
        for(let z = 0; z < matrixSize; z++) {
          const v = matrix[x][z]
          const position = reverseNormilizeCoordinates({ x, z }, matrixSize)
          const mesh = this.getObject(position)
          if(v === 1) {
            if(mesh) {
              continue
            }
            const aliveCell = cloneMesh(aliveCellMesh, position)
            this.saveObject(aliveCell)
            scene.add(aliveCell) 
          } else if(mesh) {
            fullyTerminateMesh(scene, mesh)
            this.removeObject(position)
          }
        }
    }
  }
}

export function highlightOpacityFunction(time) {
  return Math.max(.2, (Math.cos(time / 180) + 1) / 2)
}