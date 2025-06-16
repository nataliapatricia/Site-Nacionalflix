document.addEventListener('DOMContentLoaded', () => {

    // --- OBJETO COM DADOS DAS GALERIAS DE CADA FILME ---
    // A chave (ex: 'filme.html') é o nome do seu arquivo HTML.
    // O valor é um array com os links das imagens daquele filme.
    const movieGalleries = {
        'filme.html': [
            'img/TdE 1.webp',
            'img/TdE 2.webp',
            'img/TdE 3.webp',
            'img/TdE 4.jpg',
            'img/TdE 5.webp',
            'img/TdE 6.webp'
        ],
        'cidadedeus.html': [
            'img/CdD 1.jpg',
            'img/CdD 2.webp',
            'img/CdD 3.webp',
            'img/CdD 4.webp',
            'img/CdD 5.webp',
            'img/CdD 6.webp'
        ],
        'centralbrasil.html': [
            'img/CdB 1.jpg',
            'img/CdB 2.webp',
            'img/CdB 3.jpg',
            'img/CdB 4.jpg',
            'img/CdB 5.webp',
            'img/CdB 6.jpg'
        ],
        'compadecida.html': [
            'img/AdC 1.jpg',
            'img/AdC 2.jpg',
            'img/AdC 3.jpg',
            'img/AdC 4.jpg',
            'img/AdC 5.jpg',
            'img/AdC 6.jpg'
        ]
    };

    // --- LÓGICA DAS ABAS (TABS) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.tab;
                const targetContent = document.getElementById(targetId);

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // --- LÓGICA DO BOTÃO AVALIAR ---
    const evaluateButton = document.querySelector('.btn-evaluate');
    if (evaluateButton) {
        evaluateButton.addEventListener('click', () => {
            // Redireciona para a página de comentários
            window.location.href = 'comentario.html';
        });
    }

    // --- LÓGICA DO BOTÃO COMPARTILHAR ---
    const shareButton = document.querySelector('.btn-share');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            // Pega o título do filme dinamicamente da página
            const movieTitle = document.querySelector('.movie-title').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: `NacionalFlix - ${movieTitle}`,
                    text: `Confira ${movieTitle}, um clássico do cinema nacional no NacionalFlix!`,
                    url: window.location.href,
                })
                .then(() => console.log('Conteúdo compartilhado!'))
                .catch((error) => console.log('Erro ao compartilhar:', error));
            } else {
                alert('Use a função de compartilhar do seu navegador ou copie o link!');
            }
        });
    }

    // --- LÓGICA DO CARROSSEL DE IMAGENS ---
    const currentPage = window.location.pathname.split('/').pop();
    const galleryImages = movieGalleries[currentPage];

    if (galleryImages) {
        let currentImageIndex = 0;
        const galleryImageEl = document.querySelector('.gallery img');
        const prevBtn = document.querySelector('.gallery-nav .arrow:first-child');
        const nextBtn = document.querySelector('.gallery-nav .arrow:last-child');
        const dotsContainer = document.querySelector('.dots');

        if (galleryImageEl && dotsContainer) {
            dotsContainer.innerHTML = ''; // Limpa os pontos estáticos
            
            galleryImages.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');

            function updateGallery() {
                galleryImageEl.src = galleryImages[currentImageIndex];
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentImageIndex].classList.add('active');
            }

            nextBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                updateGallery();
            });

            prevBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                updateGallery();
            });

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    currentImageIndex = parseInt(e.target.dataset.index);
                    updateGallery();
                });
            });
            
            updateGallery(); // Inicia a galeria
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o formulário de login pelo ID
    const loginForm = document.getElementById('login-form');

    // Se o formulário de login existir nesta página
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // 1. Impede o comportamento padrão de envio do formulário
            event.preventDefault();
            
            // 2. Redireciona o usuário para a página principal.html
            window.location.href = 'principal.html';
        });
    }

    // Seleciona o formulário de cadastro pelo ID
    const cadastroForm = document.getElementById('cadastro-form');

    // Se o formulário de cadastro existir nesta página
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            // 1. Impede o comportamento padrão de envio do formulário
            event.preventDefault();
            
            // 2. Redireciona o usuário para a página principal.html
            window.location.href = 'principal.html';
        });
    }

});