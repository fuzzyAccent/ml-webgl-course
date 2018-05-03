const buffer = new ArrayBuffer(4);
let floats = new Float32Array(buffer);
let ints = new Uint32Array(buffer);

function bytestoFloat(bytes){

  ints[0] = parseInt(
                      bytes
                      .map(e => ("000000000" + e.toString(2)).substr(-8))
                      .reduce((a, b) => a + b), 2
                    );
  return floats[0];
}

function floatToBytes(f){
  floats[0] = f;
  let bits = ("0".repeat(32) + ints[0].toString(2)).substr(-32);
  return new Array(4).fill(0).map((elt, ii) => parseInt(bits.slice(ii * 8, (ii + 1) * 8), 2));
}

function getNumberParts(x)
{
    var float = new Float32Array(1),
        bytes = new Uint8Array(float.buffer);

    float[0] = x;

    // var sign = bytes[3] >> 7,
    //     exponent = ((bytes[3] & 0x7f) << 4 | bytes[2] >> 4) - 0x7f;
    //
    // bytes[3] = 0x3f;
    // bytes[2] |= 0xf0;

    return {
        bytes: bytes,
        // sign: sign,
        // exponent: exponent,
        // mantissa: float[0],
    }
}
