// ===== Local Storage Data =====
const DEFAULT_DATA = {
    headerTitle: 'Xưởng Dịch Vụ Taxi Ô Tô Vinfast Phương Đông',
    headerSubtitle: 'Chuyên sửa chữa, bảo dưỡng và nâng cấp xe ô tô',
    servicesSubtitle: 'Cung cấp các dịch vụ chất lượng cao cho xe ô tô của bạn',
    gallerySubtitle: 'Xem hình ảnh các dự án của chúng tôi',
    contactPhone: '02623 777 999',
    contactAddress: '569 Lê Duẩn, Phường Buôn Ma Thuột, Đắk Lắk',
    contactEmail: 'phuongdong@email.com'
};

// Tài khoản demo
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '123456'
};

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    loadSiteImages();
    loadGalleryImages();
    setupEventListeners();
});

// ===== Load Data from Storage =====
function loadDataFromStorage() {
    const storedData = JSON.parse(localStorage.getItem('websiteData')) || {};
    
    // Update page content with stored data
    const headerSubtitle = document.getElementById('headerSubtitle');
    if (headerSubtitle) headerSubtitle.textContent = storedData.headerSubtitle || DEFAULT_DATA.headerSubtitle;
    
    const servicesSubtitle = document.getElementById('servicesSubtitle');
    if (servicesSubtitle) servicesSubtitle.textContent = storedData.servicesSubtitle || DEFAULT_DATA.servicesSubtitle;
    
    const gallerySubtitle = document.getElementById('gallerySubtitle');
    if (gallerySubtitle) gallerySubtitle.textContent = storedData.gallerySubtitle || DEFAULT_DATA.gallerySubtitle;
    
    const contactPhone1 = document.getElementById('contactPhone1');
    if (contactPhone1) contactPhone1.textContent = storedData.contactPhone1 || DEFAULT_DATA.contactPhone;

    const contactPhone2 = document.getElementById('contactPhone2');
    if (contactPhone2) contactPhone2.textContent = storedData.contactPhone2 || DEFAULT_DATA.contactPhone;
    
    const contactAddress = document.getElementById('contactAddress');
    if (contactAddress) contactAddress.textContent = storedData.contactAddress || DEFAULT_DATA.contactAddress;
    
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail) contactEmail.textContent = storedData.contactEmail || DEFAULT_DATA.contactEmail;
    
    // Populate admin form with current data
    const headerSubtitleInput = document.getElementById('headerSubtitleInput');
    if (headerSubtitleInput) headerSubtitleInput.value = storedData.headerSubtitle || DEFAULT_DATA.headerSubtitle;
    
    const servicesSubtitleInput = document.getElementById('servicesSubtitleInput');
    if (servicesSubtitleInput) servicesSubtitleInput.value = storedData.servicesSubtitle || DEFAULT_DATA.servicesSubtitle;
    
    const gallerySubtitleInput = document.getElementById('gallerySubtitleInput');
    if (gallerySubtitleInput) gallerySubtitleInput.value = storedData.gallerySubtitle || DEFAULT_DATA.gallerySubtitle;
    
    // header title display + admin input
    const headerTitleDisplay = document.getElementById('headerTitleDisplay');
    if (headerTitleDisplay) headerTitleDisplay.textContent = storedData.headerTitle || DEFAULT_DATA.headerTitle;

    const headerTitleInput = document.getElementById('headerTitle');
    if (headerTitleInput) headerTitleInput.value = storedData.headerTitle || DEFAULT_DATA.headerTitle;
    
    const phone1Input = document.getElementById('phone1Input');
    if (phone1Input) phone1Input.value = storedData.contactPhone1 || DEFAULT_DATA.contactPhone;
    
    const phone2Input = document.getElementById('phone2Input');
    if (phone2Input) phone2Input.value = storedData.contactPhone2 || DEFAULT_DATA.contactPhone;
    
    const addressInput = document.getElementById('addressInput');
    if (addressInput) addressInput.value = storedData.contactAddress || DEFAULT_DATA.contactAddress;
    
    const emailInput = document.getElementById('emailInput');
    if (emailInput) emailInput.value = storedData.contactEmail || DEFAULT_DATA.contactEmail;
    
    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminDashboard();
    }
}

