const sequelize = require('./config/database.js');
const Caixa = require('./models/caixa.js');

sequelize.sync()

.then(() => {
    console.log('Tabela Caixa criada com sucesso');
})
.catch(error => {
    console.error('Erro ao criar a tabela:', error);
});