const numberPeopleInput = document.querySelector('.number-people-input');
const numberOpinionsInput = document.querySelector('.number-opinions-input');
const totalCostInput = document.querySelector('.cost-total-input');
const numberMaxInput = document.querySelector('.number-max-mov-input');

numberOpinionsInput.addEventListener('change', function() {
    console.log('Número de opiniones:', numberOpinionsInput.value);
    clearSingleRowTable('.distribution-opinion-table');
    clearSingleRowTable('.value-opinion-table');
    clearSingleRowTable('.costoe-opinion-table');
    clearMatrixTable('.costos-opinion-table');

    addTableColumn(numberOpinionsInput.value, '.distribution-opinion-table', 'Personas por opinión');
    addTableColumn(numberOpinionsInput.value, '.value-opinion-table', 'Valor por opinión');
    addTableColumn(numberOpinionsInput.value, '.costoe-opinion-table', 'Costo extra por opinión');
    addTableMatrix(numberOpinionsInput.value);
});

function clearSingleRowTable(selector) {
    const table = document.querySelector(selector);
    if (table) {
        table.innerHTML = '';
    }
}

function clearMatrixTable(selector) {
    const table = document.querySelector(selector);
    if (table) {
        table.innerHTML = '';
    }
}

function addTableColumn(value,table,initMessage){
    const tableElement = document.querySelector(table);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thInit = document.createElement('th');
    thInit.innerHTML = initMessage;
    headRow.appendChild(thInit);

    for (let i = 1; i <= value; i++) {
        const th = document.createElement('th');
        th.innerHTML = '' + i;
        headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    tableElement.appendChild(thead);

    const tbody = document.createElement('tbody');
    const bodyRow = document.createElement('tr');
    const tdInit = document.createElement('td');
    tdInit.innerHTML = '    ';
    bodyRow.appendChild(tdInit);

    for (let i = 1; i <= value; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';

        if (table === '.distribution-opinion-table') {
            input.min = '1';
            input.step = '1';
        } else if (table === '.value-opinion-table') {
            input.min = '0';
            input.max = '1';
            input.step = '0.01';
        } else if (table === '.costoe-opinion-table') {
            input.step = 'any';
        }

        bodyRow.appendChild(td);
        td.appendChild(input);
    }

    tbody.appendChild(bodyRow);
    tableElement.appendChild(tbody);
}

function getValueTables(table){
    const row = document.querySelector(table + ' tbody tr');
    if (!row) return '[]';

    const cells = row.querySelectorAll('td');
    const listValue = [];

    Array.from(cells).forEach((td, indice) => {
        if (indice > 0) {
            const input = td.querySelector('input');
            if (input && input.value !== undefined) {
                listValue.push(input.value);
            }
        }
    });

    return '[' + listValue.join(',') + ']';
}


function addTableMatrix(value){
    table = document.querySelector(".costos-opinion-table");

    thead = document.createElement('thead')
    table.appendChild(thead)

    thInit = document.createElement('th')
    thead.appendChild(thInit)

    for (let i = 1; i <= value ; i++){
        let th = document.createElement('th')
        th.innerHTML = "" + i
        thead.appendChild(th)
    }

    for (let i = 1; i <= value ; i++){
        let tr = document.createElement('tr')
        table.appendChild(tr)
        for(let j = 0; j <= value; j++){
            let td = document.createElement('td')
            let input = document.createElement('input')
            input.type = "number"
            j == 0 ? td.innerHTML = "" + i : td.appendChild(input)
            tr.appendChild(td)
        }
    }

}

function getValueTableMatrix(){
    const headerCells = document.querySelectorAll('.costos-opinion-table tr');
    matrix = []

    Array.from(headerCells).forEach((tr, indice) => {
        rowValues = []
        
        Array.from(tr.cells).forEach((td, j) => {
            if (j > 0){
                input = td.lastChild
                if (input && input.value !== undefined) {
                    rowValues.push(input.value)
                }
            }
        }); 

        matrix.push(rowValues)
    }); 

    matrixString = "[|"

    matrix.forEach((row) => {
        row.forEach((val,indice) => {
            if(indice == row.length - 1){
                matrixString += val
            }else{
                matrixString += val + ","
            }
        })
        matrixString += "\n\t|"
    })

    matrixString = matrixString.slice(0, -1).trimEnd();
    matrixString += "|]"

    console.log(matrixString)
    return matrixString
}

const calculatePlanBtn = document.getElementById("calculate-plan-btn");
calculatePlanBtn.addEventListener('click',async() => {

    calculatePlanBtn.disabled = true;
    calculatePlanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>CALCULANDO...';

    const n = numberPeopleInput.value
    const m = numberOpinionsInput.value
    const maxM = numberMaxInput.value

    const p = getValueTables(".distribution-opinion-table")
    const v = getValueTables(".value-opinion-table")
    const ce = getValueTables(".costoe-opinion-table")

    const costoMatrix = getValueTableMatrix()

    const ct = totalCostInput.value

    const contenido = "n = " + n + ";\n" + "m = " + m + ";\n" + "p = " + p + ";\n" + "v = " + v + ";\n" + "ce = " + ce + ";\n" + "costo = " + costoMatrix + ";\n" + "ct = " + ct + ";\n" + "MaxMovs = " + maxM + ";"

    const solver = document.getElementById('solver-select').value;

    try {
        if (typeof eel !== 'undefined') {
            eel.process_data(contenido, solver)(function(resp) {
                console.log(resp);
                const instanceName = document.getElementById('mpl-file-select').value || 'Manual';
                updateResultsFromResponse(resp.output, instanceName, resp.cpu_time);

                const timeCard = document.getElementById('result-time-card');
                const cpuTimeEl = document.getElementById('cpu-time');
                if (timeCard && cpuTimeEl) {
                    cpuTimeEl.textContent = resp.cpu_time + ' s';
                    timeCard.style.display = 'flex';
                }
                
                calculatePlanBtn.disabled = false;
                calculatePlanBtn.textContent = 'CALCULAR PLAN DE CAMBIO OPTIMIZADO';
            });
        } else {
            setResultStatus('Error: Eel no está disponible en este entorno.');
            calculatePlanBtn.disabled = false;
            calculatePlanBtn.textContent = 'CALCULAR PLAN DE CAMBIO OPTIMIZADO';
        }
    } catch (err) {
        console.error(err);
        setResultStatus('Error inesperado: ' + err);
        calculatePlanBtn.disabled = false;
        calculatePlanBtn.textContent = 'CALCULAR PLAN DE CAMBIO OPTIMIZADO';
    }


})


// Mode Selection Elements
const modeIndividualBtn = document.getElementById("mode-individual-btn");
const modeBatchBtn = document.getElementById("mode-batch-btn");
const individualLoadSection = document.getElementById("individual-file-load-section");
const individualFields = document.querySelectorAll(".individual-field");
const batchConfigFields = document.getElementById("batch-config-fields");

let latestBatchResults = [];
let latestIndividualResult = null;
let runAllOriginalContent = '';

if (modeIndividualBtn && modeBatchBtn) {
    modeIndividualBtn.addEventListener('click', () => {
        modeIndividualBtn.classList.add('active');
        modeBatchBtn.classList.remove('active');
        
        if (individualLoadSection) individualLoadSection.style.display = 'flex';
        if (individualFields) {
            individualFields.forEach(el => el.style.display = '');
        }
        if (batchConfigFields) batchConfigFields.style.display = 'none';
        if (calculatePlanBtn) calculatePlanBtn.style.display = 'block';
        if (runAllTestsBtn) runAllTestsBtn.style.display = 'none';
    });
    
    modeBatchBtn.addEventListener('click', () => {
        modeBatchBtn.classList.add('active');
        modeIndividualBtn.classList.remove('active');
        
        if (individualLoadSection) individualLoadSection.style.display = 'none';
        if (individualFields) {
            individualFields.forEach(el => el.style.display = 'none');
        }
        if (batchConfigFields) batchConfigFields.style.display = 'block';
        if (calculatePlanBtn) calculatePlanBtn.style.display = 'none';
        if (runAllTestsBtn) runAllTestsBtn.style.display = 'block';
    });
}

if (typeof eel !== 'undefined') {
    // Expose callbacks to Python
    eel.expose(on_test_started);
    function on_test_started(filename) {
        const tbody = document.querySelector('#batch-results-table tbody');
        if (!tbody) return;
        
        const tr = document.createElement('tr');
        tr.id = 'batch-row-' + filename.replace(/[^a-zA-Z0-9]/g, '_');
        
        const tdInst = document.createElement('td');
        tdInst.textContent = filename;
        tr.appendChild(tdInst);
        
        const tdPol = document.createElement('td');
        tdPol.textContent = '—';
        tr.appendChild(tdPol);
        
        const tdCpu = document.createElement('td');
        tdCpu.textContent = '—';
        tr.appendChild(tdCpu);
        
        const tdSolve = document.createElement('td');
        tdSolve.textContent = '—';
        tr.appendChild(tdSolve);
        
        const tdEst = document.createElement('td');
        tdEst.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 6px; color: #D97706;"></i> Ejecutando...';
        tdEst.style.color = '#D97706';
        tdEst.style.fontWeight = '600';
        tr.appendChild(tdEst);
        
        tbody.appendChild(tr);
        
        // Auto-scroll inside table container if it overflows
        const tableContainer = tbody.parentElement ? tbody.parentElement.parentElement : null;
        if (tableContainer) {
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }
    }
    
    eel.expose(on_test_completed);
    function on_test_completed(res) {
        latestBatchResults.push(res);
        
        const rowId = 'batch-row-' + res.instancia.replace(/[^a-zA-Z0-9]/g, '_');
        const tr = document.getElementById(rowId);
        if (!tr) return;
        
        // Update columns
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 5) {
            cells[1].textContent = res.polarizacion !== null ? res.polarizacion.toFixed(4) : '—';
            cells[2].textContent = res.tiempo_ejecucion_cpu.toFixed(3) + ' s';
            cells[3].textContent = res.tiempo_solve !== null ? res.tiempo_solve.toFixed(3) + ' s' : '—';
            
            const tdEst = cells[4];
            tdEst.textContent = res.estado;
            if (res.estado === 'Timeout') {
                tdEst.style.color = '#EF4444';
                tdEst.style.fontWeight = 'bold';
            } else if (res.estado === 'Error') {
                tdEst.style.color = '#EF4444';
                tdEst.style.fontWeight = 'bold';
            } else {
                tdEst.style.color = 'var(--accent-green)';
                tdEst.style.fontWeight = 'bold';
            }
        }
    }
    
    eel.expose(on_batch_finished);
    function on_batch_finished(resp) {
        if (runAllTestsBtn) {
            runAllTestsBtn.disabled = false;
            if (runAllOriginalContent) {
                runAllTestsBtn.innerHTML = runAllOriginalContent;
            }
        }
        if (calculatePlanBtn) {
            calculatePlanBtn.disabled = false;
        }
        
        if (resp && resp.status === 'success') {
            alert(`Pruebas completadas exitosamente.\nSe procesaron ${resp.count} instancias.`);
        } else if (resp && resp.status === 'error') {
            alert('Error al ejecutar pruebas: ' + resp.message);
        }
    }
}

