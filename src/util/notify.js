import NotifyComponent from '../components/Notify.vue'

const Notify = {};

// 注册

Notify.install = function (Vue) {
    const NotifyConstructor = Vue.extend(NotifyComponent)
    const instance = new NotifyConstructor();

    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    Vue.prototype.$notify = (msg, duration = 3000) => {
        instance.message = msg;
        instance.visible = true;

        setTimeout(() => {
            instance.visible = false;
        }, duration);
    }
}

export default Notify