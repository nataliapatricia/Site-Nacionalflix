document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. SELEÇÃO DE TODOS OS ELEMENTOS DO DOM ---
    const movieList = document.getElementById('movie-list');
    const searchBar = document.getElementById('search-bar');
    const addMovieBtn = document.getElementById('add-movie-btn');
    const modal = document.getElementById('add-movie-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const addMovieForm = document.getElementById('add-movie-form');
    const backendUrl = 'http://localhost:3000/api';

    // --- 2. VERIFICAÇÃO DE LOGIN E PERMISSÃO ---
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    const usuario = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : {};
    const isDev = usuario && usuario.role && usuario.role.toLowerCase().trim() === 'dev';
    
    // Linha de depuração para termos certeza da permissão
    console.log('Usuário verificado:', { usuario, isDev });

    let allMovies = [];

    // --- 3. FUNÇÃO PARA RENDERIZAR OS FILMES NA TELA ---
    const renderMovies = (filmes) => {
        movieList.innerHTML = '';
        if (!filmes || filmes.length === 0) {
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

    // --- 4. FUNÇÃO PARA CARREGAR OS FILMES DO BACKEND ---
    const loadMovies = async () => {
        try {
            const response = await fetch(`${backendUrl}/filmes`);
            if (!response.ok) throw new Error('Não foi possível carregar os filmes.');
            allMovies = await response.json();
            renderMovies(allMovies);
        } catch (error) {
            movieList.innerHTML = `<p style="color:red;">${error.message}</p>`;
        }
    };
    
    // --- 5. LÓGICA DO MODAL (SÓ PARA DEVS) ---
    if (isDev) {
        // Verifica se o botão realmente existe no HTML antes de tentar usá-lo
        if (addMovieBtn) {
            addMovieBtn.style.display = 'block'; // Mostra o botão "+ Adicionar Filme"

            const openModal = () => modal.classList.add('active');
            const closeModal = () => {
                modal.classList.remove('active');
                if(addMovieForm) addMovieForm.reset();
            };

            addMovieBtn.addEventListener('click', openModal);
            if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
            if(modal) modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            if(addMovieForm) addMovieForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(addMovieForm);
                const movieData = Object.fromEntries(formData.entries());
                const imagensValue = formData.get('imagens').trim();
                movieData.imagens = imagensValue ? imagensValue.split('\n').filter(url => url.trim() !== '') : [];

                try {
                    const response = await fetch(`${backendUrl}/filmes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(movieData)
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                    alert('Filme adicionado com sucesso!');
                    closeModal();
                    loadMovies();
                } catch (error) {
                    alert(`Erro ao adicionar filme: ${error.message}`);
                }
            });
        }
    }

    // --- 6. LÓGICA DO FILTRO DE BUSCA ---
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredMovies = allMovies.filter(filme => 
                filme.titulo.toLowerCase().includes(searchTerm)
            );
            renderMovies(filteredMovies);
        });
    }

    // --- 7. LÓGICA DE EXCLUSÃO (SÓ PARA DEVS) ---
    if (isDev) {
        movieList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const filmeId = e.target.dataset.id;
                const filmeTitulo = e.target.closest('.movie-card').querySelector('p').textContent;
                if (confirm(`Tem certeza que deseja excluir "${filmeTitulo}"?`)) {
                    // Lógica de exclusão aqui
                }
            }
        });
    }

    // --- 8. INICIA A PÁGINA CARREGANDO OS FILMES ---
    loadMovies();
});