const express = require('express');
const cors = require('cors');
const tf = require('@tensorflow/tfjs');
const axios = require('axios');

const app = express();
const port = 4000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 전역 모델 변수
let model = null;
let isModelTrained = false;

// 모델 생성
function createModel() {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({
                inputShape: [2],
                units: 4,
                activation: 'relu'
            }),
            tf.layers.dense({
                units: 1,
                activation: 'sigmoid'
            })
        ]
    });
    
    model.compile({
        optimizer: tf.train.adam(0.1),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });
    
    return model;
}

// 데이터 정규화 (오류 처리 추가)
function normalizeData(data) {
    // null 체크 추가
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('훈련 데이터가 비어있거나 올바르지 않습니다');
    }
    
    console.log('정규화할 데이터:', data);
    
    const tensor = tf.tensor2d(data);
    const min = tensor.min(0);
    const max = tensor.max(0);
    const normalized = tensor.sub(min).div(max.sub(min));
    return { normalized, min, max };
}

// Spring Boot에서 데이터 가져오기 (개선된 버전)
async function fetchTrainingData() {
    try {
        console.log('Spring Boot 서버에서 데이터 가져오는 중...');
        
        // 여러 포트 시도
        const possibleUrls = [
            'http://localhost:8485/api/training-data'
        ];
        
        let response = null;
        let lastError = null;
        
        for (const url of possibleUrls) {
            try {
                console.log(`시도 중: ${url}`);
                response = await axios.get(url, { timeout: 5000 });
                console.log(`성공: ${url}`);
                break;
            } catch (error) {
                console.log(`실패: ${url} - ${error.message}`);
                lastError = error;
            }
        }
        
        if (!response) {
            throw lastError || new Error('모든 URL에서 데이터 가져오기 실패');
        }
        
        console.log('받은 응답:', response.data);
        
        // 응답 데이터 검증
        const data = response.data;
        if (!data || !data.features || !data.labels) {
            throw new Error('응답 데이터 구조가 올바르지 않습니다');
        }
        
        if (!Array.isArray(data.features) || !Array.isArray(data.labels)) {
            throw new Error('features와 labels가 배열이 아닙니다');
        }
        
        if (data.features.length === 0 || data.labels.length === 0) {
            throw new Error('features 또는 labels가 비어있습니다');
        }
        
        if (data.features.length !== data.labels.length) {
            throw new Error('features와 labels의 길이가 일치하지 않습니다');
        }
        
        console.log(`데이터 검증 완료: ${data.features.length}개의 샘플`);
        return data;
        
    } catch (error) {
        console.error('Spring Boot 서버에서 데이터 가져오기 실패:', error.message);
        
        // 폴백 데이터 제공
        console.log('폴백 데이터 사용');
        return {
            features: [
                [1610, 50], [165, 55], [155, 48], [170, 65], [175, 70],
                [162, 52], [158, 47], [180, 80], [185, 85], [172, 68]
            ],
            labels: [0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
            status: 'fallback'
        };
    }
}

// 모델 훈련 (개선된 오류 처리)
app.post('/train', async (req, res) => {
    try {
        console.log('=== 모델 훈련 시작 ===');
        
        // Spring Boot에서 훈련 데이터 가져오기
        const trainingData = await fetchTrainingData();
        if (!trainingData) {
            return res.status(500).json({ 
                error: 'Spring Boot 서버에서 데이터를 가져올 수 없습니다',
                suggestion: 'Spring Boot 서버가 실행 중인지 확인해주세요'
            });
        }
        
        console.log('훈련 데이터 확인:', {
            featuresLength: trainingData.features?.length,
            labelsLength: trainingData.labels?.length,
            status: trainingData.status
        });
        
        const { features, labels } = trainingData;
        
        // 데이터 유효성 검사
        if (!features || !labels) {
            return res.status(500).json({ 
                error: 'features 또는 labels가 없습니다',
                received: { features: !!features, labels: !!labels }
            });
        }
        
        // 데이터 전처리
        console.log('데이터 정규화 시작...');
        const { normalized: xTrain } = normalizeData(features);
        
        console.log('라벨 텐서 생성...');
        const yTrain = tf.tensor2d(labels.map(label => [label]));
        
        console.log('모델 생성...');
        model = createModel();
        
        console.log('모델 훈련 시작...');
        const history = await model.fit(xTrain, yTrain, {
            epochs: 50,
            batchSize: 5,
            verbose: 1,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 10 === 0) {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    }
                }
            }
        });
        
        isModelTrained = true;
        
        // 메모리 정리
        xTrain.dispose();
        yTrain.dispose();
        
        console.log('=== 모델 훈련 완료 ===');
        
        res.json({ 
            message: '모델 훈련이 완료되었습니다',
            status: 'success',
            dataSource: trainingData.status || 'spring-boot',
            trainingInfo: {
                samples: features.length,
                epochs: 50,
                finalLoss: history.history.loss[history.history.loss.length - 1],
                finalAccuracy: history.history.acc[history.history.acc.length - 1]
            }
        });
        
    } catch (error) {
        console.error('=== 훈련 중 오류 ===');
        console.error('오류 메시지:', error.message);
        console.error('오류 스택:', error.stack);
        
        res.status(500).json({ 
            error: '모델 훈련 중 오류가 발생했습니다',
            details: error.message,
            suggestion: 'Spring Boot 서버(포트 8485 또는 8080)가 실행 중인지 확인해주세요'
        });
    }
});

