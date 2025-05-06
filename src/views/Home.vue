<template>
    <div>
      <h2>الصفحة الرئيسية</h2>
      <p>مرحبا بك في تطبيق براندك.</p>
      <div class="container mt-5">
        <div class="row">
        <div class="col-md-4" v-for="product in products" :key="product.id">
            <div class="card mb-5">
              <img :src="product.image" :alt="product.name" class="card-img-top" />
              <div class="card-body">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text">{{ product.description }}</p>
                  <button class="btn btn-primary">شراء الآن</button>
              </div>
            </div>
        </div>
        </div>
    </div>

    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      products: [
        { id: 1, name: 'منتج 1', description: 'وصف المنتج 1', image: 'https://brandk.project/storage/98/2.jpg' },
        { id: 2, name: 'منتج 2', description: 'وصف المنتج 2', image: 'https://brandk.project/storage/98/2.jpg' },
        { id: 3, name: 'منتج 3', description: 'وصف المنتج 3', image: 'https://brandk.project/storage/98/2.jpg' }
      ]
    };
  }
};
</script>

  
  