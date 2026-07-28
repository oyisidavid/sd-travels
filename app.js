document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initBottomNav(); 
    initFooter(); // Run before reveal animations so they are observed
    initRevealAnimations(); 
    initTiltEffect(); // 21st.dev effect
    initFAQ();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = 'light';
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        currentTheme = 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icons = document.querySelectorAll('.theme-toggle i, .mobile-theme-toggle i');
    icons.forEach(icon => {
        if (newTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

function initHeader() {
    const headerHTML = `
        <div class="header-container container">
            <div class="logo">
                <a href="index.html">
                    <i class="fa-solid fa-plane-departure" style="color: var(--accent-color);"></i>
                    SD <span>Travels</span>
                </a>
            </div>
            <nav id="main-nav">
                <ul>
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="about.html" class="nav-link">About Us</a></li>
                    <li><a href="services.html" class="nav-link">Services</a></li>
                    <li><a href="corporate.html" class="nav-link">Corporate</a></li>
                    <li><a href="news.html" class="nav-link">News</a></li>
                    <li><a href="faq.html" class="nav-link">FAQs</a></li>
                    <li><a href="partner.html" class="nav-link">Partner</a></li>
                    <li><a href="contact.html" class="nav-link nav-cta">Contact Us</a></li>
                </ul>
                <button class="theme-toggle" id="theme-toggle" title="Toggle Dark/Light Mode">
                    <i class="fa-solid fa-moon"></i>
                </button>
            </nav>
        </div>
    `;

    const header = document.createElement('header');
    header.innerHTML = headerHTML;
    document.body.insertBefore(header, document.body.firstChild);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = themeBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        themeBtn.addEventListener('click', toggleTheme);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.height = '80px';
            const headerContainer = document.querySelector('.header-container');
            if(headerContainer) headerContainer.style.height = '80px';
        } else {
            header.style.boxShadow = 'none';
            header.style.height = '90px';
            const headerContainer = document.querySelector('.header-container');
            if(headerContainer) headerContainer.style.height = '90px';
        }
    });
}

function initBottomNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = currentPage === 'index.html' ? 'active' : '';
    const isServices = currentPage.includes('services') || currentPage.includes('flight') || currentPage.includes('visa') ? 'active' : '';
    const isContact = currentPage === 'contact.html' ? 'active' : '';

    const bottomNavHTML = `
        <div class="mobile-bottom-nav">
            <div class="bottom-nav-list">
                <a href="index.html" class="bottom-nav-item ${isHome}">
                    <i class="fa-solid fa-house"></i>
                    <span>Home</span>
                </a>
                <a href="services.html" class="bottom-nav-item ${isServices}">
                    <i class="fa-solid fa-plane"></i>
                    <span>Services</span>
                </a>
                <a href="contact.html" class="bottom-nav-item ${isContact}">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Contact</span>
                </a>
                <button class="bottom-nav-item mobile-theme-toggle" title="Theme">
                    <i class="fa-solid fa-moon"></i>
                    <span>Theme</span>
                </button>
                <button class="bottom-nav-item" id="bottom-menu-btn">
                    <i class="fa-solid fa-bars"></i>
                    <span>Menu</span>
                </button>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = bottomNavHTML;
    document.body.appendChild(div.firstElementChild);

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeBtnMobile = document.querySelector('.mobile-theme-toggle');
    if (themeBtnMobile) {
        const icon = themeBtnMobile.querySelector('i');
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        themeBtnMobile.addEventListener('click', toggleTheme);
    }

    const menuBtn = document.getElementById('bottom-menu-btn');
    const navList = document.querySelector('#main-nav ul');
    
    if(menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('show');
            const icon = menuBtn.querySelector('i');
            if(navList.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
}

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);
    
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
}

function initFooter() {
    const footerHTML = `
        <div class="container">
            <div class="footer-grid reveal reveal-up">
                <div class="footer-col">
                    <h4>SD Travels & Logistics Ltd</h4>
                    <p>Integrity in Every Journey.</p>
                    <p>We simplify international travel, immigration, logistics, document processing, recruitment, and business mobility.</p>
                    <div class="social-links">
                        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="services.html">Our Services</a></li>
                        <li><a href="corporate.html">Corporate Services</a></li>
                        <li><a href="partner.html">Partner With Us</a></li>
                        <li><a href="news.html">News & Updates</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Our Services</h4>
                    <ul class="footer-links">
                        <li><a href="services.html#flight">Flight Booking</a></li>
                        <li><a href="services.html#visa">Visa Services</a></li>
                        <li><a href="services.html#study">Study Abroad</a></li>
                        <li><a href="services.html#logistics">Logistics & Freight</a></li>
                        <li><a href="services.html#recruitment">International Recruitment</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact Info</h4>
                    <ul class="footer-links">
                        <li><i class="fa-solid fa-phone" style="color: var(--accent-color); margin-right: 10px;"></i> +234 906 856 5467</li>
                        <li><i class="fa-solid fa-phone" style="color: var(--accent-color); margin-right: 10px;"></i> +234 805 944 1808</li>
                        <li><i class="fa-solid fa-envelope" style="color: var(--accent-color); margin-right: 10px;"></i> info@sdtravelsandlogistics.com</li>
                        <li><i class="fa-solid fa-location-dot" style="color: var(--accent-color); margin-right: 10px;"></i> Abuja, Nigeria</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom reveal reveal-up">
                <p>&copy; ${new Date().getFullYear()} SD Travels & Logistics Ltd. All Rights Reserved.</p>
            </div>
        </div>
    `;

    const footer = document.createElement('footer');
    footer.innerHTML = footerHTML;
    document.body.appendChild(footer);
}

function initFAQ() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if(header) {
            header.addEventListener('click', () => {
                accordions.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
}

function initTiltEffect() {
    // 21st.dev style 3D tilt logic for Bento cards
    const cards = document.querySelectorAll('.bento-grid .card');
    
    // Only apply on desktop where we have hover
    if (window.matchMedia("(min-width: 768px)").matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate rotation based on cursor position (-5deg to 5deg)
                const rotateX = ((y / rect.height) - 0.5) * -10;
                const rotateY = ((x / rect.width) - 0.5) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Dynamic Glare effect updating custom properties
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset on mouse leave
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
}
