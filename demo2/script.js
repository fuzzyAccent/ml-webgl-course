function main(){
  // Get webGL context
  let canvas = document.getElementById("c");
  let gl = canvas.getContext("webgl");
  if (!gl){
    return;
  }

  // setup GLSL program
  let program = webglUtils.createProgramFromScripts(gl, [
    "2d-vertex-shader",
    "2d-fragment-shader"
  ]);

  let colorAttributeLocation =  gl.getAttribLocation(program, "a_color");
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColor(gl);


  // look up where the vertex data needs to go
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  let matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // create buffer
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set geometry
  setGeometry(gl);

  let translation = [200, 200];
  let angleInRadians = 0;
  let scale = [1, 1];

  drawScene();

  function drawScene(){
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the positin buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of position Buffer (ARRAY_BUFFER)
    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;

    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset
    );

    gl.enableVertexAttribArray(colorAttributeLocation);

    // Bind the positin buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the attribute how to get data out of position Buffer (ARRAY_BUFFER)
    size = 4;
    type = gl.UNSIGNED_BYTE;
    normalize = true;
    stride = 0;
    offset = 0;

    gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset
    );

    // compute the matrix
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the geometry.
    let primitiveType = gl.TRIANGLES;
    offset = 0;
    let count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

let g = 4;
let main_color = [255, 0, 0]
function setColor(gl){
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        255, 255, 255, 255,
        main_color[0], main_color[1], main_color[2], 255,
        0, 0, 0, 255,
        main_color[0], main_color[1], main_color[2], 255,
        0, 0, 0, 255,
        0, 0, 0, 255
      ]),
      gl.STATIC_DRAW);
}

function setGeometry(gl) {
  let cWidth = 200;
  let l = parseInt(g * cWidth / 2);

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          -0.5 * l, -1 / 2 * l,
           0.5 * l, -1 / 2 * l,
          -0.5 * l,  1 / 2 * l,
           0.5 * l, -1 / 2 * l,
           0.5 * l,  1 / 2 * l,
          -0.5 * l,  1 / 2 * l]),
      gl.STATIC_DRAW);
}


main();

window.onload = () => {
  let slider_red = document.getElementById("slider_red");
  let slider_green = document.getElementById("slider_green");
  let slider_blue = document.getElementById("slider_blue");
  slider_red.oninput = slider_green.oninput = slider_blue.oninput = () => {
    let r = parseInt(slider_red.value);
    let g = parseInt(slider_green.value);
    let b = parseInt(slider_blue.value) ;

    let red = document.getElementById("red_value");
    let green = document.getElementById("green_value");
    let blue = document.getElementById("blue_value");

    red.innerHTML = slider_red.value;
    green.innerHTML = slider_green.value;
    blue.innerHTML = slider_blue.value;


    main_color = [r, g, b];
    main();
  }
}
