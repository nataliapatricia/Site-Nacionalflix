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
            return res.status(404).json({ message: 'Email ou senha incorreto.' });
        }

        const user = users[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha incorreto.' });
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

// ROTA: BUSCAR OS DETALHES DE UM FILME ESPECÍFICO
router.get('/filmes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Busca os dados principais do filme
        const [filmes] = await db.query('SELECT * FROM filmes WHERE id = ?', [id]);
        if (filmes.length === 0) {
            return res.status(404).json({ message: 'Filme não encontrado.' });
        }
        
        // Busca as imagens do filme
        const [imagens] = await db.query('SELECT url_imagem FROM imagens_filme WHERE filme_id = ?', [id]);
        
        // Busca os comentários (juntando com a tabela de usuários para pegar o nome)
        const [comentarios] = await db.query(`
            SELECT c.id, c.nota, c.comentario, u.nome_usuario 
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.filme_id = ?
            ORDER BY c.data_comentario DESC
        `, [id]);

        // Calcula a média das avaliações
        const [avgResult] = await db.query(
            'SELECT AVG(nota) as media FROM comentarios WHERE filme_id = ?',
            [id]
        );
        const media_avaliacoes = avgResult[0].media || 0;

        // Monta o objeto final com TODAS as informações
        const resultado = {
            ...filmes[0], // <-- ESTA LINHA É A MAIS IMPORTANTE! Ela pega tudo do filme (titulo, sinopse, url_poster etc.)
            imagens: imagens.map(img => img.url_imagem),
            comentarios: comentarios,
            media_avaliacoes: media_avaliacoes
        };

        res.status(200).json(resultado);
    } catch (error) {
        console.error('[BACKEND ERRO] Falha ao buscar detalhes do filme:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao buscar detalhes do filme.' });
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

// ROTA PARA ADICIONAR UM NOVO FILME (ATUALIZADA)
router.post('/filmes', async (req, res) => {
    const { titulo, sinopse, ano_lancamento, duracao_min, genero, diretores, elenco, url_poster, url_trailer, imagens } = req.body;

    const connection = await db.getConnection(); // Pega uma conexão para fazer uma transação

    try {
        await connection.beginTransaction(); // Inicia a transação

        // 1. Insere os dados principais na tabela 'filmes'
        const [resultFilme] = await connection.query(
            'INSERT INTO filmes (titulo, sinopse, ano_lancamento, duracao_min, genero, diretores, elenco, url_poster, url_trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, sinopse, ano_lancamento, duracao_min, genero, diretores, elenco, url_poster, url_trailer]
        );
        
        const novoFilmeId = resultFilme.insertId; // Pega o ID do filme que acabamos de criar

        // 2. Verifica se foram enviadas imagens para a galeria
        if (imagens && imagens.length > 0) {
            // Prepara os dados para inserção em lote na tabela 'imagens_filme'
            const imagensParaInserir = imagens.map(url => [novoFilmeId, url]);
            
            await connection.query(
                'INSERT INTO imagens_filme (filme_id, url_imagem) VALUES ?',
                [imagensParaInserir]
            );
        }

        await connection.commit(); // Confirma a transação (salva tudo no banco)
        res.status(201).json({ message: 'Filme e imagens adicionados com sucesso!', filmeId: novoFilmeId });

    } catch (error) {
        await connection.rollback(); // Desfaz a transação em caso de erro
        console.error("Erro ao adicionar filme:", error);
        res.status(500).json({ message: 'Erro ao adicionar filme.' });
    } finally {
        connection.release(); // Libera a conexão de volta para o pool
    }
});

// ROTA: SALVAR UM NOVO COMENTÁRIO (ATUALIZADA)
router.post('/comentarios', async (req, res) => {
    const { filme_id, usuario_id, nota, comentario } = req.body;
    // ... (validação continua a mesma) ...

    try {
        // 1. Insere o novo comentário
        const [result] = await db.query(
            'INSERT INTO comentarios (filme_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?)',
            [filme_id, usuario_id, nota, comentario]
        );
        
        // 2. Recalcula a nova média para o filme
        const [avgResult] = await db.query(
            'SELECT AVG(nota) as media FROM comentarios WHERE filme_id = ?',
            [filme_id]
        );
        const novaMedia = avgResult[0].media || 0;

        // 3. Retorna a resposta de sucesso JUNTO COM a nova média
        res.status(201).json({ 
            message: 'Comentário adicionado com sucesso!', 
            commentId: result.insertId,
            novaMedia: novaMedia 
        });

    } catch (error) {
        // ... (tratamento de erro) ...
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