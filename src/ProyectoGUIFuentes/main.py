import eel
import os
import subprocess
import time


@eel.expose
def process_data(contenido: str, solver: str = 'HiGHS') -> dict:
	try:
		web_dir = os.path.dirname(__file__)
		src_dir = os.path.abspath(os.path.join(web_dir, '..'))
		dzn_path = os.path.join(src_dir, 'DatosProyecto.dzn')

		with open(dzn_path, 'w', encoding='utf-8') as f:
			f.write(contenido)

		cmd = ['minizinc', '--solver', solver, '--statistics', 'proyecto.mzn', 'DatosProyecto.dzn']
		start = time.perf_counter()
		proc = subprocess.run(cmd, cwd=src_dir, capture_output=True, text=True)
		elapsed = time.perf_counter() - start

		output = ''
		if proc.stdout:
			output += proc.stdout
		if proc.stderr:
			output += '\n' + proc.stderr
		return {"output": output, "cpu_time": round(elapsed, 4)}
	except FileNotFoundError as e:
		return {"output": f"Error: ejecutable no encontrado: {e}", "cpu_time": 0}
	except Exception as e:
		return {"output": f"Error ejecutando proceso: {e}", "cpu_time": 0}

@eel.expose
def get_mpl_files():
	try:
		web_dir = os.path.dirname(__file__)
		src_dir = os.path.abspath(os.path.join(web_dir, '..'))
		datos_dir = os.path.join(src_dir, 'DatosProyecto')
		if not os.path.exists(datos_dir):
			return []
		files = [f for f in os.listdir(datos_dir) if f.endswith('.mpl')]
		return files
	except Exception as e:
		print(f"Error getting mpl files: {e}")
		return []

@eel.expose
def read_mpl_file(filename):
	try:
		web_dir = os.path.dirname(__file__)
		src_dir = os.path.abspath(os.path.join(web_dir, '..'))
		file_path = os.path.join(src_dir, 'DatosProyecto', filename)
		
		with open(file_path, 'r', encoding='utf-8') as f:
			lines = [l.strip() for l in f.readlines() if l.strip()]
			
		n = int(lines[0])
		m = int(lines[1])
		p = [float(x) for x in lines[2].split(',')]
		v = [float(x) for x in lines[3].split(',')]
		ce = [float(x) for x in lines[4].split(',')]
		
		c_matrix = []
		for i in range(m):
			row = [float(x) for x in lines[5 + i].split(',')]
			c_matrix.append(row)
			
		ct = float(lines[5 + m])
		max_movs = float(lines[6 + m])
		
		return {
			"status": "success",
			"data": {
				"n": n,
				"m": m,
				"p": p,
				"v": v,
				"ce": ce,
				"c": c_matrix,
				"ct": ct,
				"max_movs": max_movs
			}
		}
	except Exception as e:
		return {"status": "error", "message": str(e)}


if __name__ == '__main__':
	web_dir = os.path.dirname(__file__)
	eel.init(web_dir)
	eel.start('index.html', size=(1920, 1080))

