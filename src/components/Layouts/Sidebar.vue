<template>
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">
            <i class="bi bi-grid"></i>
            <span>الرئيسية</span>
          </router-link>
        </li>
  
        <li class="nav-item">
          <router-link to="/orders" class="nav-link" :class="{ active: isActive('/orders') }">
            <i class="bi bi-bag-check"></i>
            <span>الطلبات</span>
          </router-link>
        </li>
  
        <li class="nav-item">
          <router-link to="/products" class="nav-link" :class="{ active: isActive('/products') }">
            <i class="bi bi-box-seam"></i>
            <span>المنتجات</span>
          </router-link>
        </li>
  
        <li class="nav-item">
          <router-link to="/sales" class="nav-link" :class="{ active: isActive('/sales') }">
            <i class="bi bi-cash-coin"></i>
            <span>بيع</span>
          </router-link>
        </li>
  
        <li class="nav-item">
          <router-link to="/coupons" class="nav-link" :class="{ active: isActive('/coupons') }">
            <i class="bi bi-ticket-detailed"></i>
            <span>كوبونات الخصم</span>
          </router-link>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-toggle="collapse" href="#components-nav" aria-expanded="false">
                <i class="bi bi-menu-button-wide"></i>
                <span>Components</span>
                <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="components-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
                <li>
                <a href="components-alerts.html">
                    <i class="bi bi-circle"></i><span>Alerts</span>
                </a>
                </li>
                <li>
                <a href="components-accordion.html">
                    <i class="bi bi-circle"></i><span>Accordion</span>
                </a>
                </li>
                <li>
                <a href="components-badges.html">
                    <i class="bi bi-circle"></i><span>Badges</span>
                </a>
                </li>
                <li>
                <a href="components-breadcrumbs.html">
                    <i class="bi bi-circle"></i><span>Breadcrumbs</span>
                </a>
                </li>
                <li>
                <a href="components-buttons.html">
                    <i class="bi bi-circle"></i><span>Buttons</span>
                </a>
                </li>
                <li>
                <a href="components-cards.html">
                    <i class="bi bi-circle"></i><span>Cards</span>
                </a>
                </li>
                <li>
                <a href="components-carousel.html">
                    <i class="bi bi-circle"></i><span>Carousel</span>
                </a>
                </li>
                <li>
                <a href="components-list-group.html">
                    <i class="bi bi-circle"></i><span>List Group</span>
                </a>
                </li>
                <li>
                <a href="components-modal.html">
                    <i class="bi bi-circle"></i><span>Modal</span>
                </a>
                </li>
                <li>
                <a href="components-tabs.html">
                    <i class="bi bi-circle"></i><span>Tabs</span>
                </a>
                </li>
                <li>
                <a href="components-pagination.html">
                    <i class="bi bi-circle"></i><span>Pagination</span>
                </a>
                </li>
                <li>
                <a href="components-progress.html">
                    <i class="bi bi-circle"></i><span>Progress</span>
                </a>
                </li>
                <li>
                <a href="components-spinners.html">
                    <i class="bi bi-circle"></i><span>Spinners</span>
                </a>
                </li>
                <li>
                <a href="components-tooltips.html">
                    <i class="bi bi-circle"></i><span>Tooltips</span>
                </a>
                </li>
            </ul>
            </li>

      </ul>
    </aside>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { onMounted, watch } from 'vue'
  
  const route = useRoute()
  
  const isActive = (path) => route.path === path

    watch(() => route.fullPath, () => {
        // عند تغيير المسار، احذف كلاس فتح السايدبار
        document.body.classList.remove('toggle-sidebar')
    })
  </script>
  
  <style scoped>

  </style>
  