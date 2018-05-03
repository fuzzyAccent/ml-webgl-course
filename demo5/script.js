const mat_size = 3;

let a = new Array(mat_size * mat_size).fill(1);
let b = new Array(mat_size * mat_size).fill(1);

a = a.map(()=>{return Math.floor(Math.random() * 5);});
b = b.map(()=>{return Math.floor(Math.random() * 5);});

let show_a = [];
let show_b = [];

for(let i = 0; i < mat_size; i++){

  let row_a = [];
  let row_b = [];

  for(let j = 0; j < mat_size; j++){
    row_a.push(a[mat_size * i + j]);
    row_b.push(b[mat_size * i + j]);
  }
  show_a.push(row_a);
  show_b.push(row_b);
}

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

const c = multiplyMatrix(gpu_a, gpu_b, mat_size);
