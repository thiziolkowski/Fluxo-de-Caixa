const { Sequelize } = require('sequelize'); // importa a classe corretamente

const sequelize = new Sequelize('fluxo_de_caixa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;



// para acessar o banco de dados vir PowerShell, use o seguinte comando:
// cd C:\xampp\mysql\bin           -> para navegar ate o caminho do mysql
// .\mysql.exe -u root             -> para acessar o mysql
// use fluxo_de_caixa;             -> para selecionar o banco de dados  