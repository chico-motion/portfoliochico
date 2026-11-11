import { initServices } from "./modules/services.js";
import { initMenu } from "./modules/menu.js";
import { initCurrentPage } from "./modules/current-page.js";
import { initScrollSpy } from "./modules/scroll-spy.js";
import { initScrollTop } from "./modules/scroll-top.js";
import { initReveal } from "./modules/reveal.js";
import { initMarquee } from "./modules/marquee.js";
import { initCounter } from "./modules/counter.js";
import { initCarousel } from "./modules/carousel.js";
import { initHeroRuler } from "./modules/hero-ruler.js";
import { initForm } from "./modules/form.js";
import { initProgress } from "./modules/progress.js";
import { initWorks } from "./modules/works.js";
import { initProjectOverlay } from "./modules/project-overlay.js";
import { initProjetoNav } from "./modules/projeto-nav.js";
import { initFontsLoading } from "./modules/fonts.js";

initServices();
initMenu();
initCurrentPage();
initScrollSpy();
initScrollTop();
initReveal();
initMarquee();
initCounter();
initCarousel();
initHeroRuler();
initForm();
initProgress();
initWorks();
initProjectOverlay();
initProjetoNav();
initFontsLoading();

// ============================================================
// CONTROLE DE VÍDEOS LOCAIS (MP4)
// ============================================================
function initVideoPlayers() {
  const midias = document.querySelectorAll('.proj-midia, .proj-galeria-item');
  const videos = document.querySelectorAll('video');

  function pausarTodos(exceto) {
    videos.forEach(v => {
      if (v !== exceto && !v.paused) {
        v.pause();
      }
    });
  }

  midias.forEach(midia => {
    const video = midia.querySelector('video');
    const btn = midia.querySelector('.proj-play');

    if (!video || !btn) return;

    const togglePlay = () => {
      if (video.paused) {
        pausarTodos(video);
        video.play();
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
        video.setAttribute('controls', 'true');
      } else {
        video.pause();
      }
    };

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('click', function() {
      if (video.hasAttribute('controls')) {
        if (video.paused) video.play();
        else video.pause();
      }
    });

    video.addEventListener('pause', function() {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      video.removeAttribute('controls');
    });
  });
}

initVideoPlayers();