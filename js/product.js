import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
let productModal = null;
let delProductModal = null;

const App = {
data(){
    return { 
        apiUrl : 'https://ec-course-api.hexschool.io/v2',
        apiPath : 'milktea',
        products: [],
        isNew: false,
        tempProduct: {
            imagesUrl: [],
        },
    }
},
mounted(){//要使用mounted 要抓到動元素，不然bootstrap modal裡的文字無法正常顯示 而且要先在上面設productModal, delProductModal為空物件，再用mounted取一次才行。
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
        keyboard: false
      });
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
        keyboard: false
      });
    //取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    axios.defaults.headers.common.Authorization = token;// 之後每次發出請求時會自動把headers加進去，每次重新整理還是會維持登入狀態
    this.checkAdmin()
},
methods: {
    //驗證登入
    checkAdmin(){
        const url = `${this.apiUrl}/api/user/check`;
        axios.post(url)
            .then((res)=>{
                console.log('驗證成功')
                this.getProducts(); // 驗證成功就取得產品列表
            })
            .catch((err)=>{
                alert(err.response.data.message)
                location.href = "login.html";// 失敗就導回login頁面
            })
    },
    //取得管理員才能看到的產品列表
    getProducts(){
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
        axios.get(url)
            .then((res)=>{
                this.products = res.data.products;
            })
            .catch((err)=>{
                alert(err.response.data.message)  
            })
    }, 
    //更新產品資料
    updateProduct(){
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        let http = 'post'
        if(!this.isNew){
            url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
            http = 'put'
        }
        axios[http](url, {data: this.tempProduct})
            .then((res)=>{
                alert(res.data.message);
                productModal.hide();
                this.getProducts();
            })
            .catch((err)=>{
                alert(err.response.data.message)  
            })
    },
    openModal(isNew, item){
        if (isNew === 'new'){
            this.tempProduct = {
                imagesUrl: [],
            };
            this.isNew = true;
            productModal.show();
        } else if(isNew === 'edit'){
            this.tempProduct = { ...item };
            this.isNew = false;
            productModal.show();
        } else if (isNew === 'delete'){
            this.tempProduct = { ...item};
            delProductModal.show()
        }
    },
    //刪除產品資料
    delProduct(){
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        axios.delete(url).then((res)=>{
            alert(res.data.message);
            delProductModal.hide();
            this.getProducts();
        })
        .catch((err)=>{
            alert(err.response.data.message);
        })
    },
    createImage(){
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
    }
},
};
Vue.createApp(App).mount('#app');
