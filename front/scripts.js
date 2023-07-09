/*
  --------------------------------------------------------------------------------------
  Variaveis Globais
  --------------------------------------------------------------------------------------
*/

var minutes = 0
var dificuldade = []
var itens_totais = 0
var lista_atividades = []

/*
  --------------------------------------------------------------------------------------
  Função para formatar a data apresentada
  --------------------------------------------------------------------------------------
*/

const formatDateValue = (dateValue) => {
    let timestampDate = Date.parse(dateValue.toString())
    let inputDate = new Date(timestampDate)
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    if (date < 10) {
        date = '0' + date;
    } if (month < 10) {
        month = '0' + month;
    }

    formatDate = date + "/" + month + "/" + year
    return formatDate

}

/*
--------------------------------------------------------------------------------------
Função para formatar a hora apresentada e realizar cálculos
--------------------------------------------------------------------------------------
*/
const formatTimeValue = (timeValue) => {
    total = []
    let h = timeValue.charAt(0) + timeValue.charAt(1)
    let m = timeValue.charAt(3) + timeValue.charAt(4)
    if (parseInt(h) != 0) {
        total.push(h)
    } else {
        total.push(0)
    }
    total.push(parseInt(m))
    return total
}

const formatHourValue = (minuteValue) => {
    var h = Math.floor(minuteValue / 60);
    var m = minuteValue % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    document.getElementById("qtHours").innerHTML = h + ':' + m;
}

/*
--------------------------------------------------------------------------------------
Função para formatar a dificuldade
--------------------------------------------------------------------------------------
*/

const formatLevelValue = (dificultyLevel) => {
    var soma = dificultyLevel.reduce(function (soma, i) {
        return soma + i;
    });

    var total = soma / dificultyLevel.length
    document.getElementById("qtLevel").innerHTML = total.toFixed(1)
}


/*
--------------------------------------------------------------------------------------
Função para formatar o total de atividades
--------------------------------------------------------------------------------------
*/

const formatTotalValue = (totalList) => {
    document.getElementById("qtTotal").innerHTML = totalList.length
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/atividades';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.atividades.forEach(atv => insertList(atv.data, atv.nome_atividade, atv.dificuldade, atv.tempo_gasto))
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

getList()

/*
--------------------------------------------------------------------------------------
Função para inserir items na lista apresentada
--------------------------------------------------------------------------------------
*/
const insertList = (date_act, name_act, level, time_act) => {
    date_act = formatDateValue(date_act)
    var timeTotal = formatTimeValue(time_act)
    var table = document.getElementById('tableAct');
    var row = table.insertRow();
    var item = [date_act, name_act, level, time_act]

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
    }
    insertButton(row.insertCell(-1))
    document.getElementById("dateValue").value = ""
    document.getElementById("activityValue").value = ""
    document.getElementById("levelValue").value = ""
    document.getElementById("timeValue").value = ""

    removeElement()

    /*Adicionando nas Horas totais*/
    for (var i = 0; i < timeTotal.length; i++) {
        if (i == 0) {
            minutes += parseInt(timeTotal[i] * 60)
        } else {
            minutes += parseInt(timeTotal[i])
        }
    }
    formatHourValue(minutes)

    /*Adicionando na Dificuldade*/
    dificuldade.push(parseInt(level))
    formatLevelValue(dificuldade)

    /*Adicionando na lista local de atv*/
    lista_atividades.push(name_act)
    formatTotalValue(lista_atividades)
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar atividade ao servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/

const postItem = async (inputDate, inputActivity, InputLevel, InputTime) => {
    const formData = new FormData();
    formData.append('data', inputDate);
    formData.append('nome_atividade', inputActivity);
    formData.append('dificuldade', InputLevel);
    formData.append('tempo_gasto', InputTime)

    let url = 'http://127.0.0.1:5000/atividade';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });

}
/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/

const newItem = () => {
    let inputDate = document.getElementById("dateValue").value;
    let inputActivity = document.getElementById("activityValue").value;
    let InputLevel = document.getElementById("levelValue").value;
    let InputTime = document.getElementById("timeValue").value;

    if (InputLevel > 10 || InputLevel < 0) { //checando valor input dificuldade
        document.getElementById("errorMessage").style.display = "block"
        document.getElementById("errorMessage").innerHTML = "Valor da dificuldade entre 0 e 10!"
    } else if (inputDate === '' || inputActivity === '' || InputLevel === '' || InputTime === '') {
        document.getElementById("errorMessage").style.display = "block"
    } else {
        inputDate = inputDate.concat(" ", "00:00:00")
        insertList(inputDate, inputActivity, InputLevel, InputTime)
        postItem(inputDate, inputActivity, InputLevel, InputTime)
        document.getElementById("errorMessage").style.display = "none"
    }

}

/*
--------------------------------------------------------------------------------------
Função para criar um botão close para cada item da lista
--------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
}

/*
--------------------------------------------------------------------------------------
Função para remover um item da lista de acordo com o click no botão close
--------------------------------------------------------------------------------------
*/
const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement.parentElement;
            const itemName = div.getElementsByTagName('td')[1].innerHTML
            const itemTime = div.getElementsByTagName('td')[3].innerHTML
            const itemLevel = div.getElementsByTagName('td')[2].innerHTML

            if (confirm("Você tem certeza?")) {
                // Removendo tempo da métrica
                timeTotal = formatTimeValue(itemTime)
                for (var i = 0; i < timeTotal.length; i++) {
                    if (i == 0) {
                        minutes -= parseInt(timeTotal[i] * 60)
                    } else {
                        minutes -= parseInt(timeTotal[i])
                    }
                }
            
                // Removendo dificuldade da média
                for (var i = 0; i < dificuldade.length; i++) {
                    if (dificuldade[i] == parseInt(itemLevel)) {
                        dificuldade.splice(i,1)
                    }
                }

                //Removendo da lista de atividades
                lista_atividades.pop()

                formatTotalValue(lista_atividades)
                formatHourValue(minutes)
                formatLevelValue(dificuldade)
                div.remove()
                deleteItem(itemName)
                alert("Removido!")
            }
        }
    }


}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
    let url = 'http://127.0.0.1:5000/delAtividade?nome_atividade=' + item;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}