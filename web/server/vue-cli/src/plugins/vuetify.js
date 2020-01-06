import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

const opts = {
  iconfont: 'mdi',
  theme: {
    themes: {
      light: {
        primary: '#2196f3',
        secondary: '#03a9f4',
        accent: '#009688',
        error: '#f44336',
        warning: '#ff9800',
        info: '#3f51b5',
        success: '#4caf50'
      }
    },
  }
}

export default new Vuetify(opts)
