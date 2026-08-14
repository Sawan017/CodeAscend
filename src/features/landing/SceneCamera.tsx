import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export function SceneCamera() {
  const scroll = useScroll()
  const targetPos = new THREE.Vector3()
  const targetLook = new THREE.Vector3()

  useFrame((state) => {
    // scroll.offset goes from 0 to 1
    const offset = scroll.offset
    
    // We want the camera to move from z = 5 down to z = -105
    const zPos = 5 - (offset * 110)
    
    // Add some subtle sway based on scroll
    const xPos = Math.sin(offset * Math.PI * 4) * 2
    const yPos = Math.cos(offset * Math.PI * 2) * 1
    
    targetPos.set(xPos, yPos, zPos)
    
    // Look slightly ahead of the camera
    targetLook.set(
      Math.sin(offset * Math.PI * 4 + 0.2) * 1.5,
      Math.cos(offset * Math.PI * 2 + 0.2) * 0.5,
      zPos - 15
    )

    // Smoothly interpolate the camera position and lookAt
    state.camera.position.lerp(targetPos, 0.05)
    
    // Create a temporary vector for the current look direction, lerp it, and apply
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    currentLook.lerp(targetLook, 0.05)
    state.camera.lookAt(currentLook)
  })

  return null
}
