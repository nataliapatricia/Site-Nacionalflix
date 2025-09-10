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

        // Login bem-sucedido
        res.status(200).json({ message: 'Login realizado com sucesso!', user: { id: user.id, nome: user.nome_usuario, email: user.email } });

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


module.exports = router;