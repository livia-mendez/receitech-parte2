// public/js/receita.js
document.addEventListener('DOMContentLoaded', () => {
  // 🔹 Busca da navbar
  const campo = document.getElementById('campo-pesquisa');
  campo?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const termo = campo.value.trim();
      if (termo) {
        window.location.href = `/pesquisa?termo=${encodeURIComponent(termo)}`;
      }
    }
  });

  // 🔹 Usuário logado (dono ou não de comentário)
  let usuario = null;
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      usuario = JSON.parse(usuarioStr);
    }
  } catch (e) {
    console.error('Erro ao ler usuário do localStorage:', e);
  }

  const currentUserId = usuario?.id;

  // 🔹 Comentários: envio e botões
  const form = document.getElementById('form-comentario');
  const textarea = document.getElementById('comentario-texto');
  const lista = document.getElementById('lista-comentarios');

  // pega ID da receita pela URL: /receitas/:id
  const partes = window.location.pathname.split('/');
  const recipeId = partes[partes.length - 1];

  // Mostra botões de editar/excluir só para comentários do usuário logado
  function aplicarPermissoesComentarios() {
    if (!currentUserId || !lista) return;

    const itens = lista.querySelectorAll('.comentario-item');
    itens.forEach((li) => {
      const donoId = li.dataset.userId;
      const btnEdit = li.querySelector('.btn-edit-comment');
      const btnDelete = li.querySelector('.btn-delete-comment');

      if (String(donoId) === String(currentUserId)) {
        if (btnEdit) btnEdit.style.display = 'inline-block';
        if (btnDelete) btnDelete.style.display = 'inline-block';
      }
    });
  }

  aplicarPermissoesComentarios();

  // Envio de novo comentário
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const texto = textarea.value.trim();
    if (!texto) return;

    if (!usuario) {
      alert('Você precisa estar logado para comentar.');
      return;
    }

    try {
      const res = await fetch(`/receitas/${recipeId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: texto,
          user_id: usuario.id,
          author_name: usuario.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Erro ao enviar comentário.');
        return;
      }

      const c = data.comment;

      // monta novo comentário na tela
      const li = document.createElement('li');
      li.className = 'comentario-item';
      li.dataset.commentId = c.id;
      li.dataset.userId = c.user_id;

      li.innerHTML = `
        <div class="comentario-topo">
          <div class="comentario-autor">
            <strong>${c.author_name}</strong>
          </div>
          <span class="comentario-data">
            ${new Date(c.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <p class="comentario-conteudo">${c.content}</p>
        <div class="comentario-acoes">
          <button type="button" class="btn-edit-comment" style="display:none;">Editar</button>
          <button type="button" class="btn-delete-comment" style="display:none;">Excluir</button>
        </div>
      `;

      // adiciona no topo
      lista.prepend(li);

      textarea.value = '';

      // reaplica permissão (vai mostrar os botões pro dono)
      aplicarPermissoesComentarios();
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar comentário.');
    }
  });

  // Clique em editar/excluir (delegação de eventos)
  lista?.addEventListener('click', async (e) => {
    const btn = e.target;
    const li = btn.closest('.comentario-item');
    if (!li || !usuario) return;

    const commentId = li.dataset.commentId;

    // EDITAR
    if (btn.classList.contains('btn-edit-comment')) {
      const p = li.querySelector('.comentario-conteudo');
      const atual = p?.textContent || '';

      const novo = window.prompt('Edite seu comentário:', atual);
      if (novo === null) return;

      const textoNovo = novo.trim();
      if (!textoNovo) {
        alert('Comentário não pode ser vazio.');
        return;
      }

      try {
        const res = await fetch(`/receitas/${recipeId}/comentarios/${commentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: textoNovo,
            user_id: usuario.id,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Erro ao editar comentário.');
          return;
        }

        if (p) p.textContent = data.comment.content;
      } catch (err) {
        console.error(err);
        alert('Erro ao editar comentário.');
      }
    }

    // EXCLUIR
    if (btn.classList.contains('btn-delete-comment')) {
      const confirmar = window.confirm('Deseja realmente excluir este comentário?');
      if (!confirmar) return;

      try {
        const res = await fetch(`/receitas/${recipeId}/comentarios/${commentId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: usuario.id,
          }),
        });

        if (!res.ok && res.status !== 204) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || 'Erro ao excluir comentário.');
          return;
        }

        li.remove();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir comentário.');
      }
    }
  });
});
