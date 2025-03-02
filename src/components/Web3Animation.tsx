import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const Web3Animation = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    
    // Create a more interesting distribution pattern - spiral galaxy
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Spiral pattern
      const radius = Math.random() * 5 + 0.5;
      const angle = radius * 5 + Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 2;
      
      posArray[i3] = Math.cos(angle) * radius;
      posArray[i3 + 1] = height;
      posArray[i3 + 2] = Math.sin(angle) * radius;
      
      // Dynamic color based on position
      const distanceFromCenter = Math.sqrt(
        posArray[i3] * posArray[i3] + 
        posArray[i3 + 2] * posArray[i3 + 2]
      );
      
      // Create a gradient from center (purple) to edge (cyan)
      const t = distanceFromCenter / 5;
      
      if (theme === 'dark') {
        // Dark theme: purple to cyan
        colorArray[i3] = 0.5 - t * 0.3;     // R: decrease outward
        colorArray[i3 + 1] = 0.2 + t * 0.6; // G: increase outward
        colorArray[i3 + 2] = 0.8;           // B: constant high
      } else {
        // Light theme: deep blue to teal
        colorArray[i3] = 0.1 + t * 0.1;     // R: slight increase
        colorArray[i3 + 1] = 0.3 + t * 0.5; // G: increase outward
        colorArray[i3 + 2] = 0.7 - t * 0.2; // B: slight decrease
      }
      
      // Vary particle sizes
      sizeArray[i] = Math.random() * 2 + 0.5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    
    // Custom shader material for better particles
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular particles
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Soft edge
          float alpha = 1.0 - smoothstep(0.4, 0.5, r);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create connecting lines dynamically
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);
    
    const updateLines = () => {
      // Clear previous lines
      while(lineGroup.children.length > 0) {
        const line = lineGroup.children[0];
        lineGroup.remove(line);
        (line as THREE.Line).geometry.dispose();
      }
      
      // Create new lines
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: theme === 'dark' ? 0x9c6eff : 0x3b82f6,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      
      // Create connections between nearby particles
      const maxConnections = 100;
      const maxDistance = 1.5;
      
      for (let i = 0; i < maxConnections; i++) {
        const startIndex = Math.floor(Math.random() * particlesCount);
        const startPos = new THREE.Vector3(
          posArray[startIndex * 3],
          posArray[startIndex * 3 + 1],
          posArray[startIndex * 3 + 2]
        );
        
        // Find a nearby particle
        for (let j = 0; j < 10; j++) { // Try 10 random particles to find a close one
          const endIndex = Math.floor(Math.random() * particlesCount);
          const endPos = new THREE.Vector3(
            posArray[endIndex * 3],
            posArray[endIndex * 3 + 1],
            posArray[endIndex * 3 + 2]
          );
          
          if (startPos.distanceTo(endPos) < maxDistance) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            lineGroup.add(line);
            break;
          }
        }
      }
    };
    
    updateLines();
    
    // Camera position
    camera.position.z = 8;
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    let frame = 0;
    const clock = new THREE.Clock();
    
    const animate = () => {
      const delta = clock.getDelta();
      frame += delta;
      requestAnimationFrame(animate);
      
      // Smooth camera movement
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      particlesMesh.rotation.y += 0.02 * delta;
      particlesMesh.rotation.x += 0.01 * delta;
      
      // Smooth camera movement
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Pulse effect
      const pulseScale = 1 + Math.sin(frame * 0.5) * 0.03;
      particlesMesh.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Rotate the entire line group
      lineGroup.rotation.y += 0.005;
      
      // Occasionally update lines for dynamic effect
      if (Math.random() < 0.005) {
        updateLines();
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Update colors when theme changes
    const updateThemeColors = () => {
      // Update particle colors
      const colors = particlesGeometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        const x = posArray[i3];
        const z = posArray[i3 + 2];
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        const t = distanceFromCenter / 5;
        
        if (theme === 'dark') {
          // Dark theme: purple to cyan
          colors[i3] = 0.5 - t * 0.3;     // R: decrease outward
          colors[i3 + 1] = 0.2 + t * 0.6; // G: increase outward
          colors[i3 + 2] = 0.8;           // B: constant high
        } else {
          // Light theme: deep blue to teal
          colors[i3] = 0.1 + t * 0.1;     // R: slight increase
          colors[i3 + 1] = 0.3 + t * 0.5; // G: increase outward
          colors[i3 + 2] = 0.7 - t * 0.2; // B: slight decrease
        }
      }
      
      particlesGeometry.attributes.color.needsUpdate = true;
      
      // Update lines
      updateLines();
    };
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      
      lineGroup.children.forEach(line => {
        (line as THREE.Line).geometry.dispose();
        const material = (line as THREE.Line).material;
        if (Array.isArray(material)) {
          material.forEach(mat => mat.dispose());
        } else {
          material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, [theme]);
  
  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default Web3Animation;
