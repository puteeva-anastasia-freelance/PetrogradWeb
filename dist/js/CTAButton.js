(function () {
	"use strict";

	/**
	 * Класс управляет кнопками "Смотреть видео" и "Перейти к товару"
	 */
	class CTAButton {
		constructor() {
			this.mediaVideoEl = document.querySelector('.media__video');
			this.videoWatchEl = document.querySelector('.video__watch');

			this.mediaImageEl = document.querySelector('.media__img');
			this.productGoEl = document.querySelector('.product__go');
		}

		/**
		 * Метод инициализирует работу с кнопками CTA
		 */
		init(){
			this.placeCTAButtons(this.mediaVideoEl, this.videoWatchEl, 68, 68);
			this.addWindowResizeListener(this.mediaVideoEl, this.videoWatchEl, 68, 68);

			this.placeCTAButtons(this.mediaImageEl, this.productGoEl, 71, 80);
			this.addWindowResizeListener(this.mediaImageEl, this.productGoEl, 71, 80);
		}

		/**
		 * Метод, который располагает кнопки "Смотреть видео" и "Перейти к товару" возле видео и товара соответственно
		 * @param {HTMLVideoElement | HTMLImageElement} wrapperEl элемент, относительно которого будет расположена кнопка
		 * @param {HTMLDivElement} buttonWrapperEl блок с кнопкой
		 * @param {number} moveDistanceX расстояние, на которое передвинуть по горизонтали buttonWrapperEl относительно wrapperEl
		 * @param {number} moveDistanceY расстояние, на которое передвинуть по вертикали buttonWrapperEl относительно wrapperEl
		 */
		placeCTAButtons(wrapperEl, buttonWrapperEl, moveDistanceX, moveDistanceY) {
			let wrapperWidth = wrapperEl.offsetWidth;
			let wrapperLeft = wrapperEl.offsetLeft + wrapperWidth - moveDistanceX;

			let wrapperHeight = wrapperEl.offsetHeight;
			let wrapperTop = wrapperEl.offsetTop + wrapperHeight - moveDistanceY;

			if(window.innerWidth >= 768){
				buttonWrapperEl.style.left = `${wrapperLeft}px`;
				buttonWrapperEl.style.top = `${wrapperTop}px`;
			} else {
				buttonWrapperEl.style.left = '';
				buttonWrapperEl.style.top = '';
			}
		}

		/**
		 * Метод добавляет окну браузера слушатель события изменения размеров окна браузера
		 * @param {HTMLVideoElement | HTMLImageElement} wrapperEl элемент, относительно которого будет расположена кнопка
		 * @param {HTMLDivElement} buttonWrapperEl блок с кнопкой
		 * @param {number} moveDistanceX расстояние, на которое передвинуть по горизонтали buttonWrapperEl относительно wrapperEl
		 * @param {number} moveDistanceY расстояние, на которое передвинуть по вертикали buttonWrapperEl относительно wrapperEl
		 */
		addWindowResizeListener(wrapperEl, buttonWrapperEl, moveDistanceX, moveDistanceY){
			window.addEventListener('resize', () => {
				this.placeCTAButtons(wrapperEl, buttonWrapperEl, moveDistanceX, moveDistanceY);
			});
		}
	}

	window.addEventListener('load', () => {
		let ctabutton = new CTAButton();
		ctabutton.init();
	});
})();