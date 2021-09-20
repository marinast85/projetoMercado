-- create database mercadinho;

use mercadinho;

create table if not exists produtos(
    id_produto int not null auto_increment primary key,
    nome_produto varchar(50) not null,
    codigo_produto varchar(50) not null,
    quantidade_produto int not null,
    preco_produto float not null
);


