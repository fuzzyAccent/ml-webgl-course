function main() {

	// Create the webgl context in the canvas
  let webl_p = document.getElementById("webgl");
  let canvas = document.getElementById("cnv");
  let gl = canvas.getContext("webgl");

  // Making sure that webgl is supported
  if (!gl) {
    webl_p.innerHTML = "Webgl NOT supported on this browser";
  } else {
    webl_p.innerHTML = "Webgl is ready!";
  }

	// Setup the program
  let program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  // Location of the attributes in the GLSL code
  let positionLocation = gl.getAttribLocation(program, "a_position");

  // Create Buffers
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Feed the buffer with data
  setTriangle(gl);

  // Location of the attributes in the GLSL code
  let colorLocation = gl.getAttribLocation(program, "a_color");

  // Create Buffers
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Feed the buffer with data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       1, 0, 0, 1,
       0, 1, 0, 1,
       0, 0, 1, 1
  ]), gl.STATIC_DRAW);

  // We are using a help script to setup the size of the canvas
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clearing the background;
  gl.clearColor(0,1.0,0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

	// use the program
  gl.useProgram(program);
	// use the variables (Attribute of the position)
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // We tell the GPU how to get data from the buffer
  let size = 2;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;

  gl.vertexAttribPointer(
    positionLocation, size, type, normalize, stride, offset
  );

  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // We tell the GPU how to get data from the buffer
  size = 4;
  type = gl.FLOAT;
  normalize = false;
  stride = 0;
  offset = 0;

  gl.vertexAttribPointer(
    colorLocation, size, type, normalize, stride, offset
  );

  let primitiveType = gl.TRIANGLES;
  offset = 0;
  let count = 3;
  gl.drawArrays(primitiveType, offset, count);

}

function setTriangle(gl){
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       0,  2/3,
     1/2, -1/3,
    -1/2, -1/3
  ]), gl.STATIC_DRAW);
}
