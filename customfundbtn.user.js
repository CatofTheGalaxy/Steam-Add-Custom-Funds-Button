// ==UserScript==
// @name         [Steam] Add Custom Funds Button
// @namespace    https://github.com/CatofTheGalaxy/
// @version      1.05
// @author       CatofTheGalaxy
// @description  Customize the Steam Wallet Add Funds button with custom amounts.
// @homepageURL  https://github.com/CatofTheGalaxy/Steam-Add-Custom-Funds-Button
// @supportURL   https://github.com/CatofTheGalaxy/Steam-Add-Custom-Funds-Button/issues
// @updateURL    https://github.com/CatofTheGalaxy/Steam-Add-Custom-Funds-Button/raw/refs/heads/main/customfundbtn.user.js
// @downloadURL  https://github.com/CatofTheGalaxy/Steam-Add-Custom-Funds-Button/raw/refs/heads/main/customfundbtn.user.js
// @match        https://store.steampowered.com/steamaccount/addfunds*
// @grant        none
// ==/UserScript==
/* global submitAddFunds */

(() => {
	'use strict';
	const s = document.createElement('style');
	s.textContent = `input#custom_amount[type=number]{-moz-appearance:textfield}input#custom_amount[type=number]::-webkit-inner-spin-button,input#custom_amount[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}#btn_custom_submit{cursor:pointer;flex-shrink:0;background:linear-gradient(to bottom,#779c23,#5a7818);border:0;color:#d2e885;font:14px Motiva Sans,Arial,sans-serif;padding:0 15px;height:100%;display:inline-flex;align-items:center;justify-content:center;text-shadow:-1px -1px 0 rgba(0,0,0,.3);transition:background .2s,color .2s}#btn_custom_submit:hover{background:linear-gradient(to bottom,#8abc2e,#688c1b);color:#fff}`;
	document.head.append(s);

	const init = target => {
		const cur = document.querySelector('#input_currency,input[name="currency"]')?.value || '???',
			amts = [...document.querySelectorAll('[data-amount]')].map(e => +e.dataset.amount).filter(Number.isFinite),
			min = amts.length ? Math.min(...amts) / 100 : 0,
			btn = document.querySelector('[data-amount]'),
			div = document.createElement('div');
		div.className = 'game_area_purchase_game addfunds_area_purchase_game';
		div.style.cssText = 'margin-bottom:20px';
		div.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px"><div style="min-width:0;flex:1"><div style="color:#fff;font-size:20px;line-height:24px">Custom Add Funds</div><div style="font-size:12px;line-height:18px;color:#c6d4df">Enter custom amount (Minimum: ${min.toFixed(2)} ${cur})</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;transform:translateX(6px)"><div style="display:flex;align-items:center;background:#000;border:2px solid #000;border-radius:2px;height:30px;overflow:hidden"><div style="display:flex;align-items:center;gap:6px;padding:0 10px;height:100%"><input type="number" id="custom_amount" value="${min.toFixed(2)}" step="any" style="background:transparent;border:0;color:#fff;width:100px;min-width:100px;max-width:220px;box-sizing:content-box;font-size:14px;outline:none;text-align:right"><span style="color:#fff;font-size:14px;font-weight:bold;flex-shrink:0">${cur}</span></div><button id="btn_custom_submit">Add Funds</button></div><div id="custom_fund_err" style="display:none;font-size:12px;line-height:18px;color:#f45757;margin-top:2px;text-align:right"></div></div></div>`;
		target.prepend(div);

		const inp = div.querySelector('#custom_amount'), err = div.querySelector('#custom_fund_err'), ctx = document.createElement('canvas').getContext('2d'),
			setErr = m => { err.textContent = m; err.style.display = m ? 'block' : 'none'; },
			resize = () => { ctx.font = getComputedStyle(inp).font; inp.style.width = `${Math.min(220, Math.max(100, ctx.measureText(inp.value || '0').width + 8))}px`; },
			submit = () => {
				const v = +inp.value;
				if (!Number.isFinite(v) || v < min) return setErr(`Please enter a valid amount (minimum ${min.toFixed(2)} ${cur}).`);
				setErr('');
				const c = Math.round(v * 100);
				if (btn) { const f = btn.cloneNode(true); f.dataset.amount = c; f.hidden = true; document.body.append(f); f.click(); f.remove(); }
				else if (typeof submitAddFunds === 'function') submitAddFunds(c);
				else setErr('Could not process. Please refresh.');
			};

		resize();
		inp.addEventListener('input', () => { resize(); if (err.style.display !== 'none') setErr(''); });
		inp.addEventListener('blur', () => { if (inp.value === '') { inp.value = min.toFixed(2); resize(); } });
		inp.addEventListener('click', () => inp.select());
		inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
		div.querySelector('#btn_custom_submit').addEventListener('click', e => { e.preventDefault(); submit(); });
	};

	const delays = [500, 1500, 3000, 5000], run = (i = 0) => { const t = document.querySelector('#prices_user'); if (t) return init(t); if (i < delays.length) setTimeout(() => run(i + 1), delays[i]); };
	run();
})();
