# ada_ii_pl_polarizacion
Proyecto final del curso de Analisis y Diseño de algoritmos sobre el tema de optimizacion utilizando programación lineal, donde el problema es minimizar la polarizacion en una serie de opiniones. Cada cambio de opinion tiene un costo y hay un costo maximo que se puede usar para resolver el problema

# Ejecución de un programa minizinc

```powershell
minizinc --solver HiGHS proyecto.mzn test1.dzn
```

Los cambios x_ij fueron:
[| 0, 0, 0, 0, 0
 | 0, 0, 0, 0, 0
 | 0, 0, 0, 0, 0
 | 0, 4, 0, 0, 0
 | 0, 0, 0, 0, 0
 |]
La polarizacion final es: 2.000000000000027
El arreglo de personas modificado es: [8, 12, 0, 0, 0]
La mediana es: 0.25
El arreglo de polarizacion candidata es: [3.0, 2.0, 7.0, 12.0, 17.0]
El costo total es: 24.0
----------
==========