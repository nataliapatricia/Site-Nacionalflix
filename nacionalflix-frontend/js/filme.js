document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. FUNÇÃO DE CORREÇÃO DE VÍDEO (DEFINIDA NO TOPO PARA EVITAR ERROS) ---
const getEmbedUrl = (url) => {
        // 1. Verificação de segurança
        if (!url) return '';

        console.log('[VIDEO DEBUG] URL vinda do banco:', url);

        // 2. Expressão Regular para pegar o ID do YouTube (funciona com todos os tipos de link)
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        // 3. Se encontrou um ID válido (11 caracteres)
        if (match && match[2].length === 11) {
            const videoId = match[2];
            const finalUrl = `https://www.youtube.com/embed/${videoId}`;
            console.log('[VIDEO DEBUG] URL convertida para:', finalUrl);
            return finalUrl;
        } else {
            console.warn('[VIDEO DEBUG] Não foi possível extrair o ID. Retornando original.');
            return url;
        }
    };

    // --- 2. SELEÇÃO DE ELEMENTOS E CONFIGURAÇÕES ---
    const container = document.getElementById('movie-details-container');
    const backendUrl = 'http://localhost:3000/api';

    if (!container) {
        console.error("Erro Crítico: container não encontrado.");
        return;
    }

    // --- 3. VERIFICAÇÃO DE LOGIN ---
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogadoJSON) { return; } 
    const usuario = JSON.parse(usuarioLogadoJSON);
    const isDev = usuario && usuario.role && usuario.role.toLowerCase().trim() === 'dev';

    // --- 4. CAPTURANDO O ID ---
    const params = new URLSearchParams(window.location.search);
    const filmeId = params.get('id');

    if (!filmeId) {
        container.innerHTML = '<p style="color:red;">Erro: ID do filme não encontrado.</p>';
        return;
    }

    try {
        // --- 5. BUSCANDO DADOS ---
        const response = await fetch(`${backendUrl}/filmes/${filmeId}?usuario_id=${usuario.id}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Filme não encontrado.');
        }
        const filme = await response.json();

        document.title = `${filme.titulo} - NacionalFlix`;
        
        // Formatações
        const mediaFormatada = parseFloat(filme.media_avaliacoes).toFixed(1).replace('.', ',');
        const userComment = filme.comentarios.find(c => c.usuario_id === usuario.id);
        const userHasCommented = !!userComment;

        // HTML dos Comentários
        const commentsHTML = filme.comentarios.length > 0 ? filme.comentarios.map(c => {
            const dataFormatada = new Date(c.data_comentario).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const deleteButtonHTML = isDev ? `<button class="delete-comment-btn" data-id="${c.id}" title="Excluir comentário">×</button>` : '';
            const editButtonHTML = c.usuario_id === usuario.id ? `<button class="edit-comment-btn" data-id="${c.id}" data-nota="${c.nota}" data-texto="${encodeURIComponent(c.comentario || '')}">Editar</button>` : '';
            
            return `
                <article class="review-card" id="comment-${c.id}">
                    <div class="review-author">
                        <span class="author-score">${c.nota || 'N/A'}</span>
                        <p>${c.nome_usuario} <span class="comment-date">- ${dataFormatada}</span> ${editButtonHTML}</p>
                    </div>
                    <div class="review-content"><p>${c.comentario || ''}</p></div>
                    ${deleteButtonHTML}
                </article>`;
        }).join('') : '<p id="no-comments-msg">Ainda não há comentários para este filme.</p>';

        // HTML da Galeria
        const galleryHTML = filme.imagens && filme.imagens.length > 0 ? `
            <div class="gallery">
                <img id="gallery-image" src="${filme.imagens[0]}" alt="Cena de ${filme.titulo}">
                <button id="prev-btn" class="arrow">&lt;</button>
                <button id="next-btn" class="arrow">&gt;</button>
            </div>
            <div class="gallery-nav"><div id="dots-container" class="dots">${filme.imagens.map((_, i) => `<span class="dot" data-index="${i}"></span>`).join('')}</div></div>`
             : '<p>Não há imagens na galeria para este filme.</p>';
        
        // HTML das Plataformas
        const plataformasHTML = filme.plataformas && filme.plataformas.length > 0
             ? filme.plataformas.map(p => `<img src="${p.logo_url}" alt="${p.nome}" title="${p.nome}">`).join('')
             : '<p class="plataforma-indisponivel">Indisponível em plataformas de assinatura.</p>';

        // --- 6. RENDERIZANDO O HTML (AQUI USAMOS getEmbedUrl) ---
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
                            <h3>Sinopse:</h3><p>${filme.sinopse || 'N/A'}</p>
                            <div class="watch-on"><h4>Onde assistir:</h4>${plataformasHTML}</div>
                        </div>
                        <div id="imagens" class="tab-content">${galleryHTML}</div>
                        <div id="trailer" class="tab-content">
                            <div class="trailer-container">
                                <iframe src="${getEmbedUrl(filme.url_trailer)}" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                    <div class="user-reviews">
                        <h2>Crítica dos Usuários:</h2>
                        <div class="review-summary"><span>Média</span><div class="rating"><strong id="average-rating">${mediaFormatada}</strong></div></div>
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

        // --- 7. INTERATIVIDADE (BOTÕES, MODAIS, ETC) ---
        
        // Botão Compartilhar
        const shareBtn = document.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const shareData = { title: filme.titulo, text: `Confira ${filme.titulo} no NacionalFlix!`, url: window.location.href };
                try {
                    if (navigator.share) await navigator.share(shareData);
                    else { await navigator.clipboard.writeText(shareData.url); alert('Link copiado!'); }
                } catch (err) { console.error(err); }
            });
        }

        // Abas
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

        // Carrossel
        if (filme.imagens && filme.imagens.length > 0) {
            let currentIndex = 0;
            const galleryImage = container.querySelector('#gallery-image');
            const dots = container.querySelectorAll('.dot');
            const updateCarousel = () => {
                galleryImage.src = filme.imagens[currentIndex];
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            };
            container.querySelector('#next-btn').addEventListener('click', () => { currentIndex = (currentIndex + 1) % filme.imagens.length; updateCarousel(); });
            container.querySelector('#prev-btn').addEventListener('click', () => { currentIndex = (currentIndex - 1 + filme.imagens.length) % filme.imagens.length; updateCarousel(); });
            dots.forEach(dot => dot.addEventListener('click', (e) => { currentIndex = parseInt(e.target.dataset.index); updateCarousel(); }));
            updateCarousel();
        }

        // Checkbox "Já Assisti"
        const watchedCheckbox = document.getElementById('watched-checkbox');
        if (watchedCheckbox) {
            watchedCheckbox.addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                const method = isChecked ? 'POST' : 'DELETE';
                const endpoint = isChecked ? `${backendUrl}/historico` : `${backendUrl}/historico/${usuario.id}/${filmeId}`;
                try {
                    watchedCheckbox.disabled = true;
                    const res = await fetch(endpoint, {
                        method: method, headers: isChecked ? { 'Content-Type': 'application/json' } : {},
                        body: isChecked ? JSON.stringify({ usuario_id: usuario.id, filme_id: filmeId }) : null
                    });
                    if (!res.ok) { e.target.checked = !isChecked; throw new Error('Erro ao atualizar histórico.'); }
                } catch (err) { alert(err.message); } finally { watchedCheckbox.disabled = false; }
            });
        }

        // Exclusão de Comentário (Dev)
        if (isDev) {
            const commentsSection = container.querySelector('#comments-section');
            if(commentsSection) {
                commentsSection.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('delete-comment-btn')) {
                        if (confirm('Excluir comentário?')) {
                            try {
                                const res = await fetch(`${backendUrl}/comentarios/${e.target.dataset.id}`, { method: 'DELETE' });
                                if(res.ok) e.target.closest('.review-card').remove();
                            } catch(err) { alert(err.message); }
                        }
                    }
                });
            }
        }

        // Modais (Avaliação e Edição)
        const evaluateBtn = document.querySelector('.btn-evaluate');
        const reviewModal = document.getElementById('review-modal');
        const editModal = document.getElementById('edit-review-modal');

        // Modal Adicionar
        if (evaluateBtn && reviewModal) {
            const reviewForm = document.getElementById('review-form');
            const stars = reviewModal.querySelectorAll('.star-rating span');
            let rating = 0;
            
            const closeReview = () => { reviewModal.classList.remove('active'); reviewForm.reset(); rating = 0; stars.forEach(s => s.classList.remove('selected')); };
            
            if (!userHasCommented) evaluateBtn.addEventListener('click', () => reviewModal.classList.add('active'));
            reviewModal.querySelector('.btn-cancel').addEventListener('click', closeReview);
            reviewModal.querySelector('.close-btn').addEventListener('click', closeReview);
            
            stars.forEach(s => s.addEventListener('click', () => { rating = parseInt(s.dataset.value); stars.forEach(st => st.classList.remove('selected')); s.classList.add('selected'); }));

            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if(rating===0) return alert('Selecione uma nota.');
                try {
                    const res = await fetch(`${backendUrl}/comentarios`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({filme_id: filmeId, usuario_id: usuario.id, nota: rating, comentario: document.getElementById('comment-text').value}) });
                    if(!res.ok) throw new Error((await res.json()).message);
                    alert('Sucesso!');
                    location.reload(); // Recarrega para simplificar a atualização
                } catch(err) { alert(err.message); }
            });
        }

        // Modal Editar
        if (editModal) {
            const editForm = document.getElementById('edit-review-form');
            const starsEdit = editModal.querySelectorAll('.star-rating span');
            let ratingEdit = 0;
            const closeEdit = () => { editModal.classList.remove('active'); editForm.reset(); ratingEdit = 0; starsEdit.forEach(s => s.classList.remove('selected')); };

            document.getElementById('comments-section').addEventListener('click', (e) => {
                if(e.target.classList.contains('edit-comment-btn')) {
                    document.getElementById('edit-comment-id').value = e.target.dataset.id;
                    document.getElementById('edit-comment-text').value = decodeURIComponent(e.target.dataset.texto);
                    ratingEdit = parseFloat(e.target.dataset.nota);
                    starsEdit.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value) <= ratingEdit));
                    editModal.classList.add('active');
                }
            });
            
            editModal.querySelector('.btn-cancel').addEventListener('click', closeEdit);
            editModal.querySelector('.close-btn').addEventListener('click', closeEdit);
            starsEdit.forEach(s => s.addEventListener('click', () => { ratingEdit = parseInt(s.dataset.value); starsEdit.forEach(st => st.classList.remove('selected')); s.classList.add('selected'); }));

            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if(ratingEdit===0) return alert('Selecione uma nota.');
                try {
                    const res = await fetch(`${backendUrl}/comentarios/${document.getElementById('edit-comment-id').value}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({usuario_id: usuario.id, nota: ratingEdit, comentario: document.getElementById('edit-comment-text').value}) });
                    if(!res.ok) throw new Error((await res.json()).message);
                    alert('Atualizado!');
                    location.reload();
                } catch(err) { alert(err.message); }
            });
        }

    } catch (error) {
        container.innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
        console.error(error);
    }
});