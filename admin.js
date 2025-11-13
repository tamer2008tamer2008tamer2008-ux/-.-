// لوحة التحكم
class AdminPanel {
    constructor() {
        this.storeData = this.loadData();
        this.currentTab = 'dashboard';
        this.init();
    }

    // تحميل البيانات
    loadData() {
        const savedData = localStorage.getItem('faizTechData');
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            return {
                products: [],
                contactInfo: {
                    phone: "+966 123 456 789",
                    whatsapp: "+966 123 456 789",
                    facebook: "https://facebook.com/faiztech"
                },
                comments: [],
                adminPassword: "106",
                activities: []
            };
        }
    }

    // حفظ البيانات
    saveData() {
        localStorage.setItem('faizTechData', JSON.stringify(this.storeData));
    }

    // التهيئة
    init() {
        this.setupLogin();
        this.setupEventListeners();
        this.updateDashboard();
    }

    // إعداد نظام التسجيل
    setupLogin() {
        const loginForm = document.getElementById('login-form');
        const adminLogin = document.getElementById('admin-login');
        const adminPanel = document.getElementById('admin-panel');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('admin-password').value;
                
                if (password === this.storeData.adminPassword) {
                    adminLogin.style.display = 'none';
                    adminPanel.style.display = 'block';
                    this.addActivity('تم تسجيل الدخول إلى لوحة التحكم');
                } else {
                    alert('كلمة المرور غير صحيحة!');
                }
            });
        }

        // تسجيل الخروج
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                adminLogin.style.display = 'flex';
                adminPanel.style.display = 'none';
                document.getElementById('admin-password').value = '';
                this.addActivity('تم تسجيل الخروج من لوحة التحكم');
            });
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // تبديل التبويبات
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // إضافة منتج
        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct();
            });
        }

        // إدارة جهات الاتصال
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateContactInfo();
            });
        }

        // تغيير كلمة المرور
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        // معاينة الملفات
        this.setupFilePreviews();
        
        // البحث في المنتجات
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // تحميل البيانات الأولية
        this.loadContactInfo();
        this.displayProductsTable();
    }

    // تبديل التبويبات
    switchTab(tabName) {
        // إخفاء جميع المحتويات
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // إزالة النشاط من جميع الأزرار
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // إظهار المحتوى المحدد
        document.getElementById(tabName).classList.add('active');
        
        // تفعيل الزر المحدد
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        this.currentTab = tabName;

        // تحديث البيانات حسب التبويب
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'manage-products') {
            this.displayProductsTable();
        }
    }

    // تحديث لوحة التحكم
    updateDashboard() {
        // تحديث الإحصائيات
        document.getElementById('total-products').textContent = this.storeData.products.length;
        document.getElementById('total-comments').textContent = this.storeData.comments.length;

        // عرض النشاطات
        this.displayActivities();
    }

    // عرض النشاطات
    displayActivities() {
        const container = document.getElementById('activities-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.storeData.activities.length === 0) {
            container.innerHTML = '<p class="no-activities">لا توجد نشاطات مسجلة</p>';
            return;
        }

        // عرض آخر 5 نشاطات
        const recentActivities = this.storeData.activities.slice(-5).reverse();
        
        recentActivities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${this.formatTime(activity.timestamp)}</span>
                </div>
            `;
            container.appendChild(activityElement);
        });
    }

    // تنسيق الوقت
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('ar-EG');
    }

    // إضافة نشاط
    addActivity(text) {
        this.storeData.activities.push({
            text: text,
            timestamp: new Date().toISOString()
        });
        this.saveData();
        this.updateDashboard();
    }

    // إضافة منتج
    addProduct() {
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const price = document.getElementById('product-price').value;
        const imageFile = document.getElementById('product-image').files[0];
        const videoFile = document.getElementById('product-video').files[0];

        if (!name || !category || !description || !price) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: name,
            category: category,
            description: description,
            price: price,
            image: '',
            video: '',
            createdAt: new Date().toISOString()
        };

        // معالجة الصورة
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newProduct.image = e.target.result;
                this.processVideoAndSave(newProduct, videoFile);
            };
            reader.readAsDataURL(imageFile);
        } else if (videoFile) {
            this.processVideoAndSave(newProduct, videoFile);
        } else {
            this.saveProduct(newProduct);
        }
    }

    // معالجة الفيديو وحفظ المنتج
    processVideoAndSave(product, videoFile) {
        if (videoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                product.video = e.target.result;
                this.saveProduct(product);
            };
            reader.readAsDataURL(videoFile);
        } else {
            this.saveProduct(product);
        }
    }

    // حفظ المنتج
    saveProduct(product) {
        this.storeData.products.push(product);
        this.saveData();
        
        // إعادة تعيين النموذج
        document.getElementById('add-product-form').reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('video-preview').innerHTML = '';
        
        // تحديث الجداول
        this.displayProductsTable();
        this.updateDashboard();
        
        // إضافة نشاط
        this.addActivity(`تم إضافة منتج جديد: ${product.name}`);
        
        alert('تم إضافة المنتج بنجاح!');
    }

    // عرض جدول المنتجات
    displayProductsTable() {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.storeData.products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-products">
                        <i class="fas fa-box-open"></i>
                        <p>لا توجد منتجات</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.storeData.products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : 
                        `<div class="no-image"><i class="fas fa-image"></i></div>`
                    }
                </td>
                <td>${product.name}</td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>${product.price}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="admin.deleteProduct(${index})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // حذف منتج
    deleteProduct(index) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            const productName = this.storeData.products[index].name;
            this.storeData.products.splice(index, 1);
            this.saveData();
            this.displayProductsTable();
            this.updateDashboard();
            this.addActivity(`تم حذف المنتج: ${productName}`);
            alert('تم حذف المنتج بنجاح!');
        }
    }

    // تصفية المنتجات
    filterProducts(searchTerm) {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        const filteredProducts = this.storeData.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            this.getCategoryName(product.category).toLowerCase().includes(searchTerm.toLowerCase())
        );

        tbody.innerHTML = '';

        if (filteredProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-products">
                        <i class="fas fa-search"></i>
                        <p>لا توجد نتائج</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const originalIndex = this.storeData.products.findIndex(p => p.id === product.id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : 
                        `<div class="no-image"><i class="fas fa-image"></i></div>`
                    }
                </td>
                <td>${product.name}</td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>${product.price}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="admin.deleteProduct(${originalIndex})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // تحميل معلومات التواصل
    loadContactInfo() {
        document.getElementById('contact-phone').value = this.storeData.contactInfo.phone;
        document.getElementById('contact-whatsapp').value = this.storeData.contactInfo.whatsapp;
        document.getElementById('contact-facebook').value = this.storeData.contactInfo.facebook;
    }

    // تحديث معلومات التواصل
    updateContactInfo() {
        this.storeData.contactInfo.phone = document.getElementById('contact-phone').value;
        this.storeData.contactInfo.whatsapp = document.getElementById('contact-whatsapp').value;
        this.storeData.contactInfo.facebook = document.getElementById('contact-facebook').value;
        
        this.saveData();
        this.addActivity('تم تحديث معلومات التواصل');
        alert('تم حفظ معلومات التواصل بنجاح!');
    }

    // تغيير كلمة المرور
    changePassword() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('كلمات المرور غير متطابقة!');
            return;
        }

        if (newPassword.length < 3) {
            alert('كلمة المرور يجب أن تكون 3 أحرف على الأقل');
            return;
        }

        this.storeData.adminPassword = newPassword;
        this.saveData();
        document.getElementById('password-form').reset();
        this.addActivity('تم تغيير كلمة مرور لوحة التحكم');
        alert('تم تغيير كلمة المرور بنجاح!');
    }

    // إعداد معاينة الملفات
    setupFilePreviews() {
        const imageInput = document.getElementById('product-image');
        const videoInput = document.getElementById('product-video');
        const imagePreview = document.getElementById('image-preview');
        const videoPreview = document.getElementById('video-preview');

        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.innerHTML = `
                            <div class="preview-item">
                                <img src="${e.target.result}" alt="معاينة الصورة">
                                <button type="button" class="remove-preview" onclick="this.parentElement.remove()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (videoInput) {
            videoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    videoPreview.innerHTML = `
                        <div class="preview-item">
                            <video controls>
                                <source src="${url}" type="${file.type}">
                                متصفحك لا يدعم تشغيل الفيديو
                            </video>
                            <button type="button" class="remove-preview" onclick="this.parentElement.remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                }
            });
        }
    }

    // الحصول على اسم القسم
    getCategoryName(categoryKey) {
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
}

// تهيئة لوحة التحكم عند تحميل الصفحة
let admin;
document.addEventListener('DOMContentLoaded', function() {
    admin = new AdminPanel();
});
