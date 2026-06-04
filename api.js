const ApiService = {
    async fetchData() {
        try {
            // Karena file ini dipanggil via index.html, jalurnya langsung ke data/
            const response = await fetch('data/dataBahanAjar.json');
            
            if (!response.ok) {
                throw new Error(`Gagal mengambil data JSON: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error("Eror pada ApiService fetch:", error);
            return null;
        }
    }
};