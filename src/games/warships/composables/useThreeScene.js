import { ref, shallowRef } from 'vue'
import * as THREE from 'three'

export function useThreeScene(containerRef) {
  const scene = shallowRef(null)
  const camera = shallowRef(null)
  const renderer = shallowRef(null)
  const water = shallowRef(null)
  const clock = shallowRef(null)
  const animationId = ref(null)

  function init() {
    if (!containerRef.value) return false

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    // Create scene
    scene.value = new THREE.Scene()
    clock.value = new THREE.Clock()

    // Create camera - start close to origin where player spawns
    camera.value = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000)
    camera.value.position.set(0, 15, -35)
    camera.value.lookAt(0, 3, 0)

    // Create renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.value.toneMapping = THREE.ACESFilmicToneMapping
    renderer.value.toneMappingExposure = 0.8
    containerRef.value.appendChild(renderer.value.domElement)

    // Create sky with Rayleigh scattering
    createSky()

    // Add lighting
    createLighting()

    // Create ocean with shader
    createOcean()

    // Handle resize
    window.addEventListener('resize', handleResize)

    return true
  }

  function createSky() {
    // Photorealistic sky with Rayleigh/Mie scattering simulation
    const skyGeometry = new THREE.SphereGeometry(1500, 64, 64)
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: new THREE.Vector3(200, 100, -300) },
        rayleigh: { value: 2.0 },
        turbidity: { value: 8.0 },
        mieCoefficient: { value: 0.005 },
        mieDirectionalG: { value: 0.8 },
        luminance: { value: 1.1 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vSunDirection;
        uniform vec3 sunPosition;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vSunDirection = normalize(sunPosition);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float rayleigh;
        uniform float turbidity;
        uniform float mieCoefficient;
        uniform float mieDirectionalG;
        uniform float luminance;
        uniform vec3 sunPosition;
        
        varying vec3 vWorldPosition;
        varying vec3 vSunDirection;
        
        float rayleighPhase(float cosTheta) {
          return (3.0 / (16.0 * 3.14159)) * (1.0 + cosTheta * cosTheta);
        }
        
        float hgPhase(float cosTheta, float g) {
          float g2 = g * g;
          float inverse = 1.0 / pow(1.0 - 2.0 * g * cosTheta + g2, 1.5);
          return (1.0 / (4.0 * 3.14159)) * ((1.0 - g2) * inverse);
        }
        
        void main() {
          vec3 direction = normalize(vWorldPosition);
          float zenithAngle = acos(max(0.0, direction.y));
          float inverse = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - degrees(zenithAngle), -1.253));
          
          vec3 betaR = vec3(5.5e-6, 13.0e-6, 22.4e-6) * rayleigh;
          float Km = turbidity * mieCoefficient;
          vec3 betaM = vec3(Km, Km, Km);
          
          float sR = inverse * 8400.0;
          float sM = inverse * 1200.0;
          vec3 Fex = exp(-(betaR * sR + betaM * sM));
          
          float cosTheta = dot(direction, vSunDirection);
          float rPhase = rayleighPhase(cosTheta);
          vec3 betaRTheta = betaR * rPhase;
          float mPhase = hgPhase(cosTheta, mieDirectionalG);
          vec3 betaMTheta = betaM * mPhase;
          
          vec3 sunE = vec3(1.0, 0.95, 0.85) * 1000.0;
          vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex), vec3(1.5));
          Lin *= mix(vec3(1.0), pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex, vec3(0.5)), 
                     clamp(pow(1.0 - dot(vSunDirection, vec3(0.0, 1.0, 0.0)), 5.0), 0.0, 1.0));
          
          float sunAngularDiameter = 0.00933;
          float sunDist = length(direction - vSunDirection);
          float sundisk = smoothstep(sunAngularDiameter, sunAngularDiameter * 0.9, sunDist);
          
          vec3 L0 = vec3(0.1) * Fex;
          L0 += sunE * 19000.0 * Fex * sundisk;
          
          vec3 texColor = (Lin + L0) * 0.04;
          texColor = pow(texColor, vec3(1.0 / 2.2));
          
          float horizonBlend = pow(1.0 - max(direction.y, 0.0), 3.0);
          vec3 horizonColor = vec3(0.75, 0.82, 0.92);
          texColor = mix(texColor, horizonColor, horizonBlend * 0.3);
          
          gl_FragColor = vec4(clamp(texColor * luminance, 0.0, 1.0), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.value.add(sky)

    // Add sun with glow
    createSun()
    
    // Add clouds
    createClouds()
  }

  function createSun() {
    const sunGroup = new THREE.Group()
    
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee })
    sunGroup.add(new THREE.Mesh(sunGeometry, sunMaterial))
    
    const corona1 = new THREE.Mesh(
      new THREE.SphereGeometry(35, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfffaf0, transparent: true, opacity: 0.4 })
    )
    sunGroup.add(corona1)
    
    const corona2 = new THREE.Mesh(
      new THREE.SphereGeometry(55, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.15 })
    )
    sunGroup.add(corona2)
    
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(90, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffcc88, transparent: true, opacity: 0.08 })
    )
    sunGroup.add(glow)
    
    sunGroup.position.set(200, 100, -300)
    scene.value.add(sunGroup)
  }

  function createClouds() {
    const cloudPositions = [
      { x: -400, y: 120, z: -500, scale: 1.2 },
      { x: 200, y: 140, z: -600, scale: 1.5 },
      { x: -200, y: 100, z: -400, scale: 0.9 },
      { x: 500, y: 130, z: -450, scale: 1.1 },
      { x: -600, y: 110, z: -550, scale: 1.3 },
      { x: 100, y: 150, z: -700, scale: 1.8 }
    ]
    
    for (const pos of cloudPositions) {
      createCumulusCloud(pos.x, pos.y, pos.z, pos.scale)
    }
  }

  function createCumulusCloud(x, y, z, scale) {
    const cloudGroup = new THREE.Group()
    
    const layers = [
      { opacity: 0.9, color: 0xffffff, yOffset: 0, count: 12 },
      { opacity: 0.6, color: 0xf8f8ff, yOffset: 8, count: 8 },
      { opacity: 0.3, color: 0xf0f0f5, yOffset: 15, count: 5 }
    ]
    
    for (const layer of layers) {
      const material = new THREE.MeshPhongMaterial({
        color: layer.color,
        transparent: true,
        opacity: layer.opacity,
        depthWrite: false
      })
      
      for (let i = 0; i < layer.count; i++) {
        const size = (15 + Math.random() * 25) * scale
        const puff = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16), material)
        puff.position.set(
          (Math.random() - 0.5) * 80 * scale,
          layer.yOffset + (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 80 * scale
        )
        puff.scale.y = 0.5 + Math.random() * 0.2
        cloudGroup.add(puff)
      }
    }
    
    cloudGroup.position.set(x, y, z)
    scene.value.add(cloudGroup)
  }

  function createLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x4466aa, 0.15)
    scene.value.add(ambient)

    // Main sun light
    const sun = new THREE.DirectionalLight(0xffeedd, 2.5)
    sun.position.set(200, 100, -300)
    sun.castShadow = true
    sun.shadow.mapSize.width = 4096
    sun.shadow.mapSize.height = 4096
    sun.shadow.camera.near = 10
    sun.shadow.camera.far = 800
    sun.shadow.camera.left = -300
    sun.shadow.camera.right = 300
    sun.shadow.camera.top = 300
    sun.shadow.camera.bottom = -300
    sun.shadow.bias = -0.0001
    scene.value.add(sun)

    // Hemisphere light
    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3a5f4a, 0.4)
    scene.value.add(hemi)

    // Rim light
    const rim = new THREE.DirectionalLight(0xffd4a6, 0.8)
    rim.position.set(-100, 50, 200)
    scene.value.add(rim)
  }

  function createOcean() {
    // Ocean with realistic Gerstner-like waves
    const waterGeometry = new THREE.PlaneGeometry(2000, 2000, 128, 128)
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        deepColor: { value: new THREE.Color(0x001020) },
        midColor: { value: new THREE.Color(0x0a3d5c) },
        shallowColor: { value: new THREE.Color(0x1a6e8e) },
        sunDirection: { value: new THREE.Vector3(0.5, 0.8, -0.3).normalize() },
        sunColor: { value: new THREE.Color(0xfffaf0) },
        skyColorTop: { value: new THREE.Color(0x0055aa) },
        skyColorHorizon: { value: new THREE.Color(0x88aacc) }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vHeight;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Gentle waves
          float wave1 = sin(pos.x * 0.05 + time * 0.5) * 0.3;
          float wave2 = sin(pos.y * 0.07 + time * 0.4) * 0.2;
          float wave3 = sin((pos.x + pos.y) * 0.03 + time * 0.3) * 0.15;
          float waveHeight = wave1 + wave2 + wave3;
          
          vHeight = waveHeight;
          
          // Calculate normal from wave slope
          float dx = cos(pos.x * 0.05 + time * 0.5) * 0.05 * 0.3 +
                     cos((pos.x + pos.y) * 0.03 + time * 0.3) * 0.03 * 0.15;
          float dy = cos(pos.y * 0.07 + time * 0.4) * 0.07 * 0.2 +
                     cos((pos.x + pos.y) * 0.03 + time * 0.3) * 0.03 * 0.15;
          vNormal = normalize(vec3(-dx, 1.0, -dy));
          
          vec4 worldPosition = modelMatrix * vec4(pos.x, pos.y, waveHeight, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 deepColor;
        uniform vec3 midColor;
        uniform vec3 shallowColor;
        uniform vec3 sunDirection;
        uniform vec3 sunColor;
        uniform vec3 skyColorTop;
        uniform vec3 skyColorHorizon;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vHeight;
        
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 normal = normalize(vNormal);
          
          // Water color
          vec3 waterColor = mix(deepColor, midColor, 0.5);
          
          // Fresnel
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
          
          // Sky reflection
          vec3 skyColor = mix(skyColorHorizon, skyColorTop, 0.3);
          
          // Specular
          vec3 halfDir = normalize(sunDirection + viewDir);
          float spec = pow(max(dot(normal, halfDir), 0.0), 256.0);
          
          vec3 finalColor = mix(waterColor, skyColor, fresnel * 0.6);
          finalColor += sunColor * spec * 0.8;
          
          gl_FragColor = vec4(finalColor, 0.95);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })

    water.value = new THREE.Mesh(waterGeometry, waterMaterial)
    water.value.rotation.x = -Math.PI / 2
    water.value.position.y = 0
    scene.value.add(water.value)
  }

  function handleResize() {
    if (!containerRef.value || !camera.value || !renderer.value) return
    
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    
    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }

  function render() {
    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  }

  function updateOceanWaves(time) {
    if (water.value && water.value.material.uniforms) {
      water.value.material.uniforms.time.value = time
    }
  }

  function getElapsedTime() {
    return clock.value ? clock.value.getElapsedTime() : 0
  }

  function dispose() {
    window.removeEventListener('resize', handleResize)
    
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
    
    if (renderer.value) {
      const domElement = renderer.value.domElement
      renderer.value.dispose()
      if (containerRef.value && domElement && domElement.parentNode === containerRef.value) {
        containerRef.value.removeChild(domElement)
      }
      renderer.value = null
    }
    
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
      scene.value = null
    }
    
    camera.value = null
    water.value = null
    clock.value = null
  }

  // NOTE: Caller must call dispose() manually in onBeforeUnmount

  return {
    scene,
    camera,
    renderer,
    water,
    init,
    render,
    updateOceanWaves,
    getElapsedTime,
    dispose
  }
}
