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

// Модальное окно
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

// Отправка заявки через Google Apps Script
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

        try {
            // Используем GET вместо POST (обходим CORS)
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbw6JcXQURHKCjjunvYo-7CO1Q01IXVl0pn35k79OGLd6m4ysa1i6SwOzMPuxlCZdzlLQQ/exec';
            
            const res = await fetch(scriptUrl + '?name=' + encodeURIComponent(nameValue) + '&phone=' + encodeURIComponent(phone), {
                method: "GET"
            });

            const data = await res.json();

            if (data.success) {
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                form.reset();

                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (modal) modal.style.display = 'none';
                }, 2500);
            } else {
                alert("Ошибка отправки: " + (data.error || "Попробуйте позвонить."));
            }

        } catch (err) {
            console.error("Ошибка: ", err);
            alert("Ошибка соединения! Попробуйте позвонить.");
        }
    });
}
