// =====================================================
// TELA DE PUBLICAR (JS/pagina.js)
// aqui ficam as funções da tela de publicar
// não tem banco de dados, tudo acontece só na tela
// =====================================================


// ---------- PEGANDO OS ELEMENTOS DO HTML ----------

// botão das três linhas e o menu que abre embaixo dele
const botaoMenu = document.querySelector('#btn-menu');
const menuMobile = document.querySelector('#menu-mobile');

// botões da barra de ícones da esquerda
const iconesLaterais = document.querySelectorAll('.pub-icones button');

// campo do título e área do texto da notícia (a área é uma div editável)
const campoTitulo = document.querySelector('#titulo');
const campoTexto = document.querySelector('#texto');

// contador de caracteres e palavras
const contador = document.querySelector('.pub-contador');

// botões de formatação (negrito, itálico...) e botão "add mídia"
const botoesFormatar = document.querySelectorAll('.pub-formatar button');
const botaoAddMidia = document.querySelector('.pub-add-midia');

// campo escondido pra escolher a imagem que vai dentro do texto
const arquivoMidia = document.querySelector('#arquivo-midia');

// caixa da imagem de capa, campo escondido pra escolher o arquivo e a prévia da imagem
const caixaCapa = document.querySelector('#pub-capa');
const arquivoCapa = document.querySelector('#arquivo-capa');
const imagemCapa = document.querySelector('#capa-previa');

// botão publicar e caixinha de aviso
const botaoPublicar = document.querySelector('#btn-publicar');
const aviso = document.querySelector('#aviso');


// ---------- AVISO NA TELA ----------

// guarda o tempo do aviso pra conseguir reiniciar quando aparecer outro
let tempoDoAviso;

// função que mostra uma mensagem no canto da tela por uns segundos
// tipo pode ser 'ok' (verde) ou 'erro' (vermelho)
function mostrarAviso(mensagem, tipo) {
    // coloca o texto e a cor do aviso
    aviso.textContent = mensagem;
    aviso.className = 'aviso mostrar ' + tipo;

    // se já tinha um aviso na tela, zera o tempo dele
    clearTimeout(tempoDoAviso);

    // depois de 3,5 segundos o aviso some
    tempoDoAviso = setTimeout(function () {
        aviso.classList.remove('mostrar');
    }, 3500);
}


// ---------- MENU (três linhas) ----------

// função que abre o menu se estiver fechado e fecha se estiver aberto
function alternarMenu() {
    const aberto = menuMobile.classList.toggle('aberto');

    // avisa o navegador se o menu está aberto ou não
    botaoMenu.setAttribute('aria-expanded', aberto);
}

// função que só fecha o menu
function fecharMenu() {
    menuMobile.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', false);
}

// clicou nas três linhas: abre ou fecha o menu
botaoMenu.addEventListener('click', function (evento) {
    // impede que esse clique conte como clique fora do menu
    evento.stopPropagation();
    alternarMenu();
});

// clicou em qualquer outro lugar da página: fecha o menu
document.addEventListener('click', function () {
    fecharMenu();
});

// apertou a tecla Esc: fecha o menu
document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        fecharMenu();
    }
});


// ---------- BARRA DE ÍCONES DA ESQUERDA ----------

// passa por cada ícone da barra
iconesLaterais.forEach(function (botao) {

    // quando clicar no ícone
    botao.addEventListener('click', function () {

        // tira o destaque de todos os ícones
        iconesLaterais.forEach(function (outro) {
            outro.classList.remove('ativo');
        });

        // deixa o destaque só no ícone que foi clicado
        botao.classList.add('ativo');
    });
});


// ---------- CONTADOR DE CARACTERES E PALAVRAS ----------

// função que conta o que tem escrito no texto e mostra embaixo do editor
function atualizarContador() {
    // innerText é só o texto que aparece na tela, sem as marcações de negrito etc
    const texto = campoTexto.innerText;

    // tira os espaços e quebras de linha das pontas pra não contar espaço vazio
    const textoLimpo = texto.trim();

    // quantidade de caracteres
    const caracteres = textoLimpo.length;

    // quantidade de palavras (se estiver vazio é 0, senão separa pelos espaços)
    let palavras = 0;
    if (textoLimpo !== '') {
        palavras = textoLimpo.split(/\s+/).length;
    }

    // escreve o resultado no contador
    contador.textContent = 'Caracteres: ' + caracteres + ' | Palavras: ' + palavras;
}

// quando o editor fica vazio, o navegador deixa um <br> sobrando e o texto cinza não volta
// essa função limpa isso
function limparSeVazio() {
    if (campoTexto.innerText.trim() === '' && !campoTexto.querySelector('img')) {
        campoTexto.innerHTML = '';
    }
}

// toda vez que digitar no texto, atualiza o contador
campoTexto.addEventListener('input', function () {
    limparSeVazio();
    atualizarContador();
});

