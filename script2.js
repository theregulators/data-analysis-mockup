// INPUTS -- these are placeholders for now, have to be updated
// these will be determined from calibration
let [r0, r1, g0, g1, b0, b1] = [255, 255, 0, 255, 255, 0];
// this will be from the sample
let [r, g, b] = [255, 128, 0];
// this will be function to determine blood glucose level from percentage between calibratoin points
function f(x) { return x; }

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
  this.timesScalar = function(k) {
    return new VectorRGB(r*k, g*k, b*k);
  }
  this.projOn = function(vr2) {
    return this.timesScalar(this.dot(vr2) / Math.pow(vr2.norm(), 2));
  }
  this.ortProjOn = function(vr2) {
    return this.subtract(this.projOn(vr2));
  }
  this.toString = function() {
    return `Vector RGB R: ${r} G: ${g} B: ${b}`;
  }
}

// get canvas element
let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

// main script
/*let p0, p1, p, p0p1, pp0, o, q, p0q, z, bgl;
p0 = new VectorRGB(r0, g0, b0);
p1 = new VectorRGB(r1, g1, b1);
p = new VectorRGB(r, g, b);

p0p1 = p1.subtract(p0);
pp0 = p0.subtract(p);

o = pp0.ortProjOn(p0p1);
q = p.add(o);
p0q = q.subtract(p0);

console.log(o.toString());

z = p0q.norm() / p0p1.norm();
bgl = f(z);
// end main script

let dc = p0p1.timesScalar(1/(width-1));
let current_color = p0;
for(let i = 0; i < width; i++, current_color = current_color.add(dc)) {
  ctx.fillStyle = `rgb(${current_color.r}, ${current_color.g}, ${current_color.b})`;
  ctx.fillRect(i, 0, 1, 100);
}

ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
ctx.fillRect((width * z)-50, 100, 100, 100);*/

let minColorElem = document.querySelector('#minColor');
let minValueElem = document.querySelector('#minValue');
let maxColorElem = document.querySelector('#maxColor');
let maxValueElem = document.querySelector('#maxValue');
let colorElem = document.querySelector('#color');
let getVectorRGB = hex => new VectorRGB(parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16));
let calculate = _ => {
  let p0, p1, p, p0p1, pp0, o, q, p0q, z, bgl;
  p0 = getVectorRGB(minColorElem.value);
  p1 = getVectorRGB(maxColorElem.value);
  p = getVectorRGB(colorElem.value);

  p0p1 = p1.subtract(p0);
  pp0 = p0.subtract(p);

  o = pp0.ortProjOn(p0p1);
  q = p.add(o);
  p0q = q.subtract(p0);

  console.log(o.toString());

  z = p0q.norm() / p0p1.norm();
  bgl = f(z);
  // end main script

  ctx.clearRect(0, 0, width, height);
  let dc = p0p1.timesScalar(1/(width-1));
  let current_color = p0;
  for(let i = 0; i < width; i++, current_color = current_color.add(dc)) {
    ctx.fillStyle = `rgb(${current_color.r}, ${current_color.g}, ${current_color.b})`;
    ctx.fillRect(i, 0, 1, 100);
  }

  ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
  ctx.fillRect((width * z)-50, 100, 100, 100);
};
calculate();
[minColorElem, minValueElem, maxColorElem, maxValueElem, colorElem].forEach(elem => {
  elem.addEventListener('change', calculate);
});
