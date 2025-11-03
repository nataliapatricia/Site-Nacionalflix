document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. SELEÇÃO DE ELEMENTOS PRINCIPAIS E CONFIGURAÇÕES ---
    const container = document.getElementById('movie-details-container');
    const backendUrl = 'http://localhost:3000/api';

    // Se o container principal não for encontrado, para o script para evitar mais erros.
    if (!container) {
        console.error("Erro Crítico: O elemento com id 'movie-details-container' não foi encontrado no HTML.");
        return;
    }

    // --- 2. VERIFICAÇÃO DE LOGIN E PERMISSÃO ---
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    // Se não houver dados de usuário na sessão, o global.js já deve ter redirecionado,
    // mas esta é uma segurança extra para garantir que 'usuario' não seja null.
    if (!usuarioLogadoJSON) {
        console.warn("Usuário não logado detectado em filme.js. global.js deveria ter redirecionado.");
        return; // Encerra se não estiver logado
    }
    
    const usuario = JSON.parse(usuarioLogadoJSON);
    const isDev = usuario && usuario.role && usuario.role.toLowerCase().trim() === 'dev';

    // --- 3. CAPTURANDO O ID DO FILME DA URL ---
    const params = new URLSearchParams(window.location.search);
    const filmeId = params.get('id');

    if (!filmeId) {
        container.innerHTML = '<p style="color:red;">Erro: ID do filme não encontrado na URL.</p>';
        return;
    }

    try {
        // --- 4. BUSCANDO OS DADOS COMPLETOS DO FILME NO BACKEND ---
        const response = await fetch(`${backendUrl}/filmes/${filmeId}?usuario_id=${usuario.id}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Filme não encontrado.');
        }
        const filme = await response.json();

        document.title = `${filme.titulo} - NacionalFlix`;
        
        // --- 5. PREPARANDO BLOCOS DE HTML DINÂMICOS ---

        // Formata a média para ter uma casa decimal e usar vírgula
        const mediaFormatada = parseFloat(filme.media_avaliacoes).toFixed(1).replace('.', ',');

        // Verifica se o usuário logado já tem um comentário neste filme
        const userComment = filme.comentarios.find(c => c.usuario_id === usuario.id);
        const userHasCommented = !!userComment; // true se encontrou, false se não

        // Constrói a lista de comentários
        const commentsHTML = filme.comentarios.length > 0 ? filme.comentarios.map(c => {
            const deleteButtonHTML = isDev ? `<button class="delete-comment-btn" data-id="${c.id}" title="Excluir comentário">×</button>` : '';
            // Botão Editar: só aparece se o comentário for do usuário logado
            const editButtonHTML = c.usuario_id === usuario.id 
                ? `<button class="edit-comment-btn" data-id="${c.id}" data-nota="${c.nota}" data-texto="${encodeURIComponent(c.comentario || '')}">Editar comentário</button>` 
                : ''; 
        const dataFormatada = new Date(c.data_comentario).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            return `
                <article class="review-card" id="comment-${c.id}">
                    <div class="review-author">
                        <span class="author-score">${c.nota || 'N/A'}</span>
                        <p>${c.nome_usuario}<span class="comment-date"> - ${dataFormatada}</span></p> ${editButtonHTML}<br>
                    </div>
                    <div class="review-content"><p>${c.comentario || ''}</p></div>
                    ${deleteButtonHTML}
                </article>`;
        }).join('') : '<p id="no-comments-msg">Ainda não há comentários para este filme.</p>';

        // Constrói a galeria de imagens
        const galleryHTML = filme.imagens && filme.imagens.length > 0 ? `
            <div class="gallery">
                <img id="gallery-image" src="${filme.imagens[0]}" alt="Cena de ${filme.titulo}">
                <button id="prev-btn" class="arrow">&lt;</button>
                <button id="next-btn" class="arrow">&gt;</button>
            </div>
            <div class="gallery-nav">
                <div id="dots-container" class="dots">${filme.imagens.map((_, i) => `<span class="dot" data-index="${i}"></span>`).join('')}</div>
            </div>` : '<p>Não há imagens na galeria para este filme.</p>';

            // *** NOVO CÓDIGO: CONSTRÓI O HTML DAS PLATAFORMAS ***
    const plataformasHTML = filme.plataformas && filme.plataformas.length > 0
        ? filme.plataformas.map(p => 
            // Cria uma tag de imagem para cada plataforma encontrada
            `<img src="${p.logo_url}" alt="${p.nome}" title="${p.nome}">`
          ).join('') // Junta todas as tags de imagem
        : '<p class="plataforma-indisponivel">Indisponível em plataformas de assinatura.</p>';
    // *** FIM DO NOVO CÓDIGO ***

        // --- 6. RENDERIZANDO O HTML COMPLETO NA PÁGINA ---
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
                            <h3>Sinopse:</h3><p>${filme.sinopse || 'Sinopse não disponível.'}</p>
                            <div class="watch-on"><h4>Onde assistir:</h4>
                            ${plataformasHTML}</div>
                        </div>
                        <div id="imagens" class="tab-content">${galleryHTML}</div>
                        <div id="trailer" class="tab-content">
                            <div class="trailer-container"><iframe src="${filme.url_trailer}" title="YouTube video player" frameborder="0" allowfullscreen></iframe></div>
                        </div>
                    </div>
                    <div class="user-reviews">
                        <h2>Crítica dos Usuários:</h2>
                        <div class="review-summary">
                            <span>Média</span>
                            <div class="rating"><strong id="average-rating">${mediaFormatada}</strong></div>
                        </div>
                        <div id="comments-section">${commentsHTML}</div>
                    </div>
                </div>
                <div class="right-column">
                    <img class="poster" src="${filme.url_poster}" alt="Pôster de ${filme.titulo}">
                    <h2 class="movie-title">${filme.titulo}</h2>
                    <div class="movie-info">
                        <p>${filme.ano_lancamento || 'N/A'} | ${filme.duracao_min || 'N/A'} min | ${filme.genero || 'N/A'}</p>
                        <p><strong>Direção:</strong> ${filme.diretores || 'N/A'}</p>
                        <p><strong>Elenco:</strong> ${filme.elenco || 'N/A'}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-evaluate" ${userHasCommented ? 'disabled' : ''}>${userHasCommented ? 'Você já avaliou' : 'Avaliar'}</button>
                        <button class="btn-share">Compartilhar</button>
                    </div>
                    <div class="watched-container">
                        <label for="watched-checkbox">
                            <input type="checkbox" id="watched-checkbox" name="watched" ${filme.assistido ? 'checked' : ''}>
                            Já assisti
                        </label>
                    </div>
                </div>
            </div>`;

        // --- 7. ATIVANDO A INTERATIVIDADE APÓS O HTML SER CRIADO ---
        
        // Lógica das Abas
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    button.classList.add('active');
                    const targetContent = container.querySelector(`#${button.dataset.tab}`);
                    if (targetContent) targetContent.classList.add('active');
                });
            });
        }

        // Lógica do Carrossel de Imagens
        if (filme.imagens && filme.imagens.length > 0) {
            let currentIndex = 0;
            const galleryImage = container.querySelector('#gallery-image');
            const dots = container.querySelectorAll('.dot');
            const prevBtn = container.querySelector('#prev-btn');
            const nextBtn = container.querySelector('#next-btn');
            
            if (galleryImage && dots.length > 0 && prevBtn && nextBtn) {
                const updateCarousel = () => {
                    galleryImage.src = filme.imagens[currentIndex];
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[currentIndex].classList.add('active');
                };
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % filme.imagens.length;
                    updateCarousel();
                });
                prevBtn.addEventListener('click', () => {
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
        }
        
        // Lógica de Exclusão de Comentários (para Devs)
        if (isDev) {
            const commentsSection = container.querySelector('#comments-section');
            if(commentsSection) {
                commentsSection.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('delete-comment-btn')) {
                        const commentId = e.target.dataset.id;
                        if (confirm('Tem certeza que deseja excluir este comentário?')) {
                            try {
                                const response = await fetch(`${backendUrl}/comentarios/${commentId}`, { method: 'DELETE' });
                                if (!response.ok) throw new Error('Falha ao excluir o comentário.');
                                e.target.closest('.review-card').remove();
                                alert('Comentário excluído com sucesso.');
                                // Recalcular a média após excluir seria ideal, mas requer busca extra.
                            } catch (error) {
                                alert(error.message);
                            }
                        }
                    }
                });
            }
        }

        const watchedCheckbox = document.getElementById('watched-checkbox');
        if (watchedCheckbox) {
            // A linha abaixo não é mais necessária pois o estado inicial já vem do HTML
            // watchedCheckbox.checked = filme.assistido; 

            watchedCheckbox.addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                const method = isChecked ? 'POST' : 'DELETE';
                const endpoint = isChecked ? `${backendUrl}/historico` : `${backendUrl}/historico/${usuario.id}/${filmeId}`;
                
                try {
                    watchedCheckbox.disabled = true;
                    const watchResponse = await fetch(endpoint, {
                        method: method,
                        headers: isChecked ? { 'Content-Type': 'application/json' } : {},
                        body: isChecked ? JSON.stringify({ usuario_id: usuario.id, filme_id: filmeId }) : null
                    });
                    if (!watchResponse.ok) {
                        e.target.checked = !isChecked;
                        let errorMsg = 'Não foi possível atualizar o status.';
                        try { const errorData = await watchResponse.json(); if (errorData && errorData.message) errorMsg = errorData.message; } catch (parseError) {}
                        throw new Error(errorMsg);
                    }
                    console.log(`Filme ${isChecked ? 'marcado' : 'desmarcado'} como assistido.`);
                } catch (error) {
                    alert(error.message);
                } finally {
                    watchedCheckbox.disabled = false;
                }
            });
        }

        // --- 8. LÓGICA DO MODAL DE AVALIAÇÃO (ADICIONAR NOVO) ---
        const evaluateBtn = document.querySelector('.btn-evaluate');
        const reviewModal = document.getElementById('review-modal'); // Certifique-se que o ID no HTML é 'review-modal'
        if (evaluateBtn && reviewModal) {
            const reviewForm = document.getElementById('review-form');
            const starsAdd = reviewModal.querySelectorAll('.star-rating span');
            const cancelBtnAdd = reviewModal.querySelector('.btn-cancel');
            const closeModalBtnAdd = reviewModal.querySelector('.close-btn');
            const commentTextAdd = document.getElementById('comment-text');
            let currentRatingAdd = 0;

            const openReviewModal = () => { if (!userHasCommented) reviewModal.classList.add('active'); };
            const closeReviewModal = () => {
                reviewModal.classList.remove('active');
                if (reviewForm) reviewForm.reset();
                currentRatingAdd = 0;
                starsAdd.forEach(star => star.classList.remove('selected'));
            };

            if (!userHasCommented) { // Só ativa se o usuário NÃO comentou
                evaluateBtn.addEventListener('click', openReviewModal);
            }
            if(cancelBtnAdd) cancelBtnAdd.addEventListener('click', closeReviewModal);
            if(closeModalBtnAdd) closeModalBtnAdd.addEventListener('click', closeReviewModal);
            reviewModal.addEventListener('click', (e) => { if (e.target === reviewModal) closeReviewModal(); });

            starsAdd.forEach(star => {
                star.addEventListener('click', () => {
                    currentRatingAdd = parseInt(star.dataset.value);
                    starsAdd.forEach(s => s.classList.remove('selected'));
                    star.classList.add('selected'); // Adiciona a classe para pintar a estrela
                });
            });

            if(reviewForm) reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const comentario = commentTextAdd.value;
                if (currentRatingAdd === 0) { alert('Selecione uma nota.'); return; }
                const reviewData = { filme_id: filmeId, usuario_id: usuario.id, nota: currentRatingAdd, comentario: comentario };

                try {
                    const submitResponse = await fetch(`${backendUrl}/comentarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewData) });
                    const responseData = await submitResponse.json();
                    if (!submitResponse.ok) throw new Error(responseData.message);
                    
                    alert('Avaliação enviada com sucesso!');

                    // Atualiza a interface
                    const averageRatingEl = document.getElementById('average-rating');
                    if (averageRatingEl && responseData.novaMedia) {
                        averageRatingEl.textContent = parseFloat(responseData.novaMedia).toFixed(1).replace('.', ',');
                    }
                    const commentsSection = document.getElementById('comments-section');
                    const noCommentsMsg = document.getElementById('no-comments-msg');
                    if (noCommentsMsg) noCommentsMsg.remove();
                    const newCommentCard = document.createElement('article');
                    newCommentCard.className = 'review-card';
                    newCommentCard.id = `comment-${responseData.commentId}`; // Adiciona ID ao novo comentário
                    newCommentCard.innerHTML = `
                        <div class="review-author"><span class="author-score">${reviewData.nota}</span><p>${usuario.nome}</p><button class="edit-comment-btn" data-id="${responseData.commentId}" data-nota="${reviewData.nota}" data-texto="${encodeURIComponent(reviewData.comentario || '')}">Editar</button></div>
                        <div class="review-content"><p>${reviewData.comentario || ''}</p></div>
                        ${isDev ? `<button class="delete-comment-btn" data-id="${responseData.commentId}" title="Excluir comentário">×</button>` : ''}
                    `;
                    commentsSection.prepend(newCommentCard);
                    evaluateBtn.textContent = 'Você já avaliou';
                    evaluateBtn.disabled = true;
                    closeReviewModal();
                } catch (error) {
                    alert(`Erro ao enviar avaliação: ${error.message}`);
                }
            });
        }

        // --- 9. LÓGICA DO MODAL DE EDIÇÃO ---
        const editModal = document.getElementById('edit-review-modal'); // Certifique-se que o ID no HTML é 'edit-review-modal'
        if (editModal) {
            const editForm = document.getElementById('edit-review-form');
            const starsEdit = editModal.querySelectorAll('.star-rating span');
            const cancelBtnEdit = editModal.querySelector('.btn-cancel');
            const closeModalBtnEdit = editModal.querySelector('.close-btn');
            const commentIdInput = document.getElementById('edit-comment-id');
            const commentTextInput = document.getElementById('edit-comment-text');
            let currentRatingEdit = 0;

            const openEditModal = (commentData) => {
                commentIdInput.value = commentData.id;
                commentTextInput.value = decodeURIComponent(commentData.texto); // Decodifica o texto
                currentRatingEdit = parseFloat(commentData.nota); // Usa parseFloat para notas como 4.0
                // Marca as estrelas corretas
                starsEdit.forEach(star => {
                    star.classList.toggle('selected', parseInt(star.dataset.value) <= currentRatingEdit);
                });
                editModal.classList.add('active');
            };
            const closeEditModal = () => {
                editModal.classList.remove('active');
                if(editForm) editForm.reset();
                currentRatingEdit = 0;
                starsEdit.forEach(star => star.classList.remove('selected'));
            };

            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.addEventListener('click', (e) => {
                    if (e.target.classList.contains('edit-comment-btn')) {
                        openEditModal(e.target.dataset);
                    }
                });
            }

            if(cancelBtnEdit) cancelBtnEdit.addEventListener('click', closeEditModal);
            if(closeModalBtnEdit) closeModalBtnEdit.addEventListener('click', closeEditModal);
            editModal.addEventListener('click', (e) => { if (e.target === editModal) closeEditModal(); });
            
            starsEdit.forEach(star => {
                star.addEventListener('click', () => {
                    currentRatingEdit = parseInt(star.dataset.value);
                    starsEdit.forEach(s => s.classList.remove('selected'));
                    star.classList.add('selected'); // Adiciona a classe para pintar a estrela
                });
            });

            if (editForm) editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const commentId = commentIdInput.value;
                const comentario = commentTextInput.value;
                if (currentRatingEdit === 0) { alert('Selecione uma nota.'); return; }
                const updatedData = { usuario_id: usuario.id, nota: currentRatingEdit, comentario: comentario };

                try {
                    const editResponse = await fetch(`${backendUrl}/comentarios/${commentId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) });
                    const responseData = await editResponse.json();
                    if (!editResponse.ok) throw new Error(responseData.message);

                    alert('Comentário atualizado com sucesso!');

                    const averageRatingEl = document.getElementById('average-rating');
                    if (averageRatingEl && responseData.novaMedia) {
                         averageRatingEl.textContent = parseFloat(responseData.novaMedia).toFixed(1).replace('.', ',');
                    }

                    const commentCard = document.getElementById(`comment-${commentId}`);
                    if (commentCard) {
                        commentCard.querySelector('.author-score').textContent = updatedData.nota;
                        commentCard.querySelector('.review-content p').textContent = updatedData.comentario || '';
                        const editBtn = commentCard.querySelector('.edit-comment-btn');
                        if(editBtn) {
                            editBtn.dataset.nota = updatedData.nota;
                            editBtn.dataset.texto = encodeURIComponent(updatedData.comentario || '');
                        }
                    }
                    closeEditModal();
                } catch (error) {
                    alert(`Erro ao atualizar comentário: ${error.message}`);
                }
            });
        }

    // --- 10. TRATAMENTO FINAL DE ERRO ---
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Ocorreu um erro ao carregar a página: ${error.message}</p>`;
        console.error('Erro detalhado ao carregar a página:', error);
    }
}); // <-- FIM DO 'DOMContentLoaded'