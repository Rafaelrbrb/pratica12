// ----------------------------------------------------------
// Marca o link ativo no menu e inicializa o menu hambúrguer
// ----------------------------------------------------------
function iniciarNavegacao() {
  // Descobre qual é o arquivo da página atual (ex: "listagem.html")
  var paginaAtual = location.pathname.split("/").pop() || "index.html";

  // Percorre todos os links do menu e marca o que corresponde à página atual
  var linksDoMenu = document.querySelectorAll(".nav-links a");
  for (var i = 0; i < linksDoMenu.length; i++) {
    var link = linksDoMenu[i];
    var nomeDoLink = link.getAttribute("href").split("/").pop();

    if (nomeDoLink === paginaAtual) {
      link.classList.add("ativo");
    }
  }

  // Inicializa o menu hambúrguer (botão de menu para telas pequenas)
  var botaoMenu = document.getElementById("menuToggle");
  var listaLinks = document.getElementById("navLinks");

  if (botaoMenu && listaLinks) {
    // Abre/fecha o menu ao clicar no botão hambúrguer
    botaoMenu.addEventListener("click", function () {
      listaLinks.classList.toggle("aberto");
    });

    // Fecha o menu se o usuário clicar em qualquer lugar fora dele
    document.addEventListener("click", function (evento) {
      var clicouForaDoMenu =
        !botaoMenu.contains(evento.target) &&
        !listaLinks.contains(evento.target);
      if (clicouForaDoMenu) {
        listaLinks.classList.remove("aberto");
      }
    });
  }

  // Atualiza o número de produtos no badge do menu
  atualizarBadge();
}

// Atualiza o contador (badge) de produtos na navbar
function atualizarBadge() {
  var badge = document.getElementById("badgeProdutos");
  if (badge) {
    badge.textContent = Store.total();
  }
}

// ----------------------------------------------------------
// Exibe uma mensagem de aviso (toast) no canto da tela
// ----------------------------------------------------------
function mostrarAviso(mensagem, tipo) {
  // Define um valor padrão para o tipo se não for informado
  tipo = tipo || "sucesso";

  var icone = tipo === "sucesso" ? "✓" : "✕";

  // Cria um elemento div para o aviso
  var divAviso = document.createElement("div");
  divAviso.className = "aviso " + tipo;
  divAviso.innerHTML = "<span>" + icone + "</span> " + mensagem;

  // Adiciona o aviso ao container de avisos na página
  document.getElementById("avisos").appendChild(divAviso);

  // Remove o aviso após 2.8 segundos com uma animação de fade
  setTimeout(function () {
    divAviso.style.transition = "opacity 0.3s";
    divAviso.style.opacity = "0";

    setTimeout(function () {
      divAviso.remove();
    }, 300);
  }, 2800);
}

// --------------------------------------------
// Formata um número como moeda brasileira
// --------------------------------------------
function formatarPreco(valor) {
  return parseFloat(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Formata uma data ISO
function formatarData(dataISO) {
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

// ----------------------------------------------------------
// Retorna o HTML com a situação do estoque colorida
// ----------------------------------------------------------
function mostrarStatusEstoque(quantidade) {
  var qtd = parseInt(quantidade);

  if (qtd === 0) {
    return '<span class="estoque-zero">Esgotado</span>';
  } else if (qtd <= 5) {
    return '<span class="estoque-baixo">' + qtd + " un.</span>";
  } else {
    return '<span class="estoque-ok">' + qtd + " un.</span>";
  }
}

// ----------------------------------------------------------
// Retorna o HTML de uma tag colorida com o nome da categoria
// ----------------------------------------------------------

// Classe CSS de cada categoria (define a cor da tag)
var classesDaCategoria = {
  eletronico: "tag-eletronico",
  alimento: "tag-alimento",
  vestuario: "tag-vestuario",
  limpeza: "tag-limpeza",
  papelaria: "tag-papelaria",
  outro: "tag-outro",
};

// Nome legível de cada categoria
var nomesDaCategoria = {
  eletronico: "Eletrônico",
  alimento: "Alimento",
  vestuario: "Vestuário",
  limpeza: "Limpeza",
  papelaria: "Papelaria",
  outro: "Outro",
};

function criarTagCategoria(categoria) {
  var classeCss = classesDaCategoria[categoria] || "tag-outro";
  var nomeExibido = nomesDaCategoria[categoria] || categoria;

  return '<span class="tag ' + classeCss + '">' + nomeExibido + "</span>";
}

// Disponibilizamos as funções em window.UI para outros arquivos usarem
window.UI = {
  iniciarNav: iniciarNavegacao,
  atualizarBadge: atualizarBadge,
  mostrarAviso: mostrarAviso,
  formatarPreco: formatarPreco,
  formatarData: formatarData,
  statusEstoque: mostrarStatusEstoque,
  tagCategoria: criarTagCategoria,
};
