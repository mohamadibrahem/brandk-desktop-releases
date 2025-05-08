<template>
    <!-- ======= Header ======= -->
    <header class="header fixed-top d-flex align-items-center" id="header">
      <div class="d-flex align-items-center justify-content-between">
        <RouterLink class="logo d-flex align-items-center" to="/">
          <img src="@/assets/img/logo.png" alt="Logo" />
          <span class="d-none d-lg-block">NiceAdmin</span>
        </RouterLink>
        <i class="bi bi-list toggle-sidebar-btn"></i>
      </div>
  
      <div class="search-bar">
        <form class="search-form d-flex align-items-center" method="POST">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search">
            <i class="bi bi-search"></i>
          </button>
        </form>
      </div>
  
      <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">
          <!-- Search Icon (mobile) -->
          <li class="nav-item d-block d-lg-none">
            <a class="nav-link nav-icon search-bar-toggle" href="#">
              <i class="bi bi-search"></i>
            </a>
          </li>
  
          <!-- Notifications -->
          <li class="nav-item dropdown">
            <a class="nav-link nav-icon" data-bs-toggle="dropdown" href="#">
              <i class="bi bi-bell"></i>
              <span class="badge bg-primary badge-number">4</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
              <li class="dropdown-header">
                You have 4 new notifications
                <RouterLink to="/notifications">
                  <span class="badge rounded-pill bg-primary p-2 ms-2">View all</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="notification-item">
                <i class="bi bi-exclamation-circle text-warning"></i>
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>30 min. ago</p>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="notification-item">
                <i class="bi bi-x-circle text-danger"></i>
                <div>
                  <h4>Atque rerum nesciunt</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>1 hr. ago</p>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="notification-item">
                <i class="bi bi-check-circle text-success"></i>
                <div>
                  <h4>Sit rerum fuga</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>2 hrs. ago</p>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="notification-item">
                <i class="bi bi-info-circle text-primary"></i>
                <div>
                  <h4>Dicta reprehenderit</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>4 hrs. ago</p>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="dropdown-footer">
                <RouterLink to="/notifications">Show all notifications</RouterLink>
              </li>
            </ul>
          </li>
  
          <!-- Messages -->
          <li class="nav-item dropdown">
            <a class="nav-link nav-icon" data-bs-toggle="dropdown" href="#">
              <i class="bi bi-chat-left-text"></i>
              <span class="badge bg-success badge-number">3</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
              <li class="dropdown-header">
                You have 3 new messages
                <RouterLink to="/messages">
                  <span class="badge rounded-pill bg-primary p-2 ms-2">View all</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="message-item">
                <RouterLink to="/messages">
                  <img src="@/assets/img/messages-1.jpg" class="rounded-circle" alt="" />
                  <div>
                    <h4>Maria Hudson</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>4 hrs. ago</p>
                  </div>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="message-item">
                <RouterLink to="/messages">
                  <img src="@/assets/img/messages-2.jpg" class="rounded-circle" alt="" />
                  <div>
                    <h4>Anna Nelson</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>6 hrs. ago</p>
                  </div>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="message-item">
                <RouterLink to="/messages">
                  <img src="@/assets/img/messages-3.jpg" class="rounded-circle" alt="" />
                  <div>
                    <h4>David Muldon</h4>
                    <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                    <p>8 hrs. ago</p>
                  </div>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li class="dropdown-footer">
                <RouterLink to="/messages">Show all messages</RouterLink>
              </li>
            </ul>
          </li>
  
          <!-- Profile -->
          <li class="nav-item dropdown pe-3">
            <a class="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown" href="#">
              <img src="@/assets/img/profile-img.jpg" class="rounded-circle" alt="Profile" />
              <span class="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li class="dropdown-header">
                <h6>Kevin Anderson</h6>
                <span>Web Designer</span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center" to="/profile">
                  <i class="bi bi-person"></i><span>My Profile</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center" to="/settings">
                  <i class="bi bi-gear"></i><span>Account Settings</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center" to="/help">
                  <i class="bi bi-question-circle"></i><span>Need Help?</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink class="dropdown-item d-flex align-items-center" to="/logout">
                  <i class="bi bi-box-arrow-right"></i><span>Sign Out</span>
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script setup>
  // لا حاجة لمنطق حاليا
  </script>
  