const runAllTestsBtn = document.getElementById("run-all-tests-btn");
if (runAllTestsBtn) {
    runAllTestsBtn.addEventListener('click', async () => {
        runAllTestsBtn.disabled = true;
        if (calculatePlanBtn) calculatePlanBtn.disabled = true;
        
        runAllOriginalContent = runAllTestsBtn.innerHTML;
        runAllTestsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>EJECUTANDO PRUEBAS...';

        const solver = document.getElementById('solver-select').value;
        const timeoutSeconds = parseFloat(document.getElementById('batch-timeout-input').value) || 30.0;
        
        // Clear and show batch view
        latestBatchResults = [];
        const resultadosEl = document.querySelector('.resultados');
        if (resultadosEl) {
            resultadosEl.classList.remove('empty-state');
            resultadosEl.classList.remove('show-single');
            resultadosEl.classList.add('show-batch');
        }
        
        const tbody = document.querySelector('#batch-results-table tbody');
        if (tbody) {
            tbody.innerHTML = '';
        }

        try {
            if (typeof eel !== 'undefined') {
                eel.start_batch_tests(solver, timeoutSeconds);
            } else {
                alert('Error: Eel no está disponible en este entorno.');
                runAllTestsBtn.disabled = false;
                if (calculatePlanBtn) calculatePlanBtn.disabled = false;
                runAllTestsBtn.innerHTML = runAllOriginalContent;
            }
        } catch (err) {
            console.error(err);
            alert('Error inesperado: ' + err);
            runAllTestsBtn.disabled = false;
            if (calculatePlanBtn) calculatePlanBtn.disabled = false;
            runAllTestsBtn.innerHTML = runAllOriginalContent;
        }
    });
}

