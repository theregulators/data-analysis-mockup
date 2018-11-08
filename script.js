// r0, r1, g0, g1, b0, b1 filled in by experimental data
// can adjust algorithm to account for more reference points as needed
p0 = [ r0, g0, b0 ]
p1 = [ r1, g1, b1 ]

// p is from one sample data
p = [ r, g, b ];

// slope vector and vector from point to point on line
p0p1 = [ p1[0]-p0[0], p1[1]-p0[1], p0[2]-p1[2] ]
pp0 = [ p0[0]-p[0], p0[1]-p[1], p0[2]-p[2] ]

// calculate vector component of pp0 orthagonal to p0p1
// o = pp0 - (pp0 (dot) p0p1) / || p0p1 ||^2 * p0p1
k = ( pp0[0]*p0p1[1] + pp0[1]*p0p1[1] + pp0[2]*p0p1[2] ) /
    ( p0p1[0]*p0p1[0] + p0p1[1]*p0p1[1] + p0p1[2]*p0p1[2] )
o = [ pp0[0]-k*p0p1[0], pp0[1]-k*p0p1[1], pp0[2]-k*p0p1[2] ]

// q is point on line closest to p
q = [ p[0]+o[0], p[1]+o[1], p[2]+o[2] ]

// calculates percent of range from p0 to p1
p0q = [ q[0]-p0[0], q[1]-p0[1], q[2]-p0[2] ]
z = Math.sqrt( p0q[0]*p0q[0] + p0q[1]*p0q[1] + p0q[2]*p0q[2] ) /
    Math.sqrt( p0p1[0]*p0p1[0] + p0p1[1]*p0p1[1] + p0p1[2]*p0p1[2] );

// calculate blood glucose levels (f(x) has to be implemented)
bgl = f(z)
