document.addEventListener('DOMContentLoaded', async () => {
    const movieList = document.getElementById('movie-list');
    const searchBar = document.getElementById('search-bar');
    const backendUrl = 'http://localhost:3000/api';

    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    const usuario = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : {};

    // Linha de depuração crucial
    console.log('Usuário logado na PÁGINA PRINCIPAL:', usuario);

    // Lógica de permissão segura
    const isDev = usuario && usuario.role === 'dev';

    let allMovies = [];

    const renderMovies = (filmes) => {
        movieList.innerHTML = '';
        if (filmes.length === 0) {
            movieList.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }
        filmes.forEach(filme => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            
            const deleteButtonHTML = isDev 
                ? `<button class="delete-btn" data-id="${filme.id}" title="Excluir filme">×</button>` 
                : '';

            movieCard.innerHTML = `
                <a href="filme.html?id=${filme.id}">
                    <img src="${filme.url_poster}" alt="${filme.titulo}">
                </a>
                <p>${filme.titulo}</p>
                ${deleteButtonHTML}
            `;
            movieList.appendChild(movieCard);
        });
    };

    // Carrega os filmes iniciais
    try {
        const response = await fetch(`${backendUrl}/filmes`);
        if (!response.ok) throw new Error('Não foi possível carregar os filmes.');
        
        allMovies = await response.json();
        renderMovies(allMovies);

    } catch (error) {
        movieList.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }

    // Lógica da Barra de Busca
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMovies = allMovies.filter(filme => 
            filme.titulo.toLowerCase().includes(searchTerm)
        );
        renderMovies(filteredMovies);
    });

    // Lógica para o botão Excluir (usando delegação de eventos)
    movieList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const filmeId = e.target.dataset.id;
            const filmeTitulo = e.target.closest('.movie-card').querySelector('p').textContent;

            if (confirm(`Tem certeza que deseja excluir "${filmeTitulo}"? Esta ação não pode ser desfeita.`)) {
                try {
                    const response = await fetch(`${backendUrl}/filmes/${filmeId}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) throw new Error('Falha ao excluir o filme.');

                    // Remove o card do filme da tela
                    e.target.closest('.movie-card').remove();
                    alert(`"${filmeTitulo}" foi excluído com sucesso.`);

                } catch (error) {
                    alert(error.message);
                }
            }
        }
    });
});