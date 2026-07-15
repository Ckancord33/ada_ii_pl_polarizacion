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

calculatePlanBtn = document.querySelector(".calculate-plan-btn")
calculatePlanBtn.addEventListener('click',async() => {

    const n = numberPeopleInput.value
    const m = numberOpinionsInput.value
    const maxM = numberMaxInput.value

    const p = getValueTables(".distribution-opinion-table")
    const v = getValueTables(".value-opinion-table")
    const ce = getValueTables(".costoe-opinion-table")

    const c = getValueTableMatrix()

    const ct = totalCostInput.value

    const contenido = "n = " + n + ";\n" + "m = " + m + ";\n" + "maxM = " + maxM + ";\n" + "p = " + 
    p + ";\n" + "v = " + v + ";\n" + "ce = " + ce + ";\n" + "ct = " + ct + ";\n" + "c = " + c  
        
    try {
        if (typeof eel !== 'undefined') {
            eel.process_data(contenido)(function(resp) {
                console.log(resp);
                updateResultsFromResponse(resp);
            });
        } else {
            setResultStatus('Error: Eel no está disponible en este entorno.');
        }
    } catch (err) {
        console.error(err);
        setResultStatus('Error inesperado: ' + err);
    }


})


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
                    data: beforeData,
                },
                {
                    label: 'DESPUÉS',
                    backgroundColor: '#fb923c',
                    borderColor: '#f97316',
                    borderWidth: 1,
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
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#64748b' }
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

function updateResultsFromResponse(response) {
    document.querySelector('.resultados').classList.remove('empty-state');
    const statusEl = document.getElementById('result-status');
    if (statusEl) statusEl.style.display = 'none';

    const parsed = parseMiniZincResponse(response);

    updateResultCard('polarization-initial', 'N/A');
    updateResultCard('polarization-final', parsed.pol || 'N/A');
    updateResultCard('polarization-reduction', 'N/A');
    updateResultCard('cost-total', parsed.costo_total || 'N/A');

    const beforeArray = parseArrayString(getValueTables('.distribution-opinion-table'));
    const afterArray = parsed.p_mod ? parseArrayString(parsed.p_mod) : [];
    const moved = beforeArray.length === afterArray.length
        ? beforeArray.reduce((sum, val, idx) => sum + Math.max(0, val - afterArray[idx]), 0)
        : 'N/A';
    updateResultCard('people-moved', moved);

    const { pArray, vArray, ceArray, cMatrix, n } = getCurrentCosts();
    const initialPolarization = calculatePolarization(pArray, vArray);
    updateResultCard('polarization-initial', initialPolarization.toFixed(4));

    const reduction = parsed.pol ? (initialPolarization - Number(parsed.pol)).toFixed(4) : 'N/A';
    updateResultCard('polarization-reduction', reduction !== 'NaN' ? reduction : 'N/A');

    clearResultPlanTable();
    if (parsed.x) {
        const moves = formatPlanFromX(parsed.x, pArray, cMatrix, ceArray, n);
        moves.forEach((move) => addResultPlanRow(move.origin, move.target, move.people, move.cost));
    }

    const labels = beforeArray.map((_, index) => 'Op ' + (index + 1));
    updateChart(labels, beforeArray, afterArray);
}

function getCurrentCosts() {
    const pArray = parseArrayString(getValueTables('.distribution-opinion-table'));
    const vArray = parseArrayString(getValueTables('.value-opinion-table'));
    const ceArray = parseArrayString(getValueTables('.costoe-opinion-table'));
    const cMatrix = parseMatrixString(getValueTableMatrix());
    const n = pArray.reduce((sum, value) => sum + value, 0);
    return { pArray, vArray, ceArray, cMatrix, n };
}
