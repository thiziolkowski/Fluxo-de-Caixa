const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');  // caminho do banco de dados

const Caixa = sequelize.define('Caixa', 
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dt_emissao: {
        type: DataTypes.DATEONLY, // Data sem hora
        allowNull: false
    },
    cliente_fornecedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(1), //D ou C
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    dt_venc: {
        type: DataTypes.DATEONLY,   // Data de vencimento
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,     // Pago, Em aberto
        allowNull: false
    },
},
{
    timestamps: false,
    tableName: 'caixas'      // nome da tabela no banco
});

module.exports = Caixa;
