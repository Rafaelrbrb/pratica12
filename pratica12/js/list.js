// Variáveis que guardam o estado atual da busca e filtro
var textoBuscaAtual = "";
var categoriaFiltradaAtual = "";
var ordemAtual = "data"; // ordem padrão: mais recentes primeiro

// ----------------------------------------------------------
// Escapa caracteres especiais para evitar problemas de HTML
// ----------------------------------------------------------
function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ----------------------------------------------------------
// Ordena a lista de produtos conforme a ordem selecionada
// ----------------------------------------------------------
function ordenarLista(lista, ordem) {
  if (ordem === "nome") {
    lista.sort(function (a, b) {
      return a.nome.localeCompare(b.nome); // A-Z
    });
  } else if (ordem === "preco") {
    lista.sort(function (a, b) {
      return parseFloat(b.preco) - parseFloat(a.preco); // maior preço primeiro
    });
  } else if (ordem === "estoque") {
    lista.sort(function (a, b) {
      return parseInt(b.estoque) - parseInt(a.estoque); // maior estoque primeiro
    });
  } else {
    // Padrão: mais recentes primeiro (ordem pela data de cadastro)
    lista.sort(function (a, b) {
      return new Date(b.dataCadastro) - new Date(a.dataCadastro);
    });
  }

  return lista;
}

// ----------------------------------------------------------
// Cria o HTML de uma linha da tabela para um produto
// ----------------------------------------------------------
function criarLinhaTabela(produto) {
  return (
    "<tr>" +
    "<td>" +
    '<div class="nome-produto">' +
    escaparHTML(produto.nome) +
    "</div>" +
    '<div class="cod-produto">' +
    escaparHTML(produto.codigo) +
    "</div>" +
    "</td>" +
    "<td>" +
    UI.tagCategoria(produto.categoria) +
    "</td>" +
    '<td class="preco">' +
    UI.formatarPreco(produto.preco) +
    "</td>" +
    "<td>" +
    UI.statusEstoque(produto.estoque) +
    "</td>" +
    '<td style="color:#999;font-size:0.82rem;">' +
    UI.formatarData(produto.dataCadastro) +
    "</td>" +
    "<td>" +
    '<div style="display:flex;gap:6px;">' +
    '<button class="btn btn-cinza btn-sm" onclick="verDetalhesDoProduto(' +
    produto.id +
    ')">Ver</button>' +
    '<button class="btn btn-vermelho btn-sm" onclick="excluirProduto(' +
    produto.id +
    ')">Excluir</button>' +
    "</div>" +
    "</td>" +
    "</tr>"
  );
}

// ----------------------------------------------------------
// Renderiza (desenha) a tabela de produtos na tela
// ----------------------------------------------------------
function renderizarTabela() {
  // Busca os produtos filtrados e os ordena
  var listaDeProdutos = Store.filtrar(textoBuscaAtual, categoriaFiltradaAtual);
  ordenarLista(listaDeProdutos, ordemAtual);

  var corpoTabela = document.getElementById("corpoTabela");
  var mensagemVazia = document.getElementById("estadoVazio");
  var contadorExibindo = document.getElementById("qtdExibindo");

  // Atualiza o contador "Exibindo X produto(s)"
  contadorExibindo.textContent = listaDeProdutos.length;

  if (listaDeProdutos.length === 0) {
    // Mostra a mensagem "nenhum produto encontrado"
    corpoTabela.innerHTML = "";
    mensagemVazia.style.display = "block";
    return;
  }

  // Esconde a mensagem vazia e preenche a tabela
  mensagemVazia.style.display = "none";

  var htmlDasLinhas = "";
  for (var i = 0; i < listaDeProdutos.length; i++) {
    htmlDasLinhas += criarLinhaTabela(listaDeProdutos[i]);
  }
  corpoTabela.innerHTML = htmlDasLinhas;
}

// ----------------------------------------------------------
// Atualiza os cards de resumo no topo da página
// ----------------------------------------------------------
function atualizarContadores() {
  var lista = Store.listar();

  document.getElementById("totalProdutos").textContent = lista.length;
  document.getElementById("valorEstoque").textContent = UI.formatarPreco(
    Store.valorTotal(),
  );

  // Encontra o produto mais caro
  if (lista.length > 0) {
    var maisCaro = lista[0];
    for (var i = 1; i < lista.length; i++) {
      if (parseFloat(lista[i].preco) > parseFloat(maisCaro.preco)) {
        maisCaro = lista[i];
      }
    }
    document.getElementById("maisCaro").textContent = UI.formatarPreco(
      maisCaro.preco,
    );
  } else {
    document.getElementById("maisCaro").textContent = "R$ 0,00";
  }
}

// ----------------------------------------------------------
// Exclui um produto (chamado pelo botão "Excluir" da tabela)
// ----------------------------------------------------------
function excluirProduto(id) {
  var confirmou = confirm("Tem certeza que deseja excluir este produto?");
  if (!confirmou) return;

  Store.remover(id);
  atualizarContadores();
  renderizarTabela();
  UI.mostrarAviso("Produto removido.");
  UI.atualizarBadge();
}

// ----------------------------------------------------------
// Exibe os detalhes de um produto em um alert
// ----------------------------------------------------------
function verDetalhesDoProduto(id) {
  var lista = Store.listar();
  var produto = null;

  // Procura o produto pelo id
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === id) {
      produto = lista[i];
      break;
    }
  }

  if (!produto) return;

  alert(
    "Produto: " +
      produto.nome +
      "\n" +
      "Código: " +
      produto.codigo +
      "\n" +
      "Categoria: " +
      produto.categoria +
      "\n" +
      "Preço: " +
      UI.formatarPreco(produto.preco) +
      "\n" +
      "Estoque: " +
      produto.estoque +
      " un.\n" +
      "Descrição: " +
      produto.descricao +
      "\n" +
      "Cadastro: " +
      UI.formatarData(produto.dataCadastro),
  );
}

// ----------------------------------------------------------
// Inicialização quando a página carrega
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  UI.iniciarNav();
  atualizarContadores();
  renderizarTabela();

  // Campo de busca por texto
  document.getElementById("campoBusca").addEventListener("input", function () {
    textoBuscaAtual = this.value;
    renderizarTabela();
  });

  // Seletor de ordenação
  document
    .getElementById("selectOrdem")
    .addEventListener("change", function () {
      ordemAtual = this.value;
      renderizarTabela();
    });

  // Botões de filtro por categoria
  var botoesFiltro = document.querySelectorAll(".filtro-btn");
  for (var i = 0; i < botoesFiltro.length; i++) {
    botoesFiltro[i].addEventListener("click", function () {
      // Remove a marcação "ativo" de todos os botões
      for (var j = 0; j < botoesFiltro.length; j++) {
        botoesFiltro[j].classList.remove("ativo");
      }

      // Marca este botão como ativo
      this.classList.add("ativo");

      // Atualiza a categoria filtrada e re-renderiza a tabela
      categoriaFiltradaAtual = this.dataset.cat || "";
      renderizarTabela();
    });
  }
});
