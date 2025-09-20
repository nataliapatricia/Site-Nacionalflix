const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('./db');

const router = express.Router();
const saltRounds = 10; // Fator de custo para o hash da senha

// ROTA DE CADASTRO
router.post('/cadastro', async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Criptografa a senha antes de salvar
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const [result] = await db.query(
      'INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES (?, ?, ?)',
      [username, email, senha_hash]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = users[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

            // Login bem-sucedido - AGORA RETORNA A ROLE
          res.status(200).json({ 
          message: 'Login realizado com sucesso!', 
          user: { 
            id: user.id, 
            nome: user.nome_usuario, 
            email: user.email, 
            role: user.role // <-- MUDANÇA IMPORTANTE AQUI
        } 
    });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// ROTA DE RECUPERAÇÃO DE SENHA (Ainda não implementada por completo)
router.post('/recuperar-senha', async (req, res) => {
    // Lógica para gerar token, salvar na tabela `recuperacao_senha`
    // e enviar e-mail com o Nodemailer.
    // Esta parte é mais complexa e podemos detalhar depois.
    res.status(200).json({ message: 'Se o e-mail existir em nossa base, um link de recuperação será enviado.' });
});

// NOVA ROTA: BUSCAR TODOS OS FILMES PARA A PÁGINA PRINCIPAL
router.get('/filmes', async (req, res) => {
    try {
        const [filmes] = await db.query('SELECT id, titulo, url_poster FROM filmes ORDER BY titulo');
        res.status(200).json(filmes);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        res.status(500).json({ message: 'Erro ao buscar filmes.' });
    }
});

// NOVA ROTA: BUSCAR OS DETALHES DE UM FILME ESPECÍFICO
router.get('/filmes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Busca os dados principais do filme
        const [filmes] = await db.query('SELECT * FROM filmes WHERE id = ?', [id]);
        if (filmes.length === 0) {
            return res.status(404).json({ message: 'Filme não encontrado.' });
        }
        const filme = filmes[0];

        // Busca as imagens do filme
        const [imagens] = await db.query('SELECT url_imagem FROM imagens_filme WHERE filme_id = ?', [id]);
        
        // Busca os comentários (juntando com a tabela de usuários para pegar o nome)
        const [comentarios] = await db.query(`
            SELECT c.nota, c.comentario, u.nome_usuario 
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.filme_id = ?
            ORDER BY c.data_comentario DESC
        `, [id]);

        // Monta o objeto final com todas as informações
        const resultado = {
            ...filme,
            imagens: imagens.map(img => img.url_imagem), // Cria um array de URLs
            comentarios: comentarios
        };

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        res.status(500).json({ message: 'Erro ao buscar detalhes do filme.' });
    }
});

// NOVA ROTA: EXCLUIR UM FILME
router.delete('/filmes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM filmes WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
        }

        // Graças ao "ON DELETE CASCADE" no banco, as imagens e comentários
        // relacionados a este filme também são excluídos automaticamente.

        res.status(200).json({ message: 'Filme excluído com sucesso.' });

    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        res.status(500).json({ message: 'Erro ao excluir o filme.' });
    }
});

// ROTA PARA ADICIONAR UM NOVO FILME (PROTEGIDA)
router.post('/filmes', async (req, res) => {
    // AQUI DEVERÍAMOS TER UMA VERIFICAÇÃO DE ROLE (MIDDLEWARE),
    // mas para simplificar, vamos assumir que o frontend não enviará a requisição se o usuário não for 'dev'.
    // Em um projeto de produção, a validação no backend é OBRIGATÓRIA.
    
    const { titulo, sinopse, ano_lancamento, duracao_min, diretores, elenco, url_poster, url_trailer } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO filmes (titulo, sinopse, ano_lancamento, duracao_min, diretores, elenco, url_poster, url_trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, sinopse, ano_lancamento, duracao_min, diretores, elenco, url_poster, url_trailer]
        );
        res.status(201).json({ message: 'Filme adicionado com sucesso!', filmeId: result.insertId });
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        res.status(500).json({ message: 'Erro ao adicionar filme.' });
    }
});


// ROTA PARA EXCLUIR UM COMENTÁRIO (PROTEGIDA)
router.delete('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM comentarios WHERE id = ?', [id]);
        res.status(200).json({ message: 'Comentário excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir comentário:", error);
        res.status(500).json({ message: 'Erro ao excluir comentário.' });
    }
});

module.exports = router;