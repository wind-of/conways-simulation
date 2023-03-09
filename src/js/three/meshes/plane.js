import * as THREE from "three"

export function planeMesh({ height, width, material }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, width, height),
    new THREE.MeshBasicMaterial(material)
  )
  return mesh
}

export function horizontalPlaneMesh(options) {
  const mesh = planeMesh(options)
  mesh.rotateX(-Math.PI / 2)
  return mesh
}

export function gameGridPlaneMesh(size) {
  return horizontalPlaneMesh({ 
    height: size, 
    width: size, 
    material: {
      side: THREE.DoubleSide,
      visible: false
    }
  })
}