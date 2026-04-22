// Aguarda a página carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

  // Inicializa o menu de navegação
  UI.iniciarNav();

  // Pega a lista de todos os produtos cadastrados
  var listaDeProdutos = Store.listar();

  // Atualiza o card "Produtos cadastrados"
  document.getElementById('statTotal').textContent = listaDeProdutos.length;

  // Atualiza o card "Valor em estoque"
  document.getElementById('statValor').textContent = UI.formatarPreco(Store.valorTotal());

  // -----------------------------------------------------------
  // Descobre qual categoria tem mais produtos cadastrados
  // -----------------------------------------------------------

  // Cria um objeto para contar quantos produtos tem em cada categoria
  var contagemPorCategoria = {};

  for (var i = 0; i < listaDeProdutos.length; i++) {
    var categoria = listaDeProdutos[i].categoria;

    // Se ainda não existe a categoria no objeto, começa do zero
    if (contagemPorCategoria[categoria] === undefined) {
      contagemPorCategoria[categoria] = 0;
    }

    contagemPorCategoria[categoria]++;
  }

  // Converte o objeto em uma lista de pares [categoria, quantidade]
  var listaDeCategorias = Object.entries(contagemPorCategoria);

  var elementoCategoria = document.getElementById('statCategoria');

  if (listaDeCategorias.length === 0) {
    // Não há produtos cadastrados
    elementoCategoria.textContent = '—';
  } else {
    // Ordena do maior para o menor e pega a primeira (categoria com mais produtos)
    listaDeCategorias.sort(function(a, b) {
      return b[1] - a[1]; 
    });

    var categoriaComMaisProdutos = listaDeCategorias[0][0];

    // Nomes para exibir na tela
    var nomesDaCategoria = {
      eletronico: 'Eletrônico',
      alimento:   'Alimento',
      vestuario:  'Vestuário',
      limpeza:    'Limpeza',
      papelaria:  'Papelaria',
      outro:      'Outro'
    };

    elementoCategoria.textContent = nomesDaCategoria[categoriaComMaisProdutos] || categoriaComMaisProdutos;
  }
});

