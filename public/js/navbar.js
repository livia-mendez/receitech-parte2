// public/js/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  // ====== BUSCA NA NAVBAR (Enter) ======
  const campoPesquisa = document.getElementById('campo-pesquisa');

  if (campoPesquisa) {
    campoPesquisa.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        const termo = this.value.trim();
        if (termo) {
          // versão Node/Express: rota /pesquisa
          window.location.href = `/pesquisa?termo=${encodeURIComponent(termo)}`;
        }
      }
    });
  }

  // ====== FOTO DO USUÁRIO NA NAVBAR ======
  let usuario = null;
  try {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      usuario = JSON.parse(usuarioStr);
    }
  } catch (err) {
    console.error('Erro ao ler usuário do localStorage:', err);
  }

  if (usuario && usuario.fotoPerfil) {
    // tenta achar primeiro na home (.perfil-navbar)
    let navbarIcon = document.querySelector('.perfil-navbar');

    // se for outra página que usa .user-icon img, pega ela
    if (!navbarIcon) {
      navbarIcon = document.querySelector('.user-icon img');
    }

    if (navbarIcon) {
      navbarIcon.src = usuario.fotoPerfil;
    }
  }

  // (opcional) ajustar link do usuário
  const userLink = document.getElementById('user-link');
  if (userLink) {
    if (usuario) {
      // ajusta conforme sua rota real
      userLink.href = `/perfil`;
    } else {
      userLink.href = `/login`;
    }
  }

  // ====== CATEGORIAS DO DROPDOWN ======
  document.querySelectorAll('.dropdown-item[data-categoria]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.categoria || btn.textContent.trim();
      if (!categoria) return;
      window.location.href = `/categorias?categoria=${encodeURIComponent(categoria)}`;
    });
  });

  document.querySelectorAll('.dropdown-subitem').forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.categoria;
      const subcategoria = btn.dataset.subcategoria;
      if (!categoria) return;

      const params = new URLSearchParams({ categoria });
      if (subcategoria) params.append('subcategoria', subcategoria);

      window.location.href = `/categorias?${params.toString()}`;
    });
  });
});
