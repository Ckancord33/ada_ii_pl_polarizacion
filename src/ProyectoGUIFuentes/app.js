const numberPeopleInput = document.querySelector('.number-people-input');
const numberOpinionsInput = document.querySelector('.number-opinions-input');
const totalCostInput = document.querySelector('.cost-total-input');
const numberMaxInput = document.querySelector('.number-max-mov-input');

numberOpinionsInput.addEventListener('change', function() {
    console.log('Número de personas:', numberOpinionsInput.value);
    addTableColumn(numberOpinionsInput.value,'.distribution-opinion-table',"Personas por opinión")
    addTableColumn(numberOpinionsInput.value,'.value-opinion-table',"Valor por opinión")
    addTableColumn(numberOpinionsInput.value,'.costoe-opinion-table',"Costo extra por opinión")
    addTableMatrix(numberOpinionsInput.value)
});

function addTableColumn(value,table,initMessage){

    table = document.querySelector(table);
    
    thead = document.createElement('thead')
    table.appendChild(thead)

    thInit = document.createElement('th')
    thInit.innerHTML = initMessage
    thead.appendChild(thInit)

    for (let i = 1; i <= value ; i++){
        let th = document.createElement('th')
        th.innerHTML = "" + i
        thead.appendChild(th)
    }

    tbody = document.createElement('tbody')
    table.appendChild(tbody)

    tdInit = document.createElement('td')
    tdInit.innerHTML = "    "
    tbody.appendChild(tdInit)

    for (let i = 1; i <= value ; i++){
        let td = document.createElement('td')
        let input = document.createElement('input')
        input.type = "number"
        td.appendChild(input)
        tbody.appendChild(td)
    }
}

function getValueTables(table){
    const headerCells = document.querySelectorAll(table + ' tbody td');

    listValue = []
    Array.from(headerCells).forEach((td, indice) => {
        if (indice > 0){
            input = td.lastChild
            if (input && input.value !== undefined) {
                listValue.push(input.value)
            }
        }
    }); 

    listValueString = "["

    listValue.forEach((val) => {
        listValueString += val + ","
    })

    listValueString = listValueString.slice(0, -1); 
    listValueString += "]"

    return listValueString

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
                alert("Proceso finalizado. Salida:\n" + resp);
                console.log(resp);
            });
        } else {
            alert('Eel no está disponible en este entorno.');
        }
    } catch (err) {
        console.error(err);
        alert('Error inesperado: ' + err);
    }


})