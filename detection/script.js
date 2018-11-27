// vector class
function VectorRGB(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.dot = function(vr2) {
    return r*vr2.r + g*vr2.g + b*vr2.b;
  }
  this.norm = function() {
    return Math.sqrt(r*r + g*g + b*b);
  }
  this.negate = function() {
    return new VectorRGB(-r, -g, -b);
  }
  this.add = function(vr2) {
    return new VectorRGB(r+vr2.r, g+vr2.g, b+vr2.b);
  }
  this.subtract = function(vr2) {
    return this.add(vr2.negate());
  }
  this.distanceTo = function(vr2) {
    return this.subtract(vr2).norm();
  }
  this.timesScalar = function(k) {
    return new VectorRGB(r*k, g*k, b*k);
  }
  this.projOn = function(vr2) {
    return vr2.timesScalar(this.dot(vr2) / Math.pow(vr2.norm(), 2));
  }
  this.ortProjOn = function(vr2) {
    return this.subtract(this.projOn(vr2));
  }
  this.toString = function() {
    return `Vector RGB R: ${r} G: ${g} B: ${b}`;
  }
}
VectorRGB.from = function(arr) {
  return new VectorRGB(arr[0], arr[1], arr[2]);
}

const Jimp = require('jimp');

Jimp.read('./input1.jpg')
  .then(image => {
    // make image more manageable
    if(image.bitmap.width > image.bitmap.height)
      image.resize(256, Jimp.AUTO);
    else
      image.resize(Jimp.AUTO, 256);

    let width = image.bitmap.width;
    let height = image.bitmap.height;
    let pixels = image.bitmap.data;

    // get pixels at four corners
    let corner1 = pixels.slice(0, 4);
    let corner2 = pixels.slice(4*(width-1), 4*width);
    let corner3 = pixels.slice(4*width*(height-1), 4*width*(height-1)+4);
    let corner4 = pixels.slice(-4);

    // get average of four corner colors
    let corner_average = VectorRGB.from(corner1)
      .add(VectorRGB.from(corner2))
      .add(VectorRGB.from(corner3))
      .add(VectorRGB.from(corner4))
      .timesScalar(.25);

    console.log('corner average: ' + corner_average.toString());
    let off_white_correction = new VectorRGB(255, 255, 255).subtract(corner_average);

    // manipulate pixels
    let color_values = [];
    for(let i = 0; i < pixels.length; i += 4) {
      let current_color = VectorRGB.from(pixels.slice(i, i+4));
      let distance = current_color.distanceTo(corner_average) / Math.sqrt(2) / Math.sqrt(2);

      // distance is great enough (arbitrary threshold)
      // significant point
      const DELTA_E_THRESHOLD = 50;
      if(distance > DELTA_E_THRESHOLD) {
        color_values.push(current_color.add(off_white_correction));
        pixels[i]   += off_white_correction.r;
        pixels[i+1] += off_white_correction.g;
        pixels[i+2] += off_white_correction.b;
        continue;
      }
      
      //let [ dr, dg, db, da ] = [ 100, 100, 50, 50 ];
      pixels[i  ] = distance;//Math.max(0, Math.min(255, pixels[i  ] + dr));
      pixels[i+1] = distance;//Math.max(0, Math.min(255, pixels[i+1] + dg));
      pixels[i+2] = distance;//Math.max(0, Math.min(255, pixels[i+2] + db));
      pixels[i+3] = 255;//Math.max(0, Math.min(255, pixels[i+3] + da));
    }

    // do stuff with significant points
    let average_color = color_values.reduce((a, v) => a.add(v), color_values[0]).timesScalar(1/color_values.length);
    console.log(average_color.toString());

    image.write('./output.png');
  })
  .catch(err => console.error(err));;
