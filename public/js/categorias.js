// public/js/categorias.js
document.addEventListener('DOMContentLoaded', () => {
  // Dropdown da navbar
  document.querySelectorAll('.dropdown-item[data-categoria]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoria = (btn.dataset.categoria || btn.textContent.trim()).trim();
      if (!categoria) return;

      if (categoria.toLowerCase() === 'todas as receitas') {
        window.location.href = '/categorias';
        return;
      }

      window.location.href =
        `/categorias?categoria=${encodeURIComponent(categoria)}`;
    });
  });

  // Bolinhas de categoria na home
  document.querySelectorAll('.bolinha-categoria').forEach((bolinha) => {
    bolinha.addEventListener('click', () => {
      const categoria = bolinha.dataset.categoria;
      if (!categoria) return;

      if (categoria.toLowerCase() === 'todas as receitas') {
        window.location.href = '/categorias';
        return;
      }

      window.location.href =
        `/categorias?categoria=${encodeURIComponent(categoria)}`;
    });
  });
});
