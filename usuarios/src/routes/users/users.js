require("dotenv").config()
const express = require("express");
const router = express.Router();
const data = require("../../database/config.js")
const bcrypt = require("bcrypt")
const round = Number(process.env.SALT)
const jwt = require("jsonwebtoken")
const verificar = require ("../../middleware/verify_token.js")
const morgan = require("morgan");
const insert_register = require("../observer/register.js");
 
router.use(morgan("combined"))
let tmp = new Date()
let date_time = `${tmp.getFullYear()}-${tmp.getMonth()+1}-${tmp.getDate()} ${tmp.getHours()}:${tmp.getMinutes()}:${tmp.getSeconds()}`
let remote_data = morgan("combined")
let idusuario = ""
 
router.get("/listar", (req, res) => {
 
    insert_register(idusuario,date_time,1,"/listar",remote_data.toString())
 
    data.query("select * from usuario", (error, dados) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar dos dados" })
        }
        res.status(200).send({ msg: "Ok", payload: dados })
    })
})
 
router.post("/cadastrar", (req, res) => {
    let sh = req.body.senha
 
    bcrypt.hash(sh,round,(error,crypt)=> {
        if(error){
            return res.status(500).send({msg:"erro ao tentar cadastrar" + error})
        }
        req.body.senha = crypt
        data.query("insert into usuario set ?",req.body,(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar cadastrar"})
            }
            res.status(201).send({msg:"ok",payload:result})
        })
    })
 
})
 
router.put("/alterarfoto/:id", verificar, (req, res) => {
    insert_register(idusuario,date_time,1,`/alterarfoto/${req.params.id}`,remote_data.toString())
 
    data.query("update usuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao tentar cadastrar"})
        }
        res.status(200).send({msg:"ok",payload:result})
    })
 
})
router.put("/alterarsenha/:id", (req, res) => {
    // insert_register(idusuario,date_time,1,`/alterarsenha/${req.params.id}`,remote_data.toString())
 
    let sh = req.body.senha
 
    bcrypt.hash(sh,round,(error,crypt)=> {
        if(error){
            return res.status(500).send({msg:"erro ao tentar atualizar a senha"})
        }
        req.body.senha = crypt
        data.query("update usuario set ? where idusuario=?",[req.body,req.params.id],(error,result)=>{
            if(error){
                return res.status(500).send({msg:"Erro ao tentar cadastrar"})
            }
            res.status(201).send({msg:"ok",payload:result})
        })
    })
})
router.get("/buscarporid/:id", (req, res) => {
 
    insert_register(idusuario,date_time,1,`/buscarporid/${req.params.id}`,remote_data.toString())
 
    data.query("select * from usuario where idusuario=?", req.params.id, (error, dados) => {
        if (error) {
            return res.status(500).send({ msg: "Erro ao selecionar dos dados" })
        }
        res.status(200).send({ msg: "Ok", payload: dados })
    })
})
router.get("/buscarporusuario/:usuario", (req, res) => {
 
    insert_register(idusuario,date_time,1,`/buscarporusuario/${req.params.id}`,remote_data.toString())
 
    data.query("select * from usuario where nomeusuario=?",req.params.usuario,(error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar dos dados"})
        }
        res.status(200).send({msg:"Ok",payload:dados})
    })
})
router.post("/login", (req, res) => {
   
    let sh = req.body.senha
    data.query("select * from usuario where nomeusuario=?",req.body.nomeusuario,(error,result)=>{
        console.log(result)
        if(error || result==[0]==null){
            // insert_register(0,date_time,1,"/login",remote_data.toString())
            return res.status(400).send({msg:"Usuário ou senha incorreta"})
        }
        bcrypt.compare(sh,result[0].senha,(err,same)=>{
            if(err){
                return res.status(500).send({msg:"Erro ao Processar o login"})
            }
            else if(same==false){
                return res.status(400).send({msg:"Usuário ou senha incorreta"})
            } else {
                // insert_register(result[0].idusuario,date_time,1,"/login",remote_data.toString())
                idusuario = result [0].idusuario
                let token = jwt.sign(
                    {
                        idusuario:result[0].idusuario,
                        nomeusuario:result[0].nomeusuario
                    },
                    process.env.JWT_KEY,{expiresIn:"2d"}
                    )
                   
 
                res.status(200).send({msg:"Autenticado", token:token})
            }
        })
    })
})
 
module.exports = router;