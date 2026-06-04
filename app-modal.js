Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null
        };
    },
    methods: {
        show(title, message, callback) {
            this.title = title;
            this.message = message;
            this.onConfirm = callback;
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
        confirm() {
            if (this.onConfirm) this.onConfirm();
            this.close();
        }
    }
});