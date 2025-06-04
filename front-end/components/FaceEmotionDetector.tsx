// components/FaceEmotionDetector.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Input } from '@/components/ui/input'; // 예를 들어 shadcn/ui Input 사용
import { Button } from '@/components/ui/button'; // 예를 들어 shadcn/ui Button 사용
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FaceEmotionDetectorProps {
  onEmotionDetected: (emotion: string | null, score: number | null) => void;
}

export default function FaceEmotionDetector({ onEmotionDetected }: FaceEmotionDetectorProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [emotionScore, setEmotionScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const MODEL_URL = '/models'; // public/models 폴더 경로

  // 모델 로드
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        // 필요한 경우 다른 모델도 로드: await faceapi.nets.faceLandmarkNet.loadFromUri(MODEL_URL);
        setLoadingModels(false);
        console.log('Face-API models loaded successfully!');
      } catch (error) {
        console.error('Failed to load face-api models:', error);
        setErrorMessage('얼굴 인식 모델을 로드하는 데 실패했습니다.');
      }
    };
    loadModels();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorMessage(null); // 에러 메시지 초기화
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 얼굴 감지 및 감정 판별
  const detectFaceAndEmotion = async () => {
    if (!imageRef.current || loadingModels) {
      setErrorMessage('모델 로딩 중이거나 이미지가 없습니다.');
      return;
    }

    setDetectedEmotion(null);
    setEmotionScore(null);
    setErrorMessage(null);

    const displaySize = { width: imageRef.current.width, height: imageRef.current.height };
    faceapi.matchDimensions(canvasRef.current!, displaySize);

    try {
      const detections = await faceapi.detectSingleFace(
        imageRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      if (detections) {
        // 얼굴이 감지되었는지 확인
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current!.getContext('2d');
        ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // 기존 그림 지우기
        faceapi.draw.drawDetections(canvasRef.current!, resizedDetections); // 얼굴 주변 사각형 그리기

        const expressions = resizedDetections.expressions;
        const sortedExpressions = Object.entries(expressions).sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number));

        if (sortedExpressions.length > 0) {
          const [emotion, score] = sortedExpressions[0];
          setDetectedEmotion(emotion);
          setEmotionScore(score as number);
          onEmotionDetected(emotion, score as number); // 부모 컴포넌트로 감정 전달
          console.log(`Detected emotion: <span class="math-inline">\{emotion\} \(</span>{(score as number * 100).toFixed(2)}%)`);
        } else {
          setErrorMessage('감정을 판별할 수 없습니다.');
          onEmotionDetected(null, null);
        }
      } else {
        setErrorMessage('사진에서 사람 얼굴을 찾을 수 없습니다.');
        onEmotionDetected(null, null);
      }
    } catch (error) {
      console.error('Error during face detection/emotion analysis:', error);
      setErrorMessage('얼굴 분석 중 오류가 발생했습니다.');
      onEmotionDetected(null, null);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">얼굴 감정 분석</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingModels && <p className="text-center text-blue-500">모델 로딩 중...</p>}
        {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

        <div className="flex flex-col items-center space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loadingModels}
          />

          {imageSrc && (
            <div className="relative border-2 border-gray-300 rounded-md overflow-hidden">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Uploaded for analysis"
                onLoad={detectFaceAndEmotion} // 이미지 로드 완료 시 분석 실행
                className="max-w-full h-auto block"
                style={{ maxWidth: '300px', maxHeight: '300px' }} // 이미지 크기 제한
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                style={{ display: imageSrc ? 'block' : 'none' }}
              />
            </div>
          )}

          {imageSrc && !loadingModels && (
            <Button onClick={detectFaceAndEmotion}>
              다시 감정 분석하기
            </Button>
          )}

          {detectedEmotion && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">감지된 감정: <span className="text-purple-600">{detectedEmotion}</span></p>
              <p className="text-sm text-gray-600">확신도: {(emotionScore! * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}