const copyJsonBtn = document.getElementById("copy-json-btn");
if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', async () => {
        if (!latestBatchResults || latestBatchResults.length === 0) {
            alert('No hay resultados para copiar.');
            return;
        }
        
        const solver = document.getElementById('solver-select').value;
        const timeoutSeconds = parseFloat(document.getElementById('batch-timeout-input').value) || 30.0;
        
        const filtered = latestBatchResults.map(res => ({
            instancia: res.instancia,
            polarizacion: res.polarizacion,
            tiempo_ejecucion_cpu: res.tiempo_ejecucion_cpu,
            tiempo_solve: res.tiempo_solve
        }));
        
        const outputJson = {
            solver: solver,
            tiempo_maximo_por_test: timeoutSeconds,
            resultados: filtered
        };
        
        const jsonText = JSON.stringify(outputJson, null, 4);
        
        try {
            await navigator.clipboard.writeText(jsonText);
            const originalHTML = copyJsonBtn.innerHTML;
            copyJsonBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Copiado!';
            copyJsonBtn.style.backgroundColor = 'var(--accent-green)';
            copyJsonBtn.disabled = true;
            setTimeout(() => {
                copyJsonBtn.innerHTML = originalHTML;
                copyJsonBtn.style.backgroundColor = '';
                copyJsonBtn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error(err);
            alert('Error al copiar al portapapeles: ' + err);
        }
    });
}

