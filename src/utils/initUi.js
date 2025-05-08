// src/assets/js/initUi.js

export function initSidebarToggle() {
  const toggleBtn = document.querySelector('.toggle-sidebar-btn')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('toggle-sidebar')
    })
  }
}

export function initSearchBarToggle() {
  const toggleBtn = document.querySelector('.search-bar-toggle')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.querySelector('.search-bar')?.classList.toggle('search-bar-show')
    })
  }
}

export function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((el) => {
    new bootstrap.Tooltip(el)
  })
}

export function initQuillEditors() {
  const quillEditors = document.querySelectorAll('.quill-editor-default')
  quillEditors.forEach((el) => {
    new Quill(el, { theme: 'snow' })
  })
}

export function initTinyMCE() {
  if (typeof tinymce !== 'undefined') {
    tinymce.init({
      selector: 'textarea.tinymce-editor',
      plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount',
      toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
    })
  }
}

export function initFormValidation() {
  const needsValidationForms = document.querySelectorAll('.needs-validation')
  needsValidationForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault()
        e.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
}

export function initDataTables() {
  const dataTables = document.querySelectorAll('.datatable')
  dataTables.forEach((el) => {
    new simpleDatatables.DataTable(el)
  })
}

export function initApexChartsResize() {
  const mainContainer = document.querySelector('#main')
  if (mainContainer) {
    new ResizeObserver(() => {
      document.querySelectorAll('.apexcharts-canvas').forEach((el) => {
        el.style.width = '100%'
      })
    }).observe(mainContainer)
  }
}

export function initEchartsResize() {
  const mainContainer = document.querySelector('#main')
  if (mainContainer) {
    new ResizeObserver(() => {
      document.querySelectorAll('.echart').forEach((el) => {
        echarts.getInstanceByDom(el)?.resize()
      })
    }).observe(mainContainer)
  }
}

export function initScrollTop() {
  const scrollTop = document.querySelector('.scroll-top')
  if (!scrollTop) return

  const toggleScrollTop = () => {
    scrollTop.classList.toggle('active', window.scrollY > 100)
  }

  window.addEventListener('load', toggleScrollTop)
  document.addEventListener('scroll', toggleScrollTop)

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

export function initGLightbox() {
  GLightbox({ selector: '.glightbox' })
}
