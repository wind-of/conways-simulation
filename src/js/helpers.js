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

export function cloneMesh(mesh, { x, z }) {
	const newMesh = mesh.clone()
	newMesh.position.set(x, 0, z)
	return newMesh
}

export const coordinatesToKey = ({ x, z }) => `x${x};z${z}`

const randomArray = (length) => Array.from({ length }, () => Math.round(Math.random()))

export function initializeFieldControls(length) {
  const matrix = Array.from({ length }, () => randomArray(length));
  
  const objects = {}
  const index = (d) => length / 2 + Math.round(d) - 1
  const set = (x, z, v) => matrix[index(x)][index(z)] = v
  const get = (x, z) => matrix[index(x)] && matrix[index(x)][index(z)] || 0
  
  const revive = ({ x, z }) => set(x, z, 1)
  const kill = ({ x, z }) => set(x, z, 0)
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
      const key = coordinatesToKey(mesh.position)
      objects[key] = mesh
    },
    getObject(position) {
      return objects[coordinatesToKey(position)]
    },
    removeObject(position) {
      objects[coordinatesToKey(position)] = null
    },
    applyChanges() {
      changes.forEach(({ value, coordinates: { x, z } }) => set(x, z, value))
      changes = []
    },
    iterate({ x, z }) {
      const coordinates = { 
        x: x - length / 2 + .5,
        z: z - length / 2 + .5
      }
      const isCellAlive = isAlive(coordinates)
      if(shouldBeAlive(coordinates)) {
        return !isCellAlive && changes.push({ coordinates, value: 1 })
      } else {
        return isCellAlive && changes.push({ coordinates, value: 0 })
      }
    }
  }
}

export function displayField(scene, field, aliveCellMesh) {
	const { matrix } = field
  const matrixSize = matrix.length
	for(let x = 0; x < matrixSize; x++)
		for(let z = 0; z < matrixSize; z++) {
			const v = matrix[x][z]
			const normalize = (d) => d + .5
			let x_ = normalize(x - matrixSize / 2)
			let z_ = normalize(z - matrixSize / 2)
			const position = { x: x_, z: z_ }
      const mesh = field.getObject(position)
			if(v === 1) {
        if(mesh) {
          continue
        }
				const aliveCell = cloneMesh(aliveCellMesh, position)
				field.saveObject(aliveCell)
				scene.add(aliveCell) 
			} else if(mesh) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
        field.removeObject(position)
			}
		}
}

export function highlightOpacityFunction(time) {
  return Math.max(.2, (Math.cos(time / 180) + 1) / 2)
}