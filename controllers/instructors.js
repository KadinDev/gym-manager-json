// create
const fs = require('fs')
const data = require('../data.json')

// necessário para usarmos a data conforme vemos no Brasil
const intl = require('intl')

// trazendo age e date do utils
const { age, date } = require('../utils')

// o index 
exports.index = function( req, res ){

    return res.render('instructors/index', { instructors: data.instructors })
}

// tratando form
exports.post = function(req, res) {

    // fazendo array com as chaves do form (inputs) 
    const keys = Object.keys(req.body)
    
    // estrutura de repetição nos inputs para verificar se algum está vazio
    // validando o form
    for( key of keys ){
        if ( req.body[key] == "" ){
            return res.send(' Please, fill all fields!')
        }
    }

    // let pq os items poderão ser atualizados em EDITAR
    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(birth) 
    const created_at = Date.now()
    //const id = Number(data.instructors.length + 1)

    let id = 1
    // pegando o ultimo id
    const lastInstructor = data.instructors[data.instructors.length - 1]

    if (lastInstructor){
        // pegando o ultimo id e adicionar mais um id
        id = lastInstructor.id + 1
    }

    // criando ordem para ser colocado no JSON
    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at,
    })

    // craindo o JSON com as informações recebidas nos inputs
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error){
        if (error) return res.send('Write file erro')
    } )

    return res.redirect(`/instructors/${id}`)
}

// show
exports.show = function( req, res ){
    // tirando o id do req.params, e fazendo dele uma variável
    const { id } = req.params


    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instructor Not Found!')

    const instructor = {
        // espalhando foundInstructor (informações que estão no JSON criado)
        ... foundInstructor,

        age: age(foundInstructor.birth),
        
        // services, separando as info na área de atuação com , 
        services: foundInstructor.services.split(","),

        // criando a data de cadastro no momento que o usuário se cadastrar 
        created_at: new intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render('instructors/show', { instructor })
}

exports.create = function( req, res ){
    return res.render('instructors/create')
}

// edit
exports.edit = function( req, res ){

    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instructor Not Found!')

    const instructors = {
        ... foundInstructor,
        birth: date(foundInstructor.birth).iso
    }
    

    return res.render('instructors/edit', { instructors } )
}


// atualizando instrutores
exports.put = function( req, res ){
    // de dentro do req.body eu vou procurar o id (desestruturar)
    const { id } = req.body
    let index = 0

    // procurando se o instrutor já está cadastrado
    // foundIndex como segundo parâmetro, quando instructor for 1, foundIndex tbm será 1, e assim por diante
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send('Instructor Not Found!')

    const instructor = {
        // espalhando os dados do foundInstructor
        ...foundInstructor,
        // espalhando tudo que trouxe do req.body
        ...req.body,
        
        // trazendo do req.body para salvar
        birth: Date.parse(req.body.birth),

        // Configurando para quando fizer edições, ser salvo o id sempre como number
        id: Number(req.body.id) 

    }

    
    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write error!')

        return res.redirect(`/instructors/${id}`)
    })
}


exports.delete = function( req, res ){
    const { id } = req.body                    
    
    // filter = vai filtrar, faz uma extrutura de repetição tbm
    const filteredInstructors = data.instructors.filter(function(instructor){

        // pegar todos menos esse id que está deletando
        // se o id for diferente vai pegar todos menos esse id que está diferente
        return instructor.id != id         
    } )

    data.instructors = filteredInstructors

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write error!')
    })

    return res.redirect('/instructors')

}

// update

// delete