// ===== Load Gallery Images from Storage =====
function getGalleryImages() {
    const galleryImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    if (galleryImages.length > 0) return galleryImages;
    // fallback defaults
    return [
        { src: 'image/1.jpg', alt: 'Dự án 1' },
        { src: 'image/2.jpg', alt: 'Dự án 2' },
        { src: 'image/4.jpg', alt: 'Dự án 3' },
        { src: 'image/5.jpg', alt: 'Dự án 4' }
    ];
}

let carouselIndex = 0;
function loadGalleryImages() {
    const container = document.getElementById('galleryCarousel');
    if (!container) return;

    const images = getGalleryImages();
    
    // Build carousel markup
    container.innerHTML = `
        <div class="carousel" id="carousel">
            <button class="carousel-prev" id="carouselPrev">‹</button>
            <img id="carouselImg" src="${images[0].src}" alt="${images[0].alt}">
            <button class="carousel-next" id="carouselNext">›</button>
        </div>
        <div class="carousel-thumbs" id="carouselThumbs"></div>
    `;

    const thumbs = document.getElementById('carouselThumbs');
    images.forEach((img, i) => {
        const t = document.createElement('img');
        t.className = 'carousel-thumb' + (i === 0 ? ' active' : '');
        t.src = img.src;
        t.alt = img.alt;
        t.addEventListener('click', () => {
            carouselGoto(i);
            stopAutoSlide();
            startAutoSlide();
        });
        thumbs.appendChild(t);
    });

    // attach prev/next
    document.getElementById('carouselPrev').addEventListener('click', () => {
        carouselChange(-1);
        stopAutoSlide();
        startAutoSlide();
    });
    document.getElementById('carouselNext').addEventListener('click', () => {
        carouselChange(1);
        stopAutoSlide();
        startAutoSlide();
    });

    // click on main image opens lightbox at that index
    document.getElementById('carouselImg').addEventListener('click', () => openLightboxByIndex(carouselIndex));
    carouselIndex = 0;
    
    // Start auto-slide
    startAutoSlide();
}

let autoSlideInterval = null;

function startAutoSlide() {
    const images = getGalleryImages();
    autoSlideInterval = setInterval(() => {
        carouselChange(1);
    }, 4500);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Hamburger clicked!');
            navMenu.classList.toggle('active');
            console.log('Menu classes:', navMenu.className);
        });
        console.log('Hamburger click listener added');
    } else {
        console.error('Hamburger or navMenu not found!');
    }
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    const loginModal = document.getElementById('loginModal');
    window.addEventListener('click', function(event) {
        if (event.target == loginModal) {
            closeLoginModal();
        }
    });
    
    const lightbox = document.getElementById('lightbox');
    window.addEventListener('click', function(event) {
        if (event.target == lightbox) {
            closeLightbox();
        }
    });
}

// ===== Login Modal Functions =====
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        closeLoginModal();
        showAdminDashboard();
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Tên người dùng hoặc mật khẩu không đúng!\n\nDemo:\nUsername: admin\nPassword: 123456');
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('adminDashboard').style.display = 'none';
    document.querySelector('nav').style.display = 'block';
    document.querySelector('main') ? document.querySelector('main').style.display = 'block' : null;
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
    });
    document.querySelector('footer').style.display = 'block';
}

function showAdminDashboard() {
    // Hide main content
    document.querySelector('nav').style.display = 'block';
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector('footer').style.display = 'none';
    
    // Show admin dashboard
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Load current gallery list
    loadCurrentGalleryList();
}

// ===== Admin Tab Functions =====
function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ===== Save Content Functions =====
function saveContent() {
    const headerTitleVal = document.getElementById('headerTitle') ? document.getElementById('headerTitle').value : '';
    const data = {
        headerTitle: headerTitleVal,
        headerSubtitle: document.getElementById('headerSubtitleInput').value,
        servicesSubtitle: document.getElementById('servicesSubtitleInput').value,
        gallerySubtitle: document.getElementById('gallerySubtitleInput').value
    };
    
    // Merge with existing data
    const existingData = JSON.parse(localStorage.getItem('websiteData')) || {};
    const updatedData = { ...existingData, ...data };
    
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
    
    // Update page
    loadDataFromStorage();
    alert('Nội dung đã được lưu thành công!');
}

