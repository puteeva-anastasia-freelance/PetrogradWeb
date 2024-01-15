(function () {
	"use strict";

	/**
	 * Класс для управления мобильным меню сайта
	 */
	class MobileMenu {
		constructor() {
			this.burgerEl = document.querySelector('.header__burger');
			this.mobileMenuEl = document.querySelector('.mobile-menu');
			this.mobileMenuCloseEl = document.querySelector('.mobile-menu__close');
			this.overlayEl = document.querySelector('.overlay');
			this.mobileMenuLinksElems = document.querySelectorAll('.mobile-menu__link');
		}

		/**
		 * Метод инициализирует работу с мобильным меню
		 */
		init(){
			this.addButtonsMenuClickListener();
			this.addMobileMenuLinksClickListener();
		}

		/**
		 * Метод добавляет кнопкам меню слушатель события клика
		 */
		addButtonsMenuClickListener() {
			this.burgerEl.addEventListener('click', () => {
				this.overlayEl.style.display = 'block';
				this.mobileMenuEl.classList.add('is-show');
			});

			this.mobileMenuCloseEl.addEventListener('click', () => {
				this.overlayEl.style.display = 'none';
				this.mobileMenuEl.classList.remove('is-show');
			});

			this.overlayEl.addEventListener('click', () => {
				this.overlayEl.style.display = 'none';
				this.mobileMenuEl.classList.remove('is-show');
			});
		}

		/**
		 * Метод добавляет ссылкам мобильного меню слушатель события клика
		 */
		addMobileMenuLinksClickListener(){
			this.mobileMenuLinksElems.forEach((link) => {
				link.addEventListener('click', () => {
					this.overlayEl.style.display = 'none';
					this.mobileMenuEl.classList.remove('is-show');
				});
			});
		}
	}

	window.addEventListener('load', () => {
		let mobileMenu = new MobileMenu();
		mobileMenu.init();
	});
})();