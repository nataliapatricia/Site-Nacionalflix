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

// --- ROTAS DE FILMES ---

// ROTA DE BUSCAR OPÇÕES DE FILTRO (VEM PRIMEIRO!)
router.get('/filmes/filtros', async (req, res) => {
    try {
        // 1. Busca todos os gêneros do banco de dados
        const [generosResult] = await db.query("SELECT genero FROM filmes WHERE genero IS NOT NULL AND genero != ''");
        const [anosResult] = await db.query("SELECT DISTINCT ano_lancamento FROM filmes WHERE ano_lancamento IS NOT NULL ORDER BY ano_lancamento DESC");

        // 2. Processa a lista de gêneros
        const todosOsGeneros = new Set(); // Usamos um Set para garantir que não haverá gêneros duplicados
        
        generosResult.forEach(item => {
            // "Quebra" a string "Ação, Drama, Policial" em um array ["Ação", " Drama", " Policial"]
            const generosDoFilme = item.genero.split(','); 
            
            // Adiciona cada gênero individualmente ao nosso Set, removendo espaços em branco
            generosDoFilme.forEach(genero => {
                todosOsGeneros.add(genero.trim());
            });
        });

        // 3. Converte o Set de volta para um array e o ordena alfabeticamente
        const generosUnicos = Array.from(todosOsGeneros).sort();
        const anos = anosResult.map(item => item.ano_lancamento);

        // 4. Envia a lista limpa e ordenada para o frontend
        res.status(200).json({ generos: generosUnicos, anos });

    } catch (error) {
        console.error("Erro ao buscar opções de filtro:", error);
        res.status(500).json({ message: "Erro ao buscar opções de filtro." });
    }
});

// ROTA DE BUSCAR TODOS OS FILMES (COM FILTRO OPCIONAL)
router.get('/filmes', async (req, res) => {
    try {
        const { genero, ano } = req.query;
        let query = 'SELECT id, titulo, url_poster FROM filmes';
        const params = [];
        const whereClauses = [];

        if (genero) {
            whereClauses.push('genero LIKE ?');
            params.push(`%${genero}%`);
        }
        if (ano) {
            whereClauses.push('ano_lancamento = ?');
            params.push(ano);
        }
        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        query += ' ORDER BY titulo';

        const [filmes] = await db.query(query, params);
        res.status(200).json(filmes);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        res.status(500).json({ message: 'Erro ao buscar filmes.' });
    }
});

