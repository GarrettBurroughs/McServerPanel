import Vue from 'vue'
import App from './Login.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#login')
