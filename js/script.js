// ==========================================
// 0. HELPER MODAL ALERT
// ==========================================
function ensureAlertModalExists() {
    if (document.getElementById('mytoolsAlertModal')) return;

    const modalHTML = `
        <div class="modal fade mytools-modal" id="mytoolsAlertModal" tabindex="-1" aria-labelledby="mytoolsAlertModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="d-flex align-items-center gap-2">
                            <span id="mytoolsModalIcon" class="modal-icon-badge modal-icon-warning">
                                <i class="fas fa-triangle-exclamation"></i>
                            </span>
                            <h5 class="modal-title fs-6 fw-bold mb-0" id="mytoolsAlertModalLabel">Perhatian</h5>
                        </div>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body" id="mytoolsAlertModalBody">
                        Pesan notifikasi.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-modern w-100 justify-content-center" data-bs-dismiss="modal">
                            Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Menampilkan modal notifikasi modern
 * @param {string} title - Judul modal
 * @param {string} message - Isi pesan
 * @param {'warning'|'danger'|'success'} type - Gaya ikon modal
 */
function showAlertModal(title, message, type = 'warning') {
    ensureAlertModalExists();

    const modalEl = document.getElementById('mytoolsAlertModal');
    const titleEl = document.getElementById('mytoolsAlertModalLabel');
    const bodyEl = document.getElementById('mytoolsAlertModalBody');
    const iconWrap = document.getElementById('mytoolsModalIcon');

    if (!modalEl || !titleEl || !bodyEl || !iconWrap) return;

    titleEl.textContent = title;
    bodyEl.textContent = message;

    iconWrap.className = 'modal-icon-badge';
    if (type === 'danger') {
        iconWrap.classList.add('modal-icon-danger');
        iconWrap.innerHTML = '<i class="fas fa-circle-xmark"></i>';
    } else if (type === 'success') {
        iconWrap.classList.add('modal-icon-success');
        iconWrap.innerHTML = '<i class="fas fa-circle-check"></i>';
    } else {
        iconWrap.classList.add('modal-icon-warning');
        iconWrap.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
    }

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

// ==========================================
// 1. KALKULATOR BMI (weight.html)
// ==========================================
function hitungBMI() {
    const berat = parseFloat(document.getElementById('berat')?.value);
    const tinggiCm = parseFloat(document.getElementById('tinggi')?.value);

    if (isNaN(berat) || isNaN(tinggiCm) || berat <= 0 || tinggiCm <= 0) {
        showAlertModal(
            "Input Tidak Valid",
            "Masukkan angka yang lebih besar dari nol untuk berat badan (kg) dan tinggi badan (cm).",
            "warning"
        );
        return;
    }

    const tinggiM = tinggiCm / 100;
    const bmi = berat / (tinggiM * tinggiM);
    const bmiFix = bmi.toFixed(2);

    let kategori = '';
    let badgeColor = '#0f172a';

    if (bmi < 18.5) {
        kategori = 'Kekurangan berat badan';
        badgeColor = '#d97706';
    } else if (bmi < 25) {
        kategori = 'Berat badan normal';
        badgeColor = '#059669';
    } else if (bmi < 30) {
        kategori = 'Kelebihan berat badan';
        badgeColor = '#ea580c';
    } else {
        kategori = 'Obesitas';
        badgeColor = '#dc2626';
    }

    const hasilBox = document.getElementById('hasilBMI');
    const nilaiEl = document.getElementById('nilaiBMI');
    const kategoriEl = document.getElementById('kategoriBMI');

    if (hasilBox && nilaiEl && kategoriEl) {
        hasilBox.style.display = 'block';
        nilaiEl.textContent = `BMI Anda: ${bmiFix}`;
        kategoriEl.textContent = `Kategori: ${kategori}`;
        kategoriEl.style.color = badgeColor;
    }
}

function resetBMIForm() {
    const form = document.getElementById('bmiForm');
    const hasilBox = document.getElementById('hasilBMI');
    if (form) form.reset();
    if (hasilBox) hasilBox.style.display = 'none';
}

// ==========================================
// 2. KALKULATOR MATEMATIKA (calculator.html)
// ==========================================
function hitung(operator) {
    const angka1 = parseFloat(document.getElementById('angka1')?.value);
    const angka2 = parseFloat(document.getElementById('angka2')?.value);
    const hasilEl = document.getElementById('hasil');

    if (!hasilEl) return;

    if (isNaN(angka1) || isNaN(angka2)) {
        hasilEl.value = '';
        showAlertModal(
            "Data Belum Lengkap",
            "Pastikan Angka Pertama dan Angka Kedua sudah diisi dengan angka yang valid.",
            "warning"
        );
        return;
    }

    let hasil;
    switch (operator) {
        case '+':
            hasil = angka1 + angka2;
            break;
        case '-':
            hasil = angka1 - angka2;
            break;
        case '*':
            hasil = angka1 * angka2;
            break;
        case '/':
            if (angka2 === 0) {
                hasilEl.value = '';
                showAlertModal(
                    "Operasi Tidak Diizinkan",
                    "Pembagian dengan nol (0) tidak diperbolehkan. Silakan ubah Angka Kedua.",
                    "danger"
                );
                return;
            }
            hasil = angka1 / angka2;
            break;
        default:
            showAlertModal("Operator Tidak Dikenali", "Pilih operasi matematika yang tersedia.", "danger");
            return;
    }

    hasilEl.value = Number.isInteger(hasil) ? hasil : Number(hasil.toFixed(6));
}

function resetCalcForm() {
    const form = document.getElementById('calcForm');
    const hasilEl = document.getElementById('hasil');
    if (form) form.reset();
    if (hasilEl) hasilEl.value = '';
}

// ==========================================
// 3. KONVERSI MATA UANG (money-conversion.html)
// ==========================================
const rates = {
    IDR: { IDR: 1, USD: 0.000064, EUR: 0.000059, KRW: 0.084, JPY: 0.010 },
    USD: { IDR: 15600, USD: 1, EUR: 0.92, KRW: 1310, JPY: 156 },
    EUR: { IDR: 17000, USD: 1.09, EUR: 1, KRW: 1420, JPY: 170 },
    KRW: { IDR: 12, USD: 0.00076, EUR: 0.00070, KRW: 1, JPY: 0.12 },
    JPY: { IDR: 140, USD: 0.0064, EUR: 0.0059, KRW: 8.4, JPY: 1 }
};

function convert() {
    const amount = parseFloat(document.getElementById('amount')?.value);
    const from = document.getElementById('from')?.value;
    const to = document.getElementById('to')?.value;
    const resultEl = document.getElementById('result');

    if (!resultEl) return;

    if (isNaN(amount) || amount <= 0) {
        showAlertModal(
            "Nominal Tidak Valid",
            "Masukkan jumlah uang yang valid dan lebih besar dari nol.",
            "warning"
        );
        return;
    }

    if (!from || !to || !rates[from] || !rates[from][to]) {
        showAlertModal(
            "Mata Uang Belum Dipilih",
            "Silakan pilih mata uang asal ('Dari') dan mata uang tujuan ('Ke') terlebih dahulu.",
            "warning"
        );
        return;
    }

    const converted = amount * rates[from][to];
    const formatted = converted.toLocaleString('id-ID', {
        minimumFractionDigits: to === 'IDR' || to === 'KRW' ? 0 : 2,
        maximumFractionDigits: 2
    });

    resultEl.textContent = `${formatted} ${to}`;
}

function resetForm() {
    const amountEl = document.getElementById('amount');
    const fromEl = document.getElementById('from');
    const toEl = document.getElementById('to');
    const resultEl = document.getElementById('result');

    if (amountEl) amountEl.value = '';
    if (fromEl) fromEl.selectedIndex = 0;
    if (toEl) toEl.selectedIndex = 0;
    if (resultEl) resultEl.textContent = '-';
}

// ==========================================
// 4. PENGHITUNG KATA & KARAKTER (pages/tools/word-counter.html)
// ==========================================
function updateTextStats() {
    const inputEl = document.getElementById('textInput');
    if (!inputEl) return;

    const text = inputEl.value;
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const charWithSpace = text.length;
    const charNoSpace = text.replace(/\s/g, '').length;
    const sentences = trimmed ?
        trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length :
        0;

    const totalSeconds = Math.ceil((words / 200) * 60);
    let bacaText = '0 detik';
    if (words > 0) {
        if (totalSeconds < 60) {
            bacaText = `${totalSeconds} detik`;
        } else {
            const menit = Math.floor(totalSeconds / 60);
            const sisaDetik = totalSeconds % 60;
            bacaText = sisaDetik > 0 ? `${menit} menit ${sisaDetik} detik` : `${menit} menit`;
        }
    }

    const wordEl = document.getElementById('wordCount');
    const withSpaceEl = document.getElementById('charWithSpace');
    const noSpaceEl = document.getElementById('charNoSpace');
    const sentenceEl = document.getElementById('sentenceCount');
    const readingEl = document.getElementById('readingTime');

    if (wordEl) wordEl.textContent = words.toLocaleString('id-ID');
    if (withSpaceEl) withSpaceEl.textContent = charWithSpace.toLocaleString('id-ID');
    if (noSpaceEl) noSpaceEl.textContent = charNoSpace.toLocaleString('id-ID');
    if (sentenceEl) sentenceEl.textContent = sentences.toLocaleString('id-ID');
    if (readingEl) readingEl.textContent = bacaText;
}

function copyText() {
    const inputEl = document.getElementById('textInput');
    if (!inputEl) return;

    if (!inputEl.value.trim()) {
        showAlertModal(
            "Teks Kosong",
            "Tidak ada teks yang dapat disalin. Silakan ketik atau tempel teks terlebih dahulu.",
            "warning"
        );
        return;
    }

    navigator.clipboard.writeText(inputEl.value).then(() => {
        showAlertModal(
            "Berhasil Disalin",
            "Teks telah disalin ke clipboard.",
            "success"
        );
    }).catch(() => {
        inputEl.select();
        document.execCommand('copy');
        showAlertModal(
            "Berhasil Disalin",
            "Teks telah disalin ke clipboard.",
            "success"
        );
    });
}

function clearTextCounter() {
    const inputEl = document.getElementById('textInput');
    if (!inputEl) return;

    if (!inputEl.value) {
        showAlertModal(
            "Sudah Kosong",
            "Area teks sudah kosong.",
            "warning"
        );
        return;
    }

    inputEl.value = '';
    updateTextStats();
    inputEl.focus();
}

// ==========================================
// 5. FORM KONTAK & INISIALISASI UI
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const formKontak = document.getElementById('formKontak');
    if (formKontak) {
        formKontak.addEventListener('submit', function(e) {
            e.preventDefault();

            const nama = document.getElementById('nama')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const pesan = document.getElementById('pesan')?.value.trim();

            if (!nama || !email || !pesan) {
                showAlertModal(
                    "Form Belum Lengkap",
                    "Mohon lengkapi nama, email, dan pesan sebelum mengirim.",
                    "warning"
                );
                return;
            }

            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.classList.remove('d-none');
                setTimeout(function() {
                    successMsg.classList.add('d-none');
                }, 4000);
            }

            this.reset();
        });
    }

    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', updateTextStats);
        updateTextStats();
    }

    document.querySelectorAll('.nav-toggler-btn').forEach(function(button) {
        const collapseId = button.getAttribute('aria-controls');
        const navbarCollapse = collapseId ? document.getElementById(collapseId) : null;

        if (!navbarCollapse) return;

        function updateMenuTooltip(isOpen) {
            button.setAttribute('data-tooltip', isOpen ? 'Tutup' : 'Menu');
            button.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka menu navigasi');
        }

        updateMenuTooltip(navbarCollapse.classList.contains('show'));
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            updateMenuTooltip(true);
        });
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            updateMenuTooltip(false);
        });
    });

    // Tutup menu mobile otomatis setelah klik link navigasi
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
});

// ==========================================
// 6. EFEK SCROLL NAVBAR
// ==========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
});