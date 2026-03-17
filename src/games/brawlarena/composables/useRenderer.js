import * as THREE from 'three'
import { ref, onMounted, onUnmounted } from 'vue'

export function useRenderer(canvasRef) {
  const scene = ref(null)
  const camera = ref(null)
  const renderer = ref(null)
  let animationId = null
  
  const init = (skyColor = 0x1a1a2e) => {
    if (!canvasRef.value) return
    
    // Scene
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(skyColor)
    scene.value.fog = new THREE.Fog(skyColor, 20, 50)
    
    // Camera - side view for fighting game
    camera.value = new THREE.PerspectiveCamera(
      50,
      canvasRef.value.clientWidth / canvasRef.value.clientHeight,
      0.1,
      100
    )
    camera.value.position.set(0, 6, 22)
    camera.value.lookAt(0, 3, 0)
    
    // Renderer
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true
    })
    renderer.value.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.value.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 15, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -20
    directionalLight.shadow.camera.right = 20
    directionalLight.shadow.camera.top = 20
    directionalLight.shadow.camera.bottom = -20
    scene.value.add(directionalLight)
    
    // Rim light for that fighting game look
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3)
    rimLight.position.set(-10, 5, -10)
    scene.value.add(rimLight)
    
    window.addEventListener('resize', handleResize)
  }
  
  const handleResize = () => {
    if (!canvasRef.value || !camera.value || !renderer.value) return
    
    camera.value.aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  }
  
  const render = () => {
    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  }
  
  const startLoop = (updateCallback) => {
    const loop = () => {
      updateCallback()
      render()
      animationId = requestAnimationFrame(loop)
    }
    loop()
  }
  
  const stopLoop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }
  
  const cleanup = () => {
    stopLoop()
    window.removeEventListener('resize', handleResize)
    
    if (scene.value) {
      scene.value.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
    
    if (renderer.value) {
      renderer.value.dispose()
    }
  }
  
  const updateSkyColor = (color) => {
    if (scene.value) {
      scene.value.background = new THREE.Color(color)
      scene.value.fog = new THREE.Fog(color, 20, 50)
    }
  }
  
  const updateCameraForPlayers = (player1Pos, player2Pos) => {
    if (!camera.value) return
    
    // Calculate midpoint between players
    const midX = (player1Pos.x + player2Pos.x) / 2
    const midY = (player1Pos.y + player2Pos.y) / 2 + 3
    
    // Calculate distance for zoom
    const distX = Math.abs(player1Pos.x - player2Pos.x)
    const distY = Math.abs(player1Pos.y - player2Pos.y)
    const dist = Math.max(distX, distY, 10)
    const zoom = Math.min(Math.max(dist * 1.5 + 10, 18), 35)
    
    // Smooth camera movement
    camera.value.position.x += (midX - camera.value.position.x) * 0.1
    camera.value.position.y += (midY - camera.value.position.y) * 0.1
    camera.value.position.z += (zoom - camera.value.position.z) * 0.05
    
    camera.value.lookAt(midX, midY - 1, 0)
  }
  
  return {
    scene,
    camera,
    renderer,
    init,
    render,
    startLoop,
    stopLoop,
    cleanup,
    updateSkyColor,
    updateCameraForPlayers
  }
}
