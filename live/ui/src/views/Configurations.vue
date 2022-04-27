<template>
    <div>
        <v-app id="background">
            
            <v-card class="mx-auto" max-width="500">
                <v-toolbar color="blue" dark height="dense">
                    <v-toolbar-title>Support Groups</v-toolbar-title>
                </v-toolbar>
                <v-list height="600" style="overflow-y: scroll">
                    <v-subheader id="subheader-group">Select the groups</v-subheader>
                    <v-list-item-group v-model="settings" multiple>
                        <template v-for="group in groups">
                            <v-list-item :key="group.groupId" dense>
                                <template v-slot:default="{active}">
                                    <v-list-item-content>
                                        <v-list-item-title v-text="group.groupName"></v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-checkbox :ripple="false" v-if="!active"></v-checkbox>
                                        <v-checkbox :ripple="false" v-else color="yellow darken-3"></v-checkbox>
                                    </v-list-item-action>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list-item-group>
                </v-list>


            </v-card>
            {{settings}}
        </v-app>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: function () {
    return {

        settings: []
    }
  },
  async created () {
      this.getGroups()
  },
  computed: {
      ...mapState(["groups"])
  },
  methods: {
      ...mapActions(["getGroups"])
  }
}
</script>

<style>
#background {
    background: transparent !important;
}
#subheader-group {
    height: 20px !important;
}
.v-application--wrap { 
    min-height: none !important;
}
</style>