const copyIndividualJsonBtn = document.getElementById("copy-individual-json-btn");
if (copyIndividualJsonBtn) {
    copyIndividualJsonBtn.addEventListener('click', async () => {
        if (!latestIndividualResult) {
            alert('No hay resultados para copiar.');
            return;
        }
        
        const jsonText = JSON.stringify(latestIndividualResult, null, 4);
        
        try {
            await navigator.clipboard.writeText(jsonText);
            const originalHTML = copyIndividualJsonBtn.innerHTML;
            copyIndividualJsonBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Copiado!';
            copyIndividualJsonBtn.style.backgroundColor = 'var(--accent-green)';
            copyIndividualJsonBtn.disabled = true;
            setTimeout(() => {
                copyIndividualJsonBtn.innerHTML = originalHTML;
                copyIndividualJsonBtn.style.backgroundColor = '';
                copyIndividualJsonBtn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error(err);
            alert('Error al copiar al portapapeles: ' + err);
        }
    });
}


function setResultStatus(message) {
    const status = document.getElementById('result-status');
    if (status) {
        status.innerHTML = `<p><strong>Estado:</strong> ${message}</p>`;
        status.style.display = 'flex';
    }
}

function updateResultCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function clearResultPlanTable() {
    const tbody = document.querySelector('#result-plan-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }
}

function addResultPlanRow(origin, target, people, cost) {
    const tbody = document.querySelector('#result-plan-table tbody');
    if (!tbody) return;

    const tr = document.createElement('tr');
    [origin, target, people, cost].forEach((text) => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
    });
    tbody.appendChild(tr);
}

function parseMiniZincResponse(response) {
    const result = {
        x: null,
        pol: null,
        p_mod: null,
        mediana: null,
        pol_candidata: null,
        costo_total: null,
    };

    const xMatch = response.match(/Los cambios x_ij fueron:\s*([\s\S]*?\|\])/m);
    if (xMatch) {
        result.x = xMatch[1].trim();
    }

    const polMatch = response.match(/La polarizacion final es:\s*([\d.+\-eE]+)/);
    if (polMatch) {
        result.pol = polMatch[1];
    }

    const pmodMatch = response.match(/El arreglo de personas modificado es:\s*(\[[^\]]*\])/);
    if (pmodMatch) {
        result.p_mod = pmodMatch[1].trim();
    }

    const medianaMatch = response.match(/La mediana es:\s*([\d.+\-eE]+)/);
    if (medianaMatch) {
        result.mediana = medianaMatch[1];
    }

    const polCandidataMatch = response.match(/El arreglo de polarizacion candidata es:\s*(\[[^\]]*\])/);
    if (polCandidataMatch) {
        result.pol_candidata = polCandidataMatch[1].trim();
    }

    const costoTotalMatch = response.match(/El costo total es:\s*([\d.+\-eE]+)/);
    if (costoTotalMatch) {
        result.costo_total = costoTotalMatch[1];
    }

    return result;
}

