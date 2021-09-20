var express = require("express");
var mysql = require("mysql");
const app = express();
const PORT = 3000;

var con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "user",
    database: "mercadinho"
});


app.set("view engine", "ejs");
app.set("views", __dirname, "/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//ROTA PAGINA PRINCIPAL
app.get("/", (req, res) => {
    res.send("Home");
});


//ROTA DA LISTAGEM
app.get("/estoque", (req, res) => {
    con.query(
        "SELECT * FROM produtos",
        (err, produto) => {
            if (err) throw err

            res.render("estoque", { produto_lista: produto })
        }
    )
});


//ROTA DO CADASTRO
app.get("/cadastrarProduto", (req, res) => {
    res.render("formestoque");
});


app.post('/cadastrarProduto', (req, res) => {
    let nome_produto = req.body.nome_produto;
    let codigo_produto = req.body.codigo_produto;
    let quantidade_produto = req.body.quantidade_produto;
    let preco_produto = req.body.preco_produto;

    var sql = `INSERT INTO produtos(nome_produto, codigo_produto, quantidade_produto, preco_produto) VALUES('${nome_produto}','${codigo_produto}','${quantidade_produto}','${preco_produto}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Dado inserido com sucesso!");
    });
    return res.redirect("estoque")
});


//ROTA DE EDITAR
app.get("/editarProduto/:id", (req, res) => {
    var UserId = req.params.id;
    var sql = `SELECT * FROM produtos WHERE id_produto= ${UserId}`;

    id_produto = `${UserId}`;
    con.query(sql, function (err, produto) {
        if (err) throw err;
        console.log("Você atualizou: " + sql);
        return res.render("editarformestoque", { lista_produto: produto[0] })
    });
});


app.post("/editarProduto", (req, res) => {
    var id = req.body.id_produto;
    var updateData = req.body;
    var sql = 'UPDATE produtos SET ? WHERE id_produto= ?';
    con.query(sql, [updateData, id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " registros alterados!");
    });
    res.redirect("estoque");
});


//ROTA DELETAR 
app.get("/deletarProduto/:id", (req, res) => {
    let id = req.params.id;
    var deletar = "DELETE FROM produtos WHERE id_produto = '" + id + "'";
    con.query(deletar, id, (err, result) => {
        if (err) throw err;
        console.log("Você deletou! ");
    });
    res.redirect("/estoque");
});


//ROTA DE VENDA 
app.get("/venderProduto/:id", (req, res) => {
    let id = req.params.id;
    var comprar = "UPDATE produtos SET quantidade_produto = quantidade_produto -1 WHERE id_produto= '" + id + "'";
    con.query(comprar, id, (err, produto) => {
        if (err) throw err;

    });
    res.redirect('/estoque');
});

app.post("/venderProduto", (req, res) => {
    var id = req.body.id_produto;
    var verifica = req.body;

    con.query('UPDATE produtos SET ? WHERE id_produto= ?', [verifica, id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/estoque');
});


//codigo de tome sem o arquivo vendas
// app.get("/comprarProduto/:id", (req, res) => {
//     let id = req.params.id;
//     var comprar = "UPDATE produtos SET quantidade_produto = quantidade_produto -1 WHERE id_produto= '" + id + "'";
//     con.query(comprar, id, (err, produto) => {
//       if (err) throw err;
  
//     })
//     res.redirect("/estoque");
//   });

//   app.post("/editarProduto", (req, res) => {
//     var id = req.body.id_produto;
//     var verifica = req.body;
  
//     con.query('UPDATE produtos SET ? WHERE id_produto= ?', [verifica, id], function (err, data) {
//       if (err) throw err;
//       console.log(data.affectedRows + " record(s) updated");
//     });
//     res.redirect('/estoque');
//   });






app.listen(PORT, () => {
    console.log("Servidor rodando na porta" + PORT);
});
