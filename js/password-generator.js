// ==========================================
// PASSWORD GENERATOR (pages/tools/password-generator.html)
// ==========================================
(function() {
    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()-_=+[]{};:,.<>?'
    };

    function getRandomInt(max) {
        if (max <= 0) return 0;
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            const maxUint = 0xffffffff;
            const limit = maxUint - (maxUint % max);
            let randomValue;
            do {
                window.crypto.getRandomValues(array);
                randomValue = array[0];
            } while (randomValue >= limit);
            return randomValue % max;
        }
        return Math.floor(Math.random() * max);
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function getSelectedPools() {
        const pools = [];
        if (document.getElementById('includeUppercase')?.checked) pools.push(CHAR_SETS.uppercase);
        if (document.getElementById('includeLowercase')?.checked) pools.push(CHAR_SETS.lowercase);
        if (document.getElementById('includeNumbers')?.checked) pools.push(CHAR_SETS.numbers);
        if (document.getElementById('includeSymbols')?.checked) pools.push(CHAR_SETS.symbols);
        return pools;
    }

    function updateStrengthMeter(password, poolCount) {
        const fillEl = document.getElementById('strengthFill');
        const labelEl = document.getElementById('strengthLabel');
        if (!fillEl || !labelEl || !password || password === 'Klik Generate') {
            if (fillEl) {
                fillEl.style.width = '0%';
                fillEl.style.backgroundColor = 'transparent';
            }
            if (labelEl) {
                labelEl.textContent = '-';
                labelEl.style.color = '#64748b';
            }
            return;
        }

        let score = 0;
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        score += Math.max(0, poolCount - 1);

        if (score <= 2) {
            fillEl.style.width = '30%';
            fillEl.style.backgroundColor = '#dc2626';
            labelEl.textContent = 'Lemah';
            labelEl.style.color = '#dc2626';
        } else if (score <= 4) {
            fillEl.style.width = '65%';
            fillEl.style.backgroundColor = '#d97706';
            labelEl.textContent = 'Sedang';
            labelEl.style.color = '#d97706';
        } else {
            fillEl.style.width = '100%';
            fillEl.style.backgroundColor = '#059669';
            labelEl.textContent = 'Kuat';
            labelEl.style.color = '#059669';
        }
    }

    function generatePassword(showWarningIfEmpty = true) {
        const lengthEl = document.getElementById('passwordLength');
        const outputEl = document.getElementById('passwordOutput');
        if (!lengthEl || !outputEl) return;

        const length = parseInt(lengthEl.value, 10) || 16;
        const pools = getSelectedPools();

        if (pools.length === 0) {
            if (showWarningIfEmpty && typeof showAlertModal === 'function') {
                showAlertModal(
                    'Opsi Belum Dipilih',
                    'Pilih minimal satu jenis karakter (huruf besar, huruf kecil, angka, atau simbol).',
                    'warning'
                );
            }
            outputEl.textContent = '-';
            updateStrengthMeter('', 0);
            return;
        }

        const chars = [];

        // Pastikan setiap jenis karakter yang dicentang muncul minimal 1 kali
        pools.forEach((pool) => {
            chars.push(pool[getRandomInt(pool.length)]);
        });

        const combinedPool = pools.join('');
        while (chars.length < length) {
            chars.push(combinedPool[getRandomInt(combinedPool.length)]);
        }

        const finalPassword = shuffleArray(chars).join('');
        outputEl.textContent = finalPassword;
        updateStrengthMeter(finalPassword, pools.length);
    }

    function copyGeneratedPassword() {
        const outputEl = document.getElementById('passwordOutput');
        const text = outputEl?.textContent?.trim() || '';

        if (!text || text === '-' || text === 'Klik Generate') {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Belum Ada Password',
                    'Generate kata sandi terlebih dahulu sebelum menyalin.',
                    'warning'
                );
            }
            return;
        }

        const notifySuccess = () => {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Berhasil Disalin',
                    'Kata sandi telah disalin ke clipboard.',
                    'success'
                );
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(notifySuccess).catch(() => {
                fallbackCopy(text, notifySuccess);
            });
        } else {
            fallbackCopy(text, notifySuccess);
        }
    }

    function fallbackCopy(text, onDone) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        if (typeof onDone === 'function') onDone();
    }

    function resetPasswordOptions() {
        const lengthEl = document.getElementById('passwordLength');
        const lengthValEl = document.getElementById('lengthValue');

        if (lengthEl) lengthEl.value = '16';
        if (lengthValEl) lengthValEl.textContent = '16';

        ['includeUppercase', 'includeLowercase', 'includeNumbers', 'includeSymbols'].forEach((id) => {
            const cb = document.getElementById(id);
            if (cb) cb.checked = true;
        });

        generatePassword(false);
    }

    document.addEventListener('DOMContentLoaded', function() {
        const lengthEl = document.getElementById('passwordLength');
        const lengthValEl = document.getElementById('lengthValue');
        const generateBtn = document.getElementById('generatePasswordBtn');
        const copyBtn = document.getElementById('copyPasswordBtn');
        const resetBtn = document.getElementById('resetPasswordBtn');

        if (lengthEl) {
            lengthEl.addEventListener('input', function() {
                if (lengthValEl) lengthValEl.textContent = this.value;
                generatePassword(false);
            });
        }

        ['includeUppercase', 'includeLowercase', 'includeNumbers', 'includeSymbols'].forEach((id) => {
            const cb = document.getElementById(id);
            if (cb) {
                cb.addEventListener('change', function() {
                    generatePassword(false);
                });
            }
        });

        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                generatePassword(true);
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', copyGeneratedPassword);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetPasswordOptions);
        }

        // Buat password awal saat halaman dibuka
        generatePassword(false);
    });
})();