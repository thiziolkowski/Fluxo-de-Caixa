const express = require('express');
const router = express.Router();
const Caixa = require('../models/caixa'); // Model do Sequelize

// Rota principal
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';

    // 1) Buscar TODOS os registros
    const todosRegistros = await Caixa.findAll();

    // 2) Calcular os totais para os CARDS (sempre gerais)
    const saldoInicial = 1000;

    // Pagos
    const pagosCards = todosRegistros.filter(c => c.status === 'Pago');
    const totalReceitasPagasCards = pagosCards
      .filter(c => c.tipo === 'C')
      .reduce((acc, c) => acc + parseFloat(c.valor), 0);
    const totalDespesasPagasCards = pagosCards
      .filter(c => c.tipo === 'D')
      .reduce((acc, c) => acc + parseFloat(c.valor), 0);

    const saldoAtual = saldoInicial + totalReceitasPagasCards - totalDespesasPagasCards;

    // Em aberto
    const emAbertoCards = todosRegistros.filter(c => c.status === 'Em aberto');
    const totalReceitasAReceber = emAbertoCards
      .filter(c => c.tipo === 'C')
      .reduce((acc, c) => acc + parseFloat(c.valor), 0);
    const totalDespesasAPagar = emAbertoCards
      .filter(c => c.tipo === 'D')
      .reduce((acc, c) => acc + parseFloat(c.valor), 0);

    const totalGeral = saldoAtual + totalReceitasAReceber - totalDespesasAPagar;

    // 3) Filtrar apenas a TABELA se tiver busca
    let caixas = todosRegistros;
    if (search) {
      caixas = caixas.filter(caixa =>
        caixa.cliente_fornecedor.toLowerCase().includes(search.toLowerCase()) ||
        caixa.descricao.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 4) Renderizar view
    res.render('index', {
      caixas, // tabela filtrada
      saldoAtual,
      totalReceitas: totalReceitasAReceber,
      totalDespesas: totalDespesasAPagar,
      totalGeral,
      search, // para usar na view (exibir na caixa de busca ou mensagem)
      totalRegistros: todosRegistros.length // para exibir mensagem "mostrando X de Y"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar dados');
  }
});

// CREATE - Inserir novo lançamento
router.post('/add', async (req, res) => {
  try {
    const { dt_emissao, cliente_fornecedor, descricao, tipo, valor, dt_venc, status } = req.body;

    await Caixa.create({
      dt_emissao,
      cliente_fornecedor,
      descricao,
      tipo,
      valor,
      dt_venc,
      status
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar lançamento');
  }
});

// DELETE - Excluir registro
router.post('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Caixa.destroy({ where: { id: id } });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar registro');
  }
});

// TOGGLE STATUS - Alternar entre Pago e Em aberto
router.post('/toggle-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const caixa = await Caixa.findByPk(id);

    if (!caixa) {
      return res.status(404).send('Registro não encontrado');
    }

    const novoStatus = caixa.status === 'Pago' ? 'Em aberto' : 'Pago';

    await Caixa.update(
      { status: novoStatus },
      { where: { id: id } }
    );

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar status');
  }
});

// Rota para exibir o formulário de inserção
router.get('/add', (req, res) => {
  const hoje = new Date().toISOString().split('T')[0]; // data de hoje para o form
  res.render('add', { hoje });
});

module.exports = router;
