document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (validateForm(name, email, message)) {
                alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                contactForm.reset();
            }
        });
    }
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    });
    
    window.dispatchEvent(new Event('scroll'));
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    if (downloadButtons.length > 0) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                alert('سيتم تحويلك إلى صفحة التحميل قريباً...');
            });
        });
    }
    
    const tableBody = document.querySelector('.ai-apps-table tbody');
    let currentDetailsRow = null;
    let currentDetailsCheckbox = null;

    if (tableBody) {
        window.appData = window.appData || {
            "1": { name: "ChatGPT", developer: "OpenAI", description: "ChatGPT هو نموذج لغوي ...", features: ["محادثة طبيعية", "كتابة محتوى", "مساعدة برمجية"], url: "https://chat.openai.com" },
            "2": { name: "DALL-E", developer: "OpenAI", description: "DALL-E ينشئ صوراً من نصوص ...", features: ["توليد صور", "تعديل صور"], url: "https://openai.com/dall-e-3" },
            "3": { name: "Midjourney", developer: "Midjourney, Inc.", description: "Midjourney لصور فنية ...", features: ["صور فنية", "تخصيص عالي"], url: "https://www.midjourney.com" },
            "4": { name: "Google Bard", developer: "Google", description: "نموذج محادثة ذكي ...", features: ["بحث", "تلخيص"], url: "https://bard.google.com" },
            "5": { name: "GitHub Copilot", developer: "Microsoft/GitHub", description: "مساعد برمجة يقترح الأكواد ...", features: ["اقتراح كود", "دعم لغات متعددة"], url: "https://github.com/features/copilot" }
        };

        tableBody.addEventListener('change', function(e) {
            const target = e.target;
            if (!target.classList.contains('details-checkbox')) return;

            const allBoxes = tableBody.querySelectorAll('.details-checkbox');
            allBoxes.forEach(b => {
                if (b !== target) b.checked = false;
            });

            if (currentDetailsRow) {
                currentDetailsRow.remove();
                currentDetailsRow = null;
            }

            const appId = target.getAttribute('data-app-id');
            const app = window.appData[appId];

            if (target.checked && app) {
                // أنشئ سطر تفاصيل تحت السطر المحدد
                const parentRow = target.closest('tr');
                const detailsRow = document.createElement('tr');
                detailsRow.className = 'details-row';
                detailsRow.innerHTML = `
                    <td colspan="5">
                        <div class="app-detail-inline">
                            <h4>${app.name}</h4>
                            <p><strong>المطور:</strong> ${app.developer}</p>
                            <p>${app.description}</p>
                            <h5>المميزات:</h5>
                            <ul>${(app.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
                            <p><a href="${app.url}" target="_blank" class="app-link">زيارة الموقع الرسمي</a></p>
                            <div class="detail-actions">
                                <button type="button" id="delete-app-btn" data-app-id="${appId}" class="danger-btn">حذف هذا التطبيق</button>
                            </div>
                        </div>
                    </td>
                `;
                parentRow.parentNode.insertBefore(detailsRow, parentRow.nextSibling);

                currentDetailsRow = detailsRow;
                currentDetailsCheckbox = target;

                const deleteBtn = detailsRow.querySelector('#delete-app-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function() {
                        const id = this.getAttribute('data-app-id');
                        const box = tableBody.querySelector('.details-checkbox[data-app-id="' + id + '"]');
                        const row = box ? box.closest('tr') : null;
                        if (row) row.remove();

                        if (id && id.startsWith('u-')) {
                            const index = parseInt(id.substring(2), 10);
                            const userApps = JSON.parse(localStorage.getItem('userApps') || '[]');
                            if (!isNaN(index) && index >= 0 && index < userApps.length) {
                                userApps.splice(index, 1);
                                localStorage.setItem('userApps', JSON.stringify(userApps));
                            }
                        }

                        if (currentDetailsRow) {
                            currentDetailsRow.remove();
                            currentDetailsRow = null;
                        }
                        if (box) box.checked = false;
                        if (window.appData && window.appData[id]) {
                            delete window.appData[id];
                        }
                    });
                }
            } else {
                if (currentDetailsRow) {
                    currentDetailsRow.remove();
                    currentDetailsRow = null;
                }
            }
        });
    }
    const toggleBtn = document.querySelector('.menu-toggle');
    const navList = document.querySelector('nav ul');
    if (toggleBtn && navList) {
        toggleBtn.addEventListener('click', function() {
            navList.classList.toggle('open');
        });
    }
    const appsTable = document.querySelector('.ai-apps-table');
    const tableContainer = document.querySelector('.table-container');
    if (appsTable && tableContainer) {
        const initialHeight = appsTable.offsetHeight;
        tableContainer.style.minHeight = initialHeight + 'px';
    }
});

