const data = require("../../database/config.js")

function insert_register(idusuario, dh_acesso,tentativa_login,pag_acessada,observacao){
 data.query(`insert into observadoracesso idusuario=?, acesso=?, tentativalogin=?, paginaacessada=?, observacao=?`,[idusuario,
dh_acesso,
tentativa_login,
pag_acessada,
observacao],(error, result)=>{
    if(error){
        return "Erro ao tentar inserir a observação"
    }
    return result;
});

module.exports = insert_register;

}