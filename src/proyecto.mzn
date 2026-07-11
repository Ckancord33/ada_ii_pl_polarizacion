%Implementacion del modelo generico en MiniZinc

% -----------------------------
% PARAMETROS
% -----------------------------

int: n; %cantidad de personas
int: m; %cantidad de opiniones
int: maxM; %cantidad maxima de movimientos
float: ct; %costo maximo

array [1..m] of 0..n: p; %araray de personas en cada opinion
array [1..m] of 0.0..1.0: v; %array del valor de las opiniones
array [1..m] of float: ce; %costo extra de cada opinion si esta vacia

array[1..m, 1..m] of float: c; %costo de pasar de la opinion i a la opinion j

% -----------------------------
% VARIABLES DE DESICION
% -----------------------------

array[1..m, 1..m] of var 0..n: x; %cuantas personas vamos a pasar de la opinion i a la j
array[1..m] of var 0..n: p_mod; %array de personas en cada opinion con las modificaciones hechas

% -----------------------------
% RESTRICCIONES
% -----------------------------


constraint forall(i,j in 1..m)(x[i,j] >= 0); %restriccion de positividad
constraint forall(i in 1..m)(
    sum(j in 1..m)(x[i,j]) <= p[i]
); %no se pueden pasar mas personas de las que hay en un lugar
constraint sum(i in 1..m)(sum(j in 1..m)(x[i,j])) <= maxM; %no se pueden hacer mas movimientos de los permitidos
constraint forall(i in 1..m)(p_mod[i] = p[i] - sum(j in 1..m)(x[i,j]) + sum(j in 1..m)(x[j,i])); %lo que sale de la opinion i llega a la opinion j
constraint forall(i in 1..m)(x[i,i] = 0);

constraint sum(i,j in 1..m)(if p[j] > 0 then x[i,j] * c[i,j] * (1 + p[i]/n) else x[i,j] * c[i,j] * (1 + p[i]/n) + ce[j] * x[i,j]  endif) <= ct; %los movimientos no pueden superar el costo maximo

% -----------------------------
% CALCULAR MEDIANA
% -----------------------------

%el indice de la mediana se calcula con el array que prueba las posibles modificaciones p_mod
%este se calcula con 2 restricciones ya que la mediana es la mitad de las personas
%las 2 constraints aseguran que el indice que se encuentra estan las 2 mitades
%luego solo se pone el indice en el array de valores para obtener la mediana
var 1..m: idx_mediana;
constraint sum(i in 1..idx_mediana)(p_mod[i]) >= ((n+1) div 2);
constraint sum(i in idx_mediana..m)(p_mod[i]) >= ((n+1) div 2);

var 0.0..1.0: mediana = v[idx_mediana];

% -----------------------------
% FUNCION OBJETIVO
% -----------------------------

var float: pol; %funcion objetivo que calcula la polarizacion

constraint pol = sum(i in 1..m)(p_mod[i] + abs(v[i] - mediana));

% -----------------------------
% SOLUCION Y OUTPUT
% -----------------------------

solve minimize pol;

output["Los cambios x_ij fueron: ", show(x), "\nLa polarizacion final es: ", show(pol)];
