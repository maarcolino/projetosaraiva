require("dotenv").config()
const jwt = require("jsonwebtoken")

const verificar = (req,res,next) =>{
    //Criar uma constante para guardar o token que o usuario ira enviar
    // no cabeçalho de requisição
    const token_enviado = req.header.token
    if(!token_enviado){
        return res.status(400).send({msg:"Não autenticado. Efetue Login"})
    }
    jwt.verify(token_enviado,process.env.JWT_KEY,(error,result)=>{
        if(error){
            return res.status(403).send({msg:"Você não tem autorização para este conteúdo"})
        }
        next();
    })
}

module.exports = verificar;