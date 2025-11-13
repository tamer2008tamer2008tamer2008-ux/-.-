// لوحة الإدارة
document.addEventListener('DOMContentLoaded', function() {
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminPasswordInput = document.getElementById('admin-password');
    
    let storeData = JSON.parse(localStorage.getItem('pcStoreData')) || {
        products: [],
        contactInfo: {
            phone: "123-456-789",
            whatsapp: "123-456-789",
            facebook: "https://facebook.com/pcstore"
        },
        adminPassword: "106"
    };

    // تسجيل الدخول
    loginBtn.addEventListener('click', function() {
        const enteredPassword = adminPasswordInput.value;
        
        if (enteredPassword === storeData.adminPassword) {
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminData();
        } else {
            alert('كلمة المرور غير صحيحة');
        }
    });

    // تسجيل الخروج
    logoutBtn.addEventListener('click', function() {
        adminLogin.style.display = 'flex';
        adminPanel.style.display = 'none';
        adminPasswordInput.value = '';
    });

    // تحميل بيانات الإدارة
    function loadAdminData() {
        displayProductsList();
        loadContactInfo();
    }

    // عرض قائمة المنتجات
    function displayProductsList() {
        const container = document.getElementById('products-list');
        if (!container) return;

        container.innerHTML = '';

        storeData.products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.category} - ${product.price}$</p>
                </div>
                <button class="delete-btn" data-index="${index}">حذف</button>
            `;
            container.appendChild(productItem);
        });

        // إضافة مستمعين لأزرار الحذف
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                    storeData.products.splice(index, 1);
                    localStorage.setItem('pcStoreData', JSON.stringify(storeData));
                    displayProductsList();
                }
            });
        });
    }

    // تحميل معلومات التواصل
    function loadContactInfo() {
        document.getElementById('contact-phone').value = storeData.contactInfo.phone;
        document.getElementById('contact-whatsapp').value = storeData.contactInfo.whatsapp;
        document.getElementById('contact-facebook').value = storeData.contactInfo.facebook;
    }

    // إضافة منتج جديد
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const category = document.getElementById('product-category').value;
            const description = document.getElementById('product-description').value;
            const price = document.getElementById('product-price').value;
            const imageFile = document.getElementById('product-image').files[0];
            const videoFile = document.getElementById('product-video').files[0];
            
            if (name && category && description && price) {
                const newProduct = {
                    name: name,
                    category: category,
                    description: description,
                    price: price + ' $',
                    image: '',
                    video: ''
                };
                
                // معالجة الصورة
                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        newProduct.image = e.target.result;
                        // معالجة الفيديو بعد معالجة الصورة
                        if (videoFile) {
                            const videoReader = new FileReader();
                            videoReader.onload = function(e) {
                                newProduct.video = e.target.result;
                                saveProduct(newProduct);
                            };
                            videoReader.readAsDataURL(videoFile);
                        } else {
                            saveProduct(newProduct);
                        }
                    };
                    reader.readAsDataURL(imageFile);
                } else if (videoFile) {
                    // معالجة الفيديو فقط
                    const videoReader = new FileReader();
                    videoReader.onload = function(e) {
                        newProduct.video = e.target.result;
                        saveProduct(newProduct);
                    };
                    videoReader.readAsDataURL(videoFile);
                } else {
                    saveProduct(newProduct);
                }
            }
        });
    }

    function saveProduct(product) {
        storeData.products.push(product);
        localStorage.setItem('pcStoreData', JSON.stringify(storeData));
        alert('تم إضافة المنتج بنجاح!');
        document.getElementById('add-product-form').reset();
        displayProductsList();
    }

    // تحديث معلومات التواصل
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            storeData.contactInfo.phone = document.getElementById('contact-phone').value;
            storeData.contactInfo.whatsapp = document.getElementById('contact-whatsapp').value;
            storeData.contactInfo.facebook = document.getElementById('contact-facebook').value;
            
            localStorage.setItem('pcStoreData', JSON.stringify(storeData));
            alert('تم حفظ معلومات التواصل بنجاح!');
        });
    }

    // تغيير كلمة المرور
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword === confirmPassword) {
                storeData.adminPassword = newPassword;
                localStorage.setItem('pcStoreData', JSON.stringify(storeData));
                alert('تم تغيير كلمة المرور بنجاح!');
                passwordForm.reset();
            } else {
                alert('كلمات المرور غير متطابقة!');
            }
        });
    }

    // تبديل التبويبات
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            // إخفاء جميع المحتويات
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // تفعيل الزر المحدد
            this.classList.add('active');
            // إظهار المحتوى المناسب
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});
