import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export function SceneCamera() {
  const scroll = useScroll()
  const targetLook = new THREE.Vector3()

  useFrame((state) => {
    const offset = scroll.offset // 0 to 1
    
    // We want the camera to move from z = 5 down to z = -200
    const zPos = 5 - (offset * 215)
    
    // Extremely subtle, slow sway (dolly movement)
    const xPos = Math.sin(offset * Math.PI * 2) * 1.5
    const yPos = Math.cos(offset * Math.PI * 2) * 0.5

    // Mouse parallax (extremely subtle so it doesn't distract)
    const mouseX = (state.pointer.x * 0.5)
    const mouseY = (state.pointer.y * 0.5)

    const targetX = xPos + mouseX
    const targetY = yPos + mouseY

    // Look slightly ahead, but mostly straight to keep it calm and stable
    targetLook.set(
      Math.sin(offset * Math.PI * 2) * 0.5,
      Math.cos(offset * Math.PI * 2) * 0.2,
      zPos - 30 // Look deep into the scene
    )

    // Smoothly interpolate X/Y but bind Z more tightly to scroll so the user immediately feels the forward movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, zPos, 0.1)
    
    // Smoothly interpolate look target
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    currentLook.lerp(targetLook, 0.05)
    state.camera.lookAt(currentLook)
  })

  return null
}
