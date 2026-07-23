import os
import random
import math

def generate_mpl(n, m, filename):
    p = [0]*m
    for _ in range(n):
        p[random.randint(0, m-1)] += 1
    
    v = sorted([round(random.uniform(0, 1), 3) for _ in range(m)])
    
    ce = [round(random.uniform(1.0, 20.0), 3) for _ in range(m)]
    
    c = []
    for i in range(m):
        row = []
        for j in range(m):
            if i == j:
                row.append(0.0)
            else:
                row.append(round(random.uniform(0.1, 5.0), 3))
        c.append(row)
        
    ct = round(n * 20.0, 2)
    max_movs = int(n * 2)
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        f.write(f"{n}\n")
        f.write(f"{m}\n")
        f.write(",".join(map(str, p)) + "\n")
        f.write(",".join(map(str, v)) + "\n")
        f.write(",".join(map(str, ce)) + "\n")
        
        for row in c:
            f.write(",".join(map(str, row)) + "\n")
            
        f.write(f"{ct}\n")
        f.write(f"{max_movs}\n")
    print(f"Generated {filename} (n={n}, m={m})")

# Example
# generate_mpl(1000,70, r"c:/Users/samue/OneDrive/Documentos/ada_ii_pl_polarizacion/src/MisInstancias/real_4_n10000000_m10.mpl")