// ===== Site Images Management =====
function loadSiteImages() {
    const stored = JSON.parse(localStorage.getItem('siteImages')) || {};

    const headerImg = document.getElementById('headerImage');
    if (headerImg && stored.headerImage) headerImg.src = stored.headerImage;

    const aboutImg = document.getElementById('aboutImage');
    if (aboutImg && stored.aboutImage) aboutImg.src = stored.aboutImage;

    for (let i = 1; i <= 4; i++) {
        const key = 'serviceImg' + i;
        const el = document.getElementById(key);
        if (el && stored[key]) el.src = stored[key];
    }
}

function replaceSiteImage(key, input) {
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const stored = JSON.parse(localStorage.getItem('siteImages')) || {};
        stored[key] = e.target.result; // base64
        localStorage.setItem('siteImages', JSON.stringify(stored));
        updateSiteImages(key, e.target.result);
        alert('Ảnh đã được cập nhật.');
    };
    reader.readAsDataURL(file);
}

function updateSiteImages(key, src) {
    if (key === 'headerImage') {
        const el = document.getElementById('headerImage');
        if (el) el.src = src;
    } else if (key === 'aboutImage') {
        const el = document.getElementById('aboutImage');
        if (el) el.src = src;
    } else {
        const el = document.getElementById(key);
        if (el) el.src = src;
    }
}

function saveContact() {
    const data = {
        contactPhone1: document.getElementById('phone1Input').value,
        contactPhone2: document.getElementById('phone2Input').value,
        contactAddress: document.getElementById('addressInput').value,
        contactEmail: document.getElementById('emailInput').value
    };
    
    // Merge with existing data
    const existingData = JSON.parse(localStorage.getItem('websiteData')) || {};
    const updatedData = { ...existingData, ...data };
    
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
    
    // Update page
    loadDataFromStorage();
    alert('Thông tin liên hệ đã được lưu thành công!');
}

// ===== Gallery Image Functions =====
function loadCurrentGalleryList() {
    const galleryList = document.getElementById('currentGalleryList');
    galleryList.innerHTML = '';
    const galleryImages = getGalleryImages();
    galleryImages.forEach(imgData => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item-preview';
        itemDiv.innerHTML = `
            <img src="${imgData.src}" alt="${imgData.alt}">
            <button class="delete-btn" onclick="deleteGalleryItem('${imgData.src}')" title="Xóa ảnh">×</button>
        `;
        galleryList.appendChild(itemDiv);
    });
}

function uploadGalleryImages() {
    const fileInput = document.getElementById('galleryFileInput');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Vui lòng chọn ít nhất một ảnh!');
        return;
    }
    
    let filesProcessed = 0;
    const newImages = [];
    
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            newImages.push({
                src: e.target.result,
                alt: `Ảnh được tải lên ${filesProcessed + 1}`
            });
            
            filesProcessed++;
            
            // When all files are read
            if (filesProcessed === files.length) {
                // Get existing gallery images data
                const existingImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
                
                // Add new images
                const allImages = [...existingImages, ...newImages];
                
                // Save to localStorage
                localStorage.setItem('galleryImages', JSON.stringify(allImages));
                
                alert('Ảnh đã được tải lên thành công!');
                fileInput.value = '';
                loadCurrentGalleryList();
                loadGalleryImages();  // Cập nhật gallery trên trang chính
            }
        };
        
        reader.readAsDataURL(files[i]);
    }
}

// ===== Carousel control =====
function carouselChange(n) {
    const images = getGalleryImages();
    if (!images || images.length === 0) return;
    let newIndex = carouselIndex + n;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;
    carouselGoto(newIndex);
}

