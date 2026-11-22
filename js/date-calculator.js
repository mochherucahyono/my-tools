// ==========================================
// KALKULATOR TANGGAL & USIA (pages/tools/date-calculator.html)
// ==========================================
(function() {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    function toUTCDateOnly(dateStr) {
        const parts = dateStr.split('-').map(Number);
        if (parts.length !== 3) return null;
        return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }

    function formatTodayISO() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function switchMode(mode) {
        const diffBtn = document.getElementById('modeDiffBtn');
        const ageBtn = document.getElementById('modeAgeBtn');
        const diffForm = document.getElementById('dateDiffForm');
        const ageForm = document.getElementById('ageCalcForm');

        if (!diffBtn || !ageBtn || !diffForm || !ageForm) return;

        if (mode === 'age') {
            diffBtn.className = 'btn btn-soft-secondary';
            ageBtn.className = 'btn btn-accent active';
            diffForm.style.display = 'none';
            ageForm.style.display = 'block';
        } else {
            diffBtn.className = 'btn btn-accent active';
            ageBtn.className = 'btn btn-soft-secondary';
            diffForm.style.display = 'block';
            ageForm.style.display = 'none';
        }
    }

    function calculateDateDiff() {
        const startStr = document.getElementById('startDate')?.value;
        const endStr = document.getElementById('endDate')?.value;

        if (!startStr || !endStr) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Tanggal Belum Lengkap',
                    'Pilih Tanggal Awal dan Tanggal Akhir terlebih dahulu.',
                    'warning'
                );
            }
            return;
        }

        const startDate = toUTCDateOnly(startStr);
        const endDate = toUTCDateOnly(endStr);
        if (!startDate || !endDate) return;

        const diffDays = Math.round((endDate - startDate) / MS_PER_DAY);
        const absDays = Math.abs(diffDays);
        const weeks = Math.floor(absDays / 7);
        const remDays = absDays % 7;

        const directionLabel = diffDays > 0 ?
            `${absDays.toLocaleString('id-ID')} hari ke depan` :
            diffDays < 0 ?
            `${absDays.toLocaleString('id-ID')} hari yang lalu` :
            '0 hari (tanggal sama)';

        const detailLabel = absDays > 0 ?
            `Setara ${weeks.toLocaleString('id-ID')} minggu ${remDays} hari` :
            'Kedua tanggal berada pada hari yang sama.';

        const panelEl = document.getElementById('diffResultPanel');
        const mainEl = document.getElementById('diffDaysOutput');
        const detailEl = document.getElementById('diffDetailOutput');

        if (panelEl && mainEl && detailEl) {
            mainEl.textContent = directionLabel;
            detailEl.textContent = detailLabel;
            panelEl.style.display = 'block';
        }
    }

    function calculateAge() {
        const birthStr = document.getElementById('birthDate')?.value;
        const refStr = document.getElementById('referenceDate')?.value;

        if (!birthStr || !refStr) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Tanggal Belum Lengkap',
                    'Pilih Tanggal Lahir dan tanggal acuan perhitungan terlebih dahulu.',
                    'warning'
                );
            }
            return;
        }

        const birth = toUTCDateOnly(birthStr);
        const ref = toUTCDateOnly(refStr);
        if (!birth || !ref) return;

        if (birth > ref) {
            if (typeof showAlertModal === 'function') {
                showAlertModal(
                    'Tanggal Lahir Tidak Valid',
                    'Tanggal lahir tidak boleh melebihi tanggal acuan perhitungan.',
                    'danger'
                );
            }
            return;
        }

        let years = ref.getUTCFullYear() - birth.getUTCFullYear();
        let months = ref.getUTCMonth() - birth.getUTCMonth();
        let days = ref.getUTCDate() - birth.getUTCDate();

        if (days < 0) {
            months -= 1;
            const prevMonthLastDay = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 0)).getUTCDate();
            days += prevMonthLastDay;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Hitung hari menuju ulang tahun berikutnya dari tanggal acuan
        let nextBdayYear = ref.getUTCFullYear();
        const bMonth = birth.getUTCMonth();
        const bDay = birth.getUTCDate();

        const getBirthdayInYear = (yr) => {
            const lastDayOfMonth = new Date(Date.UTC(yr, bMonth + 1, 0)).getUTCDate();
            return new Date(Date.UTC(yr, bMonth, Math.min(bDay, lastDayOfMonth)));
        };

        let nextBday = getBirthdayInYear(nextBdayYear);
        if (nextBday < ref) {
            nextBday = getBirthdayInYear(nextBdayYear + 1);
        }

        const daysUntilBday = Math.round((nextBday - ref) / MS_PER_DAY);
        const nextBdayText = daysUntilBday === 0 ?
            'Selamat ulang tahun pada tanggal acuan ini!' :
            `${daysUntilBday.toLocaleString('id-ID')} hari lagi menuju ulang tahun berikutnya.`;

        const panelEl = document.getElementById('ageResultPanel');
        const mainEl = document.getElementById('ageMainOutput');
        const nextEl = document.getElementById('ageNextBirthdayOutput');

        if (panelEl && mainEl && nextEl) {
            mainEl.textContent = `${years} Tahun, ${months} Bulan, ${days} Hari`;
            nextEl.textContent = nextBdayText;
            panelEl.style.display = 'block';
        }
    }

    function resetDiffForm() {
        const today = formatTodayISO();
        const startEl = document.getElementById('startDate');
        const endEl = document.getElementById('endDate');
        const panelEl = document.getElementById('diffResultPanel');

        if (startEl) startEl.value = today;
        if (endEl) endEl.value = today;
        if (panelEl) panelEl.style.display = 'none';
    }

    function resetAgeForm() {
        const form = document.getElementById('ageCalcForm');
        const refEl = document.getElementById('referenceDate');
        const panelEl = document.getElementById('ageResultPanel');

        if (form) form.reset();
        if (refEl) refEl.value = formatTodayISO();
        if (panelEl) panelEl.style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', function() {
        const today = formatTodayISO();
        const startEl = document.getElementById('startDate');
        const endEl = document.getElementById('endDate');
        const refEl = document.getElementById('referenceDate');

        if (startEl) startEl.value = today;
        if (endEl) endEl.value = today;
        if (refEl) refEl.value = today;

        document.getElementById('modeDiffBtn')?.addEventListener('click', () => switchMode('diff'));
        document.getElementById('modeAgeBtn')?.addEventListener('click', () => switchMode('age'));
        document.getElementById('calcDiffBtn')?.addEventListener('click', calculateDateDiff);
        document.getElementById('resetDiffBtn')?.addEventListener('click', resetDiffForm);
        document.getElementById('calcAgeBtn')?.addEventListener('click', calculateAge);
        document.getElementById('resetAgeBtn')?.addEventListener('click', resetAgeForm);
    });
})();