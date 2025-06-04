// components/FaceEmotionDetector.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ⭐️ TensorFlow.js 코어 및 백엔드 모듈 임포트 추가
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu'; // CPU 백엔드 임포트
import '@tensorflow/tfjs-backend-webgl'; // WebGL 백엔드 임포트

// 새로 생성한 타입과 유틸리티 함수 임포트
import { FaceExpressions, CustomMoodScores } from '@/types/emotion';
import { mapEmotionsToMoodSync } from '@/hooks/emotionMapper';

interface FaceEmotionDetectorProps {
  onEmotionDetected: (moodScores: CustomMoodScores | null) => void;
}

export default function FaceEmotionDetector({ onEmotionDetected }: FaceEmotionDetectorProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [mappedMoods, setMappedMoods] = useState<CustomMoodScores | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const MODEL_URL = '/models'; // public/models 폴더 경로

  // 모델 로드 및 TensorFlow.js 백엔드 초기화
  useEffect(() => {
    const loadModels = async () => {
      try {
        // ⭐️ TensorFlow.js 백엔드 초기화 시도 (WebGL 먼저 시도, 실패 시 CPU 전환)
        try {
          await tf.setBackend('webgl'); // WebGL 백엔드를 명시적으로 설정
          await tf.ready(); // 백엔드가 준비될 때까지 기다림
          console.log('TensorFlow.js 백엔드 (WebGL) 초기화 성공.');
        } catch (backendError) {
          // WebGL 초기화 실패 시 CPU 백엔드를 시도
          console.warn('WebGL 백엔드 초기화 실패, CPU 백엔드로 전환 시도:', backendError);
          await tf.setBackend('cpu'); // CPU 백엔드로 설정
          await tf.ready(); // CPU 백엔드가 준비될 때까지 기다림
          console.log('TensorFlow.js 백엔드 (CPU) 초기화 성공 (대체 모드).');
          setErrorMessage('WebGL을 사용할 수 없어 CPU 모드로 실행됩니다. 분석 속도가 저하될 수 있습니다.');
        }

        // 백엔드가 성공적으로 초기화된 후에 face-api.js 모델 로드
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        // 필요한 경우 다른 모델도 로드: await faceapi.nets.faceLandmarkNet.loadFromUri(MODEL_URL);
        setLoadingModels(false);
        console.log('Face-API models loaded successfully!');
      } catch (error) {
        console.error('Failed to load face-api models or initialize TensorFlow.js backend:', error);
        setErrorMessage('얼굴 인식 모델 또는 TensorFlow.js 백엔드를 로드하는 데 실패했습니다. 콘솔을 확인해주세요.');
        setLoadingModels(false); // 로딩 상태 해제
      }
    };
    loadModels();
  }, []); // 빈 배열로 한 번만 실행되도록 설정

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorMessage(null); // 에러 메시지 초기화
      setMappedMoods(null); // 이전 감정 결과 초기화
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 얼굴 감지 및 감정 판별
  const detectFaceAndEmotion = async () => {
    // 모델 로딩 중이거나 이미지가 없으면 분석을 시작하지 않음
    if (!imageRef.current || loadingModels) {
      // 이미지 소스가 없는데 분석을 시도하면 에러 메시지를 표시
      if (!imageSrc) {
        setErrorMessage('이미지를 먼저 업로드해주세요.');
      } else if (loadingModels) {
        setErrorMessage('모델 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }

    setMappedMoods(null); // 새로운 분석 시작 전 결과 초기화
    setErrorMessage(null); // 이전 에러 메시지 초기화

    const displaySize = { width: imageRef.current.width, height: imageRef.current.height };
    // 캔버스 크기를 이미지 크기에 맞춥니다.
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

        // face-api.js의 감정 표현을 가져와 CustomMoodScores로 매핑합니다.
        const expressions: FaceExpressions = resizedDetections.expressions;
        const customMoodScores = mapEmotionsToMoodSync(expressions);

        setMappedMoods(customMoodScores); // 매핑된 감정 스코어 상태 업데이트
        onEmotionDetected(customMoodScores); // 부모 컴포넌트로 매핑된 감정 스코어 전달

        console.log("Detected Mood Scores:", customMoodScores);

      } else {
        setErrorMessage('사진에서 사람 얼굴을 찾을 수 없습니다.');
        onEmotionDetected(null);
      }
    } catch (error) {
      console.error('Error during face detection/emotion analysis:', error);
      setErrorMessage('얼굴 분석 중 오류가 발생했습니다. (자세한 내용은 콘솔 확인)');
      onEmotionDetected(null);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-4 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-purple-700">얼굴 감정 분석</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingModels && <p className="text-center text-blue-500 mb-4">모델 로딩 중...</p>}
        {errorMessage && <p className="text-center text-red-500 mb-4">{errorMessage}</p>}

        <div className="flex flex-col items-center space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loadingModels}
            className="file:text-blue-600 file:font-semibold file:bg-blue-100 file:border-none file:rounded-md file:py-2 file:px-4 hover:file:bg-blue-200"
          />

          {imageSrc && (
            <div className="relative border-2 border-purple-300 rounded-lg overflow-hidden shadow-md">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Uploaded for analysis"
                onLoad={detectFaceAndEmotion} // 이미지 로드 완료 시 분석 실행
                className="max-w-full h-auto block object-contain"
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
            <Button
              onClick={detectFaceAndEmotion}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              다시 감정 분석하기
            </Button>
          )}

          {mappedMoods && (
            <div className="text-center mt-4 w-full">
              <p className="text-lg font-semibold mb-2 text-gray-800">감지된 무드 스코어:</p>
              <div className="grid grid-cols-2 gap-2 text-left">
                {/* THIS IS THE CORRECT WAY TO RENDER AN OBJECT */}
                {Object.entries(mappedMoods).map(([mood, score]) => (
                  <div key={mood} className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm">
                    <span className="font-medium text-gray-700">{mood}:</span>
                    <span className="text-blue-600 font-bold">{(score).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}