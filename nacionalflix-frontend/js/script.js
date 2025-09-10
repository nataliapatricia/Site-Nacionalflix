document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = 'http://localhost:3000/api';

    // --- LÓGICA DO FORMULÁRIO DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch(`${backendUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    // Redireciona para a página principal após login bem-sucedido
                    window.location.href = 'principal.html'; 
                }
            } catch (error) {
                console.error('Erro ao tentar fazer login:', error);
                alert('Não foi possível conectar ao servidor.');
            }
        });
    }

    // --- LÓGICA DO FORMULÁRIO DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch(`${backendUrl}/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, senha })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    window.location.href = 'index.html'; // Redireciona para a tela de login
                }
            } catch (error) {
                console.error('Erro ao tentar cadastrar:', error);
                alert('Não foi possível conectar ao servidor.');
            }
        });
    }

    // --- LÓGICA DE RECUPERAÇÃO DE SENHA ---
    const recuperarSenhaForm = document.getElementById('recuperar-senha-form');
    if (recuperarSenhaForm) {
        recuperarSenhaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            
            // Simulação por enquanto, backend precisa implementar a lógica de email
            alert('Se o e-mail existir em nossa base, um link de recuperação será enviado.');
        });
    }
});