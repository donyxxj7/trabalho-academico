/* ============================= */
/* BOTÕES SEGUIR */
/* ============================= */

const botoesSeguir = document.querySelectorAll(".comunidade button");

botoesSeguir.forEach(function (botao) {
  botao.addEventListener("click", function () {
    if (botao.innerText === "Seguir") {
      botao.innerText = "Seguindo";
    } else {
      botao.innerText = "Seguir";
    }
  });
});

/* ============================= */
/* CURTIR PUBLICAÇÃO */
/* ============================= */

const publicacoes = document.querySelectorAll(".post");

publicacoes.forEach(function (post) {
  const botoes = post.querySelectorAll(".post-acoes button");

  const botaoCurtir = botoes[0];

  let curtiu = false;

  botaoCurtir.addEventListener("click", function () {
    /* Pega somente o número que está dentro do botão */
    let numeroCurtidas = parseInt(botaoCurtir.innerText.replace(/\D/g, ""));

    if (curtiu === false) {
      numeroCurtidas++;

      botaoCurtir.innerText = "♥ " + numeroCurtidas;

      curtiu = true;
    } else {
      numeroCurtidas--;

      botaoCurtir.innerText = "♡ " + numeroCurtidas;

      curtiu = false;
    }
  });
});

/* ============================= */
/* SALVAR PUBLICAÇÃO */
/* ============================= */

publicacoes.forEach(function (post) {
  const botoes = post.querySelectorAll(".post-acoes button");

  const botaoSalvar = botoes[3];

  botaoSalvar.addEventListener("click", function () {
    if (botaoSalvar.innerText === "Salvar") {
      botaoSalvar.innerText = "Salvo";
    } else {
      botaoSalvar.innerText = "Salvar";
    }
  });
});

/* ============================= */
/* CAMPO DE PESQUISA */
/* Pesquisa pelo conteúdo dos posts */
/* ============================= */

const campoPesquisa = document.querySelector(".pesquisa input");

campoPesquisa.addEventListener("input", function () {
  const textoPesquisa = campoPesquisa.value.toLowerCase();

  publicacoes.forEach(function (post) {
    const textoPost = post.innerText.toLowerCase();

    if (textoPost.includes(textoPesquisa)) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
});