function validateForm(name, email, message) {
    let isValid = true;
    
    if (name.trim() === '') {
        alert('الرجاء إدخال الاسم');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        isValid = false;
    }
    
    if (message.trim() === '') {
        alert('الرجاء إدخال رسالتك');
        isValid = false;
    }
    
    return isValid;
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const addAppForm = document.getElementById('add-app-form');
    if (addAppForm) {
        addAppForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const app = {
                name: document.getElementById('appName').value.trim(),
                developer: document.getElementById('developer').value.trim(),
                url: document.getElementById('url').value.trim(),
                domain: document.getElementById('domain').value,
                description: document.getElementById('description').value.trim(),
                features: [],
                isFree: document.getElementById('isFree').checked
            };

            const userApps = JSON.parse(localStorage.getItem('userApps') || '[]');
            userApps.push(app);
            localStorage.setItem('userApps', JSON.stringify(userApps));

            window.location.href = 'apps.html#apps';
        });
    }

    const appsTableBody = document.querySelector('.ai-apps-table tbody');
    const userAppsLoaded = JSON.parse(localStorage.getItem('userApps') || '[]');
    if (!window.appData) window.appData = {};

    if (appsTableBody && userAppsLoaded.length > 0) {
        userAppsLoaded.forEach((app, idx) => {
            const id = `u-${idx}`;
            window.appData[id] = app;

            const freeHtml = app.isFree 
                ? '<span class="free-status yes">✓</span>' 
                : '<span class="free-status no">✗</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.name}</td>
                <td>${app.developer}</td>
                <td>${app.domain}</td>
                <td>${freeHtml}</td>
                <td><input type="checkbox" class="details-checkbox" data-app-id="${id}"></td>
            `;
            appsTableBody.appendChild(tr);
        });
    }

    const allDetailsBoxes = document.querySelectorAll('.details-checkbox');
    const detailsPanel = document.getElementById('app-details');
    const detailsContent = document.getElementById('app-detail-content');

    if (allDetailsBoxes.length > 0 && detailsPanel && detailsContent) {
        allDetailsBoxes.forEach(box => {
            box.addEventListener('change', function() {
                allDetailsBoxes.forEach(b => {
                    if (b !== box) b.checked = false;
                });

                const appId = box.getAttribute('data-app-id');
                const app = window.appData[appId];
                if (box.checked && app) {
                    let featuresHTML = '';
                    (app.features || []).forEach(feature => {
                        featuresHTML += `<li>${feature}</li>`;
                    });

                    detailsContent.innerHTML = `
                        <h4>${app.name}</h4>
                        <p><strong>المطور:</strong> ${app.developer}</p>
                        <p>${app.description}</p>
                        <h5>المميزات:</h5>
                        <ul>${featuresHTML}</ul>
                        <div class="detail-actions">
                            <button type="button" id="delete-app-btn" data-app-id="${appId}" class="danger-btn">حذف هذا التطبيق</button>
                        </div>
                        <p><a href="${app.url}" target="_blank" class="app-link">زيارة الموقع الرسمي</a></p>
                    `;
                    detailsPanel.style.display = 'block';
                    detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    const deleteBtn = document.getElementById('delete-app-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function() {
                            const id = this.getAttribute('data-app-id');
                            const checkbox = document.querySelector('.details-checkbox[data-app-id="' + id + '"]');
                            const row = checkbox ? checkbox.closest('tr') : null;
                            if (row) row.remove();

                            if (id && id.startsWith('u-')) {
                                const index = parseInt(id.substring(2), 10);
                                const userApps = JSON.parse(localStorage.getItem('userApps') || '[]');
                                if (!isNaN(index) && index >= 0 && index < userApps.length) {
                                    userApps.splice(index, 1);
                                    localStorage.setItem('userApps', JSON.stringify(userApps));
                                }
                            }

                            detailsPanel.style.display = 'none';
                            if (checkbox) checkbox.checked = false;
                            if (window.appData && window.appData[id]) delete window.appData[id];
                        });
                    }
                } else {
                    detailsPanel.style.display = 'none';
                }
            });
        });
    }
});