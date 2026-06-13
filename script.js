// Плавное появление элементов при прокрутке
const animatedItems = document.querySelectorAll('.animate');

function checkAnimation() {
    const triggerBottom = window.innerHeight * 0.85;

    animatedItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < triggerBottom) {
            item.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkAnimation);
window.addEventListener('load', checkAnimation);


// ===========================
//   МОДАЛЬНОЕ ОКНО
// ===========================

const openModalBtn = document.getElementById('openModal');
const modal = document.getElementById('signupModal');
const closeModalBtn = document.getElementById('closeModal');

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});


// ===========================
//   ОТПРАВКА НА CLOUDFLARE WORKER
// ===========================

const form = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameValue = document.getElementById('nameInput').value.trim();
        const phone = document.getElementById('phoneInput').value.trim();

        if (!nameValue || !phone) {
            alert("Заполните имя и телефон!");
            return;
        }

        const workerURL = "https://dawn-field-d887.sabalinalbert9.workers.dev/";
        const data = { fio: nameValue, phone: phone };

        try {
            const res = await fetch(workerURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // НЕ ПАРСИМ JSON, а просто проверяем статус ответа
            // Если воркер вернул 200-299 — считаем успешным
            if (res.ok) {
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                form.reset();

                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (modal) modal.style.display = 'none';
                }, 2000);
            } else {
                alert("Ошибка отправки! Статус: " + res.status);
                console.log("Ответ воркера:", await res.text());
            }

        } catch (err) {
            // Если вообще не дошли до воркера (CORS или сеть)
            console.error("Ошибка сети:", err);
            alert("Ошибка соединения с сервером!");
        }
    });
}