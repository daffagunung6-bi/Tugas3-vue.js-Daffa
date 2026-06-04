// js/components/order-form.js
Vue.component('order-form', {
    props: ['paketList', 'pengirimanList', 'trackingData'],
    data() {
        return { 
            formDO: { 
                nim: '', 
                nama: '', 
                ekspedisi: '', 
                paket: '', 
                tanggalKirim: '', 
                total: 0 
            } 
        }
    },
    watch: {
        'formDO.paket'(newVal) {
            if (!this.paketList) return;
            const pkt = this.paketList.find(p => p.kode === newVal);
            this.formDO.total = pkt ? pkt.harga : 0;
        }
    },
    methods: {
        submitDO() {
            if(!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.paket) {
                alert('🚨 Tolong lengkapi seluruh kolom form order!'); 
                return;
            }

            // --- LOGIKA AUTO SEQUENCE ---
            let nextNumber = 1; 

            if (this.trackingData && this.trackingData.length > 0) {
                let maxNum = 0;
                
                this.trackingData.forEach(item => {
                    const key = Object.keys(item)[0]; 
                    if (key && key.includes('-')) {
                        const parts = key.split('-');
                        const num = parseInt(parts[1], 10); 
                        if (!isNaN(num) && num > maxNum) {
                            maxNum = num;
                        }
                    }
                });
                
                nextNumber = maxNum + 1; 
            }

            const paddedNumber = String(nextNumber).padStart(4, '0');
            const sequenceCode = `DO2025-${paddedNumber}`;

            // --- PAYLOAD DATA ---
            const payload = {};
            payload[sequenceCode] = {
                nim: this.formDO.nim, 
                nama: this.formDO.nama, 
                ekspedisi: this.formDO.ekspedisi, 
                paket: this.formDO.paket,
                tanggalKirim: this.formDO.tanggalKirim || new Date().toISOString().split('T')[0], 
                total: this.formDO.total, 
                status: 'Dalam Perjalanan', // Sesuai tampilan di foto acuan
                perjalanan: [{ 
                    waktu: new Date().toLocaleString('id-ID'), 
                    keterangan: 'Manifes DO sukses dicatat secara urut di pangkalan data UT' 
                }]
            };

            this.$emit('create-do', payload);
            alert(`✅ Sukses menerbitkan DO baru dengan nomor urut: ${sequenceCode}`);
            
            // Reset isi form inputan
            this.formDO = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '', total: 0 };
        },
        // Helper untuk memparsing objek data tracking [{ "DO2025-0001": {...} }]
        getDOKey(item) {
            return Object.keys(item)[0];
        },
        getDODetail(item) {
            return item[this.getDOKey(item)];
        },
        getNamaPaket(kode) {
            if (!this.paketList) return kode;
            const pkt = this.paketList.find(p => p.kode === kode);
            return pkt ? pkt.nama : kode;
        },
        getNamaEkspedisi(kode) {
            if (!this.pengirimanList) return kode;
            const eksp = this.pengirimanList.find(e => e.kode === kode);
            return eksp ? eksp.nama : kode;
        },
        formatTanggal(strTanggal) {
            if (!strTanggal) return '-';
            const bulanIndo = ['Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli'];
            const d = new Date(strTanggal);
            if (isNaN(d.getTime())) return strTanggal;
            
            // Format manual agar nama bulan tampil rapi (Contoh: 25 Agustus 2025)
            const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
        }
    },
    template: `
    <div class="space-y-6">
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="border-b border-slate-100 pb-3 mb-4">
                <h2 class="font-bold text-sm text-slate-900">📦 Penerbitan Delivery Order (DO) Baru</h2>
            </div>
            <form @submit.prevent="submitDO" class="space-y-4 text-xs font-semibold text-slate-600">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-slate-400 mb-1">NIM Mahasiswa</label>
                        <input type="text" v-model="formDO.nim" placeholder="Contoh: 041234" class="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none" required>
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Nama Penerima</label>
                        <input type="text" v-model="formDO.nama" placeholder="Nama Lengkap" class="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none" required>
                    </div>
                </div>
                <div>
                    <label class="block text-slate-400 mb-1">Pilih Paket Modul UT</label>
                    <select v-model="formDO.paket" class="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 outline-none" required>
                        <option value="">-- Pilih Paket Bahan Ajar --</option>
                        <option v-for="p in paketList" :value="p.kode">{{ p.nama }} (Rp {{ p.harga.toLocaleString('id-ID') }})</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-slate-400 mb-1">Layanan Ekspedisi</label>
                        <select v-model="formDO.ekspedisi" class="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 outline-none" required>
                            <option value="">-- Ekspedisi --</option>
                            <option v-for="e in pengirimanList" :value="e.kode">{{ e.nama }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Tanggal Kirim</label>
                        <input type="date" v-model="formDO.tanggalKirim" class="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none">
                    </div>
                </div>
                <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex justify-between items-center">
                    <span class="text-xs font-bold text-blue-900">Total Biaya Logistik:</span>
                    <span class="text-base font-black text-blue-600">Rp {{ formDO.total.toLocaleString('id-ID') }}</span>
                </div>
                <button type="submit" class="w-full bg-[#002855] hover:bg-[#003d7a] text-white font-extrabold py-3 rounded-xl cursor-pointer transition uppercase tracking-wide">
                    Kirim Manifes DO ke Sistem Logistik
                </button>
            </form>
        </div>

        <div class="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <span class="text-sm">📋</span>
                <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Daftar Resi Delivery Order (DO)</h3>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th class="p-4 w-40">No. Manifes DO</th>
                            <th class="p-4">Data Mahasiswa</th>
                            <th class="p-4">Paket / Tarif</th>
                            <th class="p-4">Tgl Terbit / Kurir</th>
                            <th class="p-4 text-center w-48">Status Utama</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        <tr v-for="(item, index) in trackingData" :key="index" class="hover:bg-slate-50/60 transition">
                            <td class="p-4 font-code font-bold text-slate-900 text-sm">
                                {{ getDOKey(item) }}
                            </td>
                            
                            <td class="p-4">
                                <div class="font-bold text-slate-800 text-sm">{{ getDODetail(item).nama }}</div>
                                <div class="text-[10px] text-slate-400 font-mono mt-0.5">NIM: <span class="font-semibold">{{ getDODetail(item).nim }}</span></div>
                            </td>
                            
                            <td class="p-4">
                                <div class="text-slate-800 font-bold">{{ getDODetail(item).paket }}</div>
                                <div class="text-emerald-600 font-extrabold mt-0.5">Rp {{ getDODetail(item).total.toLocaleString('id-ID') }}</div>
                            </td>
                            
                            <td class="p-4">
                                <div class="text-slate-800 font-bold">{{ formatTanggal(getDODetail(item).tanggalKirim) }}</div>
                                <div class="text-blue-600 font-extrabold uppercase text-[10px] tracking-wide mt-0.5">
                                    {{ getNamaEkspedisi(getDODetail(item).ekspedisi) }}
                                </div>
                            </td>
                            
                            <td class="p-4 text-center">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 shadow-3xs">
                                    🚚 {{ getDODetail(item).status }}
                                </span>
                            </td>
                        </tr>
                        
                        <tr v-if="!trackingData || trackingData.length === 0">
                            <td colspan="5" class="p-8 text-center text-slate-400 font-medium">
                                📦 Belum ada resi pengiriman DO yang diterbitkan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`
});