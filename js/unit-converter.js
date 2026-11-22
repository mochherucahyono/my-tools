// ==========================================
// KONVERTER SATUAN (pages/tools/unit-converter.html)
// ==========================================
(function() {
    const UNIT_DATA = {
        length: {
            label: 'Panjang',
            units: {
                mm: { name: 'Milimeter (mm)', toBase: 0.001 },
                cm: { name: 'Sentimeter (cm)', toBase: 0.01 },
                m: { name: 'Meter (m)', toBase: 1 },
                km: { name: 'Kilometer (km)', toBase: 1000 },
                in: { name: 'Inci (in)', toBase: 0.0254 },
                ft: { name: 'Kaki (ft)', toBase: 0.3048 }
            },
            defaultFrom: 'cm',
            defaultTo: 'm'
        },
        weight: {
            label: 'Berat',
            units: {
                mg: { name: 'Miligram (mg)', toBase: 0.000001 },
                g: { name: 'Gram (g)', toBase: 0.001 },
                kg: { name: 'Kilogram (kg)', toBase: 1 },
                ons: { name: 'Ons (100 g)', toBase: 0.1 },
                lb: { name: 'Pound (lb)', toBase: 0.45359237 }
            },
            defaultFrom: 'kg',
            defaultTo: 'g'
        },
        temperature: {
            label: 'Suhu',
            units: {
                c: { name: 'Celsius (°C)' },
                f: { name: 'Fahrenheit (°F)' },
                k: { name: 'Kelvin (K)' }
            },
            defaultFrom: 'c',
            defaultTo: 'f'
        }
    };

    function formatNumber(num) {
        if (!Number.isFinite(num)) return '-';
        const rounded = Number(num.toPrecision(8));
        return rounded.toLocaleString('id-ID', {
            maximumFractionDigits: 6
        });
    }

    function populateUnitSelects(categoryKey) {
        const category = UNIT_DATA[categoryKey] || UNIT_DATA.length;
        const fromSelect = document.getElementById('fromUnit');
        const toSelect = document.getElementById('toUnit');
        if (!fromSelect || !toSelect) return;

        const entries = Object.entries(category.units);
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        entries.forEach(([key, info]) => {
            const optFrom = document.createElement('option');
            optFrom.value = key;
            optFrom.textContent = info.name;
            if (key === category.defaultFrom) optFrom.selected = true;
            fromSelect.appendChild(optFrom);

            const optTo = document.createElement('option');
            optTo.value = key;
            optTo.textContent = info.name;
            if (key === category.defaultTo) optTo.selected = true;
            toSelect.appendChild(optTo);
        });

        const resultEl = document.getElementById('unitResultOutput');
        if (resultEl) resultEl.textContent = '-';
    }

    function convertTemperature(value, from, to) {
        if (from === to) return value;

        let celsius;
        if (from === 'c') {
            celsius = value;
        } else if (from === 'f') {
            celsius = (value - 32) * (5 / 9);
        } else if (from === 'k') {
            celsius = value - 273.15;
        }

        if (to === 'c') return celsius;
        if (to === 'f') return celsius * (9 / 5) + 32;
        if (to === 'k') return celsius + 273.15;
        return NaN;
    }

    function convertUnit() {
        const categoryKey = document.getElementById('unitCategory')?.value || 'length';
        const rawVal = document.getElementById('unitValue')?.value.trim();
        const fromKey = document.getElementById('fromUnit')?.value;
        const toKey = document.getElementById('toUnit')?.value;
        const resultEl = document.getElementById('unitResultOutput');

        if (!resultEl) return;

        if (!rawVal || isNaN(Number(rawVal))) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Nilai Tidak Valid',
                    'Masukkan angka yang valid untuk mengonversi satuan.',
                    'warning'
                );
            }
            return;
        }

        const value = parseFloat(rawVal);

        if ((categoryKey === 'length' || categoryKey === 'weight') && value < 0) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Nilai Tidak Boleh Negatif',
                    `Nilai ${UNIT_DATA[categoryKey].label.toLowerCase()} tidak boleh kurang dari nol.`,
                    'warning'
                );
            }
            return;
        }

        if (categoryKey === 'temperature' && fromKey === 'k' && value < 0) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Suhu Kelvin Tidak Valid',
                    'Suhu dalam Kelvin tidak boleh kurang dari 0 K (nol mutlak).',
                    'danger'
                );
            }
            return;
        }

        let converted;
        if (categoryKey === 'temperature') {
            converted = convertTemperature(value, fromKey, toKey);
        } else {
            const units = UNIT_DATA[categoryKey].units;
            const fromFactor = units[fromKey]?.toBase;
            const toFactor = units[toKey]?.toBase;
            if (!fromFactor || !toFactor) return;
            const baseValue = value * fromFactor;
            converted = baseValue / toFactor;
        }

        if (categoryKey === 'temperature' && toKey === 'k' && converted < 0) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Di Bawah Nol Mutlak',
                    'Hasil konversi suhu berada di bawah 0 K.',
                    'warning'
                );
            }
            return;
        }

        resultEl.textContent = `${formatNumber(converted)} (${toKey.toUpperCase()})`;
    }

    function swapUnits() {
        const fromSelect = document.getElementById('fromUnit');
        const toSelect = document.getElementById('toUnit');
        if (!fromSelect || !toSelect) return;

        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        const valStr = document.getElementById('unitValue')?.value.trim();
        if (valStr && !isNaN(Number(valStr))) {
            convertUnit();
        }
    }

    function resetUnitForm() {
        const categoryEl = document.getElementById('unitCategory');
        const valueEl = document.getElementById('unitValue');
        const resultEl = document.getElementById('unitResultOutput');

        if (categoryEl) categoryEl.value = 'length';
        if (valueEl) valueEl.value = '';
        populateUnitSelects('length');
        if (resultEl) resultEl.textContent = '-';
    }

    document.addEventListener('DOMContentLoaded', function() {
        const categoryEl = document.getElementById('unitCategory');
        const convertBtn = document.getElementById('convertUnitBtn');
        const swapBtn = document.getElementById('swapUnitsBtn');
        const resetBtn = document.getElementById('resetUnitBtn');

        populateUnitSelects(categoryEl?.value || 'length');

        if (categoryEl) {
            categoryEl.addEventListener('change', function() {
                populateUnitSelects(this.value);
            });
        }

        if (convertBtn) {
            convertBtn.addEventListener('click', convertUnit);
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', swapUnits);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetUnitForm);
        }
    });
})();