function carouselGoto(index) {
    const images = getGalleryImages();
    if (!images || images.length === 0) return;
    const imgEl = document.getElementById('carouselImg');
    if (!imgEl) return;

    const direction = index > carouselIndex ? 'left' : 'right';
    const outClass = 'slide-out-' + direction;
    const inClass = 'slide-in-' + direction;

    imgEl.classList.add(outClass);
    imgEl.addEventListener('animationend', function handlerOut() {
        imgEl.removeEventListener('animationend', handlerOut);
        imgEl.classList.remove(outClass);
        carouselIndex = index;
        imgEl.src = images[carouselIndex].src;
        imgEl.alt = images[carouselIndex].alt;
        imgEl.classList.add(inClass);
        imgEl.addEventListener('animationend', function handlerIn() {
            imgEl.removeEventListener('animationend', handlerIn);
            imgEl.classList.remove(inClass);
        });
    });

    // update active thumb
    const thumbs = document.querySelectorAll('.carousel-thumb');
    thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === carouselIndex);
    });
}

function openLightboxByIndex(index) {
    const images = getGalleryImages();
    if (!images || images.length === 0) return;
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = images[currentLightboxIndex].src;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function deleteGalleryItem(src) {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
        return;
    }
    
    const galleryImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    const filteredImages = galleryImages.filter(img => img.src !== src);
    
    localStorage.setItem('galleryImages', JSON.stringify(filteredImages));
    loadCurrentGalleryList();
    loadGalleryImages();  // Cập nhật gallery trên trang chính
    alert('Ảnh đã được xóa!');
}

// ===== Lightbox Functions =====
let currentLightboxIndex = 0;

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const img = element.querySelector ? element.querySelector('.gallery-img') : null;
    const lightboxImg = document.getElementById('lightboxImg');
    const images = getGalleryImages();
    if (img) {
        // find index by src
        for (let i = 0; i < images.length; i++) {
            if (images[i].src === img.src) {
                currentLightboxIndex = i;
                break;
            }
        }
        lightboxImg.src = img.src;
    } else if (images && images.length > 0) {
        currentLightboxIndex = 0;
        lightboxImg.src = images[0].src;
    }
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeLightboxImage(n) {
    const images = getGalleryImages();
    if (!images || images.length === 0) return;

    const lightboxImg = document.getElementById('lightboxImg');
    let newIndex = currentLightboxIndex + n;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;

    const direction = n > 0 ? 'left' : 'right';
    const outClass = 'slide-out-' + direction;
    const inClass = 'slide-in-' + direction;

    lightboxImg.classList.add(outClass);
    lightboxImg.addEventListener('animationend', function handlerOut() {
        lightboxImg.removeEventListener('animationend', handlerOut);
        lightboxImg.classList.remove(outClass);
        currentLightboxIndex = newIndex;
        lightboxImg.src = images[currentLightboxIndex].src;
        lightboxImg.classList.add(inClass);
        lightboxImg.addEventListener('animationend', function handlerIn() {
            lightboxImg.removeEventListener('animationend', handlerIn);
            lightboxImg.classList.remove(inClass);
        });
    });
}

// ===== Email Configuration =====
emailjs.init('YOUR_PUBLIC_KEY'); 

// ===== Contact Form Handler =====
function handleContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail_input').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Email parameters
    const templateParams = {
        to_email: 'phamgiaan545@gmail.com',
        from_name: name,
        from_email: email,
        subject: subject || 'Khách hàng liên hệ từ website',
        message: message,
        reply_to: email
    };
    
    // Gửi email
    emailjs.send('service_default', 'template_default', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            alert('Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ với bạn sớm.');
            form.reset();
        }, function(error) {
            console.error('Failed to send email:', error);
            alert('Gửi tin nhắn thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp.');
        });
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeLightbox();
    }
});

// ===== Scroll to Top Button =====
window.addEventListener('scroll', function() {
    // Có thể thêm các hiệu ứng scroll khác ở đây
});

// Uncomment để hiển thị thông tin demo trong console
console.log('%c🔑 Demo Credentials', 'color: #dc143c; font-size: 16px; font-weight: bold;');
