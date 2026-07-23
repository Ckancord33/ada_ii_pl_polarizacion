Minimizacion de la Polarizacion en una Poblacion (MinPol)
==========================================================

El proyecto implementa un modelo de programacion entera/mixta para decidir que
esfuerzos hacer para cambiar la opinion de un grupo de personas de manera que
se minimice la polarizacion final del grupo, respetando restricciones y limite
de movimientos.


ESTRUCTURA DE LOS ARCHIVOS
---------------------------

El proyecto esta organizado en las siguientes carpetas y archivos principales:

1. proyecto.mzn
   Archivo principal que contiene la especificacion generica del modelo de
   optimizacion en MiniZinc. Define parametros, variables de decision,
   restricciones, calculo de la mediana, y la funcion objetivo de polarizacion.

2. DatosProyecto.dzn
   Archivo de entrada en formato MiniZinc que contiene una instancia de datos
   de prueba para alimentar al modelo proyecto.mzn.

3. DatosProyecto/
   Directorio que contiene las 30 instancias de prueba del proyecto en formato
   .mpl. Cada archivo .mpl contiene de manera estructurada los parametros para
   simular el problema y las 5 instancias personalizadas.

4. MisInstancias/
   Directorio reservado para almacenar las 5 instancias personalizadas generadas
   por el equipo de trabajo para evaluar y retar la solucion en formato mpl y dzn, además
   del archivo gen_instances.py que fue utilizado para generar grandes instancias aleatorias.

5. ProyectoGUIFuentes/
   Contiene el codigo fuente de la interfaz grafica desarrollada bajo el
   framework Eel (Python + HTML/CSS/JavaScript):
   - main.py     : Servidor en Python que actua como backend, lee archivos .mpl,
                   escribe los datos en archivos .dzn, y ejecuta de forma
                   interactiva y en hilos secundarios las busquedas en MiniZinc.
   - index.html  : Estructura de la pagina web de la interfaz de usuario.
   - style.css   : Hoja de estilos con el diseno visual de la interfaz.
   - app.js      : Logica de interaccion en el lado del cliente (frontend) para
                   realizar consultas, interactuar con Python, cargar datos y
                   renderizar visualmente los reportes.


REQUISITOS DE INSTALACION
--------------------------

Para poder ejecutar la aplicacion de forma local, asegurese de tener instalados
los siguientes componentes:

1. MiniZinc
   - Descargar e instalar MiniZinc desde: https://www.minizinc.org/
   - IMPORTANTE: Asegurar anadir el ejecutable de MiniZinc a la variable de
     entorno PATH del sistema, para que pueda ser invocado desde la consola
     ejecutando el comando: minizinc

2. Python 3
   - Tener Python instalado en el equipo.

3. Dependencia de Eel (Python)
   - Instale la libreria eel ejecutando la siguiente linea en la consola:

       pip install eel


INSTRUCCIONES DE EJECUCION
---------------------------

1. Ejecutar la Aplicacion Grafica (GUI)

   Para lanzar la interfaz de usuario que permite configurar y ejecutar el
   modelo de forma interactiva:

   a) Abra una consola de comandos en la carpeta de las fuentes de la GUI:

        cd "src/ProyectoGUIFuentes"

   b) Ejecute el servidor backend de Python:

        python main.py

   c) Esto levantara la aplicacion web e iniciara automaticamente una ventana
      interactiva. Desde alli podra:
      - Cargar cualquier archivo .mpl disponible.
      - Modificar manualmente parametros como el umbral de costo (ct) o los
        movimientos maximos (MaxMovs).
      - Configurar el resolvedor (HiGHS, SCIP, etc).
      - Ejecutar la simulacion para guardar dinamicamente los datos en
        DatosProyecto.dzn, resolver el modelo proyecto.mzn y desplegar las
        graficas y tablas de resultados correspondientes.


2. Ejecutar directamente desde la Consola (MiniZinc CLI)

   Si desea ejecutar el modelo MiniZinc de forma directa sin usar la interfaz:

   a) Ubiquese en el directorio principal del proyecto:

   b) Ejecute el comando invocando el solver deseado (por ejemplo, HiGHS):

        minizinc --solver HiGHS proyecto.mzn DatosProyecto.dzn

      (Reemplace DatosProyecto.dzn por cualquier otro archivo .dzn que desee evaluar.)