// ROTA DE BUSCAR DETALHES DE UM FILME (COM PARÂMETRO, VEM POR ÚLTIMO!)
router.get('/filmes/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario_id } = req.query;
    try {
        const [filmes] = await db.query('SELECT * FROM filmes WHERE id = ?', [id]);
        if (filmes.length === 0) {
            return res.status(404).json({ message: 'Filme não encontrado.' });
        }
        const [imagens] = await db.query('SELECT url_imagem FROM imagens_filme WHERE filme_id = ?', [id]);
        const [comentarios] = await db.query(`
            SELECT c.id, c.usuario_id, c.nota, c.comentario, u.nome_usuario, c.data_comentario
            FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.filme_id = ? ORDER BY c.data_comentario DESC
        `, [id]);
        const [avgResult] = await db.query('SELECT AVG(nota) as media FROM comentarios WHERE filme_id = ?', [id]);
        const media_avaliacoes = avgResult[0].media || 0;

        let assistido = false;
        if (usuario_id) { // Só verifica se o ID do usuário foi enviado
            const [historicoStatus] = await db.query(
                'SELECT id FROM historico_assistidos WHERE usuario_id = ? AND filme_id = ?',
                [usuario_id, id]
            );
            assistido = historicoStatus.length > 0;
        }
        const resultado = {
            ...filmes[0],
            imagens: imagens.map(img => img.url_imagem),
            comentarios: comentarios,
            media_avaliacoes: media_avaliacoes,
            assistido: assistido
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

// ROTA: SALVAR UM NOVO COMENTÁRIO (ATUALIZADA COM VERIFICAÇÃO)
router.post('/comentarios', async (req, res) => {
    const { filme_id, usuario_id, nota, comentario } = req.body;
    if (!filme_id || !usuario_id || !nota) {
        return res.status(400).json({ message: 'Filme, usuário e nota são obrigatórios.' });
    }

    try {
        // *** NOVO: VERIFICA SE O USUÁRIO JÁ COMENTOU NESTE FILME ***
        const [existingComments] = await db.query(
            'SELECT id FROM comentarios WHERE filme_id = ? AND usuario_id = ?',
            [filme_id, usuario_id]
        );

        if (existingComments.length > 0) {
            // Se já existe, retorna um erro de conflito
            return res.status(409).json({ message: 'Você já avaliou este filme.' });
        }
        // *** FIM DA VERIFICAÇÃO ***

        // Se não existe, insere o novo comentário (código original)
        const [result] = await db.query(
            'INSERT INTO comentarios (filme_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?)',
            [filme_id, usuario_id, nota, comentario]
        );

        // Recalcula a nova média
        const [avgResult] = await db.query('SELECT AVG(nota) as media FROM comentarios WHERE filme_id = ?', [filme_id]);
        const novaMedia = avgResult[0].media || 0;

        // Retorna sucesso com o ID do novo comentário e a nova média
        res.status(201).json({ 
            message: 'Comentário adicionado com sucesso!', 
            commentId: result.insertId,
            novaMedia: novaMedia 
        });

    } catch (error) {
        console.error("Erro ao salvar comentário:", error);
        res.status(500).json({ message: 'Erro ao salvar o comentário.' });
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

// NOVA ROTA: BUSCAR OPÇÕES DE FILTRO (GÊNEROS E ANOS)
router.get('/filmes/filtros', async (req, res) => {
    try {
        const [generosResult] = await db.query("SELECT DISTINCT genero FROM filmes WHERE genero IS NOT NULL AND genero != '' ORDER BY genero");
        const [anosResult] = await db.query("SELECT DISTINCT ano_lancamento FROM filmes WHERE ano_lancamento IS NOT NULL ORDER BY ano_lancamento DESC");

        const generos = generosResult.map(item => item.genero);
        const anos = anosResult.map(item => item.ano_lancamento);

        res.status(200).json({ generos, anos });
    } catch (error) {
        console.error("Erro ao buscar opções de filtro:", error);
        res.status(500).json({ message: "Erro ao buscar opções de filtro." });
    }
});

// NOVA ROTA: ATUALIZAR UM COMENTÁRIO EXISTENTE
router.put('/comentarios/:id', async (req, res) => {
    const { id } = req.params; // ID do comentário a ser editado
    const { usuario_id, nota, comentario } = req.body; // ID do usuário que está TENTANDO editar

    // Validação básica
    if (!usuario_id || !nota || !id) {
        return res.status(400).json({ message: 'ID do comentário, ID do usuário e nota são obrigatórios.' });
    }

    try {
        // 1. Busca o comentário para verificar o dono
        const [comments] = await db.query(
            'SELECT usuario_id, filme_id FROM comentarios WHERE id = ?', 
            [id]
        );

        if (comments.length === 0) {
            return res.status(404).json({ message: 'Comentário não encontrado.' });
        }

        const comment = comments[0];

        // 2. *** VERIFICAÇÃO DE PERMISSÃO: O usuário logado é o dono do comentário? ***
        if (comment.usuario_id !== usuario_id) {
            return res.status(403).json({ message: 'Você não tem permissão para editar este comentário.' });
        }

        // 3. Se for o dono, atualiza o comentário
        await db.query(
            'UPDATE comentarios SET nota = ?, comentario = ? WHERE id = ?',
            [nota, comentario, id]
        );

        // 4. Recalcula a nova média do filme
        const [avgResult] = await db.query(
            'SELECT AVG(nota) as media FROM comentarios WHERE filme_id = ?', 
            [comment.filme_id] // Usa o filme_id do comentário buscado
        );
        const novaMedia = avgResult[0].media || 0;

        // 5. Retorna sucesso com a nova média
        res.status(200).json({ 
            message: 'Comentário atualizado com sucesso!',
            novaMedia: novaMedia 
        });

    } catch (error) {
        console.error("Erro ao atualizar comentário:", error);
        res.status(500).json({ message: 'Erro ao atualizar o comentário.' });
    }
});

// NOVA ROTA: MARCAR UM FILME COMO ASSISTIDO
router.post('/historico', async (req, res) => {
    const { usuario_id, filme_id } = req.body;
    if (!usuario_id || !filme_id) {
        return res.status(400).json({ message: 'ID do usuário e do filme são obrigatórios.' });
    }
    try {
        await db.query(
            'INSERT INTO historico_assistidos (usuario_id, filme_id) VALUES (?, ?)',
            [usuario_id, filme_id]
        );
        res.status(201).json({ message: 'Filme marcado como assistido.' });
    } catch (error) {
        // Ignora erro se já estiver marcado (UNIQUE constraint)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({ message: 'Filme já estava marcado.' });
        }
        console.error("Erro ao marcar filme:", error);
        res.status(500).json({ message: 'Erro ao marcar filme.' });
    }
});

// NOVA ROTA: DESMARCAR UM FILME COMO ASSISTIDO
router.delete('/historico/:usuario_id/:filme_id', async (req, res) => {
    const { usuario_id, filme_id } = req.params;
    try {
        await db.query(
            'DELETE FROM historico_assistidos WHERE usuario_id = ? AND filme_id = ?',
            [usuario_id, filme_id]
        );
        res.status(200).json({ message: 'Filme desmarcado.' });
    } catch (error) {
        console.error("Erro ao desmarcar filme:", error);
        res.status(500).json({ message: 'Erro ao desmarcar filme.' });
    }
});

// NOVA ROTA: BUSCAR HISTÓRICO DE UM USUÁRIO
router.get('/historico/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const [historico] = await db.query(`
            SELECT 
                f.id, 
                f.titulo, 
                f.url_poster, 
                c.nota AS sua_nota -- Pega a nota dada PELO usuário logado
            FROM historico_assistidos h
            JOIN filmes f ON h.filme_id = f.id
            LEFT JOIN comentarios c ON c.filme_id = f.id AND c.usuario_id = h.usuario_id -- Junta com comentários DO usuário
            WHERE h.usuario_id = ?
            ORDER BY h.data_marcado DESC
        `, [usuario_id]);
        
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ message: 'Erro ao buscar histórico.' });
    }
});

module.exports = router;