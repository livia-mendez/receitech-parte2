const { Recipe, Comment, sequelize } = require('../db');

exports.index = async (req, res) => {
  try {
    const receitas = await Recipe.findAll({
      attributes: [
        'id',
        'titulo',
        'imagem',
        'tempo',
        'categoria',
        [
          sequelize.fn('COUNT', sequelize.col('Comments.id')),
          'totalComentarios',
        ],
      ],
      include: [
        {
          model: Comment,
          as: 'Comments',
          attributes: [],
          required: false,
        },
      ],
      group: [
        'Recipe.id',
        'Recipe.titulo',
        'Recipe.imagem',
        'Recipe.tempo',
        'Recipe.categoria',
      ],
      order: [[sequelize.literal('totalComentarios'), 'DESC']],
      limit: 8, // igual o layout que você mostrou
    });

    const categorias = ['Sobremesas', 'Almoço', 'Fitness', 'Lanches'];

    res.render('index', {
      title: 'Receita Tech',
      receitas,
      categorias,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar home.');
  }
};
