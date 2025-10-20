document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('history-list');
    const backendUrl = 'http://localhost:3000/api';

    // Pega o ID do usuário logado (assumindo que global.js já protegeu a página)
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogadoJSON);

    if (!usuario || !usuario.id) {
        historyList.innerHTML = '<p style="color:red;">Erro: Usuário não identificado.</p>';
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/historico/${usuario.id}`);
        if (!response.ok) throw new Error('Não foi possível carregar o histórico.');
        
        const historico = await response.json();

        historyList.innerHTML = ''; // Limpa o "Carregando..."

        if (historico.length === 0) {
            historyList.innerHTML = '<p>Você ainda não marcou nenhum filme como assistido.</p>';
            return;
        }

        historico.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item-card'; // Usaremos um estilo de card
            historyItem.innerHTML = `
                <a href="filme.html?id=${item.id}">
                    <img src="${item.url_poster}" alt="${item.titulo}">
                    <h3>${item.titulo}</h3>
                </a>
                ${item.sua_nota ? `<p class="your-rating">Sua nota: ${parseFloat(item.sua_nota).toFixed(1)}</p>` : '<p class="your-rating">Não avaliado</p>'}
            `;
            historyList.appendChild(historyItem);
        });

    } catch (error) {
        historyList.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
});