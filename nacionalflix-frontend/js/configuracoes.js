document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('streaming-grid');
    const backendUrl = 'http://localhost:3000/api';

    // 1. Pega o ID do usuário logado
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogadoJSON);

    if (!usuario || !usuario.id) {
        grid.innerHTML = '<p style="color:red;">Erro: Usuário não identificado.</p>';
        return;
    }

    try {
        // 2. Busca todas as plataformas e as seleções do usuário ao mesmo tempo
        const [plataformasResponse, userSelectionsResponse] = await Promise.all([
            fetch(`${backendUrl}/plataformas`),
            fetch(`${backendUrl}/usuarios/${usuario.id}/plataformas`)
        ]);

        if (!plataformasResponse.ok || !userSelectionsResponse.ok) {
            throw new Error('Não foi possível carregar as configurações.');
        }

        const todasPlataformas = await plataformasResponse.json();
        const userSelectionIds = await userSelectionsResponse.json();
        
        // Cria um Set (conjunto) com os IDs para verificação rápida
        const userSelections = new Set(userSelectionIds);

        grid.innerHTML = '';

        // 3. Renderiza o grid de plataformas
        todasPlataformas.forEach(plataforma => {
            const isChecked = userSelections.has(plataforma.id) ? 'checked' : '';

            const platformCard = document.createElement('div');
            platformCard.className = 'streaming-logo';
            platformCard.innerHTML = `
                <label>
                    <img src="${plataforma.logo_url}" alt="${plataforma.nome}">
                    <input type="checkbox" name="streaming" data-plataforma-id="${plataforma.id}" ${isChecked}>
                </label>
            `;
            grid.appendChild(platformCard);
        });

        // 4. Adiciona o listener para salvar ao clicar
        grid.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox') {
                const plataforma_id = e.target.dataset.plataformaId;
                const selecionado = e.target.checked;

                // Desabilita o checkbox enquanto salva
                e.target.disabled = true;

                try {
                    await fetch(`${backendUrl}/plataformas/selecionar`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            usuario_id: usuario.id,
                            plataforma_id: plataforma_id,
                            selecionado: selecionado
                        })
                    });
                } catch (error) {
                    console.error('Erro ao salvar seleção:', error);
                    alert('Erro ao salvar, tente novamente.');
                    // Reverte o clique em caso de erro
                    e.target.checked = !selecionado;
                } finally {
                    // Reabilita o checkbox
                    e.target.disabled = false;
                }
            }
        });

    } catch (error) {
        grid.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
});