import * as THREE from 'three'
import { ref } from 'vue'

export function useStage(scene) {
  const platforms = ref([])
  const stageGroup = ref(null)
  
  const createStage = (stageData) => {
    // Clear existing stage
    if (stageGroup.value) {
      scene.value.remove(stageGroup.value)
      stageGroup.value = null
    }
    platforms.value = []
    
    stageGroup.value = new THREE.Group()
    
    // Create platforms
    stageData.platforms.forEach(platData => {
      const geometry = new THREE.BoxGeometry(platData.width, platData.height, platData.depth)
      
      // Create material with slight glow effect
      const material = new THREE.MeshStandardMaterial({
        color: platData === stageData.platforms[0] ? stageData.groundColor : stageData.platformColor,
        roughness: 0.6,
        metalness: 0.2
      })
      
      const platform = new THREE.Mesh(geometry, material)
      platform.position.set(platData.x, platData.y - platData.height / 2, platData.z)
      platform.receiveShadow = true
      platform.castShadow = true
      
      // Add edge glow
      const edgeGeometry = new THREE.EdgesGeometry(geometry)
      const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: stageData.accentColor || 0x88aacc, 
        linewidth: 2 
      })
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
      platform.add(edges)
      
      stageGroup.value.add(platform)
      
      platforms.value.push({
        mesh: platform,
        bounds: {
          left: platData.x - platData.width / 2,
          right: platData.x + platData.width / 2,
          top: platData.y,
          bottom: platData.y - platData.height,
          front: platData.z + platData.depth / 2,
          back: platData.z - platData.depth / 2
        }
      })
    })
    
    // Add decorative background elements
    addBackgroundElements(stageData)
    
    scene.value.add(stageGroup.value)
    
    return {
      platforms: platforms.value,
      blastZones: stageData.blastZones
    }
  }
  
  const addBackgroundElements = (stageData) => {
    // Add floating particles/stars
    const particleCount = 100
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60
      positions[i + 1] = Math.random() * 30 - 5
      positions[i + 2] = -10 - Math.random() * 20
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      color: stageData.accentColor || 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.6
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    stageGroup.value.add(particles)
    
    // Add background gradient plane
    const bgGeometry = new THREE.PlaneGeometry(80, 50)
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        colorTop: { value: new THREE.Color(stageData.skyColor).multiplyScalar(0.5) },
        colorBottom: { value: new THREE.Color(stageData.skyColor).multiplyScalar(1.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorTop;
        uniform vec3 colorBottom;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(colorBottom, colorTop, vUv.y), 1.0);
        }
      `,
      side: THREE.DoubleSide
    })
    
    const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial)
    bgPlane.position.z = -25
    stageGroup.value.add(bgPlane)
  }
  
  const cleanup = () => {
    if (stageGroup.value && scene.value) {
      scene.value.remove(stageGroup.value)
    }
    platforms.value = []
  }
  
  return {
    platforms,
    createStage,
    cleanup
  }
}
