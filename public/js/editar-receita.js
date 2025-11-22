// public/js/editar-receita.js
document.addEventListener('DOMContentLoaded', () => {
  // ====== USUÁRIO LOGADO ======
  let usuario = null;
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      usuario = JSON.parse(usuarioStr);
    }
  } catch (e) {
    console.error('Erro ao ler usuário do localStorage:', e);
  }

  if (!usuario) {
    alert('Você precisa estar logado para editar uma receita.');
    window.location.href = '/login';
    return;
  }

  const card = document.querySelector('.card-cadastro');
  const recipeId = card?.dataset.recipeId;

  // função usada pelo botão X e pelo voltar
  window.fecharModal = function () {
    window.history.back();
  };

  // ====== CAMPOS ======
  const form = document.getElementById('form-editar-receita');
  const inputNome = document.getElementById('nome');
  const selectCategoria = document.getElementById('categoria');
  const selectSubcategoria = document.getElementById('subcategoria');
  const textareaSobre = document.getElementById('sobre');
  const listaIngredientes = document.getElementById('lista-ingredientes');
  const listaPreparo = document.getElementById('lista-preparo');
  const inputTempo = document.getElementById('tempo-preparo');
  const textareaDica = document.getElementById('dica');

  const btnAddIngrediente = document.getElementById('btn-add-ingrediente');
  const btnAddPreparo = document.getElementById('btn-add-preparo');

  // adiciona novo campo de ingrediente
  btnAddIngrediente?.addEventListener('click', () => {
    const qtd = listaIngredientes.querySelectorAll('.ingrediente-input').length;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ingrediente-input';
    input.placeholder = `${qtd + 1} -`;
    listaIngredientes.appendChild(input);
  });

  // adiciona novo campo de preparo
  btnAddPreparo?.addEventListener('click', () => {
    const qtd = listaPreparo.querySelectorAll('.preparo-input').length;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'preparo-input';
    input.placeholder = `${qtd + 1} -`;
    listaPreparo.appendChild(input);
  });

  // ====== SUBMIT ======
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const categoria = selectCategoria.value.trim();
    const descricao = textareaSobre.value.trim();

    if (!nome || !categoria || !descricao) {
      alert('Nome, categoria e sobre a receita são obrigatórios.');
      return;
    }

    const ingredientesArr = Array.from(
      listaIngredientes.querySelectorAll('.ingrediente-input')
    )
      .map((inp) => inp.value.trim())
      .filter((v) => v.length > 0);

    if (!ingredientesArr.length) {
      alert('Informe pelo menos um ingrediente.');
      return;
    }

    const passosArr = Array.from(
      listaPreparo.querySelectorAll('.preparo-input')
    )
      .map((inp) => inp.value.trim())
      .filter((v) => v.length > 0);

    if (!passosArr.length) {
      alert('Informe pelo menos uma etapa de preparo.');
      return;
    }

    const payload = {
      user_id: usuario.id,
      title: nome,
      category: categoria,
      subcategory: selectSubcategoria.value || null,
      description: descricao,
      ingredients: JSON.stringify(ingredientesArr),
      steps: JSON.stringify(passosArr),
      prep_time_min: inputTempo.value.trim() || null,
      tip: textareaDica.value.trim() || null,
      // servings: aqui não tem campo na UI, então não envio
    };

    try {
      const resp = await fetch(`/receitas/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(data.error || 'Erro ao atualizar receita.');
        return;
      }

      // deu certo -> volta para a página da receita
      window.location.href = `/receitas/${recipeId}`;
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar receita.');
    }
  });
});
