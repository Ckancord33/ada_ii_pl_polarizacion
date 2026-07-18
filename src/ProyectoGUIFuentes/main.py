import eel
import os
import subprocess
import time
import json
import re
import threading





def _format_dzn(n, m, p, v, ce, c_matrix, ct, max_movs):
	p_str = "[" + ",".join(str(int(float(x))) for x in p) + "]"
	v_str = "[" + ",".join(str(float(x)) for x in v) + "]"
	ce_str = "[" + ",".join(str(float(x)) for x in ce) + "]"
	rows_str = []
	for row in c_matrix:
		row_str = ",".join(str(float(x)) for x in row)
		rows_str.append(row_str)
	costo_str = "[| " + " \n\t| ".join(rows_str) + " |]"
	contenido = (
		f"n = {int(float(n))};\n"
		f"m = {int(float(m))};\n"
		f"p = {p_str};\n"
		f"v = {v_str};\n"
		f"ce = {ce_str};\n"
		f"costo = {costo_str};\n"
		f"ct = {float(ct)};\n"
		f"MaxMovs = {int(float(max_movs))};"
	)
	return contenido


def _run_batch_tests_thread(solver: str, timeout_seconds: float):
	try:
		web_dir = os.path.dirname(__file__)
		src_dir = os.path.abspath(os.path.join(web_dir, '..'))
		datos_dir = os.path.join(src_dir, 'DatosProyecto')
		
		if not os.path.exists(datos_dir):
			eel.on_batch_finished({"status": "error", "message": "Directorio DatosProyecto no encontrado"})()
			return
			
		files = [f for f in os.listdir(datos_dir) if f.endswith('.mpl')]
		
		# Sort files naturally so they go MinPol1, MinPol2, ..., MinPol10
		def natural_sort_key(s):
			return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]
		files = sorted(files, key=natural_sort_key)
		
		temp_dzn_path = os.path.join(src_dir, '_batch_temp.dzn')
		
		for filename in files:
			# Notify frontend that this test is starting
			eel.on_test_started(filename)()
			
			file_path = os.path.join(datos_dir, filename)
			res = {
				"instancia": filename,
				"polarizacion": None,
				"tiempo_ejecucion_cpu": 0.0,
				"tiempo_solve": None,
				"estado": "Error"
			}
			try:
				mpl_data = read_mpl_file(filename)
				if mpl_data["status"] != "success":
					raise Exception(mpl_data.get("message", "Error al leer archivo"))
				d = mpl_data["data"]
				contenido = _format_dzn(d["n"], d["m"], d["p"], d["v"], d["ce"], d["c"], d["ct"], d["max_movs"])
				
				with open(temp_dzn_path, 'w', encoding='utf-8') as f:
					f.write(contenido)
					
				# Time limit in ms for MiniZinc
				timeout_ms = int(timeout_seconds * 1000)
				cmd = ['minizinc', '--solver', solver, '--statistics', '-t', str(timeout_ms), 'proyecto.mzn', '_batch_temp.dzn']
				start = time.perf_counter()
				
				try:
					# Add a buffer to the subprocess timeout so MiniZinc has a chance to terminate itself
					proc = subprocess.run(cmd, cwd=src_dir, capture_output=True, text=True, timeout=timeout_seconds + 2.0)
					elapsed = time.perf_counter() - start
					
					pol = None
					solve_time = None
					estado = "Completado"
					
					if proc.stdout:
						pol_match = re.search(r'La polarizacion final es:\s*([\d.+\-eE]+)', proc.stdout)
						if pol_match:
							pol = float(pol_match.group(1))
							
						solve_time_match = re.search(r'solveTime=([\d.+\-eE]+)', proc.stdout)
						if solve_time_match:
							solve_time = float(solve_time_match.group(1))
					
					# If elapsed time is greater than or equal to timeout_seconds, or solveTime is absent and elapsed is close
					if elapsed >= timeout_seconds or (proc.stderr and "timeout" in proc.stderr.lower()):
						estado = "Timeout"
						pol = None
						solve_time = None
						elapsed = min(elapsed, timeout_seconds)
						
					res = {
						"instancia": filename,
						"polarizacion": pol,
						"tiempo_ejecucion_cpu": round(elapsed, 4),
						"tiempo_solve": solve_time,
						"estado": estado
					}
				except subprocess.TimeoutExpired:
					res = {
						"instancia": filename,
						"polarizacion": None,
						"tiempo_ejecucion_cpu": timeout_seconds,
						"tiempo_solve": None,
						"estado": "Timeout"
					}
			except Exception as ex:
				res["error"] = str(ex)
				
			# Send individual test result to JS
			eel.on_test_completed(res)()
			
		# Clean up temporary DZN file
		if os.path.exists(temp_dzn_path):
			try:
				os.remove(temp_dzn_path)
			except:
				pass
				
		eel.on_batch_finished({"status": "success", "count": len(files)})()
		
	except Exception as e:
		eel.on_batch_finished({"status": "error", "message": str(e)})()


@eel.expose
def start_batch_tests(solver: str = 'HiGHS', timeout_seconds: float = 30.0):
	# Start batch test in a separate background thread
	threading.Thread(target=_run_batch_tests_thread, args=(solver, timeout_seconds), daemon=True).start()



@eel.expose
def process_data(contenido: str, solver: str = 'SCIP') -> dict:
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