function extractMiniZincStatistics(response) {
    const lines = response.split(/\r?\n/);
    const statistics = [];
    let insideStatistics = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            if (insideStatistics && statistics.length > 0 && statistics[statistics.length - 1] !== '') {
                statistics.push('');
            }
            continue;
        }

        if (trimmed === '%%%mzn-stat-end') {
            insideStatistics = false;
            continue;
        }

        if (trimmed.startsWith('%%%mzn-stat:')) {
            insideStatistics = true;
            statistics.push(trimmed.replace(/^%%%mzn-stat:\s*/, ''));
            continue;
        }

        if (insideStatistics) {
            statistics.push(trimmed);
        }
    }

    return statistics.join('\n').trim();
}

function extractSolveTime(statisticsText) {
    if (!statisticsText) return null;

    const matches = [...statisticsText.matchAll(/solveTime=([\d.+\-eE]+)/g)];
    if (matches.length === 0) return null;

    return matches[matches.length - 1][1];
}

function parseArrayString(arrayString) {
    if (!arrayString) return [];
    return arrayString
        .replace(/\[|\]/g, '')
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => !Number.isNaN(value));
}

function parseMatrixString(matrixString) {
    const content = matrixString.replace(/\[\|?|\|\]/g, '').trim();
    const rows = content.split(/\|/).map((row) => row.trim()).filter((row) => row.length > 0);
    return rows.map((row) => row.split(',').map((value) => Number(value.trim())));
}

function calculateMedianIndex(counts) {
    const n = counts.reduce((sum, value) => sum + value, 0);
    const half = Math.floor((n + 1) / 2);
    let prefix = 0;
    for (let i = 0; i < counts.length; i++) {
        prefix += counts[i];
        if (prefix >= half) {
            return i;
        }
    }
    return counts.length - 1;
}

function calculatePolarization(counts, values) {
    if (counts.length !== values.length || counts.length === 0) return 0;
    const idx = calculateMedianIndex(counts);
    const medianValue = values[idx];
    return counts.reduce((sum, count, i) => sum + count * Math.abs(values[i] - medianValue), 0);
}

function calculateMoveCost(origin, target, people, pArray, cMatrix, ceArray, n) {
    const pOrigin = pArray[origin];
    const pTarget = pArray[target];
    const cValue = cMatrix[origin][target];
    const extra = pTarget > 0 ? 0 : ceArray[target];
    return people * cValue * (1 + pOrigin / n) + people * extra;
}

function formatPlanFromX(xString, pArray, cMatrix, ceArray, n) {
    const matrix = parseMatrixString(xString);
    const moves = [];

    matrix.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val !== 0) {
                const cost = calculateMoveCost(i, j, val, pArray, cMatrix, ceArray, n);
                moves.push({ origin: i + 1, target: j + 1, people: val, cost: cost.toFixed(2) });
            }
        });
    });

    return moves;
}

