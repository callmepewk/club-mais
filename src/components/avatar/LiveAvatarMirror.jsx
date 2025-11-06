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
    scene.background = new THREE.Color(0xb2d8ff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 4);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup - mais suave e realista
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const avatar = createSimsStyleAvatar(scene, avatarConfig);
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
  }, [avatarConfig]);

  useEffect(() => {
    if (avatarRef.current && poseLandmarks && poseLandmarks.length >= 33) {
      updateAvatarPoseRealtime(avatarRef.current, faceLandmarks, poseLandmarks);
    }
  }, [faceLandmarks, poseLandmarks]);

  const createSimsStyleAvatar = (scene, config) => {
    const avatar = new THREE.Group();
    avatar.userData.parts = {};

    const isFemale = config.gender === 'female';
    const skinColor = new THREE.Color(config.skinColor || '#ffd4b3');
    const hairColor = new THREE.Color(config.hairColor || '#4a3728');

    let bodyScale = 1;
    if (config.bodyType === 'magro') bodyScale = 0.88;
    else if (config.bodyType === 'atletico') bodyScale = 1.12;
    else if (config.bodyType === 'plus') bodyScale = 1.28;

    // ===== HEAD =====
    const headGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ 
      color: skinColor,
      roughness: 0.6,
      metalness: 0.05
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    head.castShadow = true;
    head.receiveShadow = true;
    avatar.add(head);
    avatar.userData.parts.head = head;

    // ===== HAIR =====
    if (config.hairStyle !== 'none') {
      let hairGeo;
      const hairMat = new THREE.MeshStandardMaterial({ 
        color: hairColor,
        roughness: 0.7
      });
      
      if (isFemale) {
        if (config.hairStyle === 'long') {
          hairGeo = new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.9);
          const hair = new THREE.Mesh(hairGeo, hairMat);
          hair.position.y = 1.75;
          hair.castShadow = true;
          avatar.add(hair);
          
          // Long hair back
          const backHairGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.9, 16);
          const backHair = new THREE.Mesh(backHairGeo, hairMat);
          backHair.position.set(0, 1.2, -0.15);
          backHair.castShadow = true;
          avatar.add(backHair);
        } else if (config.hairStyle === 'bun') {
          hairGeo = new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
          const hair = new THREE.Mesh(hairGeo, hairMat);
          hair.position.y = 1.75;
          hair.castShadow = true;
          avatar.add(hair);
          
          const bunGeo = new THREE.SphereGeometry(0.14, 16, 16);
          const bun = new THREE.Mesh(bunGeo, hairMat);
          bun.position.set(0, 1.95, -0.25);
          bun.castShadow = true;
          avatar.add(bun);
        } else {
          hairGeo = new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
          const hair = new THREE.Mesh(hairGeo, hairMat);
          hair.position.y = 1.75;
          hair.castShadow = true;
          avatar.add(hair);
        }
      } else {
        hairGeo = new THREE.SphereGeometry(0.33, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 1.75;
        hair.castShadow = true;
        avatar.add(hair);
      }
    }

    // ===== FACIAL FEATURES =====
    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const eyeIrisMat = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0x4a90e2 : 0x2e5c3a,
      roughness: 0.2,
      metalness: 0.1
    });
    
    const createEye = (x) => {
      const eyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eyeWhite.position.set(x, 1.76, 0.28);
      eyeWhite.scale.set(1.1, 0.9, 1);
      avatar.add(eyeWhite);
      
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), eyeIrisMat);
      iris.position.set(x, 1.76, 0.31);
      avatar.add(iris);
      
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), new THREE.MeshStandardMaterial({ color: 0x000000 }));
      pupil.position.set(x, 1.76, 0.32);
      avatar.add(pupil);
      
      if (isFemale) {
        const lashGeo = new THREE.BoxGeometry(0.08, 0.018, 0.01);
        const lashMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const lash = new THREE.Mesh(lashGeo, lashMat);
        lash.position.set(x, 1.745, 0.31);
        avatar.add(lash);
      }
    };
    
    createEye(-0.14);
    createEye(0.14);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.15, 0.025, 0.02);
    const browMat = new THREE.MeshStandardMaterial({ color: hairColor });
    [-0.14, 0.14].forEach(x => {
      const brow = new THREE.Mesh(browGeo, browMat);
      brow.position.set(x, 1.84, 0.29);
      if (x < 0) brow.rotation.z = 0.05;
      else brow.rotation.z = -0.05;
      avatar.add(brow);
    });

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.048, 0.14, 8);
    const noseMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.65 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = Math.PI;
    nose.position.set(0, 1.68, 0.31);
    nose.castShadow = true;
    avatar.add(nose);

    // Mouth
    const mouthGeo = new THREE.BoxGeometry(0.18, 0.045, 0.035);
    const mouthMat = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0xff6b9d : 0xcc5577,
      roughness: 0.4
    });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.58, 0.3);
    avatar.add(mouth);

    // ===== NECK =====
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.28, 16);
    const neckMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.y = 1.38;
    neck.castShadow = true;
    avatar.add(neck);
    avatar.userData.parts.neck = neck;

    // ===== TORSO =====
    const torsoGeo = isFemale 
      ? new THREE.CylinderGeometry(0.28 * bodyScale, 0.35 * bodyScale, 0.75, 24)
      : new THREE.CylinderGeometry(0.32 * bodyScale, 0.35 * bodyScale, 0.75, 24);
    const torsoMat = new THREE.MeshStandardMaterial({ 
      color: isFemale ? 0x1a1a1a : 0x3a5f8f,
      roughness: 0.7
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.9;
    torso.castShadow = true;
    torso.receiveShadow = true;
    avatar.add(torso);
    avatar.userData.parts.torso = torso;

    // ===== ARMS & FOREARMS =====
    const createArm = (side) => {
      const x = side * 0.38 * bodyScale;
      
      // Upper arm
      const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.7, 16);
      const armMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
      const upperArm = new THREE.Mesh(upperArmGeo, armMat);
      upperArm.position.set(x, 0.9, 0);
      upperArm.castShadow = true;
      avatar.add(upperArm);
      avatar.userData.parts[`upperArm_${side > 0 ? 'R' : 'L'}`] = upperArm;
      
      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.65, 16);
      const forearm = new THREE.Mesh(forearmGeo, armMat);
      forearm.position.set(x, 0.2, 0);
      forearm.castShadow = true;
      avatar.add(forearm);
      avatar.userData.parts[`forearm_${side > 0 ? 'R' : 'L'}`] = forearm;
      
      // Hand
      const handGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const hand = new THREE.Mesh(handGeo, armMat);
      hand.position.set(x, -0.15, 0);
      hand.castShadow = true;
      avatar.add(hand);
      avatar.userData.parts[`hand_${side > 0 ? 'R' : 'L'}`] = hand;
    };
    
    createArm(-1);
    createArm(1);

    // ===== LEGS & FEET =====
    const createLeg = (side) => {
      const x = side * 0.16 * bodyScale;
      
      const legGeo = isFemale
        ? new THREE.CylinderGeometry(0.095, 0.088, 1.0, 16)
        : new THREE.CylinderGeometry(0.105, 0.1, 1.0, 16);
      const legMat = new THREE.MeshStandardMaterial({ 
        color: isFemale ? skinColor : 0x2c3e50,
        roughness: isFemale ? 0.6 : 0.8
      });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, -0.05, 0);
      leg.castShadow = true;
      avatar.add(leg);
      avatar.userData.parts[`leg_${side > 0 ? 'R' : 'L'}`] = leg;
      
      // Foot
      const footGeo = new THREE.BoxGeometry(0.13, 0.09, 0.24);
      const footMat = new THREE.MeshStandardMaterial({ 
        color: isFemale ? 0x1a1a1a : 0x1a1a1a,
        roughness: 0.9
      });
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(x, -0.52, 0.07);
      foot.castShadow = true;
      avatar.add(foot);
      avatar.userData.parts[`foot_${side > 0 ? 'R' : 'L'}`] = foot;
    };
    
    createLeg(-1);
    createLeg(1);

    scene.add(avatar);
    return avatar;
  };

  const updateAvatarPoseRealtime = (avatar, faceLandmarks, poseLandmarks) => {
    if (!avatar || !poseLandmarks || poseLandmarks.length < 33) return;

    const parts = avatar.userData.parts;
    const getLM = (idx) => poseLandmarks[idx];

    // CABEÇA - Movimento completo em 3 eixos
    if (parts.head && poseLandmarks[0]) {
      const nose = getLM(0);
      const leftEar = getLM(7);
      const rightEar = getLM(8);
      
      if (nose && leftEar && rightEar) {
        // Yaw (rotação Y) - virar cabeça esquerda/direita
        const headYaw = (nose.x - 0.5) * -1.2;
        
        // Pitch (rotação X) - inclinar cabeça cima/baixo  
        const headPitch = (nose.y - 0.5) * 0.8;
        
        // Roll (rotação Z) - inclinar cabeça lateralmente
        const headRoll = (rightEar.y - leftEar.y) * 2.5;
        
        parts.head.rotation.set(headPitch, headYaw, headRoll);
      }
    }

    // PESCOÇO - Acompanha sutilmente a cabeça
    if (parts.neck && parts.head) {
      parts.neck.rotation.x = parts.head.rotation.x * 0.3;
      parts.neck.rotation.y = parts.head.rotation.y * 0.5;
      parts.neck.rotation.z = parts.head.rotation.z * 0.4;
    }

    // TORSO - Responde à postura geral
    const leftShoulder = getLM(11);
    const rightShoulder = getLM(12);
    const leftHip = getLM(23);
    const rightHip = getLM(24);
    
    if (parts.torso && leftShoulder && rightShoulder) {
      // Inclinação lateral
      const shoulderTilt = (rightShoulder.y - leftShoulder.y) * 2;
      
      // Rotação
      const shoulderCenter = (leftShoulder.x + rightShoulder.x) / 2;
      const torsoRotation = (shoulderCenter - 0.5) * 0.6;
      
      // Inclinação frente/trás
      const shoulderDepth = (leftShoulder.z + rightShoulder.z) / 2;
      const torsoPitch = (shoulderDepth + 0.5) * 0.4;
      
      parts.torso.rotation.set(torsoPitch, torsoRotation, shoulderTilt);
    }

    // BRAÇOS - Movimento completo e natural
    const leftElbow = getLM(13);
    const leftWrist = getLM(15);
    const rightElbow = getLM(14);
    const rightWrist = getLM(16);

    // Braço esquerdo superior
    if (parts.upperArm_L && leftShoulder && leftElbow) {
      const dx = leftElbow.x - leftShoulder.x;
      const dy = leftElbow.y - leftShoulder.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.upperArm_L.rotation.z = angle;
      
      // Rotação para frente/trás
      const dz = leftElbow.z - leftShoulder.z;
      parts.upperArm_L.rotation.x = dz * 2;
    }

    // Antebraço esquerdo
    if (parts.forearm_L && leftElbow && leftWrist) {
      const dx = leftWrist.x - leftElbow.x;
      const dy = leftWrist.y - leftElbow.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.forearm_L.rotation.z = angle;
      
      const dz = leftWrist.z - leftElbow.z;
      parts.forearm_L.rotation.x = dz * 2;
    }

    // Mão esquerda - segue o punho
    if (parts.hand_L && leftWrist) {
      parts.hand_L.rotation.copy(parts.forearm_L?.rotation || new THREE.Euler());
    }

    // Braço direito superior
    if (parts.upperArm_R && rightShoulder && rightElbow) {
      const dx = rightElbow.x - rightShoulder.x;
      const dy = rightElbow.y - rightShoulder.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.upperArm_R.rotation.z = angle;
      
      const dz = rightElbow.z - rightShoulder.z;
      parts.upperArm_R.rotation.x = dz * 2;
    }

    // Antebraço direito
    if (parts.forearm_R && rightElbow && rightWrist) {
      const dx = rightWrist.x - rightElbow.x;
      const dy = rightWrist.y - rightElbow.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.forearm_R.rotation.z = angle;
      
      const dz = rightWrist.z - rightElbow.z;
      parts.forearm_R.rotation.x = dz * 2;
    }

    // Mão direita
    if (parts.hand_R && rightWrist) {
      parts.hand_R.rotation.copy(parts.forearm_R?.rotation || new THREE.Euler());
    }

    // PERNAS - Movimento de quadril e joelho
    const leftKnee = getLM(25);
    const leftAnkle = getLM(27);
    const rightKnee = getLM(26);
    const rightAnkle = getLM(28);

    // Perna esquerda
    if (parts.leg_L && leftHip && leftKnee) {
      const dx = leftKnee.x - leftHip.x;
      const dy = leftKnee.y - leftHip.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.leg_L.rotation.z = angle * 0.5; // Movimento mais sutil
      
      const dz = leftKnee.z - leftHip.z;
      parts.leg_L.rotation.x = dz * 1.5;
    }

    // Pé esquerdo
    if (parts.foot_L && leftKnee && leftAnkle) {
      const dy = leftAnkle.y - leftKnee.y;
      parts.foot_L.rotation.x = dy * 0.8;
    }

    // Perna direita
    if (parts.leg_R && rightHip && rightKnee) {
      const dx = rightKnee.x - rightHip.x;
      const dy = rightKnee.y - rightHip.y;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      parts.leg_R.rotation.z = angle * 0.5;
      
      const dz = rightKnee.z - rightHip.z;
      parts.leg_R.rotation.x = dz * 1.5;
    }

    // Pé direito
    if (parts.foot_R && rightKnee && rightAnkle) {
      const dy = rightAnkle.y - rightKnee.y;
      parts.foot_R.rotation.x = dy * 0.8;
    }
  };

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px', background: 'linear-gradient(180deg, #b2d8ff 0%, #e8f4ff 100%)' }}
    />
  );
}