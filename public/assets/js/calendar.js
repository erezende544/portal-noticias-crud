import { API_BASE } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const calendarEl = document.getElementById("calendar");

    calendarEl.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <div>Carregando notícias...</div>
        </div>
    `;

    let noticias = [];
    try {
        // AQUI está o segredo ↓↓↓ NADA DE ENDPOINT com barra extra
        const res = await fetch(`${API_BASE}noticias`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        noticias = Array.isArray(payload) ? payload : (payload.noticias || []);

    } catch (err) {
        console.error("Erro ao carregar notícias:", err);

        calendarEl.innerHTML = `
            <div class="empty-state">
                <h3>Não foi possível carregar o calendário</h3>
                <p>Erro: ${err.message}</p>
            </div>
        `;
        return;
    }

    const events = noticias.map(n => ({
        id: n.id,
        title: n.titulo,
        start: n.data,
        extendedProps: {
            descricao: n.descricao,
            categoria: n.categoria,
            autor: n.autor,
            imagem: n.imagem_pincipal,
            destaque: n.destaque
        },
        url: `detalhes.html?id=${encodeURIComponent(n.id)}`
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: "pt-br",
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        },
        events
    });


    calendar.render();
});
