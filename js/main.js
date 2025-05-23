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
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        });

        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('-translate-x-full');
        });

        // Fermer le menu mobile si un lien est cliqué
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('-translate-x-full');
            });
        });
    }

    // --- 3. Animation d'entrée des éléments au défilement (Intersection Observer) ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // L'élément est visible à 10%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Arrêter d'observer une fois l'animation déclenchée
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(el => {
        observer.observe(el);
    });

    // --- 4. Animation du train sur la page d'accueil ---
    const mainHeader = document.getElementById('main-header'); // Récupère l'élément header
    const trainAnimationContainer = document.getElementById('train-animation-container');
    const trainSVG = document.getElementById('train-svg');

    if (mainHeader && trainAnimationContainer && trainSVG) {
        // Fonction pour lancer l'animation
        const startTrainAnimation = () => {
            // S'assurer que le header est en pleine hauteur pour l'animation
            mainHeader.classList.add('h-screen');
            mainHeader.classList.remove('h-auto', 'pt-20', 'pb-10');

            // Rendre le conteneur de l'animation visible et non cliquable (pour ne pas masquer le texte en dessous)
            trainAnimationContainer.classList.remove('opacity-0');
            trainAnimationContainer.classList.add('opacity-100');
            trainAnimationContainer.classList.remove('pointer-events-auto');
            trainAnimationContainer.classList.add('pointer-events-none');

            // Réinitialiser la position du train hors écran
            trainSVG.style.transform = 'translateX(-100%)';

            // Petit délai pour permettre la réinitialisation de la transformation avant de lancer l'animation
            setTimeout(() => {
                // Ajouter la classe pour déclencher les animations CSS (roues, fumée)
                trainAnimationContainer.classList.add('train-animate');
                // Lancer l'animation de translation du train
                trainSVG.style.transform = 'translateX(0%)';

                // Récupérer la durée de la transition de déplacement du train depuis le CSS
                const animationDuration = parseFloat(getComputedStyle(trainSVG).transitionDuration) * 1000;

                // Après la durée de l'animation principale du train
                setTimeout(() => {
                    // Arrêter les animations des roues et de la fumée
                    trainAnimationContainer.classList.remove('train-animate');

                    // Commencer à estomper le conteneur de l'animation du train
                    trainAnimationContainer.classList.remove('opacity-100');
                    trainAnimationContainer.classList.add('opacity-0');

                    // Le conteneur reste non interactif (pointer-events-none)

                    // Réduire la hauteur de l'en-tête pour révéler le contenu principal
                    mainHeader.classList.remove('h-screen');
                    mainHeader.classList.add('h-auto', 'pt-20', 'pb-10');

                }, animationDuration); // Attendre que la translation du train soit terminée
            }, 50); // Délai avant de commencer la translation du train
        };

        // Lancer l'animation automatiquement au chargement de la page
        startTrainAnimation();
    }

    // --- 5. Effets sonores subtils (Sifflet de train au clic) ---
    const soundButton = document.getElementById('discover-cta');
    const trainWhistleSound = new Audio('assets/sounds/train_whistle_short.mp3');
    trainWhistleSound.volume = 0.5; // Un volume légèrement plus élevé pour un clic
    let isPlaying = false; // Variable pour suivre l'état de lecture du son

    if (soundButton) {
        // Écouteur d'événement au clic sur le bouton
        soundButton.addEventListener('click', () => {
            if (isPlaying) {
                // Si le son est en cours de lecture, le mettre en pause et le réinitialiser au début
                trainWhistleSound.pause();
                trainWhistleSound.currentTime = 0; // Remettre le son au début pour le prochain clic
                isPlaying = false;
            } else {
                // Si le son n'est pas en cours de lecture, le lancer
                trainWhistleSound.play().then(() => {
                    isPlaying = true;
                }).catch(e => {
                    // Gérer les erreurs (par exemple, si le navigateur bloque la lecture pour une raison quelconque)
                    console.error("Erreur lors de la lecture du son du sifflet :", e);
                });
            }
        });

        // Écouteur d'événement pour savoir quand le son a terminé sa lecture naturelle
        trainWhistleSound.addEventListener('ended', () => {
            isPlaying = false;
            trainWhistleSound.currentTime = 0; // Réinitialiser pour le prochain clic
        });
    }

    // --- 6. Lightbox pour les images ---
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
    lightboxOverlay.setAttribute('role', 'dialog');
    lightboxOverlay.setAttribute('aria-modal', 'true');
    lightboxOverlay.setAttribute('aria-hidden', 'true'); // Initialement caché pour l'accessibilité
    lightboxOverlay.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="Image agrandie">
        </div>
        <button class="lightbox-close" aria-label="Fermer l'image agrandie">&times;</button>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector('img');
    const lightboxCloseBtn = lightboxOverlay.querySelector('.lightbox-close');

    document.querySelectorAll('.piece-image-container').forEach(container => {
        container.addEventListener('click', () => {
            const imgSrc = container.querySelector('img').src;
            const imgAlt = container.querySelector('img').alt;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightboxOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêcher le défilement du corps
            lightboxOverlay.setAttribute('aria-hidden', 'false');
            lightboxCloseBtn.focus(); // Mettre le focus sur le bouton de fermeture
        });
    });

    lightboxCloseBtn.addEventListener('click', () => {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Rétablir le défilement du corps
        lightboxOverlay.setAttribute('aria-hidden', 'true');
    });

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = '';
            lightboxOverlay.setAttribute('aria-hidden', 'true');
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = '';
            lightboxOverlay.setAttribute('aria-hidden', 'true');
        }
    });

    // --- 7. Effet Parallaxe sur l'arrière-plan de l'en-tête (CSS background-attachment: fixed) ---
    // Le CSS gère déjà cela avec .parallax-bg.
    // Vous pouvez ajouter du JS pour un effet plus sophistiqué si nécessaire, mais pour un parallaxe simple, le CSS est suffisant.
    // Exemple de parallaxe JS (décommenter si besoin d'un contrôle plus fin)
    // window.addEventListener('scroll', () => {
    //     const scrolled = window.pageYOffset;
    //     const parallaxBg = document.querySelector('.parallax-bg');
    //     if (parallaxBg) {
    //         parallaxBg.style.transform = 'translateY(' + scrolled * 0.3 + 'px)'; // Ajustez le facteur pour l'intensité
    //     }
    // });
});