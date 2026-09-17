const detalhesComercios = {
    "Cantina CT": {
        img: "documents/imgs/cantina-ct.jpg",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-cup-hot"></i> Salgados variados</li>
                <li><i class="bi bi-cup-straw"></i> Sucos naturais</li>
                <li><i class="bi bi-cup-hot-fill"></i> Café</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-menu-down"></i>
                    Cardápio
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    },

"Tapiocabana": {
    img: "documents/imgs/tapiocabana-icon.png",
    desc: `
        <ul class="popup-lista">
            <li><i class="bi bi-egg-fried"></i> Tapiocas doces e salgadas</li>
            <li><i class="bi bi-cheese"></i> Recheios variados</li>
            <li><i class="bi bi-cup-straw"></i> Bebidas naturais</li>
        </ul>

        <div class="popup-status aberto">
            <i class="bi bi-clock"></i>
            Aberto agora · 07h–22h
        </div>

        <div class="popup-acoes">
            <button class="btn-primario">
                <i class="bi bi-geo-alt-fill"></i>
                Como chegar
            </button>
            <button class="btn-secundario" onclick="togglePopupContent('Tapiocabana', 'menu')">
                <i class="bi bi-menu-down"></i>
                Cardápio
            </button>
            <button class="btn-secundario">
                <i class="bi bi-eye"></i>
                Ver detalhes
            </button>
        </div>
    `,
//CARDAPIO. LEMBRANDO QUE O NOSSO É NOSSO E DELES É O DELES
    cardapioHTML: `
        <div class="popup-cardapio-container" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div class="header-cardapio" style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <button onclick="togglePopupContent('Tapiocabana', 'home')" style="background:none; border:none; color:#3553C1; cursor:pointer; font-size:18px; padding:0;">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h3 style="margin:0; color:#3553C1; font-size:18px; width:100%; text-align:center; padding-right:25px;">Cardapio</h3>
            </div>

            <div class="categorias-scroll" style="display:flex; gap:8px; margin-bottom:15px; overflow-x:auto; padding-bottom:5px;">
                <span style="background:#f0f7f0; color:#3553C1;border:1px solid #3553C1; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Salgados</span>
                <span style="background:#f5f5f5; color:#666; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Doces</span>
                <span style="background:#f5f5f5; color:#666; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Bebidas</span>
            </div>

            <div class="lista-itens" style="display:flex; flex-direction:column; gap:12px; max-height:250px; overflow-y:auto; padding-right:5px;">
                
                <div class="item-card" style="display:flex; gap:10px; background:#fff; border-radius:12px; overflow:hidden; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="documents/imgs/receita-de-tapioca-com-frango-requeijao.webp" style="width:70px; height:70px; object-fit:cover; border-radius:10px;" />
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-weight:600; font-size:14px; color:#111;">Frango com Catupiry</span>
                            <i class="bi bi-plus-circle" style="color:#3553C1; font-size:16px;"></i>
                        </div>
                        <p style="margin:2px 0; font-size:11px; color:#777;">Frango desfiado e cremoso</p>
                        <span style="color:#2e7d32; font-weight:700; font-size:14px;">R$ 22,00</span>
                    </div>
                </div>

                <div class="item-card" style="display:flex; gap:10px; background:#fff; border-radius:12px; overflow:hidden; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="documents/imgs/tapioca-de-carne.jpg" style="width:70px; height:70px; object-fit:cover; border-radius:10px;" />
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-weight:600; font-size:14px; color:#111;">Carne de Sol com Queijo</span>
                            <i class="bi bi-plus-circle" style="color:#3553C1; font-size:16px;"></i>
                        </div>
                        <p style="margin:2px 0; font-size:11px; color:#777;">Carne seca e queijo coalho</p>
                        <span style="color:#2e7d32; font-weight:700; font-size:14px;">R$ 25,00</span>
                    </div>
                </div>

                <div class="item-card" style="display:flex; gap:10px; background:#fff; border-radius:12px; overflow:hidden; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="documents/imgs/tapioca-doce.jpg" style="width:70px; height:70px; object-fit:cover; border-radius:10px;" />
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-weight:600; font-size:14px; color:#111;">Tapioca Doce</span>
                            <i class="bi bi-plus-circle" style="color:#3553C1; font-size:16px;"></i>
                        </div>
                        <p style="margin:2px 0; font-size:11px; color:#777;">Tapioca com leite ninho</p>
                        <span style="color:#2e7d32; font-weight:700; font-size:14px;">R$ 21,00</span>
                    </div>
                </div>

            </div>
        </div>
    `
},

    "Restaurante Dona Xica": {
        img: "documents/imgs/restaurante-piscina-icon.png",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-egg-fried"></i> Pratos executivos</li>
                <li><i class="bi bi-bowl-hot"></i> Refeições completas</li>
                <li><i class="bi bi-cup-straw"></i> Bebidas geladas</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                <button class="btn-secundario"
                        onclick="togglePopupContent('Restaurante Dona Xica', 'menu')">
                    <i class="bi bi-menu-down"></i>
                    Cardápio
                </button>

                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `,
//CARDAPIO. LEMBRANDO QUE O NOSSO É NOSSO E DELES É O DELES
    cardapioHTML: `
        <div class="popup-cardapio-container" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div class="header-cardapio" style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <button onclick="togglePopupContent('Restaurante Dona Xica', 'home')" style="background:none; border:none; color:#3553C1; cursor:pointer; font-size:18px; padding:0;">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h3 style="margin:0; color:#3553C1; font-size:18px; width:100%; text-align:center; padding-right:25px;">Cardapio</h3>
            </div>

            <div class="categorias-scroll" style="display:flex; gap:8px; margin-bottom:15px; overflow-x:auto; padding-bottom:5px;">
                <span style="background:#f0f7f0; color:#3553C1;border:1px solid #3553C1; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Salgados</span>
                <span style="background:#f5f5f5; color:#666; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Doces</span>
                <span style="background:#f5f5f5; color:#666; padding:4px 12px; border-radius:8px; font-size:12px; white-space:nowrap;">Bebidas</span>
            </div>

            <div class="lista-itens" style="display:flex; flex-direction:column; gap:12px; max-height:250px; overflow-y:auto; padding-right:5px;">
                
                <div class="item-card" style="display:flex; gap:10px; background:#fff; border-radius:12px; overflow:hidden; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="documents/imgs/self-service.jpg" style="width:70px; height:70px; object-fit:cover; border-radius:10px;" />
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <span style="font-weight:600; font-size:14px; color:#111;">Self Service</span>
                            <i class="bi bi-plus-circle" style="color:#3553C1; font-size:16px;"></i>
                        </div>
                        <p style="margin:2px 0; font-size:11px; color:#777;">Crie seu prato!</p>
                        <span style="color:#2e7d32; font-weight:700; font-size:14px;">R$ 23,00</span>
                    </div>
                </div>

            </div>
        </div>`
    },

    "Minaçaí": {
        img: "documents/imgs/minacai-icon.png",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-snow"></i> Açaí e cremes gelados</li>
                <li><i class="bi bi-strawberry"></i> Acompanhamentos variados</li>
                <li><i class="bi bi-cup-straw"></i> Bebidas naturais</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-menu-down"></i>
                    Cardápio
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    },

    "Pizzaria": {
        img: "documents/imgs/pizzaria-icon.jpg",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-pizza"></i> Pizzas artesanais</li>
                <li><i class="bi bi-burger"></i> Lanches rápidos</li>
                <li><i class="bi bi-cup-straw"></i> Bebidas</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-menu-down"></i>
                    Cardápio
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    },

    "Comercio do Museu": {
        img: "documents/imgs/comercio-museu.jpg",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-bread-slice"></i> Lanches rápidos</li>
                <li><i class="bi bi-cup-straw"></i> Bebidas</li>
                <li><i class="bi bi-bag"></i> Souvenirs</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-menu-down"></i>
                    Cardápio
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};
const detalhesPraca = {
    "Praça das Pedras": {
        img: "documents/imgs/praca.jpg",
        desc: `
            <div class="popup-status aberto">
                <i class="bi bi-clock"></i>
                Aberto agora · 07h–22h
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-telephone"></i>
                    Ligar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    },
}
const detalhesReitoria = {
    "Reitoria": {
        img: "documents/imgs/reitoria.webp",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-building"></i> Administração</li>
                <li><i class="bi bi-folder2"></i> Secretarias</li>
                <li><i class="bi bi-clock"></i> Atendimento 08h–18h</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    },

}
const detalhesBiblioteca = {
    "Biblioteca": {
        img: "documents/imgs/biblioteca.webp",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-book"></i> Acervo de livros e periódicos</li>
                <li><i class="bi bi-laptop"></i> Espaço de estudo e computadores</li>
                <li><i class="bi bi-clock"></i> Funcionamento 07h–22h</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};
const detalhesMuseu = {
    "Museu": {
        img: "documents/imgs/museu.jpg",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-bank"></i> Exposições permanentes e temporárias</li>
                <li><i class="bi bi-palette"></i> Acervo de arte e história</li>
                <li><i class="bi bi-clock"></i> Funcionamento 08h–20h</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};

function gerarDescEstacionamento() {
    return `
        <ul class="popup-lista">
            <li><i class="bi bi-car-front-fill"></i> Vagas para carros</li>
            <li><i class="bi bi-p-square-fill"></i> Área de estacionamento coberta</li>
            <li><i class="bi bi-clock"></i> Funcionamento 06h–23h</li>
        </ul>

        <div class="popup-status aberto">
            <i class="bi bi-check-circle-fill"></i>
            Aberto agora
        </div>

        <div class="popup-acoes">
            <button class="btn-primario">
                <i class="bi bi-geo-alt-fill"></i>
                Como chegar
            </button>
            <button class="btn-secundario">
                <i class="bi bi-eye"></i>
                Ver detalhes
            </button>
        </div>
    `;
}

const detalhesEstacionamento = {
    "Estacionamento do EVA": {
        img: "documents/imgs/estacionamento.png",
        desc: gerarDescEstacionamento()
    },
    "Estacionamento do Auditório": {
        img: "documents/imgs/estacionamento.png",
        desc: gerarDescEstacionamento()
    },
    "Estacionamento do Primeiros Socorros": {
        img: "documents/imgs/estacionamento.png",
        desc: gerarDescEstacionamento()
    },
    "Estacionamento de Psicologia": {
        img: "documents/imgs/estacionamento.png",
        desc: gerarDescEstacionamento()
    },
    "Estacionamento da Reitoria": {
        img: "documents/imgs/estacionamento.png",
        desc: gerarDescEstacionamento()
    }
};
const detalhesAuditorio = {
    "Auditório": {
        img: "documents/imgs/auditorio.webp",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-mic"></i> Espaço para palestras e eventos</li>
                <li><i class="bi bi-person-video3"></i> Capacidade para até 300 pessoas</li>
                <li><i class="bi bi-clock"></i> Funcionamento 08h–22h</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};
const detalhesEva = {
    "EVA": {
        img: "documents/imgs/eva.webp",
        desc: `
            <ul class="popup-lista">
                <li>
                    <i class="bi bi-mic"></i>
                    Espaço para palestras e eventos
                </li>
                <li>
                    <i class="bi bi-people"></i>
                    Capacidade para até 300 pessoas
                </li>
                <li>
                    <i class="bi bi-clock"></i>
                    Funcionamento 08h–22h
                </li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};
const detalhesGinasio = {
    "Ginasio": {
        img: "documents/imgs/ginasio-unipe.png",
        desc: `
            <ul class="popup-lista">
                <li><i class="bi bi-dribbble"></i> Quadra poliesportiva</li>
                <li><i class="bi bi-people"></i> Capacidade para até 800 pessoas</li>
                <li><i class="bi bi-lightning-charge"></i> Atividades esportivas e eventos</li>
                <li><i class="bi bi-clock"></i> Funcionamento 07h–23h</li>
            </ul>

            <div class="popup-status aberto">
                <i class="bi bi-check-circle-fill"></i>
                Aberto agora
            </div>

            <div class="popup-acoes">
                <button class="btn-primario">
                    <i class="bi bi-geo-alt-fill"></i>
                    Como chegar
                </button>
                <button class="btn-secundario">
                    <i class="bi bi-eye"></i>
                    Ver detalhes
                </button>
            </div>
        `
    }
};
const markerConfig = {
    'comercio': {
        dataSource: detalhesComercios, 
        icon: 'comercio-icon.png',
        size: [60, 60],
        anchor: [31, 43],
    },
    'reitoria': {
        dataSource: detalhesReitoria, 
        icon: 'reitoria-icon.png',
        size: [66, 66],
        anchor: [34, 42],
    },
    'biblioteca': {
        dataSource: detalhesBiblioteca,
        icon: 'biblioteca-icon.png',
        size: [66, 66],
        anchor: [34, 42],
    },
    'estacionamento': {
        dataSource: detalhesEstacionamento,
        icon: 'estacionamento-icon.png',
        size: [66, 66],
        anchor: [30, 41],
    },
    'auditorio': {
        dataSource: detalhesAuditorio,
        icon: 'auditorio-icon.png',
        size: [66, 66],
        anchor: [31, 41],
    },
    'eva': {
        dataSource: detalhesEva,
        icon: 'eva-icon.png',
        size: [66, 66],
        anchor: [34, 43],
    },
    'ginasio': {
        dataSource: detalhesGinasio,
        icon: 'ginasio-icon.png',
        size: [66, 66],
        anchor: [33, 40],
    },
    'museu': {
        dataSource: detalhesMuseu,
        icon: 'museu-icon.png',
        size: [48, 48],
        anchor: [24, 36],
    },
    'praça das pedras': {
        dataSource: detalhesPraca,
        icon: 'praca-icon.png',
        size: [48, 48],
        anchor: [28, 28],
    }
};