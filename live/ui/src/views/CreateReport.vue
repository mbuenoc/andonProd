<template>
    <div class="layout-report">
        <form novalidate  @submit.prevent="validateReport" id="form-design">       
            <div>
                <p class="subtitle">Report</p>
            </div>  
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('selectedPlant')">
                        <label for="plant">Plant</label>
                        <md-select name="plant" id="plant" v-model="form.selectedPlant"  @md-selected="getAreas()">
                            <md-option v-for="plant in plants" :key="plant.plantId" :value="plant.plantId"> {{plant.plantName}} </md-option>
                        </md-select>
                        <span class="md-error">The Plant is required</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('selectedArea')">
                        <label for="area">Area</label>
                        <md-select name="area" id="area" v-model="form.selectedArea">
                            <md-option v-for="area in areas" :key="area.areaId" :value="area.areaId"> {{area.areaName}} </md-option>
                        </md-select>
                        <span class="md-error">The Area is required</span>
                    </md-field>
                </div> 
            </div>
            <div>
                <p class="subtitle">Resposible</p>
            </div>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('selectedGroup')">
                        <label for="group">Group</label>
                        <md-select name="group" id="group" v-model="form.selectedGroup"  @md-selected="getCodes()">
                            <md-option v-for="group in groups" :key="group.groupId" :value="group.groupId"> {{group.groupName}} </md-option>
                        </md-select>
                        <span class="md-error">The Group is required</span>
                    </md-field>
                </div>
                
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('selectedCode')">
                        <label for="code">Code</label>
                        <md-select name="code" id="code" v-model="form.selectedCode" >
                            <md-option v-for="code in codes" :key="code.codeId" :value="code.codeId"> {{code.identifierCode}} - {{code.codeDescription}} </md-option>
                        </md-select>
                        <span class="md-error">The Code is required</span>
                    </md-field>
                </div>
            </div>
            <div>
                <p class="subtitle">Problem Information</p>
            </div>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-layout md-size-20" id="style-fields">
                    
                    <md-field :class="getValidationClass('location')">
                        <label for="location">Location</label>
                        <md-select name="location" id="location" v-model="form.location" >
                            <md-option v-for="location in locations" :key="location" :value="location"> {{location}} </md-option>
                        </md-select>
                        <span class="md-error">The Location is required</span>
                    </md-field>
                    
                    <!--
                    <div class="md-layout-item">
                        <md-autocomplete :class="getValidationClass('location')" v-model="form.location" :md-options="locations" :md-open-on-focus="true" :default="Office" >
                            <label>Location</label>
                            <span class="md-error">The Location is required</span>
                        </md-autocomplete>
                    </div>                   
                    -->
                </div>
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('partNumber')" :md-counter="false">
                        <label for="partNumber">Part Number</label>
                        <md-input id="partNumber" name="partNumber" v-model="form.partNumber" maxlength="20"></md-input>
                        <span class="md-error" v-if="!$v.form.partNumber.required">Part Number is required</span>
                        <span class="md-error" v-else-if="!$v.form.partNumber.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.partNumber.minLength">Invalid! </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('assembly')" :md-counter="false">
                        <label for="assembly">Component</label >
                        <md-input id="assembly" name="assembly" v-model="form.assembly" maxlength="20"></md-input>
                        <span class="md-error" v-if="!$v.form.assembly.required">Assembly number is required</span>
                        <span class="md-error" v-else-if="!$v.form.assembly.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.assembly.minLength">Invalid!</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-20" id="style-fields">
                    <md-field :class="getValidationClass('sapTransaction')" :md-counter="false">
                        <label for="sapTransaction">SAP Transaction</label>
                        <md-input id="sapTransaction" name="sapTransaction" v-model="form.sapTransaction" maxlength="20"></md-input>
                        <span class="md-error" v-if="!$v.form.sapTransaction.required">SAP Transaction is required</span>
                        <span class="md-error" v-else-if="!$v.form.sapTransaction.maxLength">Invalid! Input too long!</span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout md-gutter">
                
                
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-size-80" id="style-fields">
                    <md-field :class="getValidationClass('problem')">
                        <label for="problem">Description problem</label>
                        <md-input id="problem" name="problem" v-model="form.problem" maxlength="80"  md-counter="80"></md-input>
                        <span class="md-error" v-if="!$v.form.problem.required">Description problem is required</span>
                        <span class="md-error" v-else-if="!$v.form.problem.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.problem.minLength">Invalid! </span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-size-80" id="style-fields">
                    <md-field :class="getValidationClass('why1')">
                        <label for="why1">Why ?</label>
                        <md-input id="why1" name="why1" v-model="form.why1" maxlength="50" md-counter="50"></md-input>
                        <span class="md-error" v-if="!$v.form.why1.required">This field is required</span>
                        <span class="md-error" v-else-if="!$v.form.why1.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.why1.minLength">Invalid! </span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-size-80" id="style-fields">
                    <md-field :class="getValidationClass('why2')">
                        <label for="why2">Why ?</label>
                        <md-input id="why2" name="why2" v-model="form.why2" maxlength="50" md-counter="50"></md-input>
                        <span class="md-error" v-if="!$v.form.why2.required">This field is required</span>
                        <span class="md-error" v-else-if="!$v.form.why2.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.why2.minLength">Invalid</span>
                    </md-field>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-size-80" id="style-fields">
                    <md-field :class="getValidationClass('why3')">
                        <label for="why3">Why ?</label>
                        <md-input id="why3" name="why3" v-model="form.why3" maxlength="50" md-counter="50"></md-input>
                        <span class="md-error" v-if="!$v.form.why3.required">This field is required</span>
                        <span class="md-error" v-else-if="!$v.form.why3.maxLength">Invalid! Input too long!</span>
                        <span class="md-error" v-else-if="!$v.form.why3.minLength">Invalid! </span>
                    </md-field>
                </div>
            </div>
            <div class="button-section">
                <md-button class="md-raised md-primary" type="submit" id="button-send">Send</md-button>
            </div>
            
        </form>
    </div>
