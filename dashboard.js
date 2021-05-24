let myModal = '';
const app = Vue.createApp({
    data() {
        return {
            api: 'https://vue3-course-api.hexschool.io/',
            path: 'tim8076',
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: false,
            loading: false,
            uploadingImages: {},
            //前台商品輪播
            activeImage: 0,
            slideMode:'slide-right',     
        }
    },
    computed:{
        modalTitle(){
           return  this.isNew ? '建立商品' : '編輯商品';
        },
        imagesUrlList(){
            return this.products.map(product => product.imageUrl);
        },
        imagesLength(){
            return this.imagesUrlList.length;
        }
    },
    methods: {
        openModal(isNew, item){
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            } else{
                this.tempProduct = {...item};
                this.isNew = false;
            }
            myModal.show();
        },
        getProductList(page = 1){
            this.loading = true;
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('timToken='))
                .split('=')[1];
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${this.api}api/${this.path}/admin/products?page=${page}`)
                .then(res => {
                    if(res.data.success){
                        console.log(res);
                        this.products = res.data.products;
                        this.loading = false;
                    } 
                })
        },
        updateProduct(){
            this.loading = true;
            this.uploadingImage();
            let api = `${this.api}api/${this.path}/admin/product`;
            let httpMethod = 'post';
            if(!this.isNew){
                api = `${this.api}api/${this.path}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            axios[httpMethod]( api, { data: this.tempProduct })
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        myModal.hide();
                        this.getProductList();
                    this.loading = false;
                    }else{
                        myModal.hide();
                        this.loading = false;
                    }
                })
        },
        deleteProduct(product){
            this.loading = true;
            axios.delete(`${this.api}api/${this.path}/admin/product/${product.id}`)
                .then(res=>{
                    console.log(res);
                    if(res.data.success){            
                        this.getProductList();
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                })
        },
        uploadingImage(){
            let imgKeys = Object.keys(this.uploadingImages);
            this.tempProduct.imagesUrl = [];
            imgKeys.forEach(key => {       
                this.tempProduct.imagesUrl.push(this.uploadingImages[key]);
            })
        },
        //前台商品圖片輪播
        changeIndex(index){
            this.activeImage = (index + this.imagesLength) % this.imagesLength;
        },
        changeSlide(mode){
            this.slideMode = mode;
        },
        setSlideInterval(){
            setInterval(()=>{
                this.slideMode = 'slide-right';
                this.activeImage ++;
                this.changeIndex(this.activeImage);
            },3000)
        }
    },
    mounted(){
        this.getProductList();
        myModal = new bootstrap.Modal(document.querySelector('#modal'));
        this.setSlideInterval();
    }
})
app.mount('#dashboard');