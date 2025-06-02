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

// 데이터 정규화
function normalizeData(data) {
    const tensor = tf.tensor2d(data);
    const min = tensor.min(0);
    const max = tensor.max(0);
    const normalized = tensor.sub(min).div(max.sub(min));
    return { normalized, min, max };
}

// Spring Boot에서 데이터 가져오기
async function fetchTrainingData() {
    try {
        const response = await axios.get('http://localhost:8080/api/training-data');
        return response.data;
    } catch (error) {
        console.error('Spring Boot 서버에서 데이터 가져오기 실패:', error.message);
        return null;
    }
}

// 모델 훈련
app.post('/train', async (req, res) => {
    try {
        console.log('모델 훈련 시작...');
        
        // Spring Boot에서 훈련 데이터 가져오기
        const trainingData = await fetchTrainingData();
        if (!trainingData) {
            return res.status(500).json({ error: 'Spring Boot 서버에서 데이터를 가져올 수 없습니다' });
        }
        
        const { features, labels } = trainingData;
        
        // 데이터 전처리
        const { normalized: xTrain } = normalizeData(features);
        const yTrain = tf.tensor2d(labels, [labels.length, 1]);
        
        // 모델 생성 및 훈련
        model = createModel();
        await model.fit(xTrain, yTrain, {
            epochs: 50,
            batchSize: 5,
            verbose: 0
        });
        
        isModelTrained = true;
        
        // 메모리 정리
        xTrain.dispose();
        yTrain.dispose();
        
        console.log('모델 훈련 완료!');
        res.json({ 
            message: '모델 훈련이 완료되었습니다',
            status: 'success'
        });
        
    } catch (error) {
        console.error('훈련 중 오류:', error);
        res.status(500).json({ error: '모델 훈련 중 오류가 발생했습니다' });
    }
});

// 예측
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
        
        // Spring Boot에 예측 결과 저장
        try {
            await axios.post('http://localhost:8080/api/save-prediction', result);
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

// 서버 시작
app.listen(port, () => {7
    console.log(`TensorFlow.js 서버가 http://localhost:${port} 에서 실행 중입니다`);
    console.log('사용 가능한 엔드포인트:');
    console.log('- POST /train : 모델 훈련');
    console.log('- POST /predict : 예측 수행');
    console.log('- GET /status : 서버 상태 확인');
});