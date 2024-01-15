(function () {
	"use strict";

	/**
	 * Класс управляет скроллом страницы
	 */
	class Scroll {
		constructor() {
			this.pageContainerEl = document.querySelector("[data-scroll-container]");

			this.headerEl = document.querySelector("header");
			this.headerContainerEl = document.querySelector(".header__container");
			this.headerMenuLinkElems = document.querySelectorAll('.header__menu-link');

			this.firstEl = document.querySelector('.first');

			this.sectionPinEl = document.querySelector("#section-pin");
			this.pinWrapEl = document.querySelector(".pin-wrap");

			this.mediaWrapVideoEl = document.querySelector('.media__wrap-video');
			this.mediaVideoEl = document.querySelector('.media__video');

			this.mediaWrapImgEl = document.querySelector('.media__wrap-img');
			this.mediaImgEl = document.querySelector('.media__img');

			this.videoLineSecondEl = document.querySelectorAll(".video-line")[1];
			this.videoWatchEl = document.querySelector('.video__watch');
			this.videoWatchBtnEl = this.videoWatchEl.querySelector('button');

			this.productGoEl = document.querySelector('.product__go');
			this.productGoBtnEl = this.productGoEl.querySelector('button');

			this.productLineSecondEl = document.querySelectorAll(".product-line")[1];

			this.leftPoint = 0;
			this.pinWrapWidth = 1400;

			this.pauseVideo = null;
			this.pauseImg = null;

			this.isBottomPositionSetVideo = false;
			this.isBottomPositionSetImage = false;
			this.isScrolledUpFromForm = false;
			this.isPausedVideo = false;
			this.isPausedImage = false;
			this.isScrollingUp = false;

			this.isMobileVersion = true;
		}

		/**
		 * Метод инициализирует работу со скроллом
		 */
		init() {
			window.addEventListener('resize', () => {
				document.querySelector('.media').style.height = `${window.innerHeight}px`;
			});

			document.querySelector('.media').style.height = `${window.innerHeight}px`;

			this.initializeScroller();
			this.initializeScrollTriggers();
			this.setScrollUpdate();
			this.setPinEffect();
			this.setRefreshEvent();
		}

		/**
		 * Инициализация LocomotiveScroll
		 */
		initializeScroller() {
			this.scroller = new LocomotiveScroll({
				el: this.pageContainerEl,
				smooth: true,
				multiplier: 0.3,

				mobile: {
					breakpoint: 0,
					smooth: true,
					direction: "vertical",
					multiplier: 0.1,
				},
				tablet: {
					breakpoint: 0,
					smooth: true,
					direction: "vertical",
					multiplier: 0.1,
				}
			});
		}

		/**
		 * Инициализация ScrollTrigger
		 */
		initializeScrollTriggers() {
			// Регистрация плагина ScrollTrigger
			gsap.registerPlugin(ScrollTrigger);

			// Настройка ScrollTrigger
			ScrollTrigger.scrollerProxy(this.pageContainerEl, {
				scrollTop: (value) => {
					return arguments.length ?
						this.scroller.scrollTo(value, 0, 0) :
						this.scroller.scroll.instance.scroll.y;
				},
				getBoundingClientRect() {
					return {
						left: 0,
						top: 0,
						width: window.innerWidth,
						height: window.innerHeight
					};
				},
				pinType: this.pageContainerEl.style.transform ? "transform" : "fixed"
			});
		}

		/**
		 * Метод устанавливает обновления ScrollTrigger при скролле
		 */
		setScrollUpdate() {
			// Обновление ScrollTrigger при скролле
			this.scroller.on("scroll", ScrollTrigger.update);

			this.scroller.on("scroll", (obj) => {
				if ((this.scrollY > obj.scroll.y) && (this.scrollY > this.pinWrapWidth) && !this.isScrolledUpFromForm) {
					this.onFormScrollUp();
				}

				this.checkMobileVersion();

				this.scrollY = obj.scroll.y;

				this.setBottomPositionOfVideo();

				this.updatePositionProductLineSecond();

				this.updateHeaderOnScroll();

				this.rotateVideo();
				this.manageVideoAnimation();

				this.rotateImage();
				this.manageImageAnimation();
			});
		}

		/**
		 * Метод слова "Велосипед" на второй строчке размещает перед словами "Видео"
		 */
		updatePositionProductLineSecond() {
			let pinWrapRect = this.pinWrapEl.getBoundingClientRect();
			let videoLineSecondRect = this.videoLineSecondEl.getBoundingClientRect();

			this.leftPoint = -pinWrapRect.left + videoLineSecondRect.left - this.pinWrapEl.offsetWidth;
			this.productLineSecondEl.style.transform = `translateX(${this.leftPoint}px)`;
		}

		/**
		 * Метод поворачивает элемент с видео
		 */
		rotateVideo() {
			if (!this.isScrollingUp) {
				let offsetBottom = (window.innerHeight - this.mediaWrapVideoEl.offsetHeight) / 2;
				let x = null, y = null;

				this.bottomDistanceVideo = window.innerHeight - this.mediaWrapVideoEl.getBoundingClientRect().bottom;

				if (this.isMobileVersion) {
					x = -7 / (offsetBottom + 400);
					y = -offsetBottom * x;
					this.mediaVideoRotate = +((y + (x * this.bottomDistanceVideo)).toFixed(1));
				} else {
					x = -5 / (offsetBottom + 485);
					y = -offsetBottom * x;
				}

				this.mediaVideoRotate = +((y + (x * this.bottomDistanceVideo)).toFixed(1));

				this.mediaVideoEl.style.transform = `rotate(${this.mediaVideoRotate}deg)`;
			}
		}

		/**
		 * Метод поворачивает элемент с картинкой
		 */
		rotateImage() {
			let offsetBottom = (window.innerHeight - this.mediaWrapImgEl.offsetHeight) / 2;
			let x = null, y = null;

			this.bottomDistanceImage = window.innerHeight - this.mediaWrapImgEl.getBoundingClientRect().bottom;

			if (this.isMobileVersion) {
				x = -7 / (offsetBottom + 400);
				y = -offsetBottom * x;
			} else {
				x = -5 / (offsetBottom + 485);
				y = -offsetBottom * x;
			}

			this.mediaImgRotate = +((y + (x * this.bottomDistanceImage)).toFixed(1));

			this.mediaImgEl.style.transform = `rotate(${this.mediaImgRotate}deg)`;
		}

		/**
		 * Метод обновляет позицию хедера в зависимости от скролла
		 */
		updateHeaderOnScroll() {
			if (this.scrollY < this.headerEl.offsetHeight) {
				this.headerContainerEl.style.transform = "none";
				this.headerEl.style.top = '0';
				this.headerEl.style.transition = 'none';
			} else if (this.scrollY < this.firstEl.offsetHeight) {
				this.headerEl.style.top = `-${this.headerEl.offsetHeight}px`;
				this.headerEl.style.transition = 'none';
			}
		}

		/**
		 * Метод управляет анимацией блока с видео
		 */
		manageVideoAnimation() {
			if ((this.pauseVideo != null) && (this.pauseVideo <= Math.floor(this.scrollY)) && !this.isScrollingUp) {
				this.resumeVideoAnimation();
				this.videoWatchEl.classList.add('is-hidden');
			} else if (this.mediaVideoRotate == 0) {
				if (!this.isPausedVideo) {
					if (this.isMobileVersion) {
						this.pauseVideo = Math.floor(this.scrollY) + 200;
					} else {
						this.pauseVideo = Math.floor(this.scrollY) + 275;
					}
					this.isPausedVideo = true;
				}
				this.stopVideoAnimation();
				this.videoWatchBtnEl.style.opacity = '1';
				this.videoWatchEl.classList.remove('is-hidden');
				this.setBottomPositionOfImage();
			} else if (this.mediaVideoRotate > 0) {
				this.resumeVideoAnimation();
				this.videoWatchEl.classList.remove('is-hidden');
				this.videoWatchBtnEl.style.opacity = `${0.96 - 0.17 * this.mediaVideoRotate}`;
			}
		}

		/**
		 * Метод управляет анимацией блока с картинкой
		 */
		manageImageAnimation() {
			if (((this.pauseImg <= (Math.floor(this.scrollY) + 3)) && (this.pauseImg >= Math.floor(this.scrollY))) || (this.mediaImgRotate > 0)) {
				this.mediaWrapImgEl.classList.remove('is-paused');

				if (this.isMobileVersion) {
					this.mediaWrapImgEl.style.bottom = `-${this.videoLineSecondEl.offsetWidth - this.pauseVideo + 1000}px`;
				} else {
					this.mediaWrapImgEl.style.bottom = `-${2 * (this.videoLineSecondEl.offsetWidth - this.pauseVideo)}px`;
				}

				this.mediaImgEl.classList.remove('is-paused');

				if (!this.mediaWrapImgEl.classList.contains('is-paused')) {
					this.productGoEl.classList.remove('is-hidden');
					this.productGoBtnEl.style.opacity = `${0.96 - 0.17 * this.mediaImgRotate}`;
				}
			} else if ((this.mediaImgRotate <= 0.3 && this.mediaImgRotate >= -0.3) && !this.isPausedImage) {
				if (!this.pauseImg) {
					this.pauseImg = Math.floor(this.scrollY);
					this.isPausedVideo = true;
				}
				this.stopImageAnimation();
				this.productGoBtnEl.style.opacity = '1';
				this.productGoEl.classList.remove('is-hidden');
			}
		}

		/**
		 * Метод, который устанавливает картинке позицию bottom
		 */
		setBottomPositionOfImage() {
			if (!this.isBottomPositionSetImage) {
				if (this.isMobileVersion) {
					this.mediaWrapImgEl.style.bottom = `-${this.videoLineSecondEl.offsetWidth - this.pauseVideo + 1000}px`;
				} else {
					this.mediaWrapImgEl.style.bottom = `-${2 * (this.videoLineSecondEl.offsetWidth - this.pauseVideo)}px`;
				}
				this.isBottomPositionSetImage = true;
			}
		}

		/**
		 * Метод, который устанавливает видео позицию bottom
		 */
		setBottomPositionOfVideo() {
			if (!this.isBottomPositionSetVideo) {
				this.mediaWrapVideoEl.style.bottom = '0';
				this.isBottomPositionSetVideo = true;
			}
		}

		/**
		 * Метод останавливает анимацию видео
		 */
		stopVideoAnimation() {
			this.mediaVideoEl.classList.add('is-paused');
			this.mediaWrapVideoEl.classList.add('is-paused');
			this.mediaWrapVideoEl.style.transition = 'none';
		}

		/**
		 * Метод останавливает анимацию картинки
		 */
		stopImageAnimation() {
			this.mediaImgEl.classList.add('is-paused');
			this.mediaWrapImgEl.classList.add('is-paused');
			this.mediaWrapImgEl.style.transition = 'none';
			this.mediaWrapImgEl.style.bottom = '0';
		}

		/**
		 * Метод возобновляет анимацию видео
		 */
		resumeVideoAnimation() {
			this.mediaVideoEl.classList.remove('is-paused');
			this.mediaWrapVideoEl.classList.remove('is-paused');
			this.mediaWrapVideoEl.style.transition = 'transform .2s linear';
		}

		/**
		 * Метод проверяет мобильная ли версия
		 */
		checkMobileVersion() {
			if (window.innerWidth >= 768) {
				this.isMobileVersion = false;
			}
		}

		/**
		 * Метод, который будет вызываться при скролле вверх с блока "Оставить заявку"
		 */
		onFormScrollUp() {
			this.isScrolledUpFromForm = true;
			this.isScrollingUp = true;

			this.headerContainerEl.style.transform = "none";
			this.headerEl.style.top = '0';
			this.headerEl.style.transition = 'none';

			this.scroller.scrollTo(this.firstEl.nextElementSibling, {
				duration: 1000,
				offset: 10,
				callback: () => {
					this.mediaWrapImgEl.style.bottom = '';
					this.headerEl.classList.add('is-fixed');
				}
			});

			setTimeout(() => {
				this.isScrollingUp = false;
			}, 1800);

			this.mediaVideoEl.style.transform = 'rotate(0)';
			this.videoWatchEl.classList.remove('is-hidden');
			this.mediaImgEl.classList.remove('is-paused');
			this.mediaImgEl.classList.remove('rotate-15');
			this.mediaWrapImgEl.classList.remove('is-paused');

			if (this.isMobileVersion) {
				this.mediaWrapImgEl.style.bottom = `-${this.videoLineSecondEl.offsetWidth - this.pauseVideo + 1000}px`;
			} else {
				this.mediaWrapImgEl.style.bottom = `-${2 * (this.videoLineSecondEl.offsetWidth - this.pauseVideo)}px`;
			}
		}

		/**
		 * Метод возобновляет анимацию картинки
		 */
		resumeImageAnimation() {
			this.productGoEl.classList.add('is-hidden');
			this.mediaWrapImgEl.style.bottom = '1000px';
			this.headerEl.classList.remove("is-fixed");
			this.mediaWrapImgEl.style.transition = 'bottom 1s linear';
			this.mediaImgEl.style.transition = 'transform 1s linear';
			this.mediaImgEl.classList.remove('is-paused');
			this.mediaImgEl.classList.add('rotate-15');
			this.mediaImgEl.style.transform = `rotate(${this.mediaImgRotate}deg)`;
		}

		/**
		 * Метод настраивает эффект закрепления и горизонтальной прокрутки
		 */
		setPinEffect() {
			this.horizontalScrollLength = 0;

			let enterCallback = () => {
				this.headerEl.classList.add("is-fixed");
				this.headerEl.style.top = '0';
				this.headerEl.style.transition = 'top .2s ease-in-out';
				this.headerMenuLinkElems.forEach((headerMenuLinkEl) => {
					headerMenuLinkEl.classList.remove('transition-effect');
				});
			};

			let updateCallback = () => {
				this.headerMenuLinkElems.forEach((headerMenuLinkEl) => {
					headerMenuLinkEl.classList.add('transition-effect');
				});
			}

			// Создание эффекта закрепления и горизонтальной прокрутки
			gsap.to(".pin-wrap", {
				scrollTrigger: {
					scroller: this.pageContainerEl, //locomotive-scroll
					scrub: true,
					trigger: "#section-pin",
					pin: true,
					start: "top top",
					end: this.pinWrapWidth,
					onEnter: enterCallback,
					onUpdate: updateCallback,
					onLeave: () => {
						this.isPausedImage = true;
						this.headerEl.classList.remove("is-fixed");
						this.resumeImageAnimation();
						this.scrollToNextSection();
						this.sectionPinEl.style.opacity = '0';
						console.log('выходим');
					},
					onEnterBack: enterCallback,
					onLeaveBack: () => {
						console.log('выходим');
						this.headerEl.classList.remove("is-fixed");
					},
				},
				x: -this.horizontalScrollLength,
				ease: "none"
			});
		}

		/**
		 * Переход к следующей секции
		 */
		scrollToNextSection() {
			let nextSection = this.sectionPinEl.parentElement.nextElementSibling;

			if (nextSection) {
				let nextSectionPosition = nextSection.offsetTop;
				this.scroller.scrollTo(nextSectionPosition, {
					duration: 800,
				});

				setTimeout(() => {
					this.sectionPinEl.style.opacity = '1';
					this.isScrolledUpFromForm = false;
					this.isPausedImage = false;
					this.mediaImgEl.style.transition = 'none';
				}, 800);
			}
		}

		/**
		 * Метод устанавливает обновление ScrollTrigger
		 */
		setRefreshEvent() {
			ScrollTrigger.addEventListener("refresh", () => this.scroller.update());
			ScrollTrigger.refresh();
		}
	}

	window.addEventListener('load', () => {
		let scroll = new Scroll();
		scroll.init();
	});
})();