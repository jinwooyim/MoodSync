const tf = require('@tensorflow/tfjs');

console.log('=== 고급 로지스틱 회귀 예제 ===\n');

// 1. 더 복잡한 데이터셋 (붓꽃 데이터셋 스타일)
// 특성: [꽃받침 길이, 꽃받침 너비, 꽃잎 길이, 꽃잎 너비]
// 레이블: [0: Setosa, 1: Versicolor]
const irisData = [
    [5.1, 3.5, 1.4, 0.2], [4.9, 3.0, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2],
    [4.6, 3.1, 1.5, 0.2], [5.0, 3.6, 1.4, 0.2], [5.4, 3.9, 1.7, 0.4],
    [7.0, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5],
    [5.5, 2.3, 4.0, 1.3], [6.5, 2.8, 4.6, 1.5], [5.7, 2.8, 4.5, 1.3],
    [6.3, 3.3, 4.7, 1.6], [4.9, 2.4, 3.3, 1.0], [6.6, 2.9, 4.6, 1.3],
    [5.2, 2.7, 3.9, 1.4], [5.0, 2.0, 3.5, 1.0], [5.9, 3.0, 4.2, 1.5]
];

const irisLabels = [
    0, 0, 0, 0, 0, 0,  // Setosa
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1  // Versicolor
];

// 2. 데이터 전처리
function preprocessData(data, labels) {
    // 특성 정규화
    const dataTensor = tf.tensor2d(data);
    const mean = dataTensor.mean(0);
    const std = dataTensor.sub(mean).square().mean(0).sqrt();
    const normalizedData = dataTensor.sub(mean).div(std);
    
    // 레이블 텐서 변환
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
    
    return { 
        features: normalizedData, 
        labels: labelTensor, 
        mean, 
        std 
    };
}

// 3. 로지스틱 회귀 클래스
class LogisticRegression {
    constructor(inputSize, learningRate = 0.01) {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [inputSize],
                    units: 8,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid'
                })
            ]
        });
        
        this.model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
    }
    
    async train(features, labels, epochs = 100) {
        console.log('모델 훈련 중...');
        
        const history = await this.model.fit(features, labels, {
            epochs: epochs,
            batchSize: 8,
            validationSplit: 0.2,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if (epoch % 25 === 0) {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    }
                }
            }
        });
        
        return history;
    }
    
    predict(features) {
        return this.model.predict(features);
    }
    
    evaluate(features, labels) {
        return this.model.evaluate(features, labels);
    }
}

// 4. 실행 함수
async function runAdvancedExample() {
    // 데이터 전처리
    const { features, labels, mean, std } = preprocessData(irisData, irisLabels);
    
    console.log('데이터 형태:');
    console.log('특성:', features.shape);
    console.log('레이블:', labels.shape);
    
    // 모델 생성 및 훈련
    const logReg = new LogisticRegression(4, 0.01);
    
    console.log('\n모델 구조:');
    logReg.model.summary();
    
    await logReg.train(features, labels, 150);
    
    // 평가
    console.log('\n=== 모델 평가 ===');
    const evaluation = await logReg.evaluate(features, labels);
    const [loss, accuracy] = await Promise.all([
        evaluation[0].data(),
        evaluation[1].data()
    ]);
    
    console.log(`최종 손실: ${loss[0].toFixed(4)}`);
    console.log(`최종 정확도: ${(accuracy[0] * 100).toFixed(2)}%`);
    
    // 예측 테스트
    console.log('\n=== 예측 테스트 ===');
    const testData = [
        [5.0, 3.5, 1.3, 0.3],  // Setosa 특성
        [6.0, 3.0, 4.5, 1.5]   // Versicolor 특성
    ];
    
    const testTensor = tf.tensor2d(testData);
    const normalizedTest = testTensor.sub(mean).div(std);
    const predictions = logReg.predict(normalizedTest);
    const predictionValues = await predictions.data();
    
    testData.forEach((sample, i) => {
        const prob = predictionValues[i];
        const predicted = prob > 0.5 ? 'Versicolor' : 'Setosa';
        console.log(`샘플 ${i + 1}: [${sample.join(', ')}] -> ${predicted} (확률: ${prob.toFixed(4)})`);
    });
    
    // 메모리 정리
    features.dispose();
    labels.dispose();
    mean.dispose();
    std.dispose();
    testTensor.dispose();
    normalizedTest.dispose();
    predictions.dispose();
}

// 실행
runAdvancedExample().catch(console.error);