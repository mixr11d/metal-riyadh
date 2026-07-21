/**
 * نظام التتبع المركزي وتفاعل المستخدم للموقع الإعلاني
 * تطوير متوافق مع معايير CRO وتجربة الهاتف المحمول
 */

// ==========================================
// أولاً: متغيرات تكوين حملة جوجل الإعلانية (Google Ads Setup)
// يمكن تعديل هذه القيم مباشرة عند إطلاق الحملة لتفعيل التتبع التلقائي
// ==========================================
const GOOGLE_ADS_ID = "AW-18339402313";               // ضع هنا معرّف التتبع الخاص بك مثل: AW-123456789
const CALL_CONVERSION_LABEL = "VU9DCMeCm9QcEMmk9KhE";       // ملصق تحويل الاتصال الهاتفي (مثال: abCdEfGhIjKlMnOpQ)
const WHATSAPP_CONVERSION_LABEL = "F88zCPS-l9QcEMmk9KhE";   // ملصق تحويل نقرات الواتساب (مثال: opQrStUvWxYzAbCdE)
const FORM_CONVERSION_LABEL = "UdPXCITygNQcEMmk9KhE";       // ملصق تحويل نموذج البيانات (مثال: yZAbCdEfGhIjKlMnOp)

const CLIENT_PHONE = "0556492570";      // رقم العميل الإعلاني الأساسي المستهدف بالتتبع
const DEV_PHONE = "0578539687";         // رقم المطور الرعد التقني (يتم استبعاده تلقائياً من التتبع)

// ==========================================
// ثانياً: تهيئة وحقن سكربت التتبع الإعلاني (Dynamic Google Tag Injection)
// ==========================================
(function initGoogleTracking() {
    if (GOOGLE_ADS_ID && GOOGLE_ADS_ID.trim() !== "") {
        // إنشاء وحقن مكتبة gtag.js ديناميكياً
        const scriptElement = document.createElement("script");
        scriptElement.async = true;
        scriptElement.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
        document.head.appendChild(scriptElement);

        // إعداد دالة gtag المعتمدة
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        
        // تفعيل الإعدادات الأساسية
        window.gtag("js", new Date());
        window.gtag("config", GOOGLE_ADS_ID);
        console.log("Google Ads Gtag initialized successfully.");
    } else {
        // دالة وهمية بديلة لمنع حدوث أخطاء برمجية في بيئة التطوير قبل وضع المعرّف
        window.gtag = function() {
            console.log("Simulated Gtag Event:", arguments);
        };
    }
})();

/**
 * دالة مركزية لإرسال أحداث التحويل الإعلاني بأمان
 * @param {string} label ملصق التحويل المطلوب
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
    
    // 1. التقاط أحداث الاتصال الهاتفي للرقم المخصص للعميل
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const phoneNumber = this.getAttribute("href").replace("tel:", "").trim();
            // تتبع التحويل فقط إذا كان الاتصال موجهاً لرقم العميل وتجنب رقم المطور
            if (phoneNumber.includes(CLIENT_PHONE)) {
                sendGoogleConversion(CALL_CONVERSION_LABEL);
            }
        });
    });

    // 2. التقاط أحداث النقر على روابط الواتساب للعميل
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const urlString = this.getAttribute("href");
            // تتبع التحويل فقط إذا كان الرابط موجهاً لرقم العميل وتجنب رقم المطور
            if (urlString.includes(CLIENT_PHONE) && !urlString.includes(DEV_PHONE)) {
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
            e.preventDefault(); // إيقاف إعادة تحميل الصفحة الافتراضية
            
            const submitBtn = document.getElementById("submitBtn");
            const btnText = submitBtn.querySelector(".btn-text");
            const btnSpinner = submitBtn.querySelector(".btn-spinner");
            
            // قفل زر الإرسال وعرض مؤشر التحميل المؤقت
            submitBtn.disabled = true;
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

            // صياغة رسالة الواتساب الاحترافية المنسقة للعميل الإعلاني
            const baseText = `السلام عليكم ورحمة الله وبركاته\n\n` +
                             `أرغب في طلب معاينة مجانية عبر الموقع الإلكتروني:\n\n` +
                             `👤 *الاسم الكريم:* ${name}\n` +
                             `📱 *رقم الجوال:* ${phone}\n` +
                             `📍 *الحي/المنطقة:* ${district}\n` +
                             `🛠️ *نوع الخدمة:* ${service}\n\n` +
                             `أرجو التواصل لتحديد موعد الزيارة الميدانية وتأكيد السعر.`;

            const encodedMessage = encodeURIComponent(baseText);
            const whatsappRedirectURL = `https://wa.me/966${CLIENT_PHONE.substring(1)}?text=${encodedMessage}`;

            // تأخير خفيف جداً لضمان اكتمال معالجة الطلب في بكسل التتبع قبل الانتقال
            setTimeout(() => {
                // إعادة تعيين حالة الزر قبل المغادرة
                submitBtn.disabled = false;
                if (btnText && btnSpinner) {
                    btnText.style.opacity = "1";
                    btnSpinner.classList.add("hidden");
                }
                
                // توجيه العميل فوراً إلى تطبيق الواتساب
                window.location.href = whatsappRedirectURL;
            }, 350);
        });
    }
});

// ==========================================
// خامساً: التفاعلات البرمجية لواجهة المستخدم على الجوال (Mobile UX UI)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. تفعيل وإغلاق قائمة الهامبرغر الرئيسية للجوال
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle("open");
            navMenu.classList.toggle("active");
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove("open");
                navMenu.classList.remove("active");
            }
        });
    }

    // 2. تفعيل القائمة المنسدلة للخدمات بالضغط (On-Click Dropdown Toggle)
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

        // إغلاق المنسدلة عند النقر في أي مكان فارغ بالصفحة
        document.addEventListener("click", (e) => {
            if (!servicesDropdown.contains(e.target) && !servicesMenu.contains(e.target)) {
                servicesDropdown.setAttribute("aria-expanded", "false");
                servicesMenu.classList.remove("show");
            }
        });
    }

    // 3. تفعيل وإدارة زر الصعود للأعلى (Scroll To Top Button)
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
