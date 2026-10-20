document.addEventListener('DOMContentLoaded', () => {
    // Mark slider ready
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) heroSlider.classList.add('js-loaded');

    /* -----------------------------------------------------------
       1. HERO SLIDER CONTROLLER (All 7 Local Slide Images)
       ----------------------------------------------------------- */
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const captionText = document.getElementById('slideCaptionText');
    const heroSection = document.querySelector('.hero');

    const slideCaptions = [
        "Featured Project: Continuous Linear Slot Diffusers in Luxury Ceiling",
        "Featured Project: Geometric Coffered Ceiling HVAC Installation",
        "Featured Project: Commercial Exhaust Ducting & Kitchen Ventilation",
        "Featured Project: Architectural Timber Louvers with Integrated Diffusers",
        "Featured Project: Minimalist Hall Ceiling with Concealed Air Supply",
        "Featured Project: Parametric Triangular Ceiling AC Slot Grilles",
        "Featured Project: Continuous High-Ceiling Linear Diffuser Terminal"
    ];

    let currentSlide = 0;
    let slideTimer = null;

    function goToSlide(index) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        if (captionText && slideCaptions[currentSlide]) {
            captionText.textContent = slideCaptions[currentSlide];
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideTimer() {
        stopSlideTimer();
        slideTimer = setInterval(nextSlide, 5000);
    }

    function stopSlideTimer() {
        if (slideTimer) clearInterval(slideTimer);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            startSlideTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            startSlideTimer();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            goToSlide(idx);
            startSlideTimer();
        });
    });

    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideTimer);
        heroSection.addEventListener('mouseleave', startSlideTimer);
    }

    startSlideTimer();

    /* -----------------------------------------------------------
       2. MOBILE MENU TOGGLE
       ----------------------------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    /* -----------------------------------------------------------
       3. INTERACTIVE AC TONNAGE & COOLING CALCULATOR
       ----------------------------------------------------------- */
    const roomAreaRange = document.getElementById('roomAreaRange');
    const roomAreaVal = document.getElementById('roomAreaVal');
    const sunOptions = document.querySelectorAll('#sunOptions .calc-toggle-btn');
    const sunVal = document.getElementById('sunExposureVal');
    const ceilingOptions = document.querySelectorAll('#ceilingOptions .calc-toggle-btn');
    const ceilingVal = document.getElementById('ceilingHeightVal');
    const resultTonnage = document.getElementById('resultTonnage');
    const resultBTU = document.getElementById('resultBTU');
    const resultAdvice = document.getElementById('resultAdvice');
    const applyCalcBtn = document.getElementById('applyCalcBtn');
    const projectDetails = document.getElementById('projectDetails');
    const serviceTypeSelect = document.getElementById('serviceType');

    let currentArea = 350;
    let currentSun = 'medium';
    let currentCeiling = 'standard';

    function calculateCooling() {
        if (!resultTonnage || !resultBTU || !resultAdvice) return;
        // Base BTU: ~20 BTU per sq ft
        let baseBtu = currentArea * 20;

        // Sun exposure modifier
        let sunMultiplier = 1.0;
        if (currentSun === 'medium') sunMultiplier = 1.15;
        if (currentSun === 'high') sunMultiplier = 1.30;

        // Ceiling height modifier
        let ceilingMultiplier = 1.0;
        if (currentCeiling === 'medium') ceilingMultiplier = 1.15;
        if (currentCeiling === 'high') ceilingMultiplier = 1.30;

        let totalBtu = Math.round(baseBtu * sunMultiplier * ceilingMultiplier);

        // Round to common tonnage (1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0)
        let rawTons = totalBtu / 12000;
        let recommendedTons = Math.ceil(rawTons * 2) / 2;
        if (recommendedTons < 1.0) recommendedTons = 1.0;

        resultTonnage.innerHTML = `${recommendedTons.toFixed(1)} <span>TON</span>`;
        resultBTU.textContent = `${totalBtu.toLocaleString()} BTU/hr Estimated Capacity`;

        // Recommendation text
        if (recommendedTons <= 1.5) {
            resultAdvice.innerHTML = `<strong>Optimal System:</strong> High-efficiency Inverter High-Wall Split or Mini-Ducted unit with silent air filtration.`;
        } else if (recommendedTons <= 3.0) {
            resultAdvice.innerHTML = `<strong>Optimal System:</strong> Inverter Concealed Ducted AC paired with continuous Linear Slot Diffusers for quiet, even cooling.`;
        } else {
            resultAdvice.innerHTML = `<strong>Optimal System:</strong> Multi-Split VRF / VRV System with motorized zone dampers and custom ceiling linear grilles.`;
        }
    }

    if (roomAreaRange) {
        roomAreaRange.addEventListener('input', (e) => {
            currentArea = parseInt(e.target.value, 10);
            if (roomAreaVal) roomAreaVal.textContent = `${currentArea} Sq. Ft`;
            calculateCooling();
        });
    }

    sunOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            sunOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSun = btn.getAttribute('data-value');
            if (sunVal) sunVal.textContent = btn.textContent;
            calculateCooling();
        });
    });

    ceilingOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            ceilingOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCeiling = btn.getAttribute('data-value');
            if (ceilingVal) ceilingVal.textContent = btn.textContent;
            calculateCooling();
        });
    });

    // "Quote This Capacity" button autofill
    if (applyCalcBtn) {
        applyCalcBtn.addEventListener('click', () => {
            const tonnageText = resultTonnage ? resultTonnage.textContent.trim() : '2.0 TON';
            const btuText = resultBTU ? resultBTU.textContent.trim() : '24,000 BTU/hr';
            if (projectDetails) {
                projectDetails.value = `Calculated Requirement: ${tonnageText} (${btuText}) for approx ${currentArea} Sq. Ft room area. Please provide an estimate for installation with linear slot diffusers.`;
            }
            if (serviceTypeSelect) {
                serviceTypeSelect.value = 'New AC Installation / VRF';
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    calculateCooling();

    /* -----------------------------------------------------------
       4. PROJECT GALLERY FILTER & LIGHTBOX MODAL
       ----------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const projectModal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const successModal = document.getElementById('successModal');

    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Modal Open
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.getAttribute('data-img');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');

            if (modalImg && modalTitle && modalDesc && projectModal) {
                modalImg.src = img;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                projectModal.classList.add('open');
            }
        });
    });

    // Lightbox Modal Close
    function closeModal() {
        if (projectModal) projectModal.classList.remove('open');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (successModal) successModal.classList.remove('open');
        }
    });

    /* -----------------------------------------------------------
       5. QUOTE FORM SUBMISSION CONFIRMATION
       ----------------------------------------------------------- */
    const quoteForm = document.getElementById('quoteForm');
    const successCloseBtn = document.getElementById('successCloseBtn');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (successModal) successModal.classList.add('open');
            quoteForm.reset();
        });
    }

    if (successCloseBtn && successModal) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('open');
        });
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) successModal.classList.remove('open');
        });
    }
});
