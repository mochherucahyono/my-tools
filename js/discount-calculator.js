// ==========================================
// KALKULATOR DISKON (pages/tools/discount-calculator.html)
// ==========================================
(function() {
    function formatCurrency(value) {
        const hasDecimal = Math.abs(value % 1) > 0.0001;
        return 'Rp' + Number(value).toLocaleString('id-ID', {
            minimumFractionDigits: hasDecimal ? 2 : 0,
            maximumFractionDigits: 2
        });
    }

    function parseOptionalPercent(inputId) {
        const raw = document.getElementById(inputId)?.value.trim();
        if (!raw) return 0;
        return parseFloat(raw);
    }

    function calculateDiscount() {
        const price = parseFloat(document.getElementById('originalPrice')?.value);
        const disc1 = parseFloat(document.getElementById('discountPercent')?.value);
        const disc2 = parseOptionalPercent('extraDiscountPercent');
        const tax = parseOptionalPercent('taxPercent');

        if (isNaN(price) || price <= 0) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Harga Tidak Valid',
                    'Masukkan harga awal yang valid dan lebih besar dari nol.',
                    'warning'
                );
            }
            return;
        }

        if (isNaN(disc1) || disc1 < 0 || disc1 > 100) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Diskon Utama Tidak Valid',
                    'Masukkan persentase diskon utama antara 0% sampai 100%.',
                    'warning'
                );
            }
            return;
        }

        if (isNaN(disc2) || disc2 < 0 || disc2 > 100) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Diskon Tambahan Tidak Valid',
                    'Masukkan persentase diskon tambahan antara 0% sampai 100%.',
                    'warning'
                );
            }
            return;
        }

        if (isNaN(tax) || tax < 0 || tax > 100) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Pajak Tidak Valid',
                    'Masukkan persentase pajak antara 0% sampai 100%.',
                    'warning'
                );
            }
            return;
        }

        const afterFirstDiscount = price * (1 - disc1 / 100);
        const afterSecondDiscount = afterFirstDiscount * (1 - disc2 / 100);
        const totalSaved = price - afterSecondDiscount;
        const taxAmount = afterSecondDiscount * (tax / 100);
        const finalPrice = afterSecondDiscount + taxAmount;

        const panelEl = document.getElementById('discountResultPanel');
        const finalEl = document.getElementById('finalPriceOutput');
        const savedEl = document.getElementById('savedAmountOutput');
        const taxRowEl = document.getElementById('taxRow');
        const taxAmountEl = document.getElementById('taxAmountOutput');

        if (panelEl && finalEl && savedEl) {
            finalEl.textContent = formatCurrency(finalPrice);
            savedEl.textContent = formatCurrency(totalSaved);

            if (taxRowEl && taxAmountEl) {
                if (tax > 0) {
                    taxAmountEl.textContent = formatCurrency(taxAmount);
                    taxRowEl.style.setProperty('display', 'flex', 'important');
                } else {
                    taxRowEl.style.setProperty('display', 'none', 'important');
                }
            }

            panelEl.style.display = 'block';
        }
    }

    function resetDiscountForm() {
        const form = document.getElementById('discountForm');
        const panelEl = document.getElementById('discountResultPanel');
        const taxRowEl = document.getElementById('taxRow');

        if (form) form.reset();
        if (panelEl) panelEl.style.display = 'none';
        if (taxRowEl) taxRowEl.style.setProperty('display', 'none', 'important');
    }

    document.addEventListener('DOMContentLoaded', function() {
        const calcBtn = document.getElementById('calculateDiscountBtn');
        const resetBtn = document.getElementById('resetDiscountBtn');

        if (calcBtn) {
            calcBtn.addEventListener('click', calculateDiscount);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetDiscountForm);
        }
    });
})();