# Minimización de la Polarización en una Población (MinPol)

 El proyecto implementa un modelo de programación entera/mixta para decidir qué esfuerzos hacer para cambiar la opinión de un grupo de personas de manera que se minimice la polarización final del grupo, respetando restricciones  y límite de movimientos.

---

## Estructura de los Archivos

El proyecto está organizado en las siguientes carpetas y archivos principales dentro del directorio `/src`:

1. **`src/proyecto.mzn`**  
   Archivo principal que contiene la especificación genérica del modelo de optimización en MiniZinc. Define parámetros, variables de decisión, restricciones, cálculo de la mediana, y la función objetivo de polarización.

2. **`src/DatosProyecto.dzn`**  
   Archivo de entrada en formato MiniZinc que contiene una instancia de datos de prueba para alimentar al modelo `proyecto.mzn`.

3. **`src/DatosProyecto/`**  
   Directorio que contiene las 30 instancias de prueba del proyecto en formato `.mpl`. Cada archivo `.mpl` contiene de manera estructurada los parámetros para simular el problema.

4. **`src/MisInstancias/`**  
   Directorio reservado para almacenar las 5 instancias personalizadas generadas por el equipo de trabajo para evaluar y retar la solución.

5. **`src/ProyectoGUIFuentes/`**  
   Contiene el código fuente de la interfaz gráfica desarrollada bajo el framework Eel (Python + HTML/CSS/JavaScript):
   * `main.py`: Servidor en Python que actúa como `backend`, lee archivos `.mpl`, escribe los datos en archivos `.dzn`, y ejecuta de forma interactiva y en hilos secundarios las búsquedas en MiniZinc.
   * `index.html`: Estructura de la página web de la interfaz de usuario.
   * `style.css`: Hoja de estilos con el diseño visual de la interfaz de usuario.
   * `app.js`: Lógica de interacción en el lado del cliente (`frontend`) para realizar consultas, interactuar con Python, cargar datos y renderizar visualmente los reportes.

---

## Requisitos de Instalación

Para poder ejecutar la aplicación de forma local, asegúrese de tener instalados los siguientes componentes:

1. **MiniZinc**  
   * Descargar e instalar MiniZinc desde [minizinc.org](https://www.minizinc.org/).
   * **Importante:** Asegurar añadir el ejecutable de MiniZinc a la variable de entorno `PATH` del sistema, para que pueda ser invocado desde la consola ejecutando el comando `minizinc`.

2. **Python 3**  
   * Tener python en el equipo

3. **Dependencia de Eel (Python)**  
   * Instale la librería `eel` ejecutando la siguiente línea en la consola de comandos:
     ```bash
     pip install eel
     ```

---

## Instrucciones de Ejecución

### 1. Ejecutar la Aplicación Gráfica (GUI)

Para lanzar la interfaz de usuario que permite configurar y ejecutar el modelo de forma interactiva:

1. Abra una consola de comandos en la carpeta de las fuentes de la GUI:
   ```powershell
   cd "src/ProyectoGUIFuentes"
   ```
2. Ejecute el servidor backend de Python:
   ```powershell
   python main.py
   ```
3. Esto levantará la aplicación web e iniciará automáticamente una ventana interactiva. Desde alli podrá:
   * Cargar cualquier archivo `.mpl` disponible.
   * Modificar manualmente parámetros como el umbral de costo (`ct`) o los movimientos máximos (`MaxMovs`).
   * Configurar el resolvedor (`HiGHS`, `SCIP`,etc).
   * Ejecutar la simulación para guardar dinámicamente los datos en `DatosProyecto.dzn`, resolver el modelo `proyecto.mzn` y desplegar las gráficas y tablas de resultados correspondientes.

### 2. Ejecutar directamente desde la Consola (MiniZinc CLI)

Si desea ejecutar el modelo MiniZinc de forma directa sin usar la interfaz gráfica:

1. Ubíquese en el directorio `src/` del proyecto:
   ```powershell
   cd "src"
   ```
2. Ejecute el comando invocando el solver deseado (por ejemplo, `HiGHS`):
   ```powershell
   minizinc --solver HiGHS proyecto.mzn DatosProyecto.dzn
   ```
   *(Reemplace `DatosProyecto.dzn` por cualquier otro archivo `.dzn` que desee evaluar).*