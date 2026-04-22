
function gerarCodigoProduto() {
  var numero = Math.floor(Math.random() * 9000) + 1000; // número entre 1000 e 9999
  return 'PROD-' + numero;
}

// ----------------------------------------------------------
// Valida um campo individual e exibe ou remove a mensagem de erro
// Retorna true se o campo for válido, false se inválido
// ----------------------------------------------------------
function validarCampo(idDoCampo, valorDoCampo) {
  var mensagemDeErro = '';

  // Regras de validação para cada campo
  if (idDoCampo === 'nome') {
    if (valorDoCampo.trim().length < 2) {
      mensagemDeErro = 'Informe o nome do produto (mínimo 2 caracteres).';
    }
  } else if (idDoCampo === 'codigo') {
    if (valorDoCampo.trim().length < 2) {
      mensagemDeErro = 'Informe um código para o produto.';
    }
  } else if (idDoCampo === 'categoria') {
    if (valorDoCampo === '') {
      mensagemDeErro = 'Selecione uma categoria.';
    }
  } else if (idDoCampo === 'preco') {
    if (isNaN(valorDoCampo) || parseFloat(valorDoCampo) <= 0) {
      mensagemDeErro = 'Preço deve ser maior que zero.';
    }
  } else if (idDoCampo === 'estoque') {
    if (isNaN(valorDoCampo) || parseInt(valorDoCampo) < 0) {
      mensagemDeErro = 'Estoque não pode ser negativo.';
    }
  } else if (idDoCampo === 'descricao') {
    if (valorDoCampo.trim().length < 5) {
      mensagemDeErro = 'Descrição muito curta (mínimo 5 caracteres).';
    }
  }

  // Aplica ou remove o estilo de erro no campo
  var campoDomElement = document.getElementById(idDoCampo);
  var spanDeErro = document.getElementById('erro-' + idDoCampo);

  if (campoDomElement && spanDeErro) {
    if (mensagemDeErro) {
      // Adiciona borda vermelha e mostra a mensagem de erro
      campoDomElement.classList.add('invalido');
      spanDeErro.textContent = mensagemDeErro;
      spanDeErro.classList.add('visivel');
    } else {
      // Remove borda vermelha e esconde a mensagem de erro
      campoDomElement.classList.remove('invalido');
      spanDeErro.textContent = '';
      spanDeErro.classList.remove('visivel');
    }
  }

  return mensagemDeErro === ''; // retorna true se não tiver erro
}

// ----------------------------------------------------------
// Valida todos os campos do formulário de uma vez
// Retorna true se todos estiverem válidos
// ----------------------------------------------------------
function validarTodosOsCampos(dadosDoFormulario) {
  var tudoValido = true;

  // Percorre cada campo e valida
  var campos = Object.keys(dadosDoFormulario); 
  for (var i = 0; i < campos.length; i++) {
    var nomeCampo = campos[i];
    var valorCampo = dadosDoFormulario[nomeCampo];
    var campoEhValido = validarCampo(nomeCampo, valorCampo);

    if (!campoEhValido) {
      tudoValido = false;
    }
  }

  return tudoValido;
}

// ----------------------------------------------------------
// Inicializa o formulário: eventos de validação e envio
// ----------------------------------------------------------
function inicializarFormulario() {
  var formulario = document.getElementById('formProduto');
  if (!formulario) return; 

  var campoCodigo = document.getElementById('codigo');

  // Preenche o código automaticamente se estiver vazio
  if (campoCodigo && !campoCodigo.value) {
    campoCodigo.value = gerarCodigoProduto();
  }

  // Botão "Gerar" código: gera um novo código ao clicar
  var botaoGerarCodigo = document.getElementById('btnGerarCodigo');
  if (botaoGerarCodigo) {
    botaoGerarCodigo.addEventListener('click', function() {
      campoCodigo.value = gerarCodigoProduto();
    });
  }

  // -----------------------------------------------------------
  // Adiciona validação em tempo real em todos os campos:
  // - ao sair do campo (blur): valida o campo
  // - ao digitar (input): se o campo já estava inválido, revalida
  // -----------------------------------------------------------
  var todosOsCampos = formulario.querySelectorAll('input, select, textarea');
  for (var i = 0; i < todosOsCampos.length; i++) {
    var campo = todosOsCampos[i];

    campo.addEventListener('blur', function() {
      validarCampo(this.id, this.value);
    });

    campo.addEventListener('input', function() {
      if (this.classList.contains('invalido')) {
        validarCampo(this.id, this.value);
      }
    });
  }

  // -----------------------------------------------------------
  // Submissão do formulário
  // -----------------------------------------------------------
  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    // Coleta os valores de cada campo
    var dadosDoFormulario = {
      nome:      document.getElementById('nome').value,
      codigo:    document.getElementById('codigo').value,
      categoria: document.getElementById('categoria').value,
      preco:     document.getElementById('preco').value,
      estoque:   document.getElementById('estoque').value,
      descricao: document.getElementById('descricao').value
    };

    // Só salva se todos os campos estiverem válidos
    if (!validarTodosOsCampos(dadosDoFormulario)) {
      UI.mostrarAviso('Corrija os campos destacados.', 'erro');
      return;
    }

    // Salva o produto no localStorage
    Store.adicionar(dadosDoFormulario);
    UI.mostrarAviso('Produto cadastrado com sucesso!');

    // Limpa o formulário
    formulario.reset();

    // Gera um novo código para o próximo cadastro
    setTimeout(function() {
      campoCodigo.value = gerarCodigoProduto();
    }, 100);

    // Atualiza o contador no menu
    UI.atualizarBadge();
  });

  // -----------------------------------------------------------
  // Botão "Limpar": reseta o formulário e remove erros visuais
  // -----------------------------------------------------------
  var botaoLimpar = document.getElementById('btnLimpar');
  if (botaoLimpar) {
    botaoLimpar.addEventListener('click', function() {
      formulario.reset();
      campoCodigo.value = gerarCodigoProduto();

      // Remove a classe de erro de todos os campos
      var camposInvalidos = formulario.querySelectorAll('.invalido');
      for (var i = 0; i < camposInvalidos.length; i++) {
        camposInvalidos[i].classList.remove('invalido');
      }

      // Esconde todas as mensagens de erro
      var mensagensVisiveis = formulario.querySelectorAll('.erro-msg.visivel');
      for (var j = 0; j < mensagensVisiveis.length; j++) {
        mensagensVisiveis[j].classList.remove('visivel');
      }
    });
  }
}

// Aguarda a página carregar antes de inicializar o formulário
document.addEventListener('DOMContentLoaded', function() {
  UI.iniciarNav();
  inicializarFormulario();
});
