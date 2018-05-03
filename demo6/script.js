let computeOnGPU = (mat_size, callback) => {

  let a = new Array(mat_size * mat_size);
  let b = new Array(mat_size * mat_size);

  a.fill(1);
  b.fill(2);

  const gpu = new GPU();
  const multiplyMatrix = gpu.createKernel(function(a, b, n) {
    var sum = 0;
    for (var i = 0; i < n; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  }).setOutput([mat_size, mat_size]);

  let gpu_a = new GPU.Input(new Float32Array(a), [mat_size, mat_size]);
  let gpu_b = new GPU.Input(new Float32Array(b), [mat_size, mat_size]);
  let t0 = performance.now();
  const c = multiplyMatrix(gpu_a, gpu_b, mat_size);
  let t1 = performance.now();
  callback(t1-t0);
}


let computeOnCPU = (mat_size, callback) => {

  let a = new Array(mat_size * mat_size);
  let b = new Array(mat_size * mat_size);

  a.fill(1);
  b.fill(2);

  let t0 = performance.now();
  let mul = new Array(mat_size);
  for (var i = 0; i < mat_size; i++) {
    mul[i] = new Array(mat_size).fill(0);
    for (var j = 0; j < mat_size; j++) {
      for(var k = 0; k < mat_size; k++){
        mul[i][j] += a[i*mat_size + k] * b[k*mat_size + j];
      }
    }
  }
  let t1 = performance.now();
  callback(t1 - t0);
}

window.onload = function(){
  let btnGPU = document.getElementById('btn-compute-gpu');
  let btnCPU = document.getElementById('btn-compute-cpu');
  let cpuElTime = document.getElementById('cpuElTime');
  let gpuElTime = document.getElementById('gpuElTime');
  let getGpuSize = document.getElementById('gpu-mult-size');
  let getCpuSize = document.getElementById('cpu-mult-size');
  let cpuBox = document.getElementById('cpu-box');
  let gpuBox = document.getElementById('gpu-box');

  btnGPU.onclick = (e) => {
    e.preventDefault();
    let m = parseInt(getGpuSize.value) ?  parseInt(getGpuSize.value)  : 1024;
    gpuBox.classList.toggle("blinkit");
    computeOnGPU(m, function(dt) {
      let delTime = dt;
      let unit = delTime > 60000 ? 'min' : delTime > 1000 ? 's' : 'ms';
      delTime = delTime > 60000 ? precisionRound(delTime / 60000, 2) : delTime > 1000 ? precisionRound(delTime / 1000, 2) : delTime;
      gpuElTime.innerHTML = delTime + unit;
      gpuBox.classList.toggle("blinkit");
    });
  }

  btnCPU.onclick = (e) => {
    e.preventDefault();
    let m = parseInt(getCpuSize.value) ?  parseInt(getCpuSize.value)  : 1024;
    cpuBox.classList.toggle("blinkit");
    let delTime = 0;
    setTimeout(() => {
      computeOnCPU(m, function (dt) {
        let delTime =  dt;
        let unit = delTime > 60000 ? 'min' : (delTime > 1000 ? 's' : 'ms');
        delTime = delTime > 60000 ? precisionRound(delTime / 60000, 2) : (delTime > 1000 ? precisionRound(delTime / 1000, 2) : delTime);
        cpuElTime.innerHTML = delTime + unit;
        cpuBox.classList.toggle("blinkit");
      });
    }, 1000);
  }
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
