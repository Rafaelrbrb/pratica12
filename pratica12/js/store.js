// Nome da chave que usamos para guardar os produtos no localStorage
var CHAVE_STORAGE = 'produtos_lista';

// Retorna a lista de produtos salva no localStorage
function listarProdutos() {
  var dadosSalvos = localStorage.getItem(CHAVE_STORAGE);


  if (dadosSalvos === null) {
    return [];
  }

  // JSON.parse converte o texto salvo de volta para um array de objetos
  return JSON.parse(dadosSalvos);
}

// Salva a lista de produtos no localStorage
function salvarProdutos(listaDeProdutos) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(listaDeProdutos));
}

// Adiciona um novo produto e retorna o produto com id e data preenchidos
function adicionarProduto(dadosDoProduto) {
  var lista = listarProdutos();

  // Criamos o produto com um id único (baseado na data/hora atual)
  var novoProduto = {
    id: Date.now(),
    dataCadastro: new Date().toISOString(),
    nome: dadosDoProduto.nome,
    codigo: dadosDoProduto.codigo,
    categoria: dadosDoProduto.categoria,
    preco: dadosDoProduto.preco,
    estoque: dadosDoProduto.estoque,
    descricao: dadosDoProduto.descricao
  };

  lista.push(novoProduto);
  salvarProdutos(lista);
  return novoProduto;
}

// Remove um produto pelo id
function removerProduto(id) {
  var lista = listarProdutos();

  // Filtra a lista mantendo apenas os que NÃO têm esse id
  var listaAtualizada = lista.filter(function(produto) {
    return produto.id !== id;
  });

  salvarProdutos(listaAtualizada);
}

// Retorna quantos produtos estão cadastrados
function totalDeProdutos() {
  return listarProdutos().length;
}

// Calcula o valor total em estoque (preço × quantidade de cada produto)
function calcularValorTotalEmEstoque() {
  var lista = listarProdutos();
  var total = 0;

  for (var i = 0; i < lista.length; i++) {
    var produto = lista[i];
    var preco = parseFloat(produto.preco);
    var estoque = parseInt(produto.estoque) || 0;
    total += preco * estoque;
  }

  return total;
}

// Filtra produtos pela busca e/ou categoria
function filtrarProdutos(textoBusca, categoriaFiltro) {
  var lista = listarProdutos();
  var busca = (textoBusca || '').toLowerCase();

  var resultado = lista.filter(function(produto) {
    // Verifica se o produto pertence à categoria selecionada
    var passouCategoria = !categoriaFiltro || produto.categoria === categoriaFiltro;

    // Verifica se o produto contém o texto buscado no nome, código ou descrição
    var passouBusca = !busca
      || produto.nome.toLowerCase().includes(busca)
      || (produto.codigo || '').toLowerCase().includes(busca)
      || (produto.descricao || '').toLowerCase().includes(busca);

    return passouCategoria && passouBusca;
  });

  return resultado;
}

// Disponibilizamos as funções em "window.Store" para que outros arquivos possam usar
window.Store = {
  listar: listarProdutos,
  adicionar: adicionarProduto,
  remover: removerProduto,
  total: totalDeProdutos,
  valorTotal: calcularValorTotalEmEstoque,
  filtrar: filtrarProdutos
};
