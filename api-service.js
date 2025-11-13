// ملف api-service.js
class ApiService {
    constructor() {
        this.baseURL = 'https://api.jsonbin.io/v3/b';
        this.binId = API_CONFIG.BIN_ID;
        this.apiKey = API_CONFIG.API_KEY;
    }

    async getData() {
        try {
            console.log('📡 جلب البيانات من السحابة...');
            const response = await fetch(`${this.baseURL}/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (!response.ok) throw new Error('فشل في جلب البيانات');
            
            const data = await response.json();
            console.log('✅ تم جلب البيانات بنجاح:', data.record);
            return data.record;
        } catch (error) {
            console.error('❌ خطأ في جلب البيانات من السحابة:', error);
            console.log('🔄 جلب البيانات من التخزين المحلي...');
            return this.getLocalData();
        }
    }

    async saveData(data) {
        try {
            console.log('💾 حفظ البيانات في السحابة...');
            data.lastUpdate = new Date().toISOString();
            
            const response = await fetch(`${this.baseURL}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) throw new Error('فشل في حفظ البيانات');
            
            const result = await response.json();
            console.log('✅ تم حفظ البيانات في السحابة بنجاح');
            return result;
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات في السحابة:', error);
            console.log('💾 حفظ البيانات في التخزين المحلي...');
            this.saveLocalData(data);
            return null;
        }
    }

    getLocalData() {
        const localData = localStorage.getItem('faizTechData');
        if (localData) {
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            return JSON.parse(localData);
        } else {
            console.log('⚙️ استخدام البيانات الافتراضية');
            return this.getDefaultData();
        }
    }

    saveLocalData(data) {
        localStorage.setItem('faizTechData', JSON.stringify(data));
        console.log('💾 تم حفظ البيانات في التخزين المحلي');
    }

    getDefaultData() {
        return {
            products: [],
            contactInfo: {
                phone: "+966 123 456 789",
                whatsapp: "+966 123 456 789",
                facebook: "https://facebook.com/faiztech"
            },
            comments: [],
            adminPassword: "106",
            lastUpdate: new Date().toISOString()
        };
    }
}

const apiService = new ApiService();
