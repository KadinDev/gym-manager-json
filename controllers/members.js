// create
const fs = require('fs')
const data = require('../data.json')

// necessário para usarmos a data conforme vemos no Brasil
const intl = require('intl')

// trazendo age e date do utils
const { date } = require('../utils')



exports.index = function( req, res ){

    return res.render('members/index', { members: data.members })
}

exports.create = function( req, res ){
    return res.render('members/create')
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


    birth = Date.parse(req.body.birth) 

    let id = 1
    // pegando o ultimo id
    const lastMember = data.members[data.members.length - 1]

    if (lastMember){
        // pegando o ultimo id e adicionar mais um id
        id = lastMember.id + 1
    }
     

    // criando ordem para ser colocado no JSON
    data.members.push({
        id,
        ...req.body,
        birth
    })

    // craindo o JSON com as informações recebidas nos inputs
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error){
        if (error) return res.send('Write file erro')
    } )

    return res.redirect(`/members/${id}`)
}

// show
exports.show = function( req, res ){
    // tirando o id do req.params
    const { id } = req.params


    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send('Member Not Found!')

    const member = {
        // espalhando foundMember (informações que estão no JSON criado)
        ... foundMember,

        birth: date(foundMember.birth).birthDay
        
    }

    return res.render('members/show', { member })
}

// edit
exports.edit = function( req, res ){

    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if (!foundMember) return res.send('Member Not Found!')

    const members = {
        ... foundMember,
        birth: date(foundMember.birth).iso
    }
    

    return res.render('members/edit', { members } )
}


// atualizando instrutores
exports.put = function( req, res ){
    // de dentro do req.body eu vou procurar o id (desestruturar)
    const { id } = req.body
    let index = 0

    // procurando se o instrutor já está cadastrado
    // foundIndex como segundo parâmetro, quando member for 1, foundIndex tbm será 1, e assim por diante
    const foundMember = data.members.find(function(member, foundIndex){
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send('Member Not Found!')

    const member = {
        // espalhando os dados do foundMember
        ...foundMember,
        // espalhando tudo que trouxe do req.body
        ...req.body,
        
        // trazendo do req.body para salvar
        birth: Date.parse(req.body.birth),

        // Configurando para quando fizer edições, ser salvo o id sempre como number
        id: Number(req.body.id) 

    }

    
    data.members[index] = member

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write error!')

        return res.redirect(`/members/${id}`)
    })
}


exports.delete = function( req, res ){
    const { id } = req.body                    
    
    // filter = vai filtrar, faz uma extrutura de repetição tbm
    const filteredMembers = data.members.filter(function(member){

        // pegar todos menos esse id que está deletando
        // se o id for diferente vai pegar todos menos esse id que está diferente
        return member.id != id         
    } )

    data.members = filteredMembers

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write error!')
    })

    return res.redirect('/members')

}

// update

// delete