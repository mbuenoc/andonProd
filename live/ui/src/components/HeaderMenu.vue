<template>
  <div class="navbar-safran">
    <div class="secondary-navbar">
      <div class="navbar-header">
        <img src="../assets/logo.png">
      </div>
      <div class="third-navbar">
        <h1 class="activity">Andon</h1>
      </div>
    </div>
    <!-- :to="getPath('')" :to="getPath('open-reports')" :to="getPath('support')" :to="getPath('administrator')" -->
    <md-tabs md-sync-route md-alignment="centered">
      <md-tab id="tab-1" md-label="Create Report" to='/andon' exact></md-tab>
      <md-tab id="tab-2" md-label="Open Reports" to='/open-reports'></md-tab>
      <md-tab id="tab-3" md-label="Support" to='/support' v-if=" user.roleDescription == 'admin' || user.roleDescription == 'support'"></md-tab>
      <md-tab id="tab-4" md-label="Administrator" to='administrator' v-if=" user.roleDescription == 'admin'"></md-tab>
    </md-tabs>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: function () {
    return {

    }
  },
  async created() {
    await this.getUserRole()
    console.log(this.user)
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(["getUserRole"]),
    getPath(param) {
      var publicPath = process.env.NODE_ENV === 'production' ? '/andon/' : '/';
        console.log(param)
      return publicPath + param
    },

  }
}
</script>


<style>

.navbar-safran {
    margin: 0;
    font: 400 15px oswald,Arial,serif;
    color: #333333;
    box-shadow: 0 6px 20px 2px rgba(0,0,0,0.175);
    border: none;
    background: #ffffff;
    z-index: 998;
}

.navbar-safran .secondary-navbar .navbar-header {
    width: 220px;
    min-width: 160px;
    max-width: 220px;
    padding: 0 10px 0 24px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0,-50%);
}

.secondary-navbar {
    border-bottom: 1px solid #e4e4e4;
    min-height: 78px;
    max-height: 84px;
    color: #404040;
    position: relative;
    z-index: 1;
}

.navbar-safran .third-navbar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.navbar-safran .activity {
    display: block;
    font: 400 14px Oswald;
    text-transform: uppercase;
    color: #666666;
    margin: 10px;
}

.navbar-safran .activity:before,
.navbar-safran .activity:after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    height: 1px;
    background: #e4e4e4;
    margin-left: 10px;
    margin-right: 10px;
}

.md-button-content {
    font: 400 16px oswald;
    text-transform: uppercase;
    padding-right: 15px;
    padding-left: 15px;
}

.md-button.md-active {
  color: #000;
}

</style>