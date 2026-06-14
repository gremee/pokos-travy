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
            const res = await fetch('ТВОЙ_GOOGLE_APPS_SCRIPT_URL', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameValue, phone: phone })
            });

            if (res.ok) {
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                form.reset();

                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                    if (modal) modal.style.display = 'none';
                }, 2500);
            } else {
                alert("Ошибка отправки! Попробуйте позвонить.");
            }

        } catch (err) {
            console.error("Ошибка: ", err);
            alert("Ошибка соединения! Попробуйте позвонить.");
        }
    });
}