let chartInstance = null;

function updateChart(labels, beforeData, afterData) {
    const canvas = document.getElementById('polarization-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (chartInstance) {
        chartInstance.destroy();
    }

    const maxVal = Math.max(...beforeData, ...afterData);
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'ANTES',
                    backgroundColor: '#2dd4bf',
                    borderColor: '#14b8a6',
                    borderWidth: 1,
                    minBarLength: 4,
                    data: beforeData,
                },
                {
                    label: 'DESPUÉS',
                    backgroundColor: '#fb923c',
                    borderColor: '#f97316',
                    borderWidth: 1,
                    minBarLength: 4,
                    data: afterData,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxVal + 1,
                    grid: { color: '#e2e8f0' },
                    ticks: { 
                        color: '#64748b',
                        stepSize: 1
                    }
                },
                x: {
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#64748b' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#1e293b' }
                },
            },
        },
    });
}

function updateResultsFromResponse(response, instanceName, cpuTime) {
    const resultadosEl = document.querySelector('.resultados');
    resultadosEl.classList.remove('empty-state');
    resultadosEl.classList.remove('show-batch');
    resultadosEl.classList.add('show-single');
    const statusEl = document.getElementById('result-status');
    if (statusEl) statusEl.style.display = 'none';

    const statsPanel = document.getElementById('result-stats-card');
    const statsContent = document.getElementById('solver-statistics');
    const solveTimeWrapper = document.getElementById('solve-time-wrapper');
    const solveTimeEl = document.getElementById('solve-time');
    const statisticsText = extractMiniZincStatistics(response);
    if (statsPanel && statsContent) {
        if (statisticsText) {
            statsContent.textContent = statisticsText;
            statsPanel.style.display = 'block';
        } else {
            statsContent.textContent = '—';
            statsPanel.style.display = 'none';
        }
    }

    const solveTime = extractSolveTime(statisticsText);
    const timeCard = document.getElementById('result-time-card');
    if (solveTimeWrapper && solveTimeEl) {
        if (solveTime) {
            solveTimeEl.textContent = solveTime + ' s';
            solveTimeWrapper.style.display = 'inline';
            if (timeCard) timeCard.style.display = 'flex';
        } else {
            solveTimeEl.textContent = '—';
            solveTimeWrapper.style.display = 'none';
        }
    }

    // Show instance name
    const instanceEl = document.getElementById('instance-name');
    if (instanceEl && instanceName) {
        instanceEl.textContent = '— ' + instanceName;
    }

    const parsed = parseMiniZincResponse(response);

    updateResultCard('polarization-initial', 'N/A');
    updateResultCard('polarization-final', parsed.pol ? Number(parsed.pol).toFixed(3) : 'N/A');
    updateResultCard('polarization-reduction', 'N/A');
    updateResultCard('cost-total', parsed.costo_total ? Number(parsed.costo_total).toFixed(4) : 'N/A');

    const beforeArray = parseArrayString(getValueTables('.distribution-opinion-table'));
    const afterArray = parsed.p_mod ? parseArrayString(parsed.p_mod) : [];

    const { pArray, vArray, ceArray, cMatrix, n } = getCurrentCosts();
    const initialPolarization = calculatePolarization(pArray, vArray);
    updateResultCard('polarization-initial', initialPolarization.toFixed(3));

    const reduction = parsed.pol ? (initialPolarization - Number(parsed.pol)).toFixed(3) + " (" + ((initialPolarization - Number(parsed.pol)) / initialPolarization * 100).toFixed(3) + "%)" : 'N/A';
    updateResultCard('polarization-reduction', reduction !== 'NaN' ? reduction : 'N/A');

    clearResultPlanTable();
    let moved = 'N/A';
    if (parsed.x) {
        const moves = formatPlanFromX(parsed.x, pArray, cMatrix, ceArray, n);
        moves.forEach((move) => addResultPlanRow(move.origin, move.target, move.people, move.cost));
        moved = moves.reduce((sum, move) => sum + move.people, 0);
    }
    updateResultCard('people-moved', moved);

    const labels = beforeArray.map((_, index) => 'Op ' + (index + 1));
    updateChart(labels, beforeArray, afterArray);

    // Save individual results as JSON object
    latestIndividualResult = {
        configuracion: {
            instancia: instanceName,
            solver: document.getElementById('solver-select').value,
            numero_personas: n,
            numero_opiniones: pArray.length,
            presupuesto_maximo: Number(document.querySelector('.cost-total-input')?.value || 0),
            max_movimientos: Number(document.querySelector('.number-max-mov-input')?.value || 0),
            distribucion_inicial: pArray,
            valores_opinion: vArray,
            costos_extra: ceArray,
            matriz_costos: cMatrix
        },
        resultados: {
            polarizacion_inicial: Number(initialPolarization.toFixed(3)),
            polarizacion_final: parsed.pol ? Number(Number(parsed.pol).toFixed(3)) : null,
            reduccion_lograda: parsed.pol ? Number((initialPolarization - Number(parsed.pol)).toFixed(3)) : null,
            reduccion_porcentaje: parsed.pol ? Number(((initialPolarization - Number(parsed.pol)) / initialPolarization * 100).toFixed(3)) : null,
            costo_total_utilizado: parsed.costo_total ? Number(Number(parsed.costo_total).toFixed(4)) : null,
            personas_movidas: moved !== 'N/A' ? moved : null,
            tiempo_ejecucion_cpu: cpuTime !== undefined ? Number(cpuTime) : null,
            tiempo_solve: solveTime ? Number(solveTime) : null,
            plan_cambio: parsed.x ? formatPlanFromX(parsed.x, pArray, cMatrix, ceArray, n).map(move => ({
                opinion_origen: move.origin,
                opinion_destino: move.target,
                personas_a_cambiar: move.people,
                costo_parcial: Number(move.cost)
            })) : [],
            estadisticas_solver: statisticsText || null
        }
    };
}

