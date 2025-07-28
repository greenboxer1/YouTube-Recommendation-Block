// YouTube Focus Extension - Content Script

(function() {
    'use strict';

    // Функция для скрытия элементов
    function hideElements() {
        // Убираем видео на главной странице
    if (window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions') {
        const videoContainers = document.querySelectorAll(
            'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer, ' +
            'ytd-browse[page-subtype="home"] ytd-rich-shelf-renderer, ' +
            'ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer, ' +
            'ytd-browse[page-subtype="subscriptions"] ytd-rich-shelf-renderer'
        );
        videoContainers.forEach(container => container.style.display = 'none');
    }

        // На страницах просмотра видео удаляем только рекомендованные видео
        if (window.location.pathname === '/watch') {
            // Удаляем блок "Следующий" с автовоспроизведением
            const autoplay = document.querySelector('ytd-compact-autoplay-renderer');
            if (autoplay) autoplay.remove();
            
            // Удаляем все рекомендованные видео
            const recommendations = document.querySelectorAll(
                '#secondary ytd-compact-video-renderer, ' +
                '#secondary ytd-compact-radio-renderer, ' +
                '#secondary ytd-compact-playlist-renderer'
            );
            recommendations.forEach(rec => rec.remove());
            
            // Удаляем блоки с заголовками рекомендаций
            const recSections = document.querySelectorAll('#secondary ytd-item-section-renderer');
            recSections.forEach(section => {
                const header = section.querySelector('ytd-continuation-item-renderer, #header');
                if (header && !section.querySelector('ytd-playlist-panel-renderer')) {
                    section.remove();
                }
            });
        }
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(() => {
        hideElements();
    });

    // Инициализация
    function init() {
        hideElements();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Отслеживание смены URL
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(hideElements, 500);
        }
    }, 1000);
})();