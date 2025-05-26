// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Gestion de la navigation dynamique (apparaître/disparaître au défilement) ---
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Défilement vers le bas et au-delà de 100px du haut
            navbar.classList.add('translate-y-[-100%]', 'bg-gray-900', 'bg-opacity-80', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            // Défilement vers le haut ou proche du haut
            navbar.classList.remove('translate-y-[-100%]', 'bg-gray-900', 'bg-opacity-80', 'shadow-lg');
            if (window.scrollY === 0) {
                navbar.classList.add('bg-transparent');
            }
        }
        lastScrollY = window.scrollY;
    });

    // --- 2. Menu Hamburger (mobile) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    if (menuToggle && mobileMenu && closeMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = ''; // Rétablit le défilement du corps
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        // Fermer le menu mobile si un lien est cliqué
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = '';
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 3. Gestion de l'audio ---
    const backgroundAudio = document.getElementById('backgroundAudio');
    const toggleAudioBtn = document.getElementById('toggleAudioBtn');
    const audioIcon = document.getElementById('audioIcon');

    if (backgroundAudio && toggleAudioBtn && audioIcon) {
        backgroundAudio.volume = 0.3; // Réglez le volume si nécessaire
        backgroundAudio.loop = true; // Pour que le son se répète

        // Fonction pour jouer le son
        const playAudio = () => {
            backgroundAudio.play()
                .then(() => {
                    console.log("Audio joué avec succès.");
                    audioIcon.classList.remove('fa-volume-mute');
                    audioIcon.classList.add('fa-volume-up');
                })
                .catch(error => {
                    console.error("Erreur lors de la tentative de lecture automatique de l'audio :", error);
                    // Si la lecture automatique est bloquée, mettre l'icône en muet
                    audioIcon.classList.remove('fa-volume-up');
                    audioIcon.classList.add('fa-volume-mute');
                });
        };

        // Tenter de lancer la lecture automatiquement au chargement de la page
        // Les navigateurs peuvent bloquer ceci, mais nous essayons quand même.
        playAudio();

        // Gestion du clic sur le bouton
        toggleAudioBtn.addEventListener('click', () => {
            if (backgroundAudio.paused) {
                playAudio(); // Tente de jouer
            } else {
                backgroundAudio.pause();
                audioIcon.classList.remove('fa-volume-up');
                audioIcon.classList.add('fa-volume-mute');
                console.log("Audio mis en pause.");
            }
        });

        // Mettre à jour l'icône si le son est mis en pause par d'autres moyens
        backgroundAudio.addEventListener('pause', () => {
            audioIcon.classList.remove('fa-volume-up');
            audioIcon.classList.add('fa-volume-mute');
        });

        backgroundAudio.addEventListener('play', () => {
            audioIcon.classList.remove('fa-volume-mute');
            audioIcon.classList.add('fa-volume-up');
        });

    } else {
        console.warn("Éléments audio (audio, bouton ou icône) non trouvés. Vérifiez les IDs et leur présence dans le HTML.");
    }

    // --- 4. Animation au défilement (Scroll Reveal) ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // L'élément est visible à 10%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Arrête d'observer une fois l'animation déclenchée
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // --- 5. Lightbox pour les images (si vous avez des images avec la classe .lightbox-trigger) ---
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imageUrl = trigger.getAttribute('href');
            lightboxImage.setAttribute('src', imageUrl);
            lightboxOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
            lightboxOverlay.setAttribute('aria-hidden', 'false');
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Rétablir le défilement du corps
            lightboxOverlay.setAttribute('aria-hidden', 'true');
        });
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
                lightboxOverlay.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = '';
            lightboxOverlay.setAttribute('aria-hidden', 'true');
        }
    });

    // --- 6. Effet Parallaxe sur l'arrière-plan de l'en-tête (CSS background-attachment: fixed) ---
    // Le CSS gère déjà cela avec .hero.
    // Vous pouvez ajouter du JS pour un effet plus sophistiqué si nécessaire, mais pour un parallaxe simple, le CSS est suffisant.
});