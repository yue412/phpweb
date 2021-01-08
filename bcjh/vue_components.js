Vue.component('login-panel', {
    // 在 JavaScript 中是 camelCase 的
    props: ['login-ref'],
    data: {
        user_id: -1,
    },
    created: function () {
        this.user_id = getCookie("user_id");
        if (!this.is_login())
            this.go_login();
        else
            this.$emit('give-user', this.user_id);
    },
    methods: {
        is_login: function () {
            return this.user_id != "";
        },
        exit_login: function () {
            clearCookie("user_id");
            this.go_login();
        },
        go_login: function () {
            if (this.loginRef) {
                window.location.href = this.loginRef + "?source=" + encodeURIComponent(window.location.href);
            }
        }
    },
    template: '<span v-if="is_login()">已登录 <a v-on:click="exit_login()" href="#">退出</a></span><a v-bind:href="loginRef" v-else>登录</a>'
})