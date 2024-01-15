(function () {
	"use strict";

	/**
	 * Класс управляет блоком "Оставить заявку"
	 */
	class Request {
		constructor() {
			this.inputElems = document.querySelectorAll('.request__input');
			this.buttonEl = document.querySelector('.request__button');
			this.policyCheckboxEl = document.querySelector('.request__policy-checkbox');
			this.policyErrorEl = document.querySelector('.request__policy-error');
			this.innerEl = document.querySelector('.request__inner');
			this.inputNameEl = document.querySelector('.request__input-name');
			this.successEl = document.querySelector('.request__success');
		}

		/**
		 * Метод инициализирует работу с блоком "Оставить заявку"
		 */
		init() {
			this.addPhoneMaskToInput();
			this.addInputElemsFocusListener();
			this.addInputElemsBlurListener();
			this.addButtonClickListener();
			this.checkComplianceWithPolicy();
			this.addFormSubmitListener();
		}

		/**
		 * Метод добавляет маску номера телефона для инпута
		 */
		addPhoneMaskToInput() {
			$('.mask-phone').mask('+7 999-999-99-99');
		}

		/**
		 * Метод добавляет инпутам формы слушатель события фокуса
		 */
		addInputElemsFocusListener() {
			this.inputElems.forEach((inputEl) => {
				inputEl.addEventListener('focus', () => {
					inputEl.nextElementSibling.style.display = 'none';
					inputEl.classList.remove('is-error');
				});
			});
		}

		/**
		 * Метод добавляет инпутам формы слушатель события потери фокуса
		 */
		addInputElemsBlurListener() {
			this.inputElems.forEach((inputEl) => {
				inputEl.addEventListener('blur', () => {
					if (inputEl.value.length === 0) {
						inputEl.nextElementSibling.style.display = 'block';
						inputEl.classList.add('is-error');
						inputEl.classList.remove('is-filled');
						inputEl.nextElementSibling.textContent = 'Поле обязательно к заполнению';
					} else {
						inputEl.classList.add('is-filled');
						inputEl.classList.remove('is-error');

						if (inputEl == this.inputNameEl && !this.isValidateNameInput()) {
							inputEl.nextElementSibling.textContent = 'Некорректное имя';
							inputEl.nextElementSibling.style.display = 'block';
							inputEl.classList.add('is-error');
							inputEl.classList.remove('is-filled');
						}
					}
				});
			});
		}

		/**
		 * Метод добавляет кнопке "Отправить" слушатель события клика
		 */
		addButtonClickListener() {
			this.buttonEl.addEventListener('click', (event) => {
				this.inputElems.forEach((inputEl) => {
					if (inputEl.value.length === 0) {
						event.preventDefault();
						inputEl.nextElementSibling.style.display = 'block';
						inputEl.classList.add('is-error');
						inputEl.nextElementSibling.textContent = 'Поле обязательно к заполнению';
					} else if (!this.isValidateNameInput()) {
						event.preventDefault();
					}
				});
			});
		}

		/**
		 * Метод добавляет слушатель события отправки формы
		 */
		addFormSubmitListener() {
			$('html').on('submit', '.form-application', function (event) {
				if (!$('.request__policy-checkbox').prop('checked')) {
					event.preventDefault();
				} else {
					event.preventDefault();

					let form = $(this);

					form[0].reset();
					$('.request__success').css('display', 'flex');
					/*
					$.ajax({
						url: '/form-application.php',
						type: 'POST',
						data: form.serialize(),
						dataType: 'html',
						success: function () {
							form[0].reset();
							$('.request__success').css('display', 'flex');
						}
					});*/
				}
			});
		}

		/**
		 * Метод проверяет согласие с обработкой персональных данных
		 */
		checkComplianceWithPolicy() {
			const handleClick = () => {
				if (this.policyCheckboxEl.checked == true) {
					this.policyErrorEl.style.display = 'none';
					this.innerEl.classList.remove('is-start');
				} else {
					this.policyErrorEl.style.display = 'block';
					this.innerEl.classList.add('is-start');
				}
			};

			this.policyCheckboxEl.addEventListener('click', handleClick);
			this.buttonEl.addEventListener('click', handleClick);
		}

		/**
		 * Метод проверяет корректность введенного имени в инпут
		 */
		isValidateNameInput() {
			let nameRegex = /^[A-Za-zА-Яа-яЁё\s]{1}[A-Za-zА-Яа-яЁё\s.\-]{1,}$/;
			let isValid = nameRegex.test(this.inputNameEl.value);

			return isValid;
		}
	}

	window.addEventListener('load', () => {
		let request = new Request();
		request.init();
	});
})();