// ao colar um texto, cola só o texto puro (sem fonte e cor de outro site)
campoTexto.addEventListener('paste', function (evento) {
    evento.preventDefault();
    const textoColado = evento.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, textoColado);
});


// ---------- FORMATAÇÃO DO TEXTO ----------

// função que aplica a formatação no texto selecionado (ou no ponto onde o cursor está)
// comando é o nome do comando do navegador, tipo 'bold' ou 'italic'
function formatar(comando, valor) {
    // volta o foco pro editor, senão o clique no botão tira o cursor de lá
    campoTexto.focus();
    document.execCommand(comando, false, valor);

    // o texto mudou, então atualiza o contador e os botões
    atualizarContador();
    atualizarBotoesLigados();
}

// guarda o trecho que estava selecionado no texto
// precisa disso porque o link pede uma janela e a seleção se perde
let selecaoGuardada = null;

// função que coloca o link no texto selecionado
function criarLink() {
    const selecao = window.getSelection();

    // se não tem nada selecionado, pede pra selecionar primeiro
    if (selecao.isCollapsed) {
        mostrarAviso('Selecione o texto que vai virar link.', 'erro');
        return;
    }

    selecaoGuardada = selecao.getRangeAt(0).cloneRange();

    // pergunta o endereço do link
    let endereco = prompt('Cole o endereço do link:', 'https://');
    if (!endereco) {
        return;
    }

    // se escreveu sem o http, coloca
    if (!/^(https?:|mailto:)/i.test(endereco)) {
        endereco = 'https://' + endereco;
    }

    // devolve a seleção que tinha antes da janela e cria o link
    selecao.removeAllRanges();
    selecao.addRange(selecaoGuardada);
    formatar('createLink', endereco);

    // abre o link em outra aba
    campoTexto.querySelectorAll('a').forEach(function (link) {
        link.target = '_blank';
        link.rel = 'noopener';
    });
}

// função que coloca o texto selecionado como código
function criarCodigo() {
    const selecao = window.getSelection();

    // se não tem nada selecionado, pede pra selecionar primeiro
    if (selecao.isCollapsed) {
        mostrarAviso('Selecione o texto que vai virar código.', 'erro');
        return;
    }

    // pega o texto selecionado e troca por ele dentro de <code>
    // textContent evita que algum html colado vire código de verdade
    const texto = document.createElement('code');
    texto.textContent = selecao.toString();
    formatar('insertHTML', texto.outerHTML);
}

// passa por cada botão de formatação
botoesFormatar.forEach(function (botao) {

    // mousedown com preventDefault faz o botão não roubar a seleção do texto
    botao.addEventListener('mousedown', function (evento) {
        evento.preventDefault();
    });

    // quando clicar no botão
    botao.addEventListener('click', function () {

        // cada botão tem um data-acao no html que diz o que ele faz
        const acao = botao.dataset.acao;

        if (acao === 'negrito') {
            formatar('bold');

        } else if (acao === 'italico') {
            formatar('italic');

        } else if (acao === 'riscado') {
            formatar('strikeThrough');

        } else if (acao === 'lista') {
            formatar('insertUnorderedList');

        } else if (acao === 'link') {
            criarLink();

        } else if (acao === 'codigo') {
            criarCodigo();

        } else if (acao === 'imagem') {
            // guarda onde estava o cursor e abre a janela pra escolher a imagem
            guardarCursor();
            arquivoMidia.click();
        }
    });
});

// função que marca os botões (negrito, itálico...) que estão ligados onde o cursor está
function atualizarBotoesLigados() {
    const comandos = {
        negrito: 'bold',
        italico: 'italic',
        riscado: 'strikeThrough',
        lista: 'insertUnorderedList'
    };

    botoesFormatar.forEach(function (botao) {
        const comando = comandos[botao.dataset.acao];

        // só os botões que têm comando (negrito, itálico, riscado, lista) acendem
        if (comando) {
            botao.classList.toggle('ligado', document.queryCommandState(comando));
        }
    });
}

// quando o cursor muda de lugar, atualiza os botões (só se for dentro do editor)
document.addEventListener('selectionchange', function () {
    const selecao = window.getSelection();
    if (selecao.rangeCount && campoTexto.contains(selecao.anchorNode)) {
        atualizarBotoesLigados();
    }
});

// guarda a posição do cursor no texto pra colocar a imagem no lugar certo
let cursorGuardado = null;

function guardarCursor() {
    const selecao = window.getSelection();
    if (selecao.rangeCount && campoTexto.contains(selecao.anchorNode)) {
        cursorGuardado = selecao.getRangeAt(0).cloneRange();
    } else {
        cursorGuardado = null;
    }
}

// botão "add mídia" também abre a janela pra escolher a imagem
botaoAddMidia.addEventListener('mousedown', function () {
    guardarCursor();
});

