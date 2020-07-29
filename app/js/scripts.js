window.addEventListener('DOMContentLoaded', () => {
	let step = 1;
	let progressbarItems = document.querySelectorAll('.progressbar li');
	let nextBtn = document.querySelector('.next_btn');
	let submitBtn = document.querySelector('.submit_btn');
	let tabs = document.querySelectorAll('.tab_pane');
	let form = document.querySelector('.s_quiz__form');
	let feedbackMethod = document.querySelectorAll('input[name="feedback"]');
	let feedbackMethodForm = document.querySelectorAll('.s_quiz__form--feedback');
	let checkName = feedbackMethod[0].value;

	const createHelper = (btn, msg) => {
		let div = document.createElement('div');
		div.classList.add('helper_text');
		div.textContent  = msg;

		form.append(div)
		btn.setAttribute('disabled', true)

		setTimeout(function() {
			form.removeChild(div);
			btn.removeAttribute('disabled')
		}, 1200)
	}

	form.addEventListener('submit', (e) => {
		let value = '';

		feedbackMethodForm.forEach(m => {
			if(m.querySelector(`input[name="${checkName}"]`)) {
				value = m.querySelector(`input[name="${checkName}"]`).value;
			}
		})

		if(value.startsWith('+')) {
			const regEx = /^(\d{12})$/;
			value = value.replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '')
			value = value.split(' ').join('').slice(1)

			if(!regEx.test(value)) {
				e.preventDefault()
				createHelper(submitBtn, 'Пожалуйста, проверьте введенные данные');
			}
		}

		if(checkName === 'email') {
			const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([A-Za-z]{2,5})$/;

			if(!re.test(value)) {
				e.preventDefault()
				createHelper(submitBtn, 'Пожалуйста, проверьте введенный e-mail');
			}
		}

		if(checkName === 'telegram' && value.trim().length < 3) {
			e.preventDefault()
			createHelper(submitBtn, 'Необходимо ввести минимум 3 символа');
		}

		nextBtn.style.display = 'none';
		submitBtn.style.display = 'block';
	})

	nextBtn.addEventListener('click', (e) => {
		e.preventDefault();
		let value = tabs[step - 1].querySelector('input').value;

		if(value.trim() === '') {
			createHelper(nextBtn, 'Пожалуйста, заполните поле');
			return;
		}
		
		if(step < tabs.length) step++;

		tabs.forEach(tab => {
			if(tab.dataset.step == step) {
				tab.classList.add('active')
			} else {
				tab.classList.remove('active')
			}
		})

		if(step === tabs.length) {
			nextBtn.style.display = 'none';
			submitBtn.style.display = 'block';
			return;
		}

		if(step <= progressbarItems.length) progressbarItems[step - 1].classList.add('active')
	})

	function doFormat(x, pattern, mask) {

		var strippedValue = x.replace(/[^0-9]/g, "");
		var chars = strippedValue.split('');
		var count = 0;

		var formatted = '';
		for (var i=0; i<pattern.length; i++) {
			const c = pattern[i];
			if (chars[3+count]) {
				if (/\*/.test(c)) {
					formatted += chars[3+count];
					count++;
				} else {
					formatted += c;
				}
			} else if (mask) {
				if (mask.split('')[i])
					formatted += mask.split('')[i];
			}
		}
		return `+375 ${formatted}`;
	}

	document.querySelectorAll('[data-mask]').forEach(function(e) {
		function format(elem) {
			const val = doFormat(elem.value, elem.getAttribute('data-format'));
			elem.value = doFormat(elem.value, elem.getAttribute('data-format'), elem.getAttribute('data-mask'));

			if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.move('character', val.length);
				range.select();
			} else if (elem.selectionStart) {
				elem.focus();
				elem.setSelectionRange(val.length, val.length);
			}
		}
		e.addEventListener('keyup', function() {
			format(e);
		});
		format(e)
	});

	const checkedForm = (e) => {
		const name = e.target.dataset.target;
		checkName = name;

		feedbackMethodForm.forEach(form => {
			if(form.dataset.target == name) {
				form.classList.add('active')

			} else {
				form.classList.remove('active')
			}
		})
	}

	feedbackMethod.forEach(method => {
		method.addEventListener('change', checkedForm);
	})

});