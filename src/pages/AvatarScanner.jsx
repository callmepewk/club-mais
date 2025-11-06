
import React, { useRef, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Slider is removed as it's not used in the new outline
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Camera, CameraOff, Download, Save, 
  CheckCircle, AlertCircle, User, Sparkles,
  Edit3, MapPin, DollarSign, Locate, Search
} from "lucide-react";
import AvatarPreview3D from "../components/avatar/AvatarPreview3D";

export default function AvatarScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isProcessingRef = useRef(false);
  
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("Pronto para iniciar");
  const [isScanning, setIsScanning] = useState(false);
  const [lastPolygons, setLastPolygons] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const [showEditor, setShowEditor] = useState(false);
  const [avatarEdits, setAvatarEdits] = useState({
    faceShape: 'oval',
    noseShape: 'medium',
    eyeSize: 'medium',
    cheekSize: 'medium',
    mouthSize: 'medium',
    eyebrowStyle: 'normal',
    bodyType: 'medium',
    skinColor: '#f5d1b3', // Added
    hairStyle: 'short',   // Added
    hairColor: '#2b1b10'  // Added
  });
  const [showDrBelezaDialog, setShowDrBelezaDialog] = useState(false);
  const [wantsTreatments, setWantsTreatments] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaire, setQuestionnaire] = useState({
    priceRange: '',
    city: '',
    state: '',
    latitude: '',
    longitude: ''
  });
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);
  const navigate = useNavigate();

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
    // Removed canvas.style.width and canvas.style.height, relying on CSS for display
  };

  const lmToPixel = (lm, canvas) => {
    return { 
      x: lm.x * canvas.width, 
      y: lm.y * canvas.height, 
      z: lm.z ?? 0 
    };
  };

  // lmListToNormalized and convexHull are removed as they are no longer used by the new onResults logic.

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
    if (!isProcessingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !results) return;

    const ctx = canvas.getContext('2d');
    fitCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pose = results.poseLandmarks || null;
    const face = results.faceLandmarks || null;

    // Draw face mesh with golden color
    if (face && face.length > 0) {
      // Draw face contour
      const faceContour = [
        10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
        397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
        172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
      ];
      
      const contourPoints = faceContour.map(i => lmToPixel(face[i], canvas));
      drawPolygon(ctx, contourPoints, {
        stroke: '#D4AF37',
        fill: 'rgba(212,175,55,0.15)',
        lineWidth: 3
      });

      // Draw eyes
      const leftEyeIndices = [33, 160, 158, 133, 153, 144];
      const rightEyeIndices = [362, 385, 387, 263, 373, 380];
      
      const leftEyePoints = leftEyeIndices.map(i => lmToPixel(face[i], canvas));
      const rightEyePoints = rightEyeIndices.map(i => lmToPixel(face[i], canvas));
      
      drawPolygon(ctx, leftEyePoints, { stroke: '#8ecae6', fill: 'rgba(142,202,230,0.2)', lineWidth: 2 });
      drawPolygon(ctx, rightEyePoints, { stroke: '#8ecae6', fill: 'rgba(142,202,230,0.2)', lineWidth: 2 });

      // Draw mouth
      const mouthIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
      const mouthPoints = mouthIndices.map(i => lmToPixel(face[i], canvas));
      drawPolygon(ctx, mouthPoints, { stroke: '#FF6B9D', fill: 'rgba(255,107,157,0.2)', lineWidth: 2 });

      // Draw nose
      const noseIndices = [1, 2, 98, 327];
      const nosePoints = noseIndices.map(i => lmToPixel(face[i], canvas));
      drawPolygon(ctx, nosePoints, { stroke: '#C8A882', fill: 'rgba(200,168,130,0.15)', lineWidth: 2 });
    }

    // Draw pose skeleton
    if (pose && pose.length >= 33) {
      const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
        [11, 23], [12, 24], [23, 24], // Torso
        [23, 25], [25, 27], [24, 26], [26, 28] // Legs
      ];

      connections.forEach(([i, j]) => {
        const pt1 = lmToPixel(pose[i], canvas);
        const pt2 = lmToPixel(pose[j], canvas);
        
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.strokeStyle = '#00c2a8';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Draw joints
      [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach(i => {
        const pt = lmToPixel(pose[i], canvas);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#D4AF37';
        ctx.fill();
      });
    }

    setLastPolygons({
      meta: {
        width: canvas.width,
        height: canvas.height,
        timestamp: Date.now()
      },
      parts: {
        face: face || [],
        pose: pose || []
      }
    });

    setStatus('Detectado — pronto para salvar');
  };

  const startCamera = async () => {
    try {
      setStatus('Iniciando câmera...');
      stopCamera();
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        await videoRef.current.play();
        setStream(mediaStream);
        
        await new Promise(resolve => {
          videoRef.current.onloadedmetadata = () => {
            fitCanvas();
            setStatus('Vídeo carregado, inicializando detecção...');
            resolve();
          };
        });

        if (!window.Holistic) {
          setStatus('Carregando MediaPipe...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!window.Holistic) {
          throw new Error('MediaPipe Holistic não foi carregado. Aguarde e tente novamente.');
        }

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
        holisticRef.current = holisticInstance;
        isProcessingRef.current = true;

        const sendFrame = async () => {
          if (!isProcessingRef.current || !holisticRef.current || !videoRef.current) {
            return;
          }

          try {
            await holisticRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error('Error sending frame:', err);
          }

          if (isProcessingRef.current && mediaStream.active) {
            animationFrameRef.current = requestAnimationFrame(sendFrame);
          }
        };
        
        sendFrame();

        setIsScanning(true);
        setStatus('Câmera ativa — posicione-se e aguarde a detecção...');
      }
    } catch (err) {
      console.error(err);
      setStatus('Erro ao abrir câmera');
      
      let errorMsg = 'Erro ao acessar câmera: ';
      if (err.name === 'NotAllowedError') {
        errorMsg += 'Permissão negada. Por favor, permita o acesso à câmera.';
      } else if (err.name === 'NotFoundError') {
        errorMsg += 'Câmera não encontrada.';
      } else {
        errorMsg += err.message;
      }
      
      alert(errorMsg);
      stopCamera();
    }
  };

  const stopCamera = () => {
    isProcessingRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (holisticRef.current) {
      try {
        holisticRef.current.close();
      } catch (err) {
        console.error('Error closing holistic:', err);
      }
      holisticRef.current = null;
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
        polygons_data: { ...lastPolygons, edits: avatarEdits }, // Include avatarEdits
        meta_width: lastPolygons.meta.width,
        meta_height: lastPolygons.meta.height,
        capture_timestamp: new Date(lastPolygons.meta.timestamp).toISOString()
      };

      await saveAvatarMutation.mutateAsync(avatarData);
      setStatus('Avatar salvo com sucesso!');
      alert('Avatar salvo no seu perfil!');
      setShowEditor(true); // Show editor after saving
      stopCamera();       // Stop camera after saving
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

    const payload = { ...lastPolygons, edits: avatarEdits }; // Include avatarEdits
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTreatmentRecommendations = () => {
    const treatments = new Set();
    
    // Baseado nas edições do avatar, recomendar tratamentos
    if (avatarEdits.faceShape !== 'oval') {
      treatments.add('Harmonização Facial (HOF)');
      treatments.add('Bioestimuladores de Colágeno');
    }
    
    if (avatarEdits.noseShape !== 'medium') {
      treatments.add('Preenchimento Facial');
      treatments.add('Rinoplastia');
    }
    
    if (avatarEdits.cheekSize !== 'medium') {
      treatments.add('Preenchimento de Maçãs do Rosto');
      treatments.add('Ácido Hialurônico');
    }
    
    if (avatarEdits.mouthSize !== 'medium') {
      treatments.add('Preenchimento Labial');
      treatments.add('Micropigmentação Labial');
    }
    
    if (avatarEdits.eyebrowStyle !== 'normal') {
      treatments.add('Design de Sobrancelhas');
      treatments.add('Micropigmentação Fio a Fio');
    }
    
    if (avatarEdits.bodyType !== 'medium') {
      treatments.add('Criolipólise');
      treatments.add('Radiofrequência Corporal');
      treatments.add('Tratamento de Flacidez');
    }
    
    return Array.from(treatments);
  };

  const handleSaveEdits = () => {
    const treatments = getTreatmentRecommendations();
    if (treatments.length > 0) {
      setRecommendedTreatments(treatments);
      setShowDrBelezaDialog(true);
      setShowQuestionnaire(false); // Reset questionnaire state
    } else {
      alert('Nenhuma mudança significativa detectada. Avatar salvo!'); // New alert
      handleSave(); // Automatically save if no treatments are recommended
    }
  };

  const handleWantsTreatments = (wants) => {
    setWantsTreatments(wants);
    if (wants) {
      setShowQuestionnaire(true);
    } else {
      setShowDrBelezaDialog(false);
      handleSave(); // Automatically save if user declines treatments
    }
  };

  const getCityFromCoordinates = async (latitude, longitude) => {
    // This is a placeholder. In a real app, you'd use a reverse geocoding API.
    // Example with Nominatim (OpenStreetMap):
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || '';
        const state = data.address.state || '';
        return { city, state };
    } catch (error) {
        console.error("Error fetching city from coordinates:", error);
        return { city: "", state: "" }; // Fallback to empty strings
    }
  };

  const getUserLocationForTreatment = async () => {
    if (navigator.geolocation) {
      setStatus("Obtendo sua localização...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { city, state } = await getCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          
          setQuestionnaire(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            city: city,
            state: state.substring(0, 2).toUpperCase()
          }));
          setStatus("Localização obtida!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setStatus("Erro ao obter localização.");
          alert("Não foi possível obter sua localização. Por favor, insira manualmente.");
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  const handleSearchTreatments = () => {
    if (!recommendedTreatments.length) {
      alert("Nenhum tratamento recomendado para buscar.");
      return;
    }
    
    handleSave(); // Save edits before navigating to Dr. Beleza
    
    // Use the first recommended treatment as the primary search term
    const treatmentQuery = recommendedTreatments[0]; 
    navigate(createPageUrl("DrBeleza"), {
      state: {
        treatment: treatmentQuery,
        city: questionnaire.city,
        state: questionnaire.state,
        budget: questionnaire.priceRange,
        autoSearch: true
      }
    });
    setShowDrBelezaDialog(false); // Close the dialog after navigating
  };

  useEffect(() => {
    // Load MediaPipe scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    setStatus('Carregando bibliotecas MediaPipe...');
    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.1/drawing_utils.js'),
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/holistic.js')
    ]).then(() => {
      setStatus('✓ Pronto! Clique em "Iniciar Câmera" para começar.');
    }).catch(err => {
      console.error('Erro ao carregar MediaPipe:', err);
      setStatus('❌ Erro ao carregar bibliotecas. Recarregue a página.');
    });

    // Cleanup on unmount
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
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Camera/Editor */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] border-b border-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    {showEditor ? 'Editor de Avatar' : 'Scanner de Avatar'}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {!showEditor ? (
                    <>
                      {/* Video Stage */}
                      <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
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
                        
                        {!isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="text-center text-white space-y-3 p-6">
                              <Camera className="w-16 h-16 mx-auto mb-4" />
                              <p className="text-xl font-semibold">Câmera Desligada</p>
                              <p className="text-sm opacity-80">Clique em "Iniciar Câmera" para começar</p>
                            </div>
                          </div>
                        )}
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
                      </div>

                      {/* Status */}
                      <div className={`p-4 rounded-lg text-center ${
                        lastPolygons ? 'bg-green-50 border border-green-200' : 
                        isScanning ? 'bg-blue-50 border border-blue-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center justify-center gap-2">
                          {lastPolygons ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : isScanning ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                          )}
                          <span className={`font-medium ${
                            lastPolygons ? 'text-green-800' : 
                            isScanning ? 'text-blue-800' : 
                            'text-gray-700'
                          }`}>
                            {status}
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Instruções
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Permita o acesso à câmera quando solicitado</li>
                          <li>• Posicione-se de frente para a câmera com boa iluminação</li>
                          <li>• Aguarde os polígonos coloridos aparecerem em seu rosto e corpo</li>
                          <li>• Quando aparecer "Detectado — pronto para salvar", clique em "Salvar Avatar"</li>
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
                    </>
                  ) : (
                    <>
                      {/* Avatar Preview 3D */}
                      <div className="relative w-full aspect-square bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6] rounded-xl overflow-hidden shadow-inner">
                        <AvatarPreview3D avatarEdits={avatarEdits} />
                      </div>

                      {/* Editor Controls */}
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2"> {/* Added max-h and overflow */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Formato do Rosto</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.faceShape} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, faceShape: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="oval">Oval</SelectItem>
                                <SelectItem value="redondo">Redondo</SelectItem>
                                <SelectItem value="quadrado">Quadrado</SelectItem>
                                <SelectItem value="triangular">Triangular</SelectItem>
                                <SelectItem value="alongado">Alongado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Formato do Nariz</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.noseShape} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, noseShape: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fino">Fino</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="largo">Largo</SelectItem>
                                <SelectItem value="arrebitado">Arrebitado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Tamanho dos Olhos</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.eyeSize} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, eyeSize: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pequeno">Pequeno</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="grande">Grande</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Bochechas</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.cheekSize} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, cheekSize: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fino">Fino</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="volumoso">Volumoso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Tamanho da Boca</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.mouthSize} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, mouthSize: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pequena">Pequena</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="grande">Grande</SelectItem>
                                <SelectItem value="volumosa">Volumosa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Sobrancelhas</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.eyebrowStyle} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, eyebrowStyle: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Natural</SelectItem>
                                <SelectItem value="arqueada">Arqueada</SelectItem>
                                <SelectItem value="reta">Reta</SelectItem>
                                <SelectItem value="fina">Fina</SelectItem>
                                <SelectItem value="grossa">Grossa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Tipo de Corpo</Label> {/* Label size updated */}
                            <Select 
                              value={avatarEdits.bodyType} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, bodyType: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="magro">Magro</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="atletico">Atlético</SelectItem>
                                <SelectItem value="plus">Plus Size</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Estilo de Cabelo</Label> {/* NEW */}
                            <Select 
                              value={avatarEdits.hairStyle} 
                              onValueChange={(value) => setAvatarEdits({...avatarEdits, hairStyle: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="short">Curto</SelectItem>
                                <SelectItem value="long">Longo</SelectItem>
                                <SelectItem value="bun">Coque</SelectItem>
                                <SelectItem value="none">Sem cabelo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Cor da Pele</Label> {/* NEW */}
                            <Input
                              type="color"
                              value={avatarEdits.skinColor}
                              onChange={(e) => setAvatarEdits({...avatarEdits, skinColor: e.target.value})}
                              className="h-10 cursor-pointer"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Cor do Cabelo</Label> {/* NEW */}
                            <Input
                              type="color"
                              value={avatarEdits.hairColor}
                              onChange={(e) => setAvatarEdits({...avatarEdits, hairColor: e.target.value})}
                              className="h-10 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => setShowEditor(false)}
                          variant="outline"
                          className="flex-1 border-[#E8DCC4]"
                        >
                          Voltar ao Scanner
                        </Button>
                        <Button
                          onClick={handleSaveEdits}
                          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Avatar Display & Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Captured Avatar Display */}
              {existingAvatar && (
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Seu Avatar Capturado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative w-full aspect-square bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6] rounded-xl overflow-hidden shadow-inner">
                      {/* Updated AvatarPreview3D prop */}
                      <AvatarPreview3D avatarEdits={existingAvatar.polygons_data?.edits || avatarEdits} />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/90 text-gray-800">
                          Capturado em: {new Date(existingAvatar.capture_timestamp).toLocaleString('pt-BR')}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowEditor(true)}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Avatar
                    </Button>
                  </CardContent>
                </Card>
              )}
               {!existingAvatar && (
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Nenhum Avatar Salvo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Capture seu avatar com a câmera para começar a editar e explorar tratamentos!
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dr. Beleza Dialog */}
      <AnimatePresence>
        {showDrBelezaDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDrBelezaDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" {/* Added max-h and overflow */}
            >
              <Card className="border-[#E8DCC4] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                        alt="Dr. Beleza"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif">Dr. Beleza</CardTitle>
                      <p className="text-white/90">Seu Assistente de Beleza</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {!showQuestionnaire ? (
                    <>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-800">
                          Olá! Notei que você fez algumas alterações no seu avatar. 
                          Gostaria de conhecer tratamentos estéticos que podem te ajudar a alcançar esse visual?
                        </p>

                        <div className="bg-[#F5EFE6] rounded-lg p-4">
                          <p className="font-semibold text-gray-800 mb-2">Tratamentos Recomendados:</p>
                          <ul className="space-y-2">
                            {recommendedTreatments.length > 0 ? (
                              recommendedTreatments.map((treatment, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700">
                                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                  {treatment}
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-700">Nenhum tratamento específico recomendado.</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleWantsTreatments(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Não, obrigado
                        </Button>
                        <Button
                          onClick={() => handleWantsTreatments(true)}
                          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                        >
                          Sim, quero saber mais!
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-800 font-semibold">
                          Ótimo! Vamos encontrar os melhores profissionais para você:
                        </p>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Faixa de Investimento</Label>
                            <Select 
                              value={questionnaire.priceRange} 
                              onValueChange={(value) => setQuestionnaire({...questionnaire, priceRange: value})}
                            >
                              <SelectTrigger className="border-[#E8DCC4]">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Até R$ 500">Até R$ 500</SelectItem>
                                <SelectItem value="R$ 500 - R$ 1.000">R$ 500 - R$ 1.000</SelectItem>
                                <SelectItem value="R$ 1.000 - R$ 2.000">R$ 1.000 - R$ 2.000</SelectItem>
                                <SelectItem value="R$ 2.000 - R$ 5.000">R$ 2.000 - R$ 5.000</SelectItem>
                                <SelectItem value="Acima de R$ 5.000">Acima de R$ 5.000</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Locate className="w-4 h-4 text-[#D4AF37]" />
                              Localização
                            </Label>
                            <Button
                              onClick={getUserLocationForTreatment}
                              variant="outline"
                              className="w-full border-[#E8DCC4]"
                            >
                              <Locate className="w-4 h-4 mr-2" />
                              Usar Minha Localização
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Cidade</Label>
                              <Input
                                value={questionnaire.city}
                                onChange={(e) => setQuestionnaire({...questionnaire, city: e.target.value})}
                                placeholder="Sua cidade"
                                className="border-[#E8DCC4]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Estado</Label>
                              <Input
                                value={questionnaire.state}
                                onChange={(e) => setQuestionnaire({...questionnaire, state: e.target.value})}
                                placeholder="UF"
                                maxLength={2}
                                className="border-[#E8DCC4]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setShowQuestionnaire(false);
                            setWantsTreatments(null);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={handleSearchTreatments}
                          disabled={!questionnaire.priceRange || !questionnaire.city || !questionnaire.state}
                          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white disabled:opacity-50"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Buscar Tratamentos
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
