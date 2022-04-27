<template>
    <div class="reports-layout">
      <div class="title">
        <p class="subtitle">Choose an Area to see all the Andons</p>
      </div>
      <div class="md-layout" id="area-dropdown">
        <div class="md-layout-item md-size-50">
          <md-field>
            <label for="area">Select an Area</label>
            <md-select v-model="selectedAreas" @md-selected="areaOptions()"  multiple>
              <md-option value = "All" >All Areas</md-option>
              <md-option v-for="area in areas" :key="area.areaId" :value="area.areaId" :disabled="allSelected"  >{{area.areaName}}</md-option>
            </md-select>
          </md-field>
        </div>
      </div> 
      <div class="md-layout" id="open-reports-table">
        <md-table v-model="reports" md-sort="" md-sort-order="asc" md-card md-fixed-header>
          <md-table-empty-state
            v-show="showEmptyState === true"
            class="md-accent"
            md-icon="done"
            md-label="YAY! No Andons created"
            md-description = "Theres no Andons created from this areas" >
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" id="hola1">
            <md-table-cell md-label="#Report" id="table-cell-id" md-sort-by="id" md-numeric> {{ item.problemId }} </md-table-cell>
            <md-table-cell md-label="Plant" md-sort-by="plantName" > {{ item.plantName }} </md-table-cell>
            <md-table-cell md-label="Area" md-sort-by="areaName"> {{ item.areaName }} </md-table-cell>
            <!-- <md-table-cell md-label="Subarea" md-sort-by="subareaName" > {{ item.subareaName }} </md-table-cell> -->
            <md-table-cell md-label="Group" md-sort-by="groupName" > {{ item.groupName }} </md-table-cell>
            <md-table-cell md-label="Code" md-sort-by="code" > {{ item.identifierCode }} </md-table-cell>
            <md-table-cell md-label="Location" md-sort-by="location"> {{ item.location }} </md-table-cell>
            <md-table-cell md-label="Open Date" md-sort-by="dateOpen" > {{ item.openDate | moment("MMM / DD / YYYY, HH:mm:ss") }} </md-table-cell>
            <md-table-cell md-label="Attended by" md-sort-by="attendedBy" > {{ item.attendedBy }} </md-table-cell>
          </md-table-row>
        </md-table>

      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'

export default {
  data: function () {
    return {
      reports: [],
      selectedAreas: [],
      allAreas:[],
      selectedSubareas: [],
      allSelected: false,
      showEmptyState : false
    }
  },
  async created () {
    await this.getAreas() 
    console.log(this.areas)
  },
  computed: {
    ...mapState(['areas'])

  },
  methods: {
    ...mapActions(['getAreas']),
    areaOptions() {
      const index = this.selectedAreas.findIndex(area => area === "All")
      if(this.selectedAreas[index] === "All") {
        console.log('all areas selected')
        this.allSelected = true
        this.allAreas = this.areas.map(a => a.areaId)
      } else {
        console.log('some areas')
        this.allSelected = false
        this.allAreas = this.selectedAreas
      }
      this.getOpenReports()
    },
    getOpenReports() {
      let areaId = this.allAreas
      console.log(this.selectedAreas)
      axios.post('/andon-api/api/getopenreport', areaId)
        .then (Response => { console.log(Response.data)
          this.reports = Response.data;
          console.log(this.reports.length)
          if (this.reports.length == 0) {this.showEmptyState = true} else {this.showEmptyState = false}
        })
        .catch (error => {console.log(error) })
    }
  }
}
</script>

<style>
.reports-layout {
  margin: 20px 40px;
}

#table-cell-id .md-table-cell-container{
  padding: 6px 10px06px 15px;
}
#area-dropdown {
  width: 30%;
}
.subtitle {
  margin: 0;
  font-family: 'Oswald';
  font-size: 20px;

}
#open-reports-table {
  display: block;
}
#open-reports-table .md-table-fixed-header .md-table-fixed-header-container {
  width: 100%;
}
</style>
