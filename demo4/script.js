function loadImage(url, callback){
  let image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

let images = [];

function loadImages(urls, callback){
  let imagesToLoad = urls.length;

  let onImageLoad = function(){
    --imagesToLoad;
    if(imagesToLoad == 0){
      callback(images);
    }
  }

    for(let ii = 0; ii < imagesToLoad; ii ++){
      images.push(loadImage(urls[ii], onImageLoad));
    }
}


function main(){
  loadImages(
    [
      "./space-elevator.jpg",
      "./gradient.jpg"
    ]
    , render
  );
}

function render(images){

  // Create the webgl context
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");

  if(!gl){
    return;
  }

  // setup the program
  let program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  let positionLocation = gl.getAttribLocation(program, "a_position");
  let texcoordLocation = gl.getAttribLocation(program, "a_texCoord");


  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, 0, 0, images[0].width, images[0].height);


  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);

  let textures = [];
  for(let ii = 0; ii < images.length; ii++){

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);

    textures.push(texture);
  }


  let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  var u_image0Location = gl.getUniformLocation(program, "u_image0");
  var u_image1Location = gl.getUniformLocation(program, "u_image1");

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let size = 2;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;

  gl.vertexAttribPointer(
    positionLocation, size, type, normalize, stride, offset
  );

  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

  size = 2;
  type = gl.FLOAT;
  normalize = false;
  stride = 0;
  offset = 0;

  gl.vertexAttribPointer(
    texcoordLocation, size, type, normalize, stride, offset
  );

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(resolutionLocation, images[0].width, images[0].height);
  gl.uniform1i(u_image0Location, 0);  // texture unit 0
  gl.uniform1i(u_image1Location, 1);  // texture unit 1

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[1]);

  let primitiveType = gl.TRIANGLES;
  offset = 0;
  let count = 6;
  gl.drawArrays(primitiveType, offset, count);
  var pixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
  gl.readPixels(0, 0, gl.canvas.width, gl.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  console.log(pixels);
}

function setRectangle(gl, x, y, width, height){
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]), gl.STATIC_DRAW);
}

main();