</template>

<script>
var path_test = '/andon-api/'
import axios from 'axios'
import swal from 'sweetalert'
import { mapActions, mapState } from 'vuex'
import {validationMixin} from 'vuelidate'
import {
    required,
    maxLength
} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    data: function () {
        return {
            areas:[],
            codes:[],
            alert: {
                title: '',
                text: '',
                icon:''
            },
            locations: [
                '1-A','2-A','3-A','4-A','5-A','6-A','7-A','8-A','9-A','10-A','11-A','12-A','13-A','14-A','15-A','16-A','17-A','18-A','19-A','20-A','21-A','22-A','23-A','24-A','25-A','26-A','27-A','28-A','29-A','30-A',
                '1-B','2-B','3-B','4-B','5-B','6-B','7-B','8-B','9-B','10-B','11-B','12-B','13-B','14-B','15-B','16-B','17-B','18-B','19-B','20-B','21-B','22-B','23-B','24-B','25-B','26-B','27-B','28-B','29-B','30-B',
                '1-C','2-C','3-C','4-C','5-C','6-C','7-C','8-C','9-C','10-C','11-C','12-C','13-C','14-C','15-C','16-C','17-C','18-C','19-C','20-C','21-C','22-C','23-C','24-C','25-C','26-C','27-C','28-C','29-C','30-C',
                '1-D','2-D','3-D','4-D','5-D','6-D','7-D','8-D','9-D','10-D','11-D','12-D','13-D','14-D','15-D','16-D','17-D','18-D','19-D','20-D','21-D','22-D','23-D','24-D','25-D','26-D','27-D','28-D','29-D','30-D',
                '1-E','2-E','3-E','4-E','5-E','6-E','7-E','8-E','9-E','10-E','11-E','12-E','13-E','14-E','15-E','16-E','17-E','18-E','19-E','20-E','21-E','22-E','23-E','24-E','25-E','26-E','27-E','28-E','29-E','30-E',
                '1-F','2-F','3-F','4-F','5-F','6-F','7-F','8-F','9-F','10-F','11-F','12-F','13-F','14-F','15-F','16-F','17-F','18-F','19-F','20-F','21-F','22-F','23-F','24-F','25-F','26-F','27-F','28-F','29-F','30-F',
                'Office'
            ],
            form: {
                selectedPlant: null,
                selectedArea: null,
                selectedGroup:null,
                selectedCode: null,
                location: null,
                partNumber: null,
                assembly: null,
                sapTransaction: null,
                problem: null,
                why1: null,
                why2: null,
                why3: null
            }

        }
    },
    validations: {
        form: {
            selectedPlant: { required },
            selectedArea: { required },
            selectedGroup: { required },
            selectedCode: { required },
            location: { required },
            partNumber: { required, maxLength:maxLength(20) },
            assembly: { required, maxLength:maxLength(20) },
            sapTransaction: { required, maxLength:maxLength(20) },
            problem: { required, maxLength:maxLength(80) },
            why1: { required, maxLength:maxLength(50) },
            why2: { required, maxLength:maxLength(50) },
            why3: { required, maxLength:maxLength(50) }
        }
    },
    async created() {
        await this.getPlants()
        console.log(this.plants)
        await this.getGroups()
        console.log(this.groups)
    },
    computed: {
        ...mapState(['plants', 'groups', 'user'])
    },
    methods: {
        ...mapActions(["getPlants", "getGroups"]),
        getAreas() {
            axios.get(path_test+'api/area')
            .then (Response => { console.log(Response.data)
                this.areas = Response.data; })
            .catch (error => {console.log(error) })
        },
        getCodes() {
            var group = this.form.selectedGroup
            var groupFiltered = this.groups.filter(function (x) {return x.groupId == group })
            var gtypeId = groupFiltered[0].gtypeId
            axios.get(path_test+'api/getcodes?gtypeId=' + gtypeId)
            .then (Response => { console.log(Response.data)
                this.codes = Response.data;
            })
            .catch (error => {console.log(error) })
        },
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]
            if (field) {
            return {
                'md-invalid': field.$invalid && field.$dirty
            }
            }
        },
        showAlert() {
           swal({
               title: this.alert.title,
               text: this.alert.text,
               icon: this.alert.icon,
               button: "Ok!"
           }) 
        },
        sendReport() {
            var plantId = this.form.selectedPlant
            var areaId = this.form.selectedArea
            var subareaId = 1
            var groupId = this.form.selectedGroup
            var codeId = this.form.selectedCode
            var location = this.form.location
            var componentPN = this.form.partNumber
            var whereUsed = this.form.assembly
            var sapTransaction = this.form.sapTransaction
            var problemDesc = this.form.problem
            var why1 = this.form.why1
            var why2 = this.form.why2
            var why3 = this.form.why3
            var submittedBy = this.user.userId

            let report = {  
                plantId:plantId, 
                areaId:areaId, 
                subareaId:subareaId, 
                groupId:groupId, 
                codeId:codeId, 
                location:location, 
                componentPN:componentPN, 
                whereUsed:whereUsed,
                sapTransaction:sapTransaction,
                problemDesc:problemDesc,
                why1: why1,
                why2: why2,
                why3: why3,
                submittedBy:submittedBy
            }

            console.log(report)
            this.clearForm()
            axios.post(path_test+'api/problem/add', report)
                .then(Response => {
                    console.log(Response)
                    var reportId = Response.data
                    this.alert.title = 'Report #'+ reportId
                    this.alert.text = 'The report has been create successfully.'
                    this.alert.icon = 'success'
                    this.showAlert()
                    this.clearForm()
                })
                .catch(error => {
                    console.log(error.Response)
                    this.alert.title = 'Error'
                    this.alert.text = 'Something happend, the report can not be create.'
                    this.alert.icon = 'error'
                    this.showAlert()
                    this.clearForm()
                })   
        },
        validateReport () {
            this.$v.$touch()
            if (!this.$v.$invalid) {
                const result = this.locations.filter(x => x == this.form.location)
                if (result == '') {
                    console.log('heeey selecciona una opcion valida')
                } else {
                    this.sendReport()
                }
            }
        },
        clearForm() {
            this.$v.$reset()
            this.form.selectedPlant = null
            this.form.selectedArea = null
            this.form.selectedGroup = null
            this.form.selectedCode = null
            this.form.location = null
            this.form.partNumber = null
            this.form.assembly = null
            this.form.sapTransaction = null
            this.form.problem = null
            this.form.why1 = null
            this.form.why2 = null
            this.form.why3 = null
        }
    }
}
</script>

<style>
.layout-report {
    margin: 20px 80px 0;
}
.subtitle {
    margin: 0;
    font: 400 20px oswald,Arial,serif;
}
#style-fields .md-field{
    margin: 0 0 15px;
}
.button-section {
    width: 80%;
}
#button-send {
   width: 10%;
   height: 40px; 
   float: right;
   margin: 15px 0 0 0;
}

#location-section {
    display: flex;
}
#locWord .md-theme-default{
    width: 15%;
}
</style>
