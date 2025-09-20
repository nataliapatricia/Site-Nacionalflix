document.addEventListener('DOMContentLoaded', async () => {
    // --- ELEMENTOS PRINCIPAIS E CONFIGS ---
    const container = document.getElementById('movie-details-container');
    const backendUrl = 'http://localhost:3000/api';

    // --- VERIFICAÇÃO DE LOGIN E PERMISSÃO (JÁ EXISTENTE) ---
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogadoJSON) {
        window.location.href = 'index.html';
        return;
    }
    const usuario = JSON.parse(usuarioLogadoJSON);
    const isDev = usuario.role === 'dev';

    // --- CAPTURANDO O ID DO FILME DA URL (JÁ EXISTENTE) ---
    const params = new URLSearchParams(window.location.search);
    const filmeId = params.get('id');
    if (!filmeId) {
        container.innerHTML = '<p style="color:red;">Erro: ID do filme não encontrado na URL.</p>';
        return;
    }

    try {
        // --- BUSCANDO OS DADOS COMPLETOS DO FILME NO BACKEND (JÁ EXISTENTE) ---
        const response = await fetch(`${backendUrl}/filmes/${filmeId}`);
        if (!response.ok) throw new Error('Filme não encontrado.');
        const filme = await response.json();

        document.title = `${filme.titulo} - NacionalFlix`;
        
        // --- CONSTRUINDO O HTML DINÂMICO DA PÁGINA (ATUALIZADO) ---
        
        // Constrói a lista de comentários (com botão de excluir para devs)
        const commentsHTML = filme.comentarios.length > 0 ? filme.comentarios.map(c => {
            const deleteButtonHTML = isDev ? `<button class="delete-comment-btn" data-id="${c.id}" title="Excluir comentário">×</button>` : '';
            return `
                <article class="review-card">
                    <div class="review-author"><span class="author-score">${c.nota || 'N/A'}</span><p>${c.nome_usuario}</p></div>
                    <div class="review-content"><p>${c.comentario}</p></div>
                    ${deleteButtonHTML}
                </article>`;
        }).join('') : '<p>Ainda não há comentários para este filme.</p>';

        // Constrói a galeria de imagens (se houver imagens)
        const galleryHTML = filme.imagens && filme.imagens.length > 0 ? `
            <div class="gallery">
                <img id="gallery-image" src="${filme.imagens[0]}" alt="Cena de ${filme.titulo}">
                <button id="prev-btn" class="arrow">&lt;</button>
                <button id="next-btn" class="arrow">&gt;</button>
            </div>
            <div class="gallery-nav">
                <div id="dots-container" class="dots">${filme.imagens.map((_, i) => `<span class="dot" data-index="${i}"></span>`).join('')}</div>
            </div>` : '<p>Não há imagens na galeria para este filme.</p>';

        // Monta o HTML completo da página
        container.innerHTML = `
            <div class="movie-container">
                <div class="left-column">
                    <div class="media-viewer">
                        <div class="tabs">
                            <button class="tab-btn active" data-tab="resumo">Resumo</button>
                            <button class="tab-btn" data-tab="imagens">Imagens</button>
                            <button class="tab-btn" data-tab="trailer">Trailer</button>
                        </div>
                        <div id="resumo" class="tab-content active">
                            <h3>Sinopse:</h3><p>${filme.sinopse}</p>
                            <div class="watch-on"><h4>Onde assistir:</h4></div>
                        </div>
                        <div id="imagens" class="tab-content">${galleryHTML}</div>
                        <div id="trailer" class="tab-content">
                            <div class="trailer-container"><iframe src="${filme.url_trailer}" title="YouTube video player" frameborder="0" allowfullscreen></iframe></div>
                        </div>
                    </div>
                    <div class="user-reviews">
                        <h2>Crítica dos Usuários:</h2>
                        <div class="review-summary"><span>Média</span><div class="rating"><strong>4,8</strong></div></div>
                        <div id="comments-section">${commentsHTML}</div>
                    </div>
                </div>
                <div class="right-column">
                    <img class="poster" src="${filme.url_poster}" alt="Pôster de ${filme.titulo}">
                    <h2 class="movie-title">${filme.titulo}</h2>
                    <div class="movie-info">
                        <p>${new Date(filme.ano_lancamento).toLocaleDateString('pt-BR')} | ${filme.duracao_min} min | Ação, Drama</p>
                        <p><strong>Direção:</strong> ${filme.diretores}</p>
                        <p><strong>Elenco:</strong> ${filme.elenco}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-evaluate">Avaliar</button>
                        <button class="btn-share">Compartilhar</button>
                    </div>
                </div>
            </div>`;

        // --- ATIVANDO A INTERATIVIDADE APÓS CRIAR O HTML ---
        
        // Lógica das Abas
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                container.querySelector(`#${button.dataset.tab}`).classList.add('active');
            });
        });

        // Lógica do Carrossel de Imagens (se existir)
        if (filme.imagens && filme.imagens.length > 0) {
            let currentIndex = 0;
            const galleryImage = container.querySelector('#gallery-image');
            const dots = container.querySelectorAll('.dot');
            const updateCarousel = () => {
                galleryImage.src = filme.imagens[currentIndex];
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };
            container.querySelector('#next-btn').addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % filme.imagens.length;
                updateCarousel();
            });
            container.querySelector('#prev-btn').addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + filme.imagens.length) % filme.imagens.length;
                updateCarousel();
            });
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    currentIndex = parseInt(e.target.dataset.index);
                    updateCarousel();
                });
            });
            updateCarousel(); // Inicia o carrossel
        }
        
        // Lógica de Exclusão de Comentários (se for dev)
        if (isDev) {
            // ... (código de exclusão de comentários que já fizemos) ...
        }

    } catch (error) {
        container.innerHTML = `<p style="color:red;">${error.message}</p>`;
        console.error('Erro:', error);
    }
});