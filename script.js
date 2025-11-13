// بيانات المتجر
let storeData = null;

// تحميل البيانات
async function loadData() {
    storeData = await apiService.getData();
    updateUI();
}

// حفظ البيانات
async function saveData() {
    await apiService.saveData(storeData);
}

// تحديث واجهة المستخدم
function updateUI() {
    displayProducts();
    displayComments();
    updateContactInfo();
    setupCategoryFilters();
    setupEventListeners();
}

// عرض المنتجات
function displayProducts(products = storeData.products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>لا توجد منتجات حالياً</h3>
                <p>سيتم إضافة منتجات قريباً</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
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
            mediaContent = `<img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">`;
        } else {
            mediaContent = `
                <div class="product-image" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 3rem;
                ">
                    <i class="fas fa-desktop"></i>
                </div>
            `;
        }

        productCard.innerHTML = `
            ${mediaContent}
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
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

    if (storeData.comments.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="background: transparent; box-shadow: none;">
                <h3>لا توجد تعليقات حالياً</h3>
                <p>كن أول من يعلق على منتجاتنا</p>
            </div>
        `;
        return;
    }

    // ترتيب التعليقات من الأحدث إلى الأقدم
    const sortedComments = [...storeData.comments].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    sortedComments.forEach(comment => {
        const commentDate = new Date(comment.date);
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-author">${comment.name}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${commentDate.toLocaleDateString('ar-EG')}</div>
        `;
        container.appendChild(commentItem);
    });
}

// تحديث معلومات التواصل
function updateContactInfo() {
    const phoneElement = document.getElementById('footer-phone');
    const whatsappElement = document.getElementById('footer-whatsapp');

    if (phoneElement) phoneElement.textContent = storeData.contactInfo.phone;
    if (whatsappElement) whatsappElement.textContent = storeData.contactInfo.whatsapp;
}

// إعداد تصفية الأقسام
function setupCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
}

// تصفية المنتجات حسب القسم
function filterProductsByCategory(category) {
    const filteredProducts = storeData.products.filter(product => product.category === category);
    displayFilteredProducts(filteredProducts, category);
}

// عرض المنتجات المصفاة
function displayFilteredProducts(products, category) {
    const container = document.getElementById('products-container');
    if (!container) return;

    // التمرير إلى قسم المنتجات
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>لا توجد منتجات في قسم ${getCategoryName(category)}</h3>
                <p>سيتم إضافة منتجات قريباً</p>
                <button class="back-button" onclick="displayProducts()">
                    <i class="fas fa-arrow-right"></i> العودة لجميع المنتجات
                </button>
            </div>
        `;
        return;
    }

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = `منتجات قسم ${getCategoryName(category)}`;
    container.appendChild(categoryTitle);

    products.forEach(product => {
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
            mediaContent = `<img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">`;
        } else {
            mediaContent = `
                <div class="product-image" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 3rem;
                ">
                    <i class="fas fa-desktop"></i>
                </div>
            `;
        }

        productCard.innerHTML = `
            ${mediaContent}
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        
        container.appendChild(productCard);
    });

    // إضافة زر العودة
    const backButton = document.createElement('button');
    backButton.textContent = 'العودة لجميع المنتجات';
    backButton.className = 'back-button';
    backButton.onclick = displayProducts;
    backButton.style.margin = '2rem auto';
    backButton.style.display = 'block';
    container.appendChild(backButton);
}

// الحصول على اسم القسم بالعربية
function getCategoryName(categoryKey) {
    const categories = {
        'gpu': 'كروت الشاشة',
        'cpu': 'المعالجات',
        'cooling': 'أنظمة التبريد',
        'keyboard': 'لوحات المفاتيح',
        'mouse': 'الفأرة',
        'case': 'صناديق الحاسب',
        'psu': 'مزودات الطاقة',
        'cables': 'الكابلات',
        'monitor': 'الشاشات',
        'motherboard': 'اللوحات الأم',
        'ram': 'الذاكرة العشوائية',
        'storage': 'مساحات التخزين',
        'fans': 'مراوح RGB',
        'prebuilt': 'تجميعات جاهزة'
    };
    return categories[categoryKey] || categoryKey;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إرسال تعليق جديد
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value;
            const text = document.getElementById('comment-text').value;
            
            if (name && text) {
                const newComment = {
                    name: name,
                    text: text,
                    date: new Date().toISOString()
                };
                
                storeData.comments.push(newComment);
                await saveData();
                displayComments();
                commentForm.reset();
                
                // رسالة البوت التلقائية
                setTimeout(() => {
                    alert('شكراً لك على تعليقك! 🎉\nللإستفسارات والطلبات، راسلنا على الواتساب: ' + storeData.contactInfo.whatsapp);
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

    // زر العودة للأعلى
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.display = 'block';
            } else {
                scrollButton.style.display = 'none';
            }
        });

        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // تصفية المنتجات
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            if (filter === 'all') {
                displayProducts();
            }
        });
    });
}

// تحديث البيانات تلقائياً كل 30 ثانية
function startAutoRefresh() {
    setInterval(async () => {
        console.log('🔄 تحديث البيانات تلقائياً...');
        const newData = await apiService.getData();
        if (JSON.stringify(newData) !== JSON.stringify(storeData)) {
            storeData = newData;
            updateUI();
            console.log('✅ تم تحديث البيانات');
        }
    }, 30000);
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    startAutoRefresh();
    console.log('🚀 تم تحميل الموقع بنجاح!');
});
