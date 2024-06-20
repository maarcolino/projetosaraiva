const express = require("express");
const router = express.Router();
const data = require("../../database/config.js")

router.get("/listar",(req,res)=>{
    data.con.query("SELECT * FROM usuario",(error,dados)=>{
        if(error){
            return res.status(500).send({msg:"Erro ao selecionar o banco da dados"})
        }
        res.status(200).send({msg:"Ok",payload:dados})
    })
})