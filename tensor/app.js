const express = require('express');
const cors = require('cors');
// require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

let isModelTrained = false;

// ========== 모델 저장 / 불러오기 함수 ===========
// 디렉토리가 없으면 생성
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 순수 JS 방식으로 모델 저장 (model.json + weights.bin)
async function saveModelPureJS(model, dirPath) {
  ensureDir(dirPath);

  await model.save(
    tf.io.withSaveHandler(async (modelArtifacts) => {
      // 1) 토폴로지(JSON) 저장
      fs.writeFileSync(
        path.join(dirPath, 'model.json'),
        JSON.stringify(modelArtifacts.modelTopology),
        'utf8'
      );

      // 2) weights 바이너리 저장
      const weightsBuffer = Buffer.from(modelArtifacts.weightData);
      fs.writeFileSync(path.join(dirPath, 'weights.bin'), weightsBuffer);

      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: 'JSON',
          weightDataBytes: modelArtifacts.weightData.byteLength,
        },
      };
    })
  );
}

// 저장된 모델 로드 (model.json + weights.bin -> tf.Model)
async function loadModelPureJS(dirPath) {
  // 1) model.json 로드
  const modelJson = JSON.parse(
    fs.readFileSync(path.join(dirPath, 'model.json'), 'utf8')
  );
  // 2) weights.bin 로드
  const weightData = fs.readFileSync(path.join(dirPath, 'weights.bin'));
  // 3) 메모리 핸들러 생성
  const handler = tf.io.fromMemory(modelJson, weightData.buffer);
  // 4) 모델 로드
  return await tf.loadLayersModel(handler);
}


