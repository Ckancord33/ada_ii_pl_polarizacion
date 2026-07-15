import eel
import os
import subprocess


@eel.expose
def process_data(contenido: str) -> str:
	try:
		web_dir = os.path.dirname(__file__)
		src_dir = os.path.abspath(os.path.join(web_dir, '..'))
		dzn_path = os.path.join(src_dir, 'DatosProyecto.dzn')

		with open(dzn_path, 'w', encoding='utf-8') as f:
			f.write(contenido)

		# Ejecutar MiniZinc en la carpeta src
		cmd = ['minizinc', '--solver', 'HiGHS', 'proyecto.mzn', 'DatosProyecto.dzn']
		proc = subprocess.run(cmd, cwd=src_dir, capture_output=True, text=True)
		output = ''
		if proc.stdout:
			output += proc.stdout
		if proc.stderr:
			output += '\n' + proc.stderr
		return output
	except FileNotFoundError as e:
		return f"Error: ejecutable no encontrado: {e}"
	except Exception as e:
		return f"Error ejecutando proceso: {e}"


if __name__ == '__main__':
	web_dir = os.path.dirname(__file__)
	eel.init(web_dir)
	eel.start('index.html', size=(1920, 1080))

