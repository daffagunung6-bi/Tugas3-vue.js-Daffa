// js/components/do-tracking.js
Vue.component('do-tracking', {
    // Diubah menjadi trackingData menyesuaikan atribut :tracking-data di index.html lu
    props: ['trackingData', 'paketList'],
    data() {
        return {
            searchKey: '',    // Menyimpan teks input nomor DO
            searchedDO: null, // Menyimpan objek DO jika ditemukan
            doKey: ''         // Menyimpan key manifes DO aktif
        }
    },
    methods: {
        cariDO() {
            this.searchedDO = null;
            this.doKey = '';
            
            if (!this.searchKey) {
                alert('🚨 Masukkan nomor DO terlebih dahulu, bro!');
                return;
            }
            
            const targetKey = this.searchKey.trim();
            
            // Validasi proteksi jika data array dari server/dosen belum masuk
            if (!this.trackingData) {
                alert('🚨 Data tracking dari sistem pusat belum siap!');
                return;
            }
            
            // Mencari nomor DO di dalam trackingData milik dataBahanAjar.json dosen
            const found = this.trackingData.find(item => Object.keys(item)[0] === targetKey);
            
            if (found) {
                this.doKey = targetKey;
                this.searchedDO = found[targetKey];
                console.log('✅ Manifes DO Berhasil Ditemukan:', this.searchedDO);
            } else {
                alert('🚨 Nomor DO tidak ditemukan di logistik UT! Coba tes menggunakan nomor DO resmi dosen: DO2025-0001');
            }
        },
        clearPencarian() {
            this.searchKey = '';
            this.searchedDO = null;
            this.doKey = '';
        },
        getNamaPaket(kode) {
            if (!this.paketList) return kode;
            const pkt = this.paketList.find(p => p.kode === kode);
            return pkt ? pkt.nama : kode;
        },
        formatRupiah(angka) {
            return 'Rp ' + (Number(angka) || 0).toLocaleString('id-ID');
        }
    },
    template: `
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto my-4">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <h3 class="text-sm font-bold text-slate-900">🔍 Pelacakan Manifes Delivery Order (DO)</h3>
        </div>
        
        <div class="flex gap-2 mb-4">
            <input type="text" v-model="searchKey" placeholder="Masukkan Nomor DO (Contoh: DO2025-0001)..." class="flex-1 p-2.5 border border-slate-200 font-code rounded-xl text-xs font-semibold outline-none focus:border-blue-500">
            <button @click="cariDO" type="button" class="px-5 bg-[#002855] hover:bg-[#003d7a] text-white text-xs font-extrabold rounded-xl transition cursor-pointer uppercase tracking-wider">Lacak</button>
            <button v-if="searchedDO" @click="clearPencarian" type="button" class="px-4 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer">Clear</button>
        </div>

        <div v-if="searchedDO" class="space-y-4 border-t border-slate-100 pt-4">
            <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-semibold text-slate-600">
                <div>
                    <p class="text-slate-400 text-[10px] uppercase">No. Manifes DO</p>
                    <p class="font-code font-bold text-blue-600 text-sm mt-0.5">{{ doKey }}</p>
                </div>
                <div>
                    <p class="text-slate-400 text-[10px] uppercase">Status Logistik</p>
                    <p class="font-bold text-emerald-600 mt-0.5">🟢 {{ searchedDO.status }}</p>
                </div>
                <div>
                    <p class="text-slate-400 text-[10px] uppercase">Nama Penerima / NIM</p>
                    <p class="font-bold text-slate-800 mt-0.5">{{ searchedDO.nama }} ({{ searchedDO.nim }})</p>
                </div>
                <div>
                    <p class="text-slate-400 text-[10px] uppercase">Paket Bahan Ajar</p>
                    <p class="font-bold text-slate-800 mt-0.5">{{ getNamaPaket(searchedDO.paket) }}</p>
                </div>
                <div class="col-span-2 border-t border-slate-200 pt-2 mt-1">
                    <p class="text-slate-400 text-[10px] uppercase">Total Biaya Pengiriman</p>
                    <p class="font-black text-slate-900 text-sm mt-0.5">{{ formatRupiah(searchedDO.total) }}</p>
                </div>
            </div>
            
            <div class="pt-2">
                <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Histori Logistik Perjalanan:</h4>
                <div class="relative border-l-2 border-slate-200 ml-2 space-y-4">
                    <div v-for="(p, index) in searchedDO.perjalanan" :key="index" class="relative pl-4">
                        <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600 border border-white"></div>
                        <p class="text-[10px] font-code text-slate-400">{{ p.waktu }}</p>
                        <p class="text-xs font-bold text-slate-700 mt-0.5">{{ p.keterangan }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
});