// 예측 (기존 코드와 동일)
app.post('/predict', async (req, res) => {
    try {
        if (!isModelTrained) {
            return res.status(400).json({ error: '모델이 훈련되지 않았습니다' });
        }
        
        const { height, weight } = req.body;
        
        if (!height || !weight) {
            return res.status(400).json({ error: '키와 몸무게를 입력해주세요' });
        }
        
        // 예측 수행
        const input = tf.tensor2d([[height, weight]]);
        const prediction = model.predict(input);
        const probability = await prediction.data();
        
        const result = {
            height,
            weight,
            probability: probability[0],
            prediction: probability[0] > 0.5 ? '남성' : '여성',
            confidence: probability[0] > 0.5 ? probability[0] : (1 - probability[0])
        };
        
        // Spring Boot에 예측 결과 저장 시도
        try {
            await axios.post('http://localhost:8485/api/save-prediction', result);
        } catch (error) {
            console.log('Spring Boot 저장 실패:', error.message);
        }
        
        // 메모리 정리
        input.dispose();
        prediction.dispose();
        
        res.json(result);
        
    } catch (error) {
        console.error('예측 중 오류:', error);
        res.status(500).json({ error: '예측 중 오류가 발생했습니다' });
    }
});

// 상태 확인
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        modelTrained: isModelTrained,
        tensorflowVersion: tf.version.tfjs
    });
});

// 루트 경로
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TensorFlow.js 서버</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                button { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
                .result { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>TensorFlow.js 서버</h1>
            <button onclick="trainModel()">모델 훈련</button>
            <button onclick="testPredict()">예측 테스트</button>
            <div id="result" class="result"></div>
            
            <script>
                async function trainModel() {
                    const result = document.getElementById('result');
                    result.innerHTML = '훈련 중...';
                    
                    try {
                        const response = await fetch('/train', { method: 'POST' });
                        const data = await response.json();
                        result.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        result.innerHTML = '오류: ' + error.message;
                    }
                }
                
                async function testPredict() {
                    const result = document.getElementById('result');
                    result.innerHTML = '예측 중...';
                    
                    try {
                        const response = await fetch('/predict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ height: 175, weight: 70 })
                        });
                        const data = await response.json();
                        result.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        result.innerHTML = '오류: ' + error.message;
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// 서버 시작
app.listen(port, () => {
    console.log(`TensorFlow.js 서버가 http://localhost:${port} 에서 실행 중입니다`);
    console.log('사용 가능한 엔드포인트:');
    console.log('- GET / : 웹 인터페이스');
    console.log('- POST /train : 모델 훈련');
    console.log('- POST /predict : 예측 수행');
    console.log('- GET /status : 서버 상태 확인');
});