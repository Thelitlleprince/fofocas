const KEY_BD = '@cadenot'
var listaRegistros = {
    ultimoID: 0,
    usuarios: []
}
function salvarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}
function lerBD() {
    const data = localStorage.getItem(KEY_BD)
    if(data) {
        listaRegistros = JSON.parse(data)
    }
    draw()
}
function draw() {
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        tbody.innerHTML = listaRegistros.usuarios
            .sort((a, b) => {
                return a.titulo < b.titulo ? -1 : 1
            })
            .map(usuarios => {
                return `<tr>
                        <td>${usuarios.id}</td>
                        <td>${usuarios.titulo}</td>
                        <td>${usuarios.categoria}</td>
                        <td>
                        <button class='botao' onclick = 'vizualizar("cadastro", false, ${usuarios.id})' >EDITAR</button>
                        <button class='botaov' onclick = 'perguntar(${usuarios.id})'>APAGAR</button>
                        </td>
                    </tr>`
            }).join('')
    }
}
function insertMedico(titulo, categoria) {
    const id = listaRegistros.ultimoID + 1;
    listaRegistros.ultimoID = id;
    listaRegistros.usuarios.push({
        id, titulo, categoria
    })
    salvarBD()
    draw()
    vizualizar('lista')
}
function editMedico(id, titulo, categoria) {
    var usuarios = listaRegistros.usuarios.find(usuarios => usuarios.id == id)
    usuarios.titulo = titulo;
    usuarios.categoria = categoria;
    salvarBD()
    draw()
    vizualizar('lista')
}
function deletMedico(id) {
    listaRegistros.usuarios = listaRegistros.usuarios.filter(usuarios => {
        return usuarios.id != id
    })
    salvarBD()
    draw()
}
function perguntar(id) {
    if(confirm('Deseja apagar o ID' +id)) {
        deletMedico(id)
    }
}
function limpar() {
    document.getElementById('titulo').value = ''
    document.getElementById('categoria').value = ''
}
function vizualizar(pagina, novo=false, id=null) {
    document.body.setAttribute('page', pagina)
    if (pagina === 'cadastro'){
        if(novo) limpar()
        if(id) {
            const usuarios = listaRegistros.usuarios.find(usuarios => usuarios.id === id)
            if(usuarios){
                document.getElementById('id').value = usuarios.id
                document.getElementById('titulo').value = usuarios.titulo
                document.getElementById('categoria').value = usuarios.categoria
            }
        }
        document.getElementById('titulo').focus()
    }
}
function submeter(e) {
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        titulo: document.getElementById('titulo').value,
        categoria: document.getElementById('categoria').value,
    }
    if(data.id) {
        editMedico(data.id, data.titulo, data.categoria)
    }
    else {
        insertMedico(data.titulo, data.categoria)
    }
}
window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
})