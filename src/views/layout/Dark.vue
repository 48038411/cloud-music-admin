<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped color="success">
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content color="info">
      <v-container class="fill-height normal" fluid>
        <v-row align="center" justify="center">
          <v-btn color="red" class="ma-12" dark large fab @click="red">red</v-btn>
          <v-btn color="cyan" class="ma-12" dark large fab @click="cyan">cyan</v-btn>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  }),
  created() {
    this.$vuetify.theme.light = true
  },
  methods: {
    red() {
      this.$vuetify.theme.light = true
      this.$vuetify.theme.dark = false
    },
    cyan() {
      this.$vuetify.theme.dark = true
      this.$vuetify.theme.light = false
    }
  }
}
</script>
