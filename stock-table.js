// js/components/stock-table.js
Vue.component('stock-table', {
    props: ['stok', 'upbjjList', 'kategoriList'],
    template: `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
        <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                    <th class="p-4">KODE</th>
                    <th class="p-4">JUDUL BUKU BAHAN AJAR</th>
                    <th class="p-4">KATEGORI</th>
                    <th class="p-4">UPBJJ TARGET</th>
                    <th class="p-4">RAK</th>
                    <th class="p-4">HARGA</th>
                    <th class="p-4">STOK / SAFETY</th>
                    
                    <th class="p-4">STATUS</th>
                    
                    <th class="p-4 text-center">AKSI INTERAKSI</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                <tr v-for="item in stok" :key="item.kode" class="hover:bg-slate-50/80 transition">
                    <td class="p-4 font-code font-bold text-blue-600">{{ item.kode }}</td>
                    <td class="p-4 font-bold text-slate-900">
                        {{ item.judul }}
                        <div v-if="item.catatanHTML" class="text-[10px] text-slate-400 font-normal mt-0.5" v-html="item.catatanHTML"></div>
                    </td>
                    <td class="p-4">
                        <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                            {{ item.kategori }}
                        </span>
                    </td>
                    <td class="p-4 text-slate-600">{{ item.upbjj }}</td>
                    <td class="p-4 font-code text-slate-400">{{ item.lokasiRak || '-' }}</td>
                    <td class="p-4 font-bold text-slate-900">Rp {{ item.harga.toLocaleString('id-ID') }}</td>
                    <td class="p-4 font-bold text-slate-800">
                        {{ item.qty }} <span class="text-slate-300 mx-1">/</span> <span class="text-slate-400 font-normal">{{ item.safety }}</span>
                    </td>
                    
                    <td class="p-4">
                        <status-badge :qty="item.qty" :safety="item.safety"></status-badge>
                    </td>
                    
                    <td class="p-4 text-center space-x-1 whitespace-nowrap">
                        <button @click="$emit('edit-item', item)" type="button" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer transition shadow-2xs">
                            Edit
                        </button>
                        <button @click="$emit('delete-item', item.kode)" type="button" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg cursor-pointer transition border border-rose-200/40">
                            Hapus
                        </button>
                    </td>
                </tr>
                <tr v-if="!stok || stok.length === 0">
                    <td colspan="9" class="p-8 text-center text-slate-400 font-medium">
                        📦 Belum ada data modul inventaris terdaftar.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
});