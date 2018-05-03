const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

let xss = new Array(10).fill(1000).map((e, idx) => idx);
let yss = new Array(10).fill(1000).map((e, idx) => idx * 2);
let xs = tf.tensor2d(xss, [xss.length, 1]);
let ys = tf.tensor2d(yss, [yss.length, 1]);

model.fit(
        xs, ys,
        {batchSize: 10, epochs: 50}
      ).then(() => {
        model.predict(tf.tensor2d([5], [1,1])).print();
      });
