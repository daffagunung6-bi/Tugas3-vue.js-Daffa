// js/components/status-badge.js
Vue.component('status-badge', {
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            required: true
        }
    },
    computed: {
        isAman() {
            // Aman jika stok fisik saat ini melebihi atau sama dengan batas aman minimum
            return this.qty >= this.safety;
        }
    },
    template: `
        <div>
            <!-- Status Aman (Hijau) -->
            <span v-if="isAman" class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs">
                ✅ Aman
            </span>
            
            <!-- Status Menipis (Kuning/Oranye) -->
            <span v-else class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 shadow-2xs">
                ⚠️ Menipis
            </span>
        </div>
    `
});