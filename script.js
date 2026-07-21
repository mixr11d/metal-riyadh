/**
 * نظام التتبع المركزي وتفاعل المستخدم للموقع الإعلاني
 * تطوير متوافق مع معايير CRO وتجربة الهاتف المحمول
 */

// ==========================================
// أولاً: متغيرات تكوين حملة جوجل الإعلانية (Google Ads Setup)
// ==========================================
const GOOGLE_ADS_ID = "AW-18339402313";               
const CALL_CONVERSION_LABEL = "VU9DCMeCm9QcEMmk9KhE";       
const WHATSAPP_CONVERSION_LABEL = "F88zCPS-l9QcEMmk9KhE";   
const FORM_CONVERSION_LABEL = "UdPXCITygNQcEMmk9KhE";       

// رقم العميل الأساسي والمطور (الصيغة الكاملة)
const CLIENT_PHONE = "0556492570";      
const DEV_PHONE = "0578539687";         

// [تعديل هامي] استخلاص الأرقام الـ 9 الأساسية لضمان دقة التتبع مع الصيغ الدولية والمحلية
const CLIENT_PHONE_CORE = "556492570";
const DEV_PHONE_CORE = "578539687";

// ==========================================
// ثانياً: تهيئة وحقن سكربت التتبع الإعلاني (Dynamic Google Tag Injection)
// ==========================================
(function initGoogleTracking() {
    if (GOOGLE_ADS_ID && GOOGLE_ADS_ID.trim() !== "") {
        const scriptElement = document.createElement("script");
        scriptElement.async = true;
        scriptElement.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
        document.head.appendChild(scriptElement);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        
        window.gtag("js", new Date());
        window.gtag("config", GOOGLE_ADS_ID);
        console.log("Google Ads Gtag initialized successfully.");
    } else {
        window.gtag = function() {
            console.log("Simulated Gtag Event:", arguments);
        };
    }
})();

/**
 * دالة مركزية لإرسال أحداث التحويل الإعلاني بأمان
 */
function sendGoogleConversion(label) {
    if (GOOGLE_ADS_ID && label && label.trim() !== "") {
        window.gtag("event", "conversion", {
            "send_to": `${GOOGLE_ADS_ID}/${label}`
        });
        console.log(`Conversion triggered for label: ${label}`);
    }
}

// ==========================================
// ثالثاً: تتبع النقرات التفاعلية (الاتصال والواتساب للعميل فقط)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. التقاط أحداث الاتصال الهاتفي (باستخدام الجزء الأساسي من الرقم)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const phoneNumber = this.getAttribute("href").replace("tel:", "").trim();
            // التحقق المرن للتأكد من مطابقة الرقم الأساسي للعميل واجتناب المطور
            if (phoneNumber.includes(CLIENT_PHONE_CORE) && !phoneNumber.includes(DEV_PHONE_CORE)) {
                sendGoogleConversion(CALL_CONVERSION_LABEL);
            }
        });
    });

    // 2. التقاط أحداث النقر على روابط الواتساب
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const urlString = this.getAttribute("href");
            // التحقق المرن للتأكد من توجيه الرسالة لرقم العميل الإعلاني وليس المطور
            if (urlString.includes(CLIENT_PHONE_CORE) && !urlString.includes(DEV_PHONE_CORE)) {
                sendGoogleConversion(WHATSAPP_CONVERSION_LABEL);
            }
        });
    });
});

// ==========================================
// رابعاً: معالجة نموذج جمع البيانات الذكي (Interactive Lead Form)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const leadForm = document.getElementById("leadForm");
    
    if (leadForm) {
        leadForm.addEventListener("submit", function(e) {
            e.preventDefault(); 
            
            const submitBtn = document.getElementById("submitBtn");
            const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
            const btnSpinner = submitBtn ? submitBtn.querySelector(".btn-spinner") : null;
            
            if (submitBtn) submitBtn.disabled = true;
            if (btnText && btnSpinner) {
                btnText.style.opacity = "0.6";
                btnSpinner.classList.remove("hidden");
            }

            // استخلاص البيانات المدخلة من النموذج
            const name = document.getElementById("client_name").value.trim();
            const phone = document.getElementById("client_phone").value.trim();
            const district = document.getElementById("client_district").value.trim();
            const service = document.getElementById("service_type").value;

            // إرسال حدث التحويل لجوجل أولاً
            sendGoogleConversion(FORM_CONVERSION_LABEL);

            // صياغة رسالة الواتساب الاحترافية للعميل
            const baseText = `السلام عليكم ورحمة الله وبركاته\n\n` +
                             `أرغب في طلب معاينة مجانية عبر الموقع الإلكتروني:\n\n` +
                             `👤 *الاسم الكريم:* ${name}\n` +
                             `📱 *رقم الجوال:* ${phone}\n` +
                             `📍 *الحي/المنطقة:* ${district}\n` +
                             `🛠️ *نوع الخدمة:* ${service}\n\n` +
                             `أرجو التواصل لتحديد موعد الزيارة الميدانية وتأكيد السعر.`;

            const encodedMessage = encodeURIComponent(baseText);
            
            // استخدام الرقم الأساسي المستخلص لبناء الرابط بشكل سليم
            const whatsappRedirectURL = `https://wa.me/966${CLIENT_PHONE_CORE}?text=${encodedMessage}`;

            // تأخير خفيف لضمان إرسال بكسل التتبع قبل تحويل الصفحة للواتساب
            setTimeout(() => {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText && btnSpinner) {
                    btnText.style.opacity = "1";
                    btnSpinner.classList.add("hidden");
                }
                window.location.href = whatsappRedirectURL;
            }, 400); // زيادة التأخير قليلاً إلى 400ms لزيادة ضمان وصول البيانات لجوجل
        });
    }
});

// ==========================================
// خامساً: التفاعلات البرمجية لواجهة المستخدم على الجوال (Mobile UX UI)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تفعيل وإغلاق قائمة الهامبرغر
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle("open");
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove("open");
                navMenu.classList.remove("active");
            }
        });
    }

    // 2. تفعيل القائمة المنسدلة للخدمات بالضغط
    const servicesDropdown = document.getElementById("servicesDropdown");
    const servicesMenu = document.getElementById("servicesMenu");

    if (servicesDropdown && servicesMenu) {
        servicesDropdown.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = servicesDropdown.getAttribute("aria-expanded") === "true";
            servicesDropdown.setAttribute("aria-expanded", !isExpanded);
            servicesMenu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!servicesDropdown.contains(e.target) && !servicesMenu.contains(e.target)) {
                servicesDropdown.setAttribute("aria-expanded", "false");
                servicesMenu.classList.remove("show");
            }
        });
    }

    // 3. زر الصعود للأعلى
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                scrollToTopBtn.classList.add("visible");
            } else {
                scrollToTopBtn.classList.remove("visible");
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
