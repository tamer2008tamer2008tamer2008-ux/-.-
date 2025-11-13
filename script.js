// بيانات المتجر
let storeData = {
    products: [],
    contactInfo: {
        phone: "123-456-789",
        whatsapp: "123-456-789",
        facebook: "https://facebook.com/pcstore"
    },
    comments: [],
    adminPassword: "106"
};

// تحميل البيانات من التخزين المحلي
function loadData() {
    const savedData = localStorage.getItem('pcStoreData');
    if (savedData) {
        storeData = JSON.parse(savedData);
    }
    updateUI();
}

// حفظ البيانات في التخزين المحلي
function saveData() {
    localStorage.setItem('pcStoreData', JSON.stringify(storeData));
}

// تحديث واجهة المستخدم
function updateUI() {
    displayProducts();
    displayComments();
    updateContactInfo();
}

// عرض المنتجات
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    storeData.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let mediaContent = '';
        if (product.video) {
            mediaContent = `
                <video class="product-image" controls>
                    <source src="${product.video}" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو
                </video>
            `;
        } else if (product.image) {
            mediaContent = `<img src="${product.image}" alt="${product.name}" class="product-image">`;
        } else {
            mediaContent = `<div class="product-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center;">لا توجد صورة</div>`;
        }

        productCard.innerHTML = `
            ${mediaContent}
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} $</div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// عرض التعليقات
function displayComments() {
    const container = document.getElementById('comments-list');
    if (!container) return;

    container.innerHTML = '';

    storeData.comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-author">${comment.name}</div>
            <div class="comment-text">${comment.text}</div>
        `;
        container.appendChild(commentItem);
    });
}

// تحديث معلومات التواصل
function updateContactInfo() {
    const phoneElement = document.getElementById('footer-phone');
    const whatsappElement = document.getElementById('footer-whatsapp');
    const facebookElement = document.getElementById('footer-facebook');
    const facebookLink = document.getElementById('facebook-link');

    if (phoneElement) phoneElement.textContent = `الهاتف: ${storeData.contactInfo.phone}`;
    if (whatsappElement) whatsappElement.textContent = `واتساب: ${storeData.contactInfo.whatsapp}`;
    if (facebookElement) facebookElement.textContent = `فيسبوك: ${storeData.contactInfo.facebook}`;
    if (facebookLink) {
        facebookLink.href = storeData.contactInfo.facebook;
        facebookLink.textContent = 'متجر قطع الكمبيوتر';
    }
}

// إرسال تعليق جديد
document.addEventListener('DOMContentLoaded', function() {
    loadData();

    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value;
            const text = document.getElementById('comment-text').value;
            
            if (name && text) {
                storeData.comments.push({
                    name: name,
                    text: text,
                    date: new Date().toISOString()
                });
                
                saveData();
                displayComments();
                commentForm.reset();
                
                // رسالة البوت التلقائية
                setTimeout(() => {
                    alert('أسف لا يمكنني الإجابة هنا، راسلني على الفيسبوك: ' + storeData.contactInfo.facebook);
                }, 1000);
            }
        });
    }

    // التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
