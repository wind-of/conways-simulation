import * as THREE from "three"

export function horizontalPlaneMesh({ height, width, material }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, width, height),
    new THREE.MeshBasicMaterial(material)
  )
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