botaoAddMidia.addEventListener('click', function () {
    arquivoMidia.click();
});

// quando escolher a imagem, coloca ela dentro do texto
arquivoMidia.addEventListener('change', function () {
    const arquivo = arquivoMidia.files[0];

    // se fechou a janela sem escolher nada, não faz nada
    if (!arquivo) {
        return;
    }

    // só aceita arquivo de imagem
    if (!arquivo.type.startsWith('image/')) {
        mostrarAviso('Escolha um arquivo de imagem.', 'erro');
        arquivoMidia.value = '';
        return;
    }

    // devolve o cursor pro lugar onde estava (ou pro final do texto)
    campoTexto.focus();
    const selecao = window.getSelection();
    if (cursorGuardado) {
        selecao.removeAllRanges();
        selecao.addRange(cursorGuardado);
    } else {
        selecao.selectAllChildren(campoTexto);
        selecao.collapseToEnd();
    }

    // cria a imagem com um endereço temporário e coloca no texto
    const imagem = document.createElement('img');
    imagem.src = URL.createObjectURL(arquivo);
    imagem.alt = arquivo.name;
    formatar('insertHTML', imagem.outerHTML);

    // limpa o campo pra dar pra escolher o mesmo arquivo de novo depois
    arquivoMidia.value = '';
});


// ---------- TAGS E CATEGORIAS (botão X) ----------

// pega todos os X das tags
const botoesRemoverTag = document.querySelectorAll('.pub-tag-x');

// passa por cada X
botoesRemoverTag.forEach(function (botao) {

    // quando clicar no X
    botao.addEventListener('click', function () {
        // o X fica dentro da tag, então apaga o "pai" dele (a tag inteira)
        botao.parentElement.remove();
    });
});

// função que devolve uma lista com o nome das tags que sobraram
// o seletor diz de qual grupo pegar (#categorias ou #tags)
function pegarTags(seletor) {
    const lista = [];

    document.querySelectorAll(seletor + ' .pub-tag').forEach(function (tag) {
        lista.push(tag.textContent.trim());
    });

    return lista;
}


// ---------- IMAGEM DE CAPA ----------

// clicou na caixa da capa: abre a janela pra escolher a imagem
caixaCapa.addEventListener('click', function () {
    arquivoCapa.click();
});

// quando escolher a imagem
arquivoCapa.addEventListener('change', function () {
    const arquivo = arquivoCapa.files[0];

    // se fechou a janela sem escolher nada, não faz nada
    if (!arquivo) {
        return;
    }

    // só aceita arquivo de imagem
    if (!arquivo.type.startsWith('image/')) {
        mostrarAviso('Escolha um arquivo de imagem.', 'erro');
        return;
    }

    // cria um endereço temporário pra mostrar a imagem na tela
    imagemCapa.src = URL.createObjectURL(arquivo);

    // troca o desenho da caixa pela imagem escolhida
    caixaCapa.classList.add('com-imagem');
});


// ---------- BOTÃO PUBLICAR ----------

// quando clicar em publicar
botaoPublicar.addEventListener('click', function () {

    // pega o título e o texto sem os espaços das pontas
    const titulo = campoTitulo.value.trim();
    const texto = campoTexto.innerText.trim();

    // se o título está vazio, avisa e para por aqui
    if (titulo === '') {
        mostrarAviso('Digite o título da notícia.', 'erro');
        campoTitulo.focus();
        return;
    }

    // se o texto está vazio, avisa e para por aqui
    if (texto === '' && !campoTexto.querySelector('img')) {
        mostrarAviso('Escreva o texto da notícia.', 'erro');
        campoTexto.focus();
        return;
    }

    // junta tudo o que foi preenchido em um objeto
    const noticia = {
        titulo: titulo,
        texto: texto,
        textoComFormatacao: campoTexto.innerHTML,
        autor: document.querySelector('#autor').value,
        categorias: pegarTags('#categorias'),
        tags: pegarTags('#tags'),
        status: document.querySelector('#status').value,
        visibilidade: document.querySelector('#visibilidade').value,
        agendar: document.querySelector('#agendar').value
    };

    // mostra no console (tecla F12) o que seria enviado, já que não tem banco de dados
    console.log('Notícia:', noticia);

    // mensagem padrão
    let mensagem = 'Notícia publicada com sucesso!';

    // se o status for rascunho, a mensagem muda
    if (noticia.status === 'Rascunho') {
        mensagem = 'Notícia marcada como rascunho.';
    }

    // se escolheu uma data, a mensagem mostra a data (o campo entrega aaaa-mm-dd, aqui vira dd/mm/aaaa)
    if (noticia.agendar !== '') {
        mensagem = 'Notícia agendada para ' + noticia.agendar.split('-').reverse().join('/') + '.';
    }

    // mostra o aviso verde
    mostrarAviso(mensagem, 'ok');
});
