window.addEventListener("load", function () {
    let tabla = document.getElementById("tabla");
    tabla.setAttribute("id", "tabla");
    let tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
    console.log(this.getDatos());
    console.log(this.loadLocalidades());
  });

async function loadLocalidades()
{
    var xhttp = new XMLHttpRequest();

    let promise = new Promise((exito, fallo) => {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var localidades = this.response;
                let array = JSON.parse(localidades);
                array.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = element.id;
                    opt.innerHTML = element.nombre;
                  document.getElementById("localidades").appendChild(opt);
                });
                exito("Carga exitosa de localidades.");
            }
            else if(this.readyState == 4 && this.status == 404)
            {
                fallo("Carga fallida de localidades");
            }
        };
    });
    xhttp.open("GET", "http://localhost:3000/localidades", true);
    xhttp.send();
    resultado = await promise;
    return resultado;
}

function llenarTabla(personas) {
    let nombre = personas.nombre;
    let apellido = personas.apellido;
    let sexo = personas.sexo;
    let id = personas.id;
    let localidad = personas.localidad;
  
    let tabla = document.getElementById("tabla");
  
    let fila = document.createElement("tr");
    fila.setAttribute("id", personas.id);
    
    let data1 = document.createElement("td");
    data1.appendChild(document.createTextNode(id));
    fila.appendChild(data1);
    
    let celda1 = document.createElement("td");
    celda1.appendChild(document.createTextNode(nombre));
    fila.appendChild(celda1);
    
    let row_2_data_2 = document.createElement("td");
    row_2_data_2.appendChild(document.createTextNode(apellido));
    fila.appendChild(row_2_data_2);
    
    let row_2_data_5 = document.createElement("td");
    row_2_data_5.appendChild(document.createTextNode(localidad.nombre));
    fila.appendChild(row_2_data_5);
    
    let row_2_data_3 = document.createElement("td");
    row_2_data_3.appendChild(document.createTextNode(sexo));
    fila.appendChild(row_2_data_3);
    
    fila.ondblclick = function (event) {
        asignarEventoBox(personas);
    };
    
    tabla.appendChild(fila);
}

function actualizarFila(persona) {
    let nombre = persona.nombre;
    let apellido = persona.apellido;
    let sexo = persona.sexo;
    let id = persona.id;
    let localidad = persona.localidad.nombre;
    
    var fila = document.getElementById(persona.id);
    
    let fila_nueva = document.createElement("tr");
    fila_nueva.setAttribute("id", persona.id);
    
    let data1 = document.createElement("td");
    data1.appendChild(document.createTextNode(id));
    let data2 = document.createElement("td");
    data2.appendChild(document.createTextNode(nombre));
    let data3 = document.createElement("td");
    data3.appendChild(document.createTextNode(apellido));
    let data4 = document.createElement("td");
    data4.appendChild(document.createTextNode(localidad));
    let data5 = document.createElement("td");
    data5.appendChild(document.createTextNode(sexo));
    fila_nueva.appendChild(data1);
    fila_nueva.appendChild(data2);
    fila_nueva.appendChild(data3);
    fila_nueva.appendChild(data4);
    fila_nueva.appendChild(data5);
    
    fila_nueva.ondblclick = function (event) {
        asignarEventoBox(persona);
    };
    
    fila.replaceWith(fila_nueva);
    closeDialog();
}

async function getDatos() {
    var xhttp = new XMLHttpRequest();

    let resultado;
    let promise = new Promise((exito, fallo) => {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var personas = this.response;
                let array = JSON.parse(personas);
                array.forEach((element) => {
                    llenarTabla(element);
                });
                exito("Carga exitosa de personas.");
            }
            else if(this.readyState == 4 && this.status == 404)
            {
                fallo("Carga fallida de personas");
            }
        };
    });
    xhttp.open("GET", "http://localhost:3000/personas", true);
    xhttp.send();
    resultado = await promise;
    return resultado;
  }

  function asignarEventoBox(persona) {
    var dialog = document.getElementById("favDialog");
    dialog.show();
  
    document.getElementById("id").value = persona.id;
    document.getElementById("name").value = persona.nombre;
    document.getElementById("lastname").value = persona.apellido;
    if (persona.sexo == "Male") {
      document.getElementById("Male").checked = true;
    } else {
      document.getElementById("Female").checked = true;
    }
    largo = document.getElementById("localidades").options.length;
    for(var i = 0; i < largo; i++ )
    {
        if(document.getElementById("localidades").options[i].value == persona.localidad.id)
        {
            document.getElementById("localidades").selectedIndex = i;
        }
    }
  }

  
function reestablecerMarcos() {
    if (document.getElementById("name").classList.contains("validate-wrong")) {
        document.getElementById("name").classList.remove("validate-wrong");
    }
    if (
        document.getElementById("lastname").classList.contains("validate-wrong")
        ) {
            document.getElementById("lastname").classList.remove("validate-wrong");
        }
}
        
async function obtenerLocaliudadPorId(idLocalidad)
{
    var xhttp = new XMLHttpRequest();
    let resultado;
    let promise = new Promise((exito, fallo) => {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var localidades = this.response;
                let array = JSON.parse(localidades);
                array.forEach((element) => {
                    if(element.id == idLocalidad)
                    {
                        exito(element);
                    }
                });
            }
            else if(this.readyState == 4 && this.status == 404)
            {
                fallo("Error al obtener localidad");
            }
        };
    });
    xhttp.open("GET", "http://localhost:3000/localidades", true);
    xhttp.send();
    resultado = await promise;
    return resultado;
}

async function modificarPersona() {
    let persona = { id: 0, nombre: "", apellido: "", localidad: {}, sexo: "" };
    persona.id = document.getElementById("id").value;
    persona.nombre = document.getElementById("name").value;
    persona.apellido = document.getElementById("lastname").value;
    var idLocalidad = document.getElementById("localidades").value;
    var localidadSeleccionada = await obtenerLocaliudadPorId(idLocalidad);
    persona.localidad = localidadSeleccionada;
    if (document.getElementById("Male").checked) {
        persona.sexo = "Male";
    } else {
        persona.sexo = "Female";
    }
    if (chequearInputs()) {
        reestablecerMarcos();
        console.log(post_editar("http://localhost:3000/editar", JSON.stringify(persona)));
        document.getElementById("divSpinner").hidden = false;
    }
}

function chequearInputs() {
    var retorno = true;
    if (document.getElementById("name").value.length < 3) {
        document.getElementById("name").classList.add("validate-wrong");
        retorno = false;
    }
    if (document.getElementById("lastname").value.length < 3) {
        document.getElementById("lastname").classList.add("validate-wrong");
        retorno = false;
    }
    return retorno;
}

async function post_editar(url, formData) {
    var xhttp = new XMLHttpRequest();
    
    let resultado;
    let promise = new Promise((exito, fallo) => {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("divSpinner").hidden = true;
                var persona = this.response;
                actualizarFila(JSON.parse(persona));
                exito("Se editaron correctamente los datos");
            }
            else if(this.readyState == 4 && this.status == 404)
            {
                fallo("Error al editar datos");
            }
        };
    });
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(formData);
    resultado = await promise;
    return resultado; 
}


function closeDialog() {
    var dialogoPregunta = document.getElementById("favDialog");
    dialogoPregunta.close();
    reestablecerMarcos();
}