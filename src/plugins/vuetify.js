import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

// const opts = {}

// export default new Vuetify(opts)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red.darken3,
        secondary: colors.red.lighten2,
        accent: colors.red.lighten3
      },
      dark: {
        primary: colors.cyan.darken3,
        secondary: colors.cyan.darken1,
        normal: colors.cyan.lighten3
      }
    }
  }
})