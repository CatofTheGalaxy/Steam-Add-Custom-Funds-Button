// ==UserScript==
// @name		[Steam] Custom Top-Up Button
// @namespace	http://tampermonkey.net/
// @version		1.02
// @description Allows you to customize the Steam Wallet Add Funds button.
// @match		https://store.steampowered.com/steamaccount/addfunds*
// @grant		none
// ==/UserScript==
/* global submitAddFunds */

(() => {
	'use strict';

	const style = document.createElement('style');
	style.textContent = `input[type=number]{-moz-appearance:textfield}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}#btn_custom_submit{cursor:pointer;background:linear-gradient(to bottom,#779c23,#5a7818);border:0;color:#d2e885;font:14px Motiva Sans,Arial,sans-serif;padding:0 15px;height:100%;display:inline-flex;align-items:center;justify-content:center;text-shadow:-1px -1px 0 rgba(0,0,0,.3);transition:background .2s,color .2s}#btn_custom_submit:hover{background:linear-gradient(to bottom,#8abc2e,#688c1b);color:#fff}`;
	document.head.appendChild(style);

	const check = setInterval(() => {
		const target = document.querySelector('#prices_user');
		if (!target) return;
		clearInterval(check);

		const currency = document.querySelector('#input_currency,input[name="currency"]')?.value || '???',
			amounts = [...document.querySelectorAll('[data-amount]')].map(el => +el.dataset.amount).filter(Number.isFinite),
			min = amounts.length ? Math.min(...amounts) / 100 : 0,
			btn = document.querySelector('[data-amount]');

		const div = document.createElement('div');
		div.className = 'game_area_purchase_game addfunds_area_purchase_game';
		div.style.cssText = 'margin-bottom:20px';
		div.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between"><div><div style="color:#fff;font-size:20px;margin-bottom:4px">Custom Add Funds</div><div style="font-size:12px;color:#8f98a0">Enter custom amount (Minimum: ${min} ${currency})</div></div><div style="display:flex;align-items:center;background:#000;border:2px solid #000;border-radius:2px;height:30px;overflow:hidden"><div style="display:flex;align-items:center;gap:6px;padding:0 10px;height:100%"><input type="number" id="custom_amount" value="${min}" step="any" style="background:transparent;border:0;color:#fff;width:75px;font-size:14px;outline:none;text-align:right"><span style="color:#fff;font-size:14px;font-weight:bold">${currency}</span></div><button id="btn_custom_submit">Add Funds</button></div></div>`;
		target.prepend(div);

		const input = div.querySelector('#custom_amount'),
			submit = () => {
				const amount = +input.value;
				if (!Number.isFinite(amount) || amount < min) return alert(`Please enter a valid amount (minimum ${min} ${currency}).`);
				const cents = Math.round(amount * 100);
				if (btn) { const fake = btn.cloneNode(true); fake.dataset.amount = cents; fake.hidden = true; document.body.appendChild(fake); fake.click(); fake.remove(); }
				else if (typeof submitAddFunds === 'function') submitAddFunds(cents);
				else alert('Could not process. Please refresh.');
			};

		input.addEventListener('click', () => input.select());
		input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
		div.querySelector('#btn_custom_submit').addEventListener('click', e => { e.preventDefault(); submit(); });
	}, 300);
})();
