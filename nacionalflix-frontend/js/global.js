document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');

    const currentPage = window.location.pathname.split('/').pop();
    const authPages = ['index.html', 'cadastro.html', 'recuperar-senha.html', ''];

    if (!usuarioLogadoJSON && !authPages.includes(currentPage)) {
        window.location.href = 'index.html';
        return;
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('usuarioLogado');
            alert('Você foi desconectado.');
            window.location.href = 'index.html';
        });
    }
});