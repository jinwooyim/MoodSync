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

let model = null;
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

// 정규화 함수
function normalizeData(data) {
    const tensor = tf.tensor2d(data);
    const min = tensor.min(0);
    const max = tensor.max(0);
    const normalized = tensor.sub(min).div(max.sub(min));
    return { normalized, min, max };
}

// ========== 모델 학습 함수 ===========
// 훈련 API
async function ModelTraining(response){
    // 1. 데이터 불러오기
    const { features, labels } = response.data;

    // 2. Tensor로 변환
    const xs = tf.tensor2d(features); // [N, 6]
    const ys = tf.tensor1d(labels, 'int32'); // [N]
    const ysOneHot = tf.oneHot(ys, Math.max(...labels) + 1); // [N, numClasses]
    const numClasses = Math.max(...labels) + 1;

    // 3. 모델 정의
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 32, activation: 'relu', inputShape: [6]}));
    model.add(tf.layers.dense({units: 16, activation: 'relu'}));
    model.add(tf.layers.dense({units: numClasses, activation: 'softmax'}));  // 클래스 수에 맞게 units 조정

    // 4. 모델 컴파일
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // 5. 모델 훈련
    await model.fit(xs, ysOneHot, { // xs : 모델 입력 데이터[배치 크기, 특성 개수], usOneHot[배치 크기, 클래스 개수] : 레이블 데이터
      epochs: 600, // 데이터셋에 대해 학습을 50번 반복
      batchSize: 16, // 한 번에 모델에 입력하는 데이터의 개수
      shuffle: true, //  epoch마다 학습 데이터의 순서를 섞어서
      callbacks: {
        onEpochEnd: (epoch, logs) => { // 손실(loss), 정확도(acc)
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, acc = ${logs.acc.toFixed(4)}`);
        },
      },
    });

    return model;
}
// ===================================================================================================================================================

// ========== 음악, 행동, 도서에 대해 학습 및 저장 =========== -> 메인
app.get('/train', async (req, res) => {
  try {
    // 음악, 행동, 도서에 대해서 학습 시작
    const act_response = await axios.get('http://localhost:8485/api/act-data');
    console.log('🔄 [1/3] act 모델 학습 시작');
    const act_model = await ModelTraining(act_response);
    console.log('✅ [1/3] act 모델 학습 완료');

    const music_response = await axios.get('http://localhost:8485/api/music-data');
    console.log('🔄 [2/3] music 모델 학습 시작');
    const music_model = await ModelTraining(music_response);
    console.log('✅ [2/3] music 모델 학습 완료');

    const book_response = await axios.get('http://localhost:8485/api/book-data');
    console.log('🔄 [3/3] book 모델 학습 시작');
    const book_model = await ModelTraining(book_response);
    console.log('✅ [3/3] book 모델 학습 완료');
    
    // 모델 저장
    await saveModelPureJS(act_model, path.join(__dirname, 'act_model'));
    await saveModelPureJS(music_model, path.join(__dirname, 'music_model'));
    await saveModelPureJS(book_model, path.join(__dirname, 'book_model'));
    console.log('📦 순수 JS 모델 저장 완료');

    res.send({ message: 'Training and saving completed successfully!' });

  } catch (error) {
    console.error('Training failed:', error);
    res.status(500).send({ error: error.message });
  }
});

// ========== 예측 수행 =========== -> 메인
// 예측 API (app.js)
app.get('/predict', express.json(), async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8485/predict?happy=0.5&sad=0.2&stress=0.1&calm=0.7&excited=0.4&tired=0.3');
    const input_emotion = response.data;

    console.log("@# input emotion =>", input_emotion);
    
    const { happy, sad, stress, calm, excited, tired } = input_emotion;
    console.log("happy      =>", input_emotion.happy);
    console.log("sad          =>", input_emotion.sad);
    console.log("stress     =>", input_emotion.stress);
    console.log("calm        =>", input_emotion.calm);
    console.log("excited   =>", input_emotion.excited);
    console.log("tired       =>", input_emotion.tired);

    if (
      [happy, sad, stress, calm, excited, tired].some((v) => v === undefined)
    ) {
      return res.status(400).json({ error: '6개 감정 값을 모두 입력해주세요.' });
    }

    const act_model = await loadModelPureJS(path.join(__dirname, 'act_model'));
    const music_model = await loadModelPureJS(path.join(__dirname, 'music_model'));
    const book_model = await loadModelPureJS(path.join(__dirname, 'book_model'));

    const inputTensor = tf.tensor2d([[happy, sad, stress, calm, excited, tired]]);

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
    res.json({
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
    });
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
