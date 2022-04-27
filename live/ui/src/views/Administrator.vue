<template>
    <div>
      <md-tabs class="md-transparent" id="tabs">

        <!-- /////////    CATALOG SUPPORT GROUPS     ////////// -->
        <md-tab id="tab-group" style="position:uset" md-label="Support Groups">
           <GroupsTab></GroupsTab>
          
        </md-tab>

        <!-- /////////     CATALOG CODES    ////////// -->
        <md-tab id="tab-codes" md-label="Codes">
          <CodesTab></CodesTab>
        </md-tab>

        <!-- /////////     CATALOG ESCALATION GROUPS    
        <md-tab id="tab-escalation-group" md-label="Escalation Group">
          <EscalationGroupTab></EscalationGroupTab>
        </md-tab>
        ////////// -->
        <!-- /////////     CATALOG ROLES    ////////// -->
        <md-tab id="tab-user-roles" md-label="User Roles">
          <UserRolesTab></UserRolesTab>
        </md-tab>

        <!-- /////////     CATALOG ESCALATION LEVELS    ////////// -->
        <md-tab id="tab-escalation-levels" md-label="Escalation Level">
          <EscalationLevelsTab></EscalationLevelsTab>
        </md-tab>

        <!-- /////////     CATALOG CAUSE CODES    ////////// -->
        <md-tab id="tab-cause-codes" md-label="Closed Codes">
          <closedCodes></closedCodes>
        </md-tab>

        <!-- /////////     CATALOG PLANTS    ////////// -->
        <md-tab id="tab-plants" md-label="Plants">
          <plants-tab></plants-tab>
        </md-tab>

        <!-- /////////     CATALOG AREAS    ////////// -->
        <md-tab id="tab-areas" md-label="Areas">
          <AreasTab></AreasTab>
        </md-tab>
        
      </md-tabs>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import GroupsTab from './admin-screens/Groups.vue'
import CodesTab from './admin-screens/Codes'
import AreasTab from './admin-screens/Areas.vue'
import PlantsTab from './admin-screens/Plants.vue'
//import EscalationGroupTab from './admin-screens/EscalationGroups.vue'
import UserRolesTab from './admin-screens/UserRoles.vue'
import closedCodes from './admin-screens/closedCodes.vue'
import EscalationLevelsTab from './admin-screens/EscalationLevels.vue'

export default {
  components: {
    CodesTab,
    GroupsTab,
    AreasTab,
    PlantsTab,
    //EscalationGroupTab,
    UserRolesTab,
    closedCodes,
    EscalationLevelsTab
  },
  data: function () {
    return {
      
    }
  },
  async created() {
    await this.getGroupTypes()
    await this.getLightColors()
  },
  computed: {
   
  },
  methods: {
    ...mapActions(["getGroupTypes", "getLightColors"])
  }
}
</script>

<style>
.md-transparent .md-tabs-navigation {
  position: unset;
}
#tabs {
  margin: 15px 0 0 0;
}
.md-tabs-container {
  transform: translate3d(0,0,0);
  transition: 0ms;
}
#tab-group, #tab-codes, #tab-areas, #tab-escalation-group, #tab-escalation-levels, #tab-cause-codes, #tab-plants {
  padding: 5px 50px;
}
</style>
