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

// campo do título e área do texto da notícia
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
    const texto = campoTexto.value;

    // quantidade de caracteres
    const caracteres = texto.length;

    // tira os espaços das pontas pra não contar espaço vazio
    const textoLimpo = texto.trim();

    // quantidade de palavras (se estiver vazio é 0, senão separa pelos espaços)
    let palavras = 0;
    if (textoLimpo !== '') {
        palavras = textoLimpo.split(/\s+/).length;
    }

    // escreve o resultado no contador
    contador.textContent = 'Caracteres: ' + caracteres + ' | Palavras: ' + palavras;
}

// toda vez que digitar no texto, atualiza o contador
campoTexto.addEventListener('input', atualizarContador);


// ---------- FORMATAÇÃO DO TEXTO ----------

// função que coloca símbolos antes e depois do texto selecionado
// se não tiver nada selecionado, usa o textoPadrao
function envolverTexto(antes, depois, textoPadrao) {

    // posição onde começa e onde termina a seleção
    const inicio = campoTexto.selectionStart;
    const fim = campoTexto.selectionEnd;

    // pega o texto selecionado (ou o texto padrão se não selecionou nada)
    const selecionado = campoTexto.value.substring(inicio, fim) || textoPadrao;

    // monta o texto novo: o que vem antes + símbolos + selecionado + o que vem depois
    campoTexto.value =
        campoTexto.value.substring(0, inicio) +
        antes + selecionado + depois +
        campoTexto.value.substring(fim);

    // volta o cursor pro texto e deixa o que foi formatado selecionado
    campoTexto.focus();
    campoTexto.setSelectionRange(inicio + antes.length, inicio + antes.length + selecionado.length);

    // o texto mudou, então atualiza o contador
    atualizarContador();
}

// passa por cada botão de formatação
botoesFormatar.forEach(function (botao) {

    // quando clicar no botão
    botao.addEventListener('click', function () {

        // cada botão tem um data-acao no html que diz o que ele faz
        const acao = botao.dataset.acao;

        if (acao === 'negrito') {
            envolverTexto('**', '**', 'texto em negrito');

        } else if (acao === 'italico') {
            envolverTexto('*', '*', 'texto em itálico');

        } else if (acao === 'riscado') {
            envolverTexto('~~', '~~', 'texto riscado');

        } else if (acao === 'lista') {
            envolverTexto('- ', '', 'item da lista');

        } else if (acao === 'link') {
            envolverTexto('[', '](https://)', 'texto do link');

        } else if (acao === 'codigo') {
            envolverTexto('`', '`', 'código');

        } else if (acao === 'imagem') {
            // abre a janela pra escolher a imagem
            arquivoMidia.click();
        }
    });
});

// botão "add mídia" também abre a janela pra escolher a imagem
botaoAddMidia.addEventListener('click', function () {
    arquivoMidia.click();
});

// quando escolher a imagem, coloca o nome dela dentro do texto
arquivoMidia.addEventListener('change', function () {
    const arquivo = arquivoMidia.files[0];

    // se fechou a janela sem escolher nada, não faz nada
    if (!arquivo) {
        return;
    }

    // escreve no texto no formato ![descrição](nome-do-arquivo)
    envolverTexto('![', '](' + arquivo.name + ')', arquivo.name);

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
    const texto = campoTexto.value.trim();

    // se o título está vazio, avisa e para por aqui
    if (titulo === '') {
        mostrarAviso('Digite o título da notícia.', 'erro');
        campoTitulo.focus();
        return;
    }

    // se o texto está vazio, avisa e para por aqui
    if (texto === '') {
        mostrarAviso('Escreva o texto da notícia.', 'erro');
        campoTexto.focus();
        return;
    }

    // junta tudo o que foi preenchido em um objeto
    const noticia = {
        titulo: titulo,
        texto: texto,
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
