import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LiveAvatarMirror({ faceLandmarks, poseLandmarks, avatarConfig, className = '' }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3.5);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const groundGeometry = new THREE.CircleGeometry(5, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x90EE90,
      roughness: 0.8 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const avatar = createAvatar(scene, avatarConfig);
    avatarRef.current = avatar;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

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
  }, []);

  useEffect(() => {
    if (avatarRef.current && (faceLandmarks || poseLandmarks)) {
      updateAvatarPose(avatarRef.current, faceLandmarks, poseLandmarks);
    }
  }, [faceLandmarks, poseLandmarks]);

  const createAvatar = (scene, config) => {
    const avatar = new THREE.Group();
    avatar.userData = {};

    const isFemale = config.gender === 'female';
    const skinColor = new THREE.Color(config.skinColor || '#f5d1b3');
    const hairColor = new THREE.Color(config.hairColor || '#2b1b10');

    let bodyScale = 1;
    if (config.bodyType === 'magro') bodyScale = 0.85;
    else if (config.bodyType === 'atletico') bodyScale = 1.1;
    else if (config.bodyType === 'plus') bodyScale = 1.25;

    // HEAD
    const headGeometry = new THREE.SphereGeometry(0.28, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: skinColor,
      roughness: 0.5,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    head.castShadow = true;
    avatar.add(head);
    avatar.userData.head = head;

    // HAIR - Estilo The Sims
    if (config.hairStyle !== 'none') {
      let hairGeometry;
      
      if (isFemale) {
        if (config.hairStyle === 'long') {
          hairGeometry = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85);
          const hairBack = new THREE.BoxGeometry(0.5, 0.8, 0.2);
          const hairBackMesh = new THREE.Mesh(hairBack, new THREE.MeshStandardMaterial({ color: hairColor }));
          hairBackMesh.position.set(0, 1.4, -0.15);
          hairBackMesh.castShadow = true;
          avatar.add(hairBackMesh);
        } else if (config.hairStyle === 'bun') {
          hairGeometry = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
          const bun = new THREE.SphereGeometry(0.12, 16, 16);
          const bunMesh = new THREE.Mesh(bun, new THREE.MeshStandardMaterial({ color: hairColor }));
          bunMesh.position.set(0, 1.85, -0.2);
          bunMesh.castShadow = true;
          avatar.add(bunMesh);
        } else {
          hairGeometry = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
        }
      } else {
        hairGeometry = new THREE.SphereGeometry(0.29, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
      }
      
      const hairMaterial = new THREE.MeshStandardMaterial({ 
        color: hairColor,
        roughness: 0.6
      });
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      hair.position.y = 1.75;
      hair.castShadow = true;
      avatar.add(hair);
    }

    // FACIAL FEATURES
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyeIris = new THREE.MeshStandardMaterial({ color: isFemale ? 0x4A90E2 : 0x2E5C3A });
    
    const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhite);
    leftEyeWhite.position.set(-0.12, 1.75, 0.23);
    avatar.add(leftEyeWhite);
    
    const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), eyeIris);
    leftIris.position.set(-0.12, 1.75, 0.26);
    avatar.add(leftIris);
    
    const rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhite);
    rightEyeWhite.position.set(0.12, 1.75, 0.23);
    avatar.add(rightEyeWhite);
    
    const rightIris = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), eyeIris);
    rightIris.position.set(0.12, 1.75, 0.26);
    avatar.add(rightIris);

    // Eyebrows
    const browGeometry = new THREE.BoxGeometry(0.14, 0.02, 0.02);
    const browMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
    
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.12, 1.82, 0.24);
    avatar.add(leftBrow);
    
    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.12, 1.82, 0.24);
    avatar.add(rightBrow);

    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.04, 0.12, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.rotation.x = Math.PI;
    nose.position.set(0, 1.68, 0.27);
    nose.castShadow = true;
    avatar.add(nose);

    // Mouth
    const mouthGeometry = new THREE.BoxGeometry(0.16, 0.04, 0.03);
    const mouthMaterial = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0xFF6B9D : 0xCC5577 
    });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.58, 0.26);
    avatar.add(mouth);

    // Eyelashes for female
    if (isFemale) {
      const lashGeometry = new THREE.BoxGeometry(0.08, 0.015, 0.01);
      const lashMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      
      const leftLash = new THREE.Mesh(lashGeometry, lashMaterial);
      leftLash.position.set(-0.12, 1.73, 0.27);
      avatar.add(leftLash);
      
      const rightLash = new THREE.Mesh(lashGeometry, lashMaterial);
      rightLash.position.set(0.12, 1.73, 0.27);
      avatar.add(rightLash);
    }

    // NECK
    const neckGeometry = new THREE.CylinderGeometry(0.11, 0.13, 0.25, 16);
    const neckMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 1.4;
    neck.castShadow = true;
    avatar.add(neck);
    avatar.userData.neck = neck;

    // TORSO
    const torsoGeometry = isFemale 
      ? new THREE.CylinderGeometry(0.25 * bodyScale, 0.32 * bodyScale, 0.7, 16)
      : new THREE.BoxGeometry(0.55 * bodyScale, 0.7, 0.28);
    const torsoMaterial = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0x000000 : 0x3A5F8F
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.9;
    torso.castShadow = true;
    avatar.add(torso);
    avatar.userData.torso = torso;

    // ARMS
    const armGeometry = new THREE.CylinderGeometry(0.06, 0.055, 0.65, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35 * bodyScale, 1.0, 0);
    leftArm.castShadow = true;
    avatar.add(leftArm);
    avatar.userData.leftArm = leftArm;
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35 * bodyScale, 1.0, 0);
    rightArm.castShadow = true;
    avatar.add(rightArm);
    avatar.userData.rightArm = rightArm;

    // FOREARMS
    const forearmGeometry = new THREE.CylinderGeometry(0.055, 0.05, 0.6, 16);
    
    const leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
    leftForearm.position.set(-0.35 * bodyScale, 0.4, 0);
    leftForearm.castShadow = true;
    avatar.add(leftForearm);
    avatar.userData.leftForearm = leftForearm;
    
    const rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
    rightForearm.position.set(0.35 * bodyScale, 0.4, 0);
    rightForearm.castShadow = true;
    avatar.add(rightForearm);
    avatar.userData.rightForearm = rightForearm;

    // HANDS
    const handGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    
    const leftHand = new THREE.Mesh(handGeometry, armMaterial);
    leftHand.position.set(-0.35 * bodyScale, 0.05, 0);
    leftHand.castShadow = true;
    avatar.add(leftHand);
    avatar.userData.leftHand = leftHand;
    
    const rightHand = new THREE.Mesh(handGeometry, armMaterial);
    rightHand.position.set(0.35 * bodyScale, 0.05, 0);
    rightHand.castShadow = true;
    avatar.add(rightHand);
    avatar.userData.rightHand = rightHand;

    // LEGS
    const legGeometry = isFemale
      ? new THREE.CylinderGeometry(0.09, 0.085, 0.95, 16)
      : new THREE.CylinderGeometry(0.1, 0.095, 0.95, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: isFemale ? skinColor : 0x2C3E50
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.14 * bodyScale, 0.05, 0);
    leftLeg.castShadow = true;
    avatar.add(leftLeg);
    avatar.userData.leftLeg = leftLeg;
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.14 * bodyScale, 0.05, 0);
    rightLeg.castShadow = true;
    avatar.add(rightLeg);
    avatar.userData.rightLeg = rightLeg;

    // FEET
    const footGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.22);
    const footMaterial = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0x000000 : 0x1A1A1A
    });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.14 * bodyScale, -0.4, 0.06);
    leftFoot.castShadow = true;
    avatar.add(leftFoot);
    avatar.userData.leftFoot = leftFoot;
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.14 * bodyScale, -0.4, 0.06);
    rightFoot.castShadow = true;
    avatar.add(rightFoot);
    avatar.userData.rightFoot = rightFoot;

    scene.add(avatar);
    return avatar;
  };

  const updateAvatarPose = (avatar, faceLandmarks, poseLandmarks) => {
    if (!avatar || !poseLandmarks || poseLandmarks.length < 33) return;

    const getLandmark = (idx) => poseLandmarks[idx];

    // HEAD - acompanha movimento da cabeça
    if (avatar.userData.head && faceLandmarks && faceLandmarks.length > 0) {
      const nose = getLandmark(0);
      const leftEar = getLandmark(7);
      const rightEar = getLandmark(8);
      
      if (nose && leftEar && rightEar) {
        const headTilt = (rightEar.y - leftEar.y) * 2;
        const headRotY = (nose.x - 0.5) * 0.8;
        const headRotX = (nose.y - 0.5) * 0.5;
        
        avatar.userData.head.rotation.set(headRotX, -headRotY, headTilt);
      }
    }

    // SHOULDERS - posição base do torso
    const leftShoulder = getLandmark(11);
    const rightShoulder = getLandmark(12);
    
    if (leftShoulder && rightShoulder && avatar.userData.torso) {
      const shoulderTilt = (rightShoulder.y - leftShoulder.y) * 1.5;
      const torsoLean = (leftShoulder.x + rightShoulder.x) / 2 - 0.5;
      
      avatar.userData.torso.rotation.set(0, torsoLean * 0.3, shoulderTilt);
    }

    // BRAÇOS
    const leftElbow = getLandmark(13);
    const leftWrist = getLandmark(15);
    const rightElbow = getLandmark(14);
    const rightWrist = getLandmark(16);

    if (leftShoulder && leftElbow && avatar.userData.leftArm) {
      const armAngle = Math.atan2(leftElbow.y - leftShoulder.y, leftElbow.x - leftShoulder.x);
      avatar.userData.leftArm.rotation.z = armAngle + Math.PI / 2;
    }

    if (rightShoulder && rightElbow && avatar.userData.rightArm) {
      const armAngle = Math.atan2(rightElbow.y - rightShoulder.y, rightElbow.x - rightShoulder.x);
      avatar.userData.rightArm.rotation.z = armAngle + Math.PI / 2;
    }

    if (leftElbow && leftWrist && avatar.userData.leftForearm) {
      const forearmAngle = Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x);
      avatar.userData.leftForearm.rotation.z = forearmAngle + Math.PI / 2;
    }

    if (rightElbow && rightWrist && avatar.userData.rightForearm) {
      const forearmAngle = Math.atan2(rightWrist.y - rightElbow.y, rightWrist.x - rightElbow.x);
      avatar.userData.rightForearm.rotation.z = forearmAngle + Math.PI / 2;
    }

    // PERNAS
    const leftHip = getLandmark(23);
    const leftKnee = getLandmark(25);
    const rightHip = getLandmark(24);
    const rightKnee = getLandmark(26);

    if (leftHip && leftKnee && avatar.userData.leftLeg) {
      const legAngle = Math.atan2(leftKnee.y - leftHip.y, leftKnee.x - leftHip.x);
      avatar.userData.leftLeg.rotation.z = legAngle + Math.PI / 2;
    }

    if (rightHip && rightKnee && avatar.userData.rightLeg) {
      const legAngle = Math.atan2(rightKnee.y - rightHip.y, rightKnee.x - rightHip.x);
      avatar.userData.rightLeg.rotation.z = legAngle + Math.PI / 2;
    }
  };

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}