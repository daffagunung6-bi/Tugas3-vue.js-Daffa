// js/app.js

new Vue({
    el: '#app',
    data() {
        return {
            tab: 'stok', 
            isEditMode: false, 
            
            // State awal kosong terstruktur mengikuti dataBahanAjar.json dosen
            state: {
                stok: [],
                upbjjList: [],
                kategoriList: [],
                paket: [],
                pengirimanList: [],
                tracking: []
            },

            formBuku: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', qty: 0, safety: 10, harga: 0, catatanHTML: '' }
        };
    },
    computed: {
        totalEntri() { return this.state.stok ? this.state.stok.length : 0; },
        totalStokFisik() { return this.state.stok ? this.state.stok.reduce((acc, item) => acc + (Number(item.qty) || 0), 0) : 0; },
        totalNilaiAset() { return this.state.stok ? this.state.stok.reduce((acc, item) => acc + ((Number(item.qty) || 0) * (Number(item.harga) || 0)), 0) : 0; },
        totalModulKritis() { return this.state.stok ? this.state.stok.filter(item => Number(item.qty) <= Number(item.safety)).length : 0; }
    },
    methods: {
        simpanDataModul() {
            if (this.isEditMode) {
                const index = this.state.stok.findIndex(item => item.kode === this.formBuku.kode);
                if (index !== -1) this.state.stok.splice(index, 1, { ...this.formBuku });
                alert('Data modul berhasil diperbarui!');
            } else {
                this.state.stok.push({ ...this.formBuku, kode: this.formBuku.kode.toUpperCase() });
                alert('Modul logistik baru berhasil ditambahkan!');
            }
            this.cancelEdit(); this.tab = 'stok';
        },
        aktifkanEditMode(item) { this.isEditMode = true; this.formBuku = { ...item }; this.tab = 'input'; },
        cancelEdit() { this.isEditMode = false; this.formBuku = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', qty: 0, safety: 10, harga: 0, catatanHTML: '' }; },
        hapusModul(item) { if (confirm('Apakah Anda yakin ingin menghapus modul ini?')) this.state.stok = this.state.stok.filter(buku => buku.kode !== item.kode); },
        handleCreateDO(payload) { this.state.tracking.push(payload); alert('🎉 Sukses: Manifes DO Baru berhasil diterbitkan ke sistem logistik UT!'); }
    },
    mounted() {
        // MURNI FETCH LANGSUNG DATA BAHAN AJAR DARI DOSEN
        fetch('data/dataBahanAjar.json')
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat file dataBahanAjar.json');
                return response.json();
            })
            .then(data => {
                this.state = data;
                if (this.state.kategoriList && this.state.kategoriList.length > 0) this.formBuku.kategori = this.state.kategoriList[0];
                if (this.state.upbjjList && this.state.upbjjList.length > 0) this.formBuku.upbjj = this.state.upbjjList[0];
                console.log('✅ Berhasil memuat struktur terpisah sesuai instruksi!');
            })
            .catch(error => {
                console.error('🚨 Error Memuat Data Dosen:', error);
            });
    }
});