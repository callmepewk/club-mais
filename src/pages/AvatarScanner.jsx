import React, { useRef, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Camera, CameraOff, Download, Save, RotateCcw, 
  CheckCircle, AlertCircle, User, Sparkles
} from "lucide-react";

export default function AvatarScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [holistic, setHolistic] = useState(null);
  const [status, setStatus] = useState("Pronto para iniciar");
  const [isScanning, setIsScanning] = useState(false);
  const [lastPolygons, setLastPolygons] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: existingAvatar } = useQuery({
    queryKey: ['user-avatar', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const avatars = await base44.entities.AvatarData.filter({ user_email: user.email });
      return avatars.length > 0 ? avatars[0] : null;
    },
    enabled: !!user?.email,
  });

  const saveAvatarMutation = useMutation({
    mutationFn: async (avatarData) => {
      if (existingAvatar) {
        return base44.entities.AvatarData.update(existingAvatar.id, avatarData);
      }
      return base44.entities.AvatarData.create(avatarData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar'] });
    },
  });

  // Utility functions
  const fitCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.style.width = video.offsetWidth + 'px';
    canvas.style.height = video.offsetHeight + 'px';
  };

  const lmToPixel = (lm, canvas) => {
    return { 
      x: lm.x * canvas.width, 
      y: lm.y * canvas.height, 
      z: lm.z ?? 0 
    };
  };

  const lmListToNormalized = (landmarks) => {
    return landmarks.map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
  };

  const convexHull = (points) => {
    if (points.length <= 3) return points.map((_, i) => i);
    const pts = points.map((p, i) => ({ x: p.x, y: p.y, i }));
    pts.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (const p of pts) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    const hull = lower.slice(0, lower.length - 1).concat(upper.slice(0, upper.length - 1));
    return Array.from(new Set(hull.map(h => h.i)));
  };

  const drawPolygon = (ctx, points, style = {}) => {
    const defaults = { 
      stroke: '#00c2a8', 
      fill: 'rgba(0,210,168,0.06)', 
      lineWidth: 2 
    };
    const s = { ...defaults, ...style };
    
    if (!points || points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = s.fill;
    ctx.fill();
    ctx.lineWidth = s.lineWidth;
    ctx.strokeStyle = s.stroke;
    ctx.stroke();
  };

  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results) return;

    const ctx = canvas.getContext('2d');
    fitCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pose = results.poseLandmarks || null;
    const face = results.faceLandmarks || null;

    // Draw pose keypoints
    if (pose) {
      for (const lm of pose) {
        const p = lmToPixel(lm, canvas);
        ctx.fillStyle = 'rgba(0,200,255,0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Face polygon
    let facePoly = [];
    if (face && face.length > 0) {
      const facePixels = face.map(lm => lmToPixel(lm, canvas));
      const hullIdx = convexHull(facePixels);
      facePoly = hullIdx.map(i => ({ x: face[i].x, y: face[i].y, z: face[i].z ?? 0 }));
      const facePixForDraw = hullIdx.map(i => facePixels[i]);
      drawPolygon(ctx, facePixForDraw, { 
        stroke: '#D4AF37', 
        fill: 'rgba(212,175,55,0.1)', 
        lineWidth: 2 
      });
    }

    const polygons = {
      face: face ? lmListToNormalized(face) : [],
      neck: [],
      torso: [],
      leftArm: [],
      rightArm: [],
      leftLeg: [],
      rightLeg: []
    };

    if (pose) {
      const idx = (i) => pose[i];
      const leftShoulder = idx(11), rightShoulder = idx(12);
      const leftHip = idx(23), rightHip = idx(24);
      const leftElbow = idx(13), leftWrist = idx(15);
      const rightElbow = idx(14), rightWrist = idx(16);
      const leftKnee = idx(25), rightKnee = idx(26);
      const leftAnkle = idx(27), rightAnkle = idx(28);
      const nose = idx(0);

      // Torso
      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        const torsoPixels = [leftShoulder, rightShoulder, rightHip, leftHip].map(lm => lmToPixel(lm, canvas));
        drawPolygon(ctx, torsoPixels, { 
          stroke: '#C8A882', 
          fill: 'rgba(200,168,130,0.08)' 
        });
        polygons.torso = [leftShoulder, rightShoulder, rightHip, leftHip].map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
      }

      // Neck
      if (leftShoulder && rightShoulder && nose) {
        const midShoulder = {
          x: (leftShoulder.x + rightShoulder.x) / 2,
          y: (leftShoulder.y + rightShoulder.y) / 2,
          z: ((leftShoulder.z || 0) + (rightShoulder.z || 0)) / 2
        };
        const neckPoint = {
          x: (midShoulder.x + nose.x) / 2,
          y: (midShoulder.y + nose.y) / 2,
          z: (midShoulder.z + (nose.z || 0)) / 2
        };
        const neckPixel = lmToPixel(neckPoint, canvas);
        ctx.fillStyle = 'rgba(212,175,55,0.9)';
        ctx.beginPath();
        ctx.arc(neckPixel.x, neckPixel.y, 4, 0, Math.PI * 2);
        ctx.fill();
        polygons.neck = [{ x: neckPoint.x, y: neckPoint.y, z: neckPoint.z }];
      }

      // Arms
      if (leftShoulder && leftElbow && leftWrist) {
        const leftArmPts = [leftShoulder, leftElbow, leftWrist].map(lm => lmToPixel(lm, canvas));
        drawPolygon(ctx, leftArmPts, { 
          stroke: '#8ecae6', 
          fill: 'rgba(142,202,230,0.04)' 
        });
        polygons.leftArm = [leftShoulder, leftElbow, leftWrist].map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
      }

      if (rightShoulder && rightElbow && rightWrist) {
        const rightArmPts = [rightShoulder, rightElbow, rightWrist].map(lm => lmToPixel(lm, canvas));
        drawPolygon(ctx, rightArmPts, { 
          stroke: '#8ecae6', 
          fill: 'rgba(142,202,230,0.04)' 
        });
        polygons.rightArm = [rightShoulder, rightElbow, rightWrist].map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
      }

      // Legs
      if (leftHip && leftKnee && leftAnkle) {
        const leftLegPts = [leftHip, leftKnee, leftAnkle].map(lm => lmToPixel(lm, canvas));
        drawPolygon(ctx, leftLegPts, { 
          stroke: '#f28482', 
          fill: 'rgba(242,132,130,0.04)' 
        });
        polygons.leftLeg = [leftHip, leftKnee, leftAnkle].map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
      }

      if (rightHip && rightKnee && rightAnkle) {
        const rightLegPts = [rightHip, rightKnee, rightAnkle].map(lm => lmToPixel(lm, canvas));
        drawPolygon(ctx, rightLegPts, { 
          stroke: '#f28482', 
          fill: 'rgba(242,132,130,0.04)' 
        });
        polygons.rightLeg = [rightHip, rightKnee, rightAnkle].map(lm => ({ x: lm.x, y: lm.y, z: lm.z ?? 0 }));
      }
    }

    setLastPolygons({
      meta: {
        width: canvas.width,
        height: canvas.height,
        timestamp: Date.now()
      },
      parts: polygons
    });

    setStatus('Detectado — pronto para salvar');
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        fitCanvas();

        // Load MediaPipe Holistic
        const { Holistic } = window;
        const holisticInstance = new Holistic({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/${file}`;
          }
        });

        holisticInstance.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          refineFaceLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        holisticInstance.onResults(onResults);
        setHolistic(holisticInstance);

        // Feed frames
        const sendFrame = async () => {
          if (holisticInstance && videoRef.current) {
            await holisticInstance.send({ image: videoRef.current });
            if (mediaStream.active) {
              requestAnimationFrame(sendFrame);
            }
          }
        };
        sendFrame();

        setIsScanning(true);
        setStatus('Câmera ativa — detectando...');
      }
    } catch (err) {
      console.error(err);
      setStatus('Erro ao abrir câmera');
      alert('Necessário permitir acesso à câmera. Erro: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (holistic) {
      holistic.close();
      setHolistic(null);
    }
    setIsScanning(false);
    setStatus('Câmera desligada');
  };

  const handleSave = async () => {
    if (!lastPolygons || !user) {
      alert('Nenhuma captura detectada ou usuário não autenticado');
      return;
    }

    setIsSaving(true);
    try {
      const avatarData = {
        user_email: user.email,
        polygons_data: lastPolygons,
        meta_width: lastPolygons.meta.width,
        meta_height: lastPolygons.meta.height,
        capture_timestamp: new Date(lastPolygons.meta.timestamp).toISOString()
      };

      await saveAvatarMutation.mutateAsync(avatarData);
      setStatus('Avatar salvo com sucesso!');
      alert('Avatar salvo no seu perfil!');
    } catch (error) {
      console.error(error);
      setStatus('Erro ao salvar avatar');
      alert('Erro ao salvar avatar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const exportJSON = () => {
    if (!lastPolygons) {
      alert('Nenhuma captura detectada');
      return;
    }

    const payload = JSON.parse(JSON.stringify(lastPolygons, (k, v) => {
      if (typeof v === 'number') return Number(v.toFixed(6));
      return v;
    }));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Load MediaPipe scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.1/drawing_utils.js'),
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/holistic.js')
    ]).catch(err => {
      console.error('Erro ao carregar MediaPipe:', err);
      setStatus('Erro ao carregar bibliotecas');
    });

    return () => {
      stopCamera();
    };
  }, []);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center p-6">
        <Card className="max-w-md border-[#E8DCC4] shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Você precisa estar autenticado para criar seu avatar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero */}
      <div className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/80 text-[#D4AF37] border-[#D4AF37]/20 px-4 py-2 text-base backdrop-blur-sm mb-4">
              <User className="w-4 h-4 mr-2" />
              Avatar Scanner 3D
            </Badge>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Crie Seu Avatar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Use sua câmera para criar um avatar 3D personalizado com tecnologia de IA
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scanner */}
      <div className="py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] border-b border-[#E8DCC4]">
                <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                  Scanner de Avatar
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Video Stage */}
                <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                  {!isScanning ? (
                    <Button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Iniciar Câmera
                    </Button>
                  ) : (
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      <CameraOff className="w-4 h-4 mr-2" />
                      Parar Câmera
                    </Button>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={!lastPolygons || isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Avatar
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={exportJSON}
                    disabled={!lastPolygons}
                    variant="outline"
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>

                  <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                    {lastPolygons ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{status}</span>
                      </>
                    ) : (
                      <span>{status}</span>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Instruções
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Posicione-se de frente para a câmera</li>
                    <li>• Certifique-se de que seu rosto e corpo estejam bem iluminados</li>
                    <li>• Aguarde os polígonos coloridos aparecerem no seu corpo</li>
                    <li>• Clique em "Salvar Avatar" quando a captura estiver completa</li>
                  </ul>
                </div>

                {/* Existing Avatar Info */}
                {existingAvatar && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Você já possui um avatar salvo
                    </h4>
                    <p className="text-sm text-green-800">
                      Capturado em: {new Date(existingAvatar.capture_timestamp).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Fazer uma nova captura irá substituir o avatar anterior
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}