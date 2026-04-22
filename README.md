# 📦 Sistema de Cadastro de Produtos

## 🖥️ Páginas

| Página | Arquivo | Descrição |
|---|---|---|
| Início | `index.html` | Tela inicial com resumo do sistema |
| Cadastro | `pages/cadastro.html` | Formulário para adicionar produtos |
| Listagem | `pages/listagem.html` | Tabela com todos os produtos cadastrados |

---

## 📁 Estrutura de Pastas

```
cadastro-produtos/
│
├── index.html               # Página inicial
│
├── css/
│   └── style.css            # Estilização de todas as páginas
│
├── js/
│   ├── store.js             # Gerenciamento de estado 
│   ├── ui.js                # Funções utilitárias compartilhadas
│   ├── home.js              # Lógica da página inicial
│   ├── form.js              # Validação e envio do formulário
│   └── list.js              # Renderização dinâmica da listagem
│
└── pages/
    ├── cadastro.html        # Página de cadastro
    └── listagem.html        # Página de listagem
```

---

## ⚙️ Funcionalidades

### Página Inicial
- Exibe o total de produtos cadastrados
- Mostra o valor total em estoque (preço × quantidade)
- Indica a categoria com mais produtos

### Cadastro
- Formulário com os campos: nome, código, categoria, preço, estoque e descrição
- Geração automática de código do produto
- Validação de todos os campos antes de salvar
- Mensagens de erro exibidas abaixo de cada campo inválido
- Botão para limpar o formulário

### Listagem
- Tabela com todos os produtos cadastrados
- Busca em tempo real por nome, código ou descrição
- Filtros por categoria (Eletrônico, Alimento, Vestuário, Limpeza, Papelaria, Outro)
- Ordenação por: mais recentes, nome, maior preço, maior estoque
- Indicador visual de estoque: 🟢 normal / 🟠 baixo (≤ 5) / 🔴 esgotado
- Botão para visualizar detalhes e excluir cada produto

---

---

## 💾 Armazenamento de Dados

Os dados são salvos no **localStorage** do navegador, ou seja:

- Ficam disponíveis mesmo após recarregar a página
- São perdidos se o cache do navegador for limpo
- Não são enviados para nenhum servidor

