document.addEventListener('DOMContentLoaded', async () => {
    // --- ELEMENTOS PRINCIPAIS E CONFIGS ---
    const container = document.getElementById('movie-details-container');
    const backendUrl = 'http://localhost:3000/api';

    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    // Não precisamos mais do IF que redireciona, pois o global.js já faz isso.
    const usuario = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : {};

    console.log('Usuário logado na PÁGINA DE FILME:', usuario);

    const isDev = usuario && usuario.role === 'dev';

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
        // --- LÓGICA DA MÉDIA ---
        const mediaFormatada = parseFloat(filme.media_avaliacoes).toFixed(1).replace('.', ',');

        // Constrói a lista de comentários (com botão de excluir para devs)
        const commentsHTML = filme.comentarios && filme.comentarios.length > 0
            ? filme.comentarios.map(c => {
                const deleteButtonHTML = isDev ? `<button class="delete-comment-btn" data-id="${c.id}" title="Excluir comentário">×</button>` : '';
                return `
                    <article class="review-card">
                        <div class="review-author"><span class="author-score">${c.nota || 'N/A'}</span><p>${c.nome_usuario}</p></div>
                        <div class="review-content"><p>${c.comentario}</p></div>
                        ${deleteButtonHTML}
                    </article>`;
            }).join('') : '<p id="no-comments-msg">Ainda não há comentários para este filme.</p>';

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
                        <div class="review-summary"><span>Média: </span><div class="rating"><strong id="average-rating">${mediaFormatada}</strong></div></div>
                        <div id="comments-section">${commentsHTML}</div>
                    </div>
                </div>
                <div class="right-column">
                    <img class="poster" src="${filme.url_poster}" alt="Pôster de ${filme.titulo}">
                    <h2 class="movie-title">${filme.titulo}</h2>
                    <div class="movie-info">
                        <p>${filme.ano_lancamento} | ${filme.duracao_min} min | ${filme.genero}</p>
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
                const target = container.querySelector(`#${button.dataset.tab}`);
                if (target) target.classList.add('active');
            });
        });

        // Lógica do Carrossel de Imagens (se existir)
        if (filme.imagens && filme.imagens.length > 0) {
            let currentIndex = 0;
            const galleryImage = container.querySelector('#gallery-image');
            const dots = container.querySelectorAll('.dot');
            const updateCarousel = () => {
                if (galleryImage) galleryImage.src = filme.imagens[currentIndex];
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[currentIndex]) dots[currentIndex].classList.add('active');
            };
            const nextBtn = container.querySelector('#next-btn');
            const prevBtn = container.querySelector('#prev-btn');
            if (nextBtn) nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % filme.imagens.length;
                updateCarousel();
            });
            if (prevBtn) prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + filme.imagens.length) % filme.imagens.length;
                updateCarousel();
            });
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    currentIndex = parseInt(e.target.dataset.index, 10);
                    updateCarousel();
                });
            });
            updateCarousel(); // Inicia o carrossel
        }

        // Lógica de Exclusão de Comentários (se for dev)
        if (isDev) {
            const commentsSection = container.querySelector('#comments-section');
            if (commentsSection) {
                commentsSection.addEventListener('click', async (e) => {
                    if (e.target.classList && e.target.classList.contains('delete-comment-btn')) {
                        const commentId = e.target.dataset.id;
                        if (confirm('Tem certeza que deseja excluir este comentário?')) {
                            try {
                                const response = await fetch(`${backendUrl}/comentarios/${commentId}`, { method: 'DELETE' });
                                if (!response.ok) throw new Error('Falha ao excluir o comentário.');
                                const card = e.target.closest('.review-card');
                                if (card) card.remove();
                                alert('Comentário excluído com sucesso.');
                            } catch (error) {
                                alert(error.message);
                            }
                        }
                    }
                });
            }
        }

        // --- INÍCIO DA NOVA LÓGICA: MODAL DE AVALIAÇÃO ---
        const evaluateBtn = document.querySelector('.btn-evaluate');
        const reviewModal = document.getElementById('review-modal');
        const reviewForm = document.getElementById('review-form');

        // Proteções caso elementos não existam no DOM
        const stars = reviewModal ? reviewModal.querySelectorAll('.star-rating span') : [];
        const cancelBtn = reviewModal ? reviewModal.querySelector('.btn-cancel') : null;
        const closeModalBtnReview = reviewModal ? reviewModal.querySelector('.close-btn') : null;
        let currentRating = 0;

        const openReviewModal = () => reviewModal && reviewModal.classList.add('active');
        const closeReviewModal = () => {
            if (!reviewModal) return;
            reviewModal.classList.remove('active');
            if (reviewForm) reviewForm.reset();
            currentRating = 0;
            stars.forEach(star => star.classList.remove('selected'));
        };

        if (evaluateBtn) evaluateBtn.addEventListener('click', openReviewModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeReviewModal);
        if (closeModalBtnReview) closeModalBtnReview.addEventListener('click', closeReviewModal);
        if (reviewModal) {
            reviewModal.addEventListener('click', (e) => {
                if (e.target === reviewModal) closeReviewModal();
            });
        }

        // Lógica das estrelas
        if (stars && stars.length) {
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    currentRating = parseInt(star.dataset.value, 10);
                    stars.forEach(s => s.classList.remove('selected'));
                    star.classList.add('selected');
                });
            });
        }

        // Lógica de envio do formulário
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const comentario = document.getElementById('comment-text') ? document.getElementById('comment-text').value : '';

                if (currentRating === 0) {
                    alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
                    return;
                }

                const reviewData = {
                    filme_id: filmeId,
                    usuario_id: usuario.id,
                    nota: currentRating,
                    comentario: comentario
                };

                try {
                    const submitResponse = await fetch(`${backendUrl}/comentarios`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(reviewData)
                    });

                    const responseData = await submitResponse.json();

                    if (!submitResponse.ok) {
                        throw new Error(responseData.message || 'Ocorreu um erro no servidor.');
                    }

                    alert('Avaliação enviada com sucesso!');

                    // Atualiza a média na tela em tempo real
                    const averageRatingEl = document.getElementById('average-rating');
                    if (averageRatingEl && responseData.novaMedia) {
                        averageRatingEl.textContent = parseFloat(responseData.novaMedia).toFixed(1).replace('.', ',');
                    }

                    // Adiciona o novo comentário no topo da lista
                    const commentsSection = document.getElementById('comments-section');
                    const noCommentsMsg = document.getElementById('no-comments-msg');
                    if (noCommentsMsg) noCommentsMsg.remove();

                    const newCommentCard = document.createElement('article');
                    newCommentCard.className = 'review-card';
                    newCommentCard.innerHTML = `
                        <div class="review-author">
                            <span class="author-score">${reviewData.nota}</span>
                            <p>${usuario.nome}</p>
                        </div>
                        <div class="review-content">
                            <p>${reviewData.comentario}</p>
                        </div>
                        ${isDev ? `<button class="delete-comment-btn" data-id="${responseData.commentId}" title="Excluir comentário">×</button>` : ''}
                    `;
                    if (commentsSection) commentsSection.prepend(newCommentCard);

                    closeReviewModal();

                } catch (error) {
                    alert(`Erro ao enviar avaliação: ${error.message}`);
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do filme:', error);
        if (container) container.innerHTML = `<p style="color:red;">Erro ao carregar os dados do filme: ${error.message}</p>`;
    }
});