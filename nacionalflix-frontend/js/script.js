document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = 'http://localhost:3000/api';

    

    // --- FORMULÁRIO DE LOGIN ---
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
                
                if (!response.ok) {
                    throw new Error(data.message);
                }

                // Guarda os dados do usuário na sessão do navegador
                sessionStorage.setItem('usuarioLogado', JSON.stringify(data.user));
                
                // Redireciona para a página principal
                window.location.href = 'principal.html';

            } catch (error) {
                alert(`Erro no login: ${error.message}`);
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

    // Procura os elementos na página
    const toggleBtn = document.getElementById('toggle-password-btn');
    const passwordInput = document.getElementById('senha');
    
    // Verifica se os elementos do "olho" existem na página atual
    if (toggleBtn && passwordInput) {
        const eyeIcon = document.getElementById('svg-eye');
        const eyeSlashIcon = document.getElementById('svg-eye-slash');

        toggleBtn.addEventListener('click', () => {
            // Verifica qual é o tipo atual do input
            if (passwordInput.type === 'password') {
                // Se for senha, muda para texto e troca os ícones
                passwordInput.type = 'text';
                eyeIcon.style.display = 'none';
                eyeSlashIcon.style.display = 'block';
            } else {
                // Se for texto, muda para senha e troca os ícones
                passwordInput.type = 'password';
                eyeIcon.style.display = 'block';
                eyeSlashIcon.style.display = 'none';
            }
        });
    } 
});