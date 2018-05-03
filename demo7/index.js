
function train(x, y){
  const xs = tf.tensor1d(x);
  const ys = tf.tensor1d(y);

  const a = tf.scalar(Math.random()).variable();
  // const b = tf.scalar(Math.random()).variable();


  // y = a * x^2 + b * x + c.
  const f = x => a.mul(x.square());
  const loss = (pred, label) => pred.sub(label).square().mean();

  const learningRate = 0.01;
  const optimizer = tf.train.rmsprop(learningRate);

  // Train the model.
  for (let i = 0; i < 2000; i++) {
     optimizer.minimize(() => loss(f(xs), ys));
  }

  // Make predictions.
  console.log(
       `pi can be: ${a.dataSync()}`);
}

function predict_y(input){
  input = tf.tensor1d([input]);
  const pred = f(input);
  console.log(`x: ${input}, pred: ${pred}`);
}
