%Implementacion del modelo generico en MiniZinc

var int: x;
var int: f;

constraint x >= 5;
constraint x < 10;
constraint f = 10 * x + 2;

solve minimize f;

output["x = ", show(x), "\nf = ", show(f)];
