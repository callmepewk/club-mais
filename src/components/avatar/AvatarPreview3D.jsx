import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarPreview3D({ avatarEdits, className = '' }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear previous content
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Ground
    const groundGeometry = new THREE.CircleGeometry(5, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x90EE90,
      roughness: 0.8 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create avatar
    createAvatar(scene, avatarEdits);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (scene.userData.avatar) {
        scene.userData.avatar.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [avatarEdits]);

  const createAvatar = (scene, edits) => {
    const avatar = new THREE.Group();
    
    // Parse colors from hex to THREE.Color
    const skinColor = new THREE.Color(edits.skinColor || '#f5d1b3');
    const hairColor = new THREE.Color(edits.hairColor || '#2b1b10');
    const shirtColor = 0xFF6B6B;
    const pantsColor = 0x4A5568;

    // Body proportions
    let bodyScale = 1;
    if (edits.bodyType === 'magro') bodyScale = 0.85;
    else if (edits.bodyType === 'atletico') bodyScale = 1.1;
    else if (edits.bodyType === 'plus') bodyScale = 1.25;

    // Head scaling
    let headScaleX = 1, headScaleY = 1, headScaleZ = 1;
    if (edits.faceShape === 'redondo') {
      headScaleX = headScaleZ = 1.15;
      headScaleY = 0.95;
    } else if (edits.faceShape === 'quadrado') {
      headScaleX = headScaleZ = 1.1;
    } else if (edits.faceShape === 'triangular') {
      headScaleY = 1.1;
      headScaleX = 0.95;
    } else if (edits.faceShape === 'alongado') {
      headScaleY = 1.2;
      headScaleX = headScaleZ = 0.9;
    }

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.scale.set(headScaleX, headScaleY, headScaleZ);
    head.position.y = 1.6;
    head.castShadow = true;
    avatar.add(head);

    // Hair - only if hairStyle is not 'none'
    if (edits.hairStyle !== 'none') {
      let hairGeometry;
      
      if (edits.hairStyle === 'long') {
        hairGeometry = new THREE.SphereGeometry(0.27, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);
      } else if (edits.hairStyle === 'bun') {
        hairGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      } else {
        hairGeometry = new THREE.SphereGeometry(0.27, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
      }
      
      const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      
      if (edits.hairStyle === 'bun') {
        hair.position.set(0, 1.75, -0.15);
      } else {
        hair.scale.set(headScaleX, headScaleY * 0.8, headScaleZ);
        hair.position.y = 1.65;
      }
      
      hair.castShadow = true;
      avatar.add(hair);
    }

    // Nose
    let noseScaleX = 0.08, noseScaleY = 0.12, noseScaleZ = 0.08;
    if (edits.noseShape === 'fino') {
      noseScaleX = noseScaleZ = 0.06;
    } else if (edits.noseShape === 'largo') {
      noseScaleX = noseScaleZ = 0.12;
    } else if (edits.noseShape === 'arrebitado') {
      noseScaleY = 0.08;
    }
    
    const noseGeometry = new THREE.BoxGeometry(1, 1, 1);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.scale.set(noseScaleX, noseScaleY, noseScaleZ);
    nose.position.set(0, 1.55, 0.25 * headScaleZ);
    nose.castShadow = true;
    avatar.add(nose);

    // Eyes
    let eyeScale = 0.05;
    if (edits.eyeSize === 'pequeno') eyeScale = 0.04;
    else if (edits.eyeSize === 'grande') eyeScale = 0.06;

    const eyeGeometry = new THREE.SphereGeometry(eyeScale, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1 * headScaleX, 1.65, 0.2 * headScaleZ);
    avatar.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1 * headScaleX, 1.65, 0.2 * headScaleZ);
    avatar.add(rightEye);

    // Eyebrows
    let browThickness = 0.02;
    let browCurve = 0;
    if (edits.eyebrowStyle === 'fina') browThickness = 0.015;
    else if (edits.eyebrowStyle === 'grossa') browThickness = 0.03;
    if (edits.eyebrowStyle === 'arqueada') browCurve = 0.02;

    const browGeometry = new THREE.BoxGeometry(0.12, browThickness, 0.02);
    const browMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
    
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.1 * headScaleX, 1.7 + browCurve, 0.22 * headScaleZ);
    if (edits.eyebrowStyle === 'arqueada') leftBrow.rotation.z = 0.1;
    avatar.add(leftBrow);
    
    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.1 * headScaleX, 1.7 + browCurve, 0.22 * headScaleZ);
    if (edits.eyebrowStyle === 'arqueada') rightBrow.rotation.z = -0.1;
    avatar.add(rightBrow);

    // Mouth
    let mouthWidth = 0.15, mouthHeight = 0.03;
    if (edits.mouthSize === 'pequena') mouthWidth = 0.12;
    else if (edits.mouthSize === 'grande') mouthWidth = 0.18;
    else if (edits.mouthSize === 'volumosa') {
      mouthWidth = 0.18;
      mouthHeight = 0.04;
    }

    const mouthGeometry = new THREE.BoxGeometry(mouthWidth, mouthHeight, 0.02);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6B9D });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.48, 0.23 * headScaleZ);
    avatar.add(mouth);

    // Cheeks
    if (edits.cheekSize !== 'fino') {
      let cheekSize = 0.08;
      if (edits.cheekSize === 'volumoso') cheekSize = 0.12;
      
      const cheekGeometry = new THREE.SphereGeometry(cheekSize, 16, 16);
      const cheekMaterial = new THREE.MeshStandardMaterial({ 
        color: skinColor,
        transparent: true,
        opacity: 0.6
      });
      
      const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
      leftCheek.position.set(-0.15 * headScaleX, 1.55, 0.15 * headScaleZ);
      avatar.add(leftCheek);
      
      const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
      rightCheek.position.set(0.15 * headScaleX, 1.55, 0.15 * headScaleZ);
      avatar.add(rightCheek);
    }

    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.2, 16);
    const neckMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 1.35;
    neck.castShadow = true;
    avatar.add(neck);

    // Torso
    const torsoGeometry = new THREE.BoxGeometry(0.5 * bodyScale, 0.6, 0.25);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.95;
    torso.castShadow = true;
    avatar.add(torso);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.6, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3 * bodyScale, 0.95, 0);
    leftArm.castShadow = true;
    avatar.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3 * bodyScale, 0.95, 0);
    rightArm.castShadow = true;
    avatar.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.09, 0.9, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.12 * bodyScale, 0.2, 0);
    leftLeg.castShadow = true;
    avatar.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.12 * bodyScale, 0.2, 0);
    rightLeg.castShadow = true;
    avatar.add(rightLeg);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.2);
    const footMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.12 * bodyScale, -0.2, 0.05);
    leftFoot.castShadow = true;
    avatar.add(leftFoot);
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.12 * bodyScale, -0.2, 0.05);
    rightFoot.castShadow = true;
    avatar.add(rightFoot);

    scene.add(avatar);
    scene.userData.avatar = avatar;
  };

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}