function getCurrentCosts() {
    const pArray = parseArrayString(getValueTables('.distribution-opinion-table'));
    const vArray = parseArrayString(getValueTables('.value-opinion-table'));
    const ceArray = parseArrayString(getValueTables('.costoe-opinion-table'));
    const cMatrix = parseMatrixString(getValueTableMatrix());
    const n = pArray.reduce((sum, value) => sum + value, 0);
    return { pArray, vArray, ceArray, cMatrix, n };
}


// Métodos para la carga de archivos

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof eel !== 'undefined') {
        const files = await eel.get_mpl_files()();
        const select = document.getElementById('mpl-file-select');
        files.forEach(f => {
            const option = document.createElement('option');
            option.value = f;
            option.textContent = f;
            select.appendChild(option);
        });
    }
});

document.getElementById('load-mpl-btn').addEventListener('click', async () => {
    const select = document.getElementById('mpl-file-select');
    if (!select.value) return;
    
    const response = await eel.read_mpl_file(select.value)();
    if (response.status === 'success') {
        const d = response.data;
        numberPeopleInput.value = d.n;
        numberOpinionsInput.value = d.m;
        
        numberOpinionsInput.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            fillTableInputs('.distribution-opinion-table', d.p);
            fillTableInputs('.value-opinion-table', d.v);
            fillTableInputs('.costoe-opinion-table', d.ce);
            
            const cRows = document.querySelectorAll('.costos-opinion-table tr');
            Array.from(cRows).forEach((tr, i) => {
                const inputs = tr.querySelectorAll('input');
                inputs.forEach((input, j) => {
                    input.value = d.c[i][j];
                });
            });
            
            totalCostInput.value = d.ct;
            numberMaxInput.value = d.max_movs;
        }, 100);
    } else {
        alert("Error cargando archivo: " + response.message);
    }
});

function fillTableInputs(selector, array) {
    const rows = document.querySelectorAll(`${selector} tbody tr`);
    if (rows.length === 0) return;
    const inputs = rows[0].querySelectorAll('input');
    inputs.forEach((input, i) => {
        if (i < array.length) {
            input.value = array[i];
        }
    });
}
