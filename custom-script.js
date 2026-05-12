/* =============================================
   OWL CAROUSEL — slider with custom nav
============================================= */
var $slider = $('#about-slide');
var totalSlides = $slider.find('.item').length;

$slider.owlCarousel({
    items: 1,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    smartSpeed: 700,
    loop: true,
    dots: false,
    nav: true,
    navText: [
        '<i class="fas fa-chevron-left"></i>',
        '<i class="fas fa-chevron-right"></i>'
    ]
});

/* Update glass panel counter + progress bar on each slide change */
function updateSlidePanel(index) {
    var current = ((index - 1) % totalSlides) + 1;
    if (current < 1) current = totalSlides;
    var pct = (current / totalSlides) * 100;
    $('.slide-num').text(current < 10 ? '0' + current : '' + current);
    $('.slide-total').text(totalSlides < 10 ? '0' + totalSlides : '' + totalSlides);
    $('.slide-progress-fill').css('width', pct + '%');
}

$slider.on('changed.owl.carousel', function (e) {
    updateSlidePanel(e.item.index);
});

/* =============================================
   NAVBAR — scroll effect + active link
============================================= */
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
        $('#navbar').addClass('scrolled');
    } else {
        $('#navbar').removeClass('scrolled');
    }

    var scrollPos = $(this).scrollTop() + 120;
    $('section[id]').each(function () {
        var top = $(this).offset().top;
        var id = $(this).attr('id');
        if (scrollPos >= top) {
            $('.nav-link').removeClass('active');
            $('.nav-link[href="#' + id + '"]').addClass('active');
        }
    });
});

/* =============================================
   HAMBURGER MENU
============================================= */
$('#navToggle').on('click', function () {
    $(this).toggleClass('is-open');
    $('#navMenu').toggleClass('is-open');
    var isOpen = $(this).hasClass('is-open');
    $(this).attr('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

/* Close mobile menu when any nav link is clicked */
$('#navMenu .nav-link, #navMenu .btn-primary').on('click', function () {
    $('#navToggle').removeClass('is-open').attr('aria-label', 'Open menu');
    $('#navMenu').removeClass('is-open');
});

/* Close mobile menu on outside click */
$(document).on('click', function (e) {
    if (!$(e.target).closest('.navbar').length) {
        $('#navToggle').removeClass('is-open').attr('aria-label', 'Open menu');
        $('#navMenu').removeClass('is-open');
    }
});

/* =============================================
   SMOOTH SCROLL
============================================= */
$('a[href^="#"]').on('click', function (e) {
    var target = $(this).attr('href');
    if ($(target).length) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 600);
    }
});

/* =============================================
   PORTFOLIO FILTER TABS
============================================= */
$('.tab').on('click', function () {
    $('.tab').removeClass('active');
    $(this).addClass('active');
});

/* =============================================
   COUNTER ANIMATION (stats)
============================================= */
function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var steps = 60;
    var increment = target / steps;
    var current = 0;
    var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

/* =============================================
   INTERSECTION OBSERVER — scroll animations + counter trigger
============================================= */
var countersDone = false;

var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
            setTimeout(function () {
                entry.target.classList.add('in-view');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
});

/* Trigger counters when stats section scrolls into view */
var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersDone) {
            countersDone = true;
            document.querySelectorAll('.counter').forEach(function (el) {
                animateCounter(el);
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

var statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
