/*
  --------------------------------------------------------------------------------------
  Variaveis Globais
  --------------------------------------------------------------------------------------
*/

var minutes = 0
var level_list = []
var item_total = 0
var activities_list = []

/*
  --------------------------------------------------------------------------------------
  Função para formatar a data apresentada
  --------------------------------------------------------------------------------------
*/

const formatDateValue = (input_date) => {
    let time_stamp_date = Date.parse(input_date.toString())
    let stamp_date_input = new Date(time_stamp_date)
    let date, month, year;
    date = stamp_date_input.getDate();
    month = stamp_date_input.getMonth() + 1;
    year = stamp_date_input.getFullYear();

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
const formatTimeValue = (input_time) => {
    total = []
    let h = input_time.charAt(0) + input_time.charAt(1)
    let m = input_time.charAt(3) + input_time.charAt(4)
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

const formatLevelValue = (input_level_list) => {
    total = 0
    if (input_level_list.length > 0) {
        var sum = input_level_list.reduce(function (sum, i) {
            return sum + i;
        });
    
        var total = sum / input_level_list.length
    } 
   
    document.getElementById("qtLevel").innerHTML = total.toFixed(1)

    if(total < 5 ) {
        document.getElementById("qtLevel").style.color = "#A8C896"
    } else if (total > 6) {
        document.getElementById("qtLevel").style.color = "#800046bb"
    } else {
        document.getElementById("qtLevel").style.color = "#ffc767bb"
    }
}


/*
--------------------------------------------------------------------------------------
Função para formatar o total de atividades
--------------------------------------------------------------------------------------
*/

const formatTotalValue = (total_list) => {
    document.getElementById("qtTotal").innerHTML = total_list.length
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

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/

getList()

/*
--------------------------------------------------------------------------------------
Função para inserir items na lista apresentada
--------------------------------------------------------------------------------------
*/
const insertList = (date_act, name_act, level, time_act) => {
    date_act = formatDateValue(date_act)
    var time_total = formatTimeValue(time_act)
    var table = document.getElementById('tableAct');
    var row = table.insertRow();
    var item = [date_act, name_act, level, time_act]

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
        if (i == 2) {
            if (parseInt(item[i]) < 5) {
                cel.style.color = '#A8C896'
            } else if (parseInt(item[i]) > 6) {
                cel.style.color = 'mediumvioletred'
            } else {
                cel.style.color = '#FFCA63'
            }
        }
    }
    insertButton(row.insertCell(-1))
    document.getElementById("dateValue").value = ""
    document.getElementById("activityValue").value = ""
    document.getElementById("levelValue").value = ""
    document.getElementById("timeValue").value = ""

    removeElement()

    /*Adicionando nas Horas totais*/
    for (var i = 0; i < time_total.length; i++) {
        if (i == 0) {
            minutes += parseInt(time_total[i] * 60)
        } else {
            minutes += parseInt(time_total[i])
        }
    }
    formatHourValue(minutes)

    /*Adicionando na Dificuldade*/
    level_list.push(parseInt(level))
    formatLevelValue(level_list)

    /*Adicionando na lista local de atv*/
    activities_list.push(name_act)
    formatTotalValue(activities_list)

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
    let input_date = document.getElementById("dateValue").value;
    let input_activity = document.getElementById("activityValue").value;
    let input_level = document.getElementById("levelValue").value;
    let input_time = document.getElementById("timeValue").value;
 
    if (input_date === '' || input_activity === '' || input_level === '' || input_time === '') {
        document.getElementById("errorMessage").style.display = "block"
    } else if (input_level > 10 || input_level < 0) {
        document.getElementById("errorMessage").style.display = "block"
        document.getElementById("errorMessage").innerHTML = "⚠ Valor da dificuldade deve ser entre 0 e 10"
    } else {
        input_date = input_date.concat(" ", "00:00:00")
        insertList(input_date, input_activity, input_level, input_time)
        postItem(input_date, input_activity, input_level, input_time)
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
  Função para fechar modal
  --------------------------------------------------------------------------------------
*/

function closeModal() {
    document.getElementById("deleteModal").style.display = 'none';
}

/*
  --------------------------------------------------------------------------------------
  Função para confirmar a exclusão pelo usuário
  --------------------------------------------------------------------------------------
*/

const confirmDelete = (time, name, level, div) => {
    //Removendo Tempo da métrica
    let time_final = formatTimeValue(time)
    for (let i = 0; i < time_final.length; i++) {
        if (i == 0) {
            minutes -= parseInt(time_final[i] * 60)
        } else {
            minutes -= parseInt(time_final[i])
        }
    }

    // Removendo dificuldade da média
    for (let i = 0; i < level_list.length; i++) {
        if (level_list[i] == parseInt(level)) {
            level_list.splice(i,1)
        }
    }

    //Removendo da lista de atividades
    activities_list.pop()

    formatTotalValue(activities_list)
    formatHourValue(minutes)
    formatLevelValue(level_list)
    div.remove()
    deleteItem(name)
    //Removendo Modal
    document.getElementById("deleteModal").style.display = 'none'
}


/*
--------------------------------------------------------------------------------------
Função para remover um item da lista de acordo com o click no botão close
--------------------------------------------------------------------------------------
*/
const removeElement = () => {
    let close = document.getElementsByClassName("close");
    let i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement.parentElement;
            const item_name = div.getElementsByTagName('td')[1].innerHTML
            const item_time = div.getElementsByTagName('td')[3].innerHTML
            const item_level = div.getElementsByTagName('td')[2].innerHTML
            document.getElementById("deleteModal").style.display = 'block'
            document.getElementById("btnDelete").onclick = function() {confirmDelete(item_time, item_name, item_level, div)}   
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