// ========== 모델 학습 함수 ===========
// 훈련 API
async function ModelTraining(response, modelType = 'default') {
    console.log(`🎯 ${modelType} 모델 학습 시작`);
    
    // 1. 데이터 불러오기
    const { features, labels } = response.data;
    console.log(`📊 ${modelType} 데이터 크기: ${features.length}개`);

    // 2. 모델별 최적화된 설정
    const configs = {
        act: { 
            epochs: 120, 
            batchSize: 16, 
            learningRate: 0.0001,
            patience: 200,
            hiddenUnits: [64, 32]
        },
        music: { 
            epochs: 120, 
            batchSize: 16, 
            learningRate: 0.0001,
            patience: 200,
            hiddenUnits: [64, 32]
        },
        book: { 
            epochs: 120, 
            batchSize: 16, 
            learningRate: 0.0001,
            patience: 200,
            hiddenUnits: [64, 32]
        },
        default: { 
            epochs: 600, 
            batchSize: 24, 
            patience: 200,
            hiddenUnits: [32, 16]
        }
    };
    
    const config = configs[modelType] || configs.default;
    console.log(`⚙️ ${modelType} 설정: epochs=${config.epochs}, batch=${config.batchSize}`);

    // 3. Tensor로 변환
    const xs = tf.tensor2d(features);
    const ys = tf.tensor1d(labels, 'int32');
    const numClasses = Math.max(...labels);
    const ysOneHot = tf.oneHot(ys, numClasses);

    // 4. 데이터 분할 (80% 훈련, 20% 검증)
    const splitIdx = Math.floor(features.length * 0.8);
    
    const xsTrain = xs.slice([0, 0], [splitIdx, -1]);
    const ysTrainOneHot = ysOneHot.slice([0, 0], [splitIdx, -1]);
    const xsVal = xs.slice([splitIdx, 0], [-1, -1]);
    const ysValOneHot = ysOneHot.slice([splitIdx, 0], [-1, -1]);

    // 5. 모델 정의 (동적 구조)
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: config.hiddenUnits[0], 
        activation: 'relu', 
        inputShape: [6]
    }));
    model.add(tf.layers.dropout({rate: 0.2})); // 과적합 방지
    model.add(tf.layers.dense({
        units: config.hiddenUnits[1], 
        activation: 'relu'
    }));
    model.add(tf.layers.dropout({rate: 0.1}));
    model.add(tf.layers.dense({
        units: numClasses, 
        activation: 'softmax'
    }));

    // 6. 모델 컴파일 (최적화된 설정)
    model.compile({
        optimizer: tf.train.adam(0.001), // 학습률 명시
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // 7. 콜백 설정
    let bestValAcc = 0;
    let patienceCounter = 0;
    let lastLogTime = Date.now();
    
    const callbacks = {
        onEpochEnd: (epoch, logs) => {
            const currentTime = Date.now();
            
            // 5초마다 또는 마지막 에포크에서만 로그 출력
            if (currentTime - lastLogTime > 5000 || epoch === config.epochs - 1) {
                console.log(`📈 ${modelType} Epoch ${epoch + 1}/${config.epochs}: ` +
                          `loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}, ` +
                          `val_loss=${logs.val_loss.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}`);
                lastLogTime = currentTime;
            }
            
            // 조기 종료 로직
            if (logs.val_acc > bestValAcc) {
                bestValAcc = logs.val_acc;
                patienceCounter = 0;
            } else {
                patienceCounter++;
                if (patienceCounter >= config.patience) {
                    console.log(`🛑 ${modelType} 조기 종료 (patience=${config.patience})`);
                    model.stopTraining = true;
                }
            }
        }
    };

    // 8. 모델 훈련
    const startTime = Date.now();
    
    const history = await model.fit(xsTrain, ysTrainOneHot, {
        epochs: config.epochs,
        batchSize: config.batchSize,
        shuffle: true,
        validationData: [xsVal, ysValOneHot],
        callbacks: callbacks,
        verbose: 0 // 기본 로그 비활성화
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ ${modelType} 학습 완료 (${duration}초, 최고 검증 정확도: ${bestValAcc.toFixed(4)})`);

    // 9. 메모리 정리
    xs.dispose();
    ys.dispose();
    ysOneHot.dispose();
    xsTrain.dispose();
    ysTrainOneHot.dispose();
    xsVal.dispose();
    ysValOneHot.dispose();

    return model;
}
// ===================================================================================================================================================





// 캐시 변수
let dataCache = {
  act: null,
  music: null,
  book: null,
  lastUpdated: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5분

async function getCachedData(type, url) {
  const now = Date.now();
  
  // 캐시가 유효한지 확인
  if (dataCache[type] && dataCache.lastUpdated && 
      (now - dataCache.lastUpdated) < CACHE_DURATION) {
    console.log(`📋 ${type} 캐시된 데이터 사용`);
    return dataCache[type];
  }
  
  // 새로운 데이터 가져오기
  console.log(`🔄 ${type} 새로운 데이터 로딩`);
  const response = await axios.get(url);
  dataCache[type] = response;
  dataCache.lastUpdated = now;
  
  return response;
}


// ========== 음악, 행동, 도서에 대해 학습 및 저장 =========== -> 메인
app.get('/train', async (req, res) => {
  try {
    const startTime = Date.now();
    console.log('🚀 모든 모델 병렬 학습 시작');
    
    // 데이터 병렬 로딩
    const [act_response, music_response, book_response] = await Promise.all([
      axios.get('http://localhost:8485/api/act-data'),
      axios.get('http://localhost:8485/api/music-data'),
      axios.get('http://localhost:8485/api/book-data')
    ]);
    
    console.log('📊 모든 데이터 로딩 완료');
    
    // 모델 병렬 학습 (타입 지정)
    const [act_model, music_model, book_model] = await Promise.all([
      ModelTraining(act_response, 'act'),
      ModelTraining(music_response, 'music'),
      ModelTraining(book_response, 'book')
    ]);
    
    // 모델 병렬 저장
    await Promise.all([
      saveModelPureJS(act_model, path.join(__dirname, 'act_model')),
      saveModelPureJS(music_model, path.join(__dirname, 'music_model')),
      saveModelPureJS(book_model, path.join(__dirname, 'book_model'))
    ]);
    
    const endTime = Date.now();
    const totalDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`🎉 전체 학습 완료! 총 소요시간: ${totalDuration}초`);
    
    res.send({ 
      message: 'Training completed successfully!',
      duration: totalDuration,
      models: {
        act: '✅ 완료',
        music: '✅ 완료', 
        book: '✅ 완료'
      }
    });

  } catch (error) {
    console.error('❌ Training failed:', error);
    res.status(500).send({ error: error.message });
  }
});

// ========== 예측 수행 =========== -> 메인
// 예측 API (app.js)
app.post('/predict', express.json(), async (req, res) => {
    console.log("predict 실행됨!!");
    
    const inputData = req.body; // 예시 : [0.12, 0.14, 0.35, 0. 65, 0.75, 0.00]
    console.log("predict inputData =>" , inputData);
    let { happy, sad, stress, calm, excited, tired } = inputData;
    happy = happy ?? 0;
    sad = sad ?? 0;
    stress = stress ?? 0;
    calm = calm ?? 0;
    excited = excited ?? 0;
    tired = tired ?? 0;
    console.log("predict happy =>" , happy);
    console.log("predict sad =>" , sad);
    console.log("predict stress =>" , stress);
    console.log("predict calm =>" , calm);
    console.log("predict excited =>" , excited);
    console.log("predict tired =>" , tired);
    
    const inputTensor = tf.tensor2d([[happy, sad, stress, calm, excited, tired]]);
    console.log("predict 실행됨!! 2222");

  try {
    if (
      [happy, sad, stress, calm, excited, tired].some((v) => v === undefined)
    ) { 
      return res.status(400).json({ error: '6개 감정 값을 모두 입력해주세요.' });
    }

    const act_model = await loadModelPureJS(path.join(__dirname, 'act_model'));
    const music_model = await loadModelPureJS(path.join(__dirname, 'music_model'));
    const book_model = await loadModelPureJS(path.join(__dirname, 'book_model'));


    const act_prediction = act_model.predict(inputTensor);
    const music_prediction = music_model.predict(inputTensor);
    const book_prediction = book_model.predict(inputTensor);

    const act_probs = await act_prediction.data();
    const music_probs = await music_prediction.data();
    const book_probs = await book_prediction.data();

    const act_predictedClass = act_prediction.argMax(-1).dataSync()[0];
    const music_predictedClass = music_prediction.argMax(-1).dataSync()[0];
    const book_predictedClass = book_prediction.argMax(-1).dataSync()[0];

    // 응답으로 JSON 반환
    console.log("@# predict : res =>",res);

    const responseData ={
      act: {
        predictedClass: act_predictedClass,
        probabilities: Array.from(act_probs),
      },
      music: {
        predictedClass: music_predictedClass,
        probabilities: Array.from(music_probs),
      },
      book: {
        predictedClass: book_predictedClass,
        probabilities: Array.from(book_probs),
      },
    };

    console.log("🎯 예측 결과 응답 데이터 =>", JSON.stringify(responseData, null, 2)); // 보기 좋게 출력

    res.json(responseData);

  } catch (err) {
    console.error('Predict failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// 상태 확인
app.get('/status', (req, res) => {
    res.json({ status: 'running', modelTrained: isModelTrained });
});

// 기본 페이지
app.get('/', (req, res) => {
    res.send(`
        <h2>TensorFlow.js Emotion Server</h2>
        <p>POST /train - 모델 훈련</p>
        <p>POST /predict - 예측 (6개의 감정 값 필요)</p>
        <p>GET /status - 서버 상태 확인</p>
    `);
});

// 서버 시작
app.listen(port, () => {
    console.log(`Emotion Prediction Server is running on http://localhost:${port}`);
});
