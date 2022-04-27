<template>
    <div>
        <md-dialog :md-active.sync="showDialogSolve">
          <form @submit.prevent="validateSolution">
            <md-card>
              <md-card-header class="header-style">
                <span class="title" >{{ title }} Problem # {{ problemId }}</span>
              </md-card-header>

              <md-card-content id="card-content-style">
                <div class="md-layout md-gutter">
                  <div class="md-layout-item" id="dialog-closed-field">
                    <md-field :class="getValidationClass('selectedClosedCode1')">
                        <label for="level1">Level 1</label>
                        <md-select name="level1" id="level1" v-model="form.selectedClosedCode1" @input="getClosedCodes1()">
                            <md-option v-for="code in l1codes" :key="code.closedcodeId" :value="code.closedcodeId" :selected="code.closedcodeId == form.selectedClosedCode1" > {{code.closedcodeId+"-"+code.details}} </md-option>
                        </md-select>
                        <span class="md-error">This field is required</span>
                    </md-field>
                  </div>
                  <div class="md-layout-item" id="dialog-closed-field">
                    <md-field :class="getValidationClass('selectedClosedCode2')">
                        <label for="level2">Level 2</label>
                        <md-select name="level2" id="level2" v-model="form.selectedClosedCode2" @click="getClosedCodes2()">
                            <md-option v-for="code in l2codes" :key="code.closedcodeId" :selected ="code.closedcodeId == form.selectedClosedCode2" :value="code.closedcodeId== form.selectedClosedCode2"> {{code.closedcodeId+"-"+code.details}} </md-option>
                        </md-select>
                        <span class="md-error">This field is required</span>
                    </md-field>
                  </div>
                  <div class="md-layout-item" id="dialog-closed-field">
                    <md-field :class="getValidationClass('selectedClosedCode3')">
                        <label for="level3">Level 3</label>
                        <md-select name="level3" id="level3" v-model="form.selectedClosedCode3" @click="getClosedCodes3()">
                            <md-option v-for="code in l3codes" :key="code.closedcodeId" :selected ="code.closedcodeId == form.selectedClosedCode3" :value="code.closedcodeId == form.selectedClosedCode3"> {{code.closedcodeId+"-"+code.details}}  </md-option>
                        </md-select>
                        <span class="md-error">This field is required</span>
                    </md-field>
                  </div>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('solutionDesc')">
                      <label for="solution">Solution</label>
                      <md-input id="solution" name="solution" v-model="form.solutionDesc" maxlength="100" ></md-input>
                      <span class="md-error" v-if="!$v.form.solutionDesc.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.solutionDesc.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.solutionDesc.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('redefinition')">
                      <label for="redefinition">Problem Redefinition</label>
                      <md-input id="redefinition" name="redefinition" v-model="form.redefinition" maxlength="100" ></md-input>
                      <span class="md-error" v-if="!$v.form.redefinition.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.redefinition.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.redefinition.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('why1')">
                      <label for="why1">Why ?</label>
                      <md-input id="why1" name="why1" v-model="form.why1" maxlength="50"></md-input>
                      <span class="md-error" v-if="!$v.form.why1.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.why1.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.why1.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('why2')">
                      <label for="why2">Why ?</label>
                      <md-input id="why2" name="why2" v-model="form.why2" maxlength="50"></md-input>
                      <span class="md-error" v-if="!$v.form.why2.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.why2.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.why2.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('why3')">
                      <label for="why3">Why ?</label>
                      <md-input id="why3" name="why3" v-model="form.why3" maxlength="50"></md-input>
                      <span class="md-error" v-if="!$v.form.why3.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.why3.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.why3.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('why4')">
                      <label for="why4">Why ?</label>
                      <md-input id="why4" name="why4" v-model="form.why4" maxlength="50"></md-input>
                      <span class="md-error" v-if="!$v.form.why4.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.why4.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.why4.minValue">Invalid</span>
                  </md-field>
                </div>
                <div id="dialog-closed-field">
                  <md-field :class="getValidationClass('why5')">
                      <label for="why5">Why ?</label>
                      <md-input id="why5" name="why5" v-model="form.why5" maxlength="50"></md-input>
                      <span class="md-error" v-if="!$v.form.why5.required">This field is required</span>
                      <span class="md-error" v-else-if="!$v.form.why5.maxLength">Invalid</span>
                      <span class="md-error" v-else-if="!$v.form.why5.minValue">Invalid</span>
                  </md-field>
                </div>
              </md-card-content>

              <md-card-actions>
                <md-button @click="showDialogSolve = false">Cancel</md-button>
                <md-button type="submit" class="md-primary md-raised">{{ title }}</md-button>
              </md-card-actions>
            </md-card>
          </form>
        </md-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import {validationMixin} from 'vuelidate'
import { mapState } from 'vuex'
import {
  required,
  maxLength,
  minLength
} from 'vuelidate/lib/validators'
var parentId1
var parentId2
var default0code = [{"closecodeId":1,"details":"None","levelCode":0,"parentId":0}]
//var default1code = [{"closecodeId":1,"details":"None","levelCode":2,"parentId":58}]

export default {
    mixins: [validationMixin],
    props: ['selected'],
    data: function () {
        return {
            l1codes:[],
            l2codes:[],
            l3codes:[],
            title: '',
            showDialogSolve: false,
            problemId:null,
            close: true,
            form: {
                selectedClosedCode1:null,
                selectedClosedCode2:null,
                selectedClosedCode3:null,
                solutionDesc:null,
                redefinition: null,
                why1:null,
                why2:null,
                why3:null,
                why4:null,
                why5:null
            },
        }
    },
    validations: {
        form: {
            selectedClosedCode1: {
                required
            },
            selectedClosedCode2: {
                required
            },
            selectedClosedCode3: {
                required
            },
            solutionDesc: {
                required,
                maxLength: maxLength(100),
                minLength: minLength(5)
            },
            redefinition: {
                required,
                maxLength: maxLength(100),
                minLength: minLength(5)
            },
            why1: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(5)
            },
            why2: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(5)
            },
            why3: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(5)
            },
            why4: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(5)
            },
            why5: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(5)
            }
        }
    },
    created () {

    },
    computed: {
    ...mapState(['user'])
    },
    methods: {
        openDialogSolution(PId) {
            this.selected.problemId = PId
            this.showDialogSolve = true
            this.title = 'Close'
            this.close = true
            this.problemId = this.selected.problemId
            this.form.redefinition = this.selected.problemDesc
            this.form.why1 = this.selected.why1
            this.form.why2 = this.selected.why2
            this.form.why3 = this.selected.why3
            console.log(this.selected)
            this.getClosedCodes1()
            
        },
        openDialogEditSolution() {
            this.showDialogSolve = true
            this.title = 'Edit'
            this.close = false
            this.problemId = this.selected.problemId
            this.form.solutionDesc = this.selected.solutionDesc
            this.form.redefinition = this.selected.problemDesc
            this.form.selectedClosedCode1 = this.selected.closedCode1
            this.form.selectedClosedCode2 = this.selected.closedCode2
            this.form.selectedClosedCode3 = this.selected.closedCode3
            this.form.why1 = this.selected.why1
            this.form.why2 = this.selected.why2
            this.form.why3 = this.selected.why3
            this.form.why4 = this.selected.why4
            this.form.why5 = this.selected.why5
            this.getClosedCodes1()
            this.getClosedCodes2()
            this.getClosedCodes3()
        },
        getClosedCodes1() {
            parentId1 = this.form.selectedClosedCode1
            axios.get('/andon-api/api/closedcodes?parentId=' + 0)
            .then (Response => { console.log(Response.data)
                this.l1codes = Response.data;
                console.log(this.l1codes)
            })
            .catch (error => {console.log(error) })
            parentId1 = this.form.selectedClosedCode1
        },
        getClosedCodes2() {
            //var parentId = this.form.selectedClosedCode1
            axios.get('/andon-api/api/closedcodes?parentId=' + parentId1)
            .then (Response => { console.log(Response.data)
                this.l2codes = Response.data;
                if (this.l2codes == '') {
                    this.l2codes = default0code
                    this.form.selectedClosedCode2 = 1
                } 
                /*
                if (this.l2codes == '') {
                    this.selectLevel2 = true
                    this.selectLevel3 = true
                    this.form.selectedClosedCode2 = 1
                    this.form.selectedClosedCode3 = 1
                } else {
                    this.selectLevel2 = false
                    this.selectLevel3 = false
                    this.form.selectedClosedCode2 = null
                    this.form.selectedClosedCode3 = null
                }
                */
            })
            .catch (error => {console.log(error) })
             if (this.l2codes == '') {
                parentId2 = 1
             }else {
                parentId2 = this.form.selectedClosedCode2
             }
        },
        getClosedCodes3() {            
            parentId2 = this.form.selectedClosedCode2            
            if (parentId2 == 'false' || parentId2 == false ) 
             {                
                parentId2 = 1              
             }
            axios.get('/andon-api/api/closedcodes?parentId=' + parentId2)
            .then (Response => { console.log(Response.data)
                this.l3codes = Response.data;
                if (this.l3codes == '') {
                    this.l3codes = default0code    
                    this.form.selectedClosedCode3 = 1   
                    this.selected.closedCode3 = 1
                  //  code.closedcodeId = 1            
                }
                /*
                if (this.l3codes == '') {
                    this.selectLevel3 = true 
                    this.form.selectedClosedCode3 = 1
                } else {
                    this.selectLevel3 = false 
                    this.form.selectedClosedCode3 = null
                }
                */
                console.log(this.l3codes)
            })
            .catch (error => {console.log(error) })    
                  
        },
        validateSolution() {
            this.$v.$touch() 
            if (!this.$v.$invalid){
                if (this.close == true ) {
                    this.sendSolution()
                } else (
                    this.editSolution()
                )
            }
        },
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]
            if (field) {
                return {
                'md-invalid':field.$invalid && field.$dirty
                }
            }
        },
        sendSolution() {
            var problemId = this.selected.problemId
            var closedCode1 = this.form.selectedClosedCode1
            var closedCode2 = this.form.selectedClosedCode2
            var closedCode3 = this.form.selectedClosedCode3
            var solutionDesc = this.form.solutionDesc
            var redefinitionProblem = this.form.redefinition
            var why1 = this.form.why1
            var why2 = this.form.why2
            var why3 = this.form.why3
            var why4 = this.form.why4
            var why5 = this.form.why5
            var closedBy = this.user.userId

            let solution = {
                problemId:problemId,
                closedCode1:closedCode1,
                closedCode2:closedCode2,
                closedCode3:closedCode3,
                solutionDesc:solutionDesc,
                redefinitionProblem:redefinitionProblem,
                why1:why1,
                why2:why2,
                why3:why3,
                why4:why4,
                why5:why5,
                closedBy:closedBy
            }
            console.log(solution)
            
            axios.post('/andon-api/api/solution/add', solution)
            .then(Response => {
                console.log(Response)
                this.$toastr.s('The Andon #'+problemId+ ' has been closed succesfully', 'Success!')
                this.showDialogSolve = false
                this.clearFormSolution()
                this.$parent.getOpenReports()
                
            })
                .catch(error => {
                console.log(error.Response)
                this.$toastr.e('Something happend', 'Oops!')
                this.showDialogSolve = false
                this.clearFormSolution()        
            })
        },
        editSolution() {
            var problemId = this.selected.problemId
            var solutionId = this.selected.solutionId
            var closedCode1 = this.form.selectedClosedCode1
            var closedCode2 = this.form.selectedClosedCode2
            var closedCode3 = this.form.selectedClosedCode3
            var solutionDesc = this.form.solutionDesc
            var redefinition = this.form.redefinition
            var why1 = this.form.why1
            var why2 = this.form.why2
            var why3 = this.form.why3
            var why4 = this.form.why4
            var why5 = this.form.why5
            var editedBy = this.user.userId

            let solutionEdited = {
                problemId:problemId,
                solutionId:solutionId,
                closedCode1:closedCode1,
                closedCode2:closedCode2,
                closedCode3:closedCode3,
                solutionDesc:solutionDesc,
                redefinition:redefinition,
                why1:why1,
                why2:why2,
                why3:why3,
                why4:why4,
                why5:why5,
                editedBy:editedBy
            }
            console.log(solutionEdited)
            
            axios.post('/andon-api/api/solution/save', solutionEdited)
            .then(Response => {
                console.log(Response)
                this.$toastr.s('The Andon #'+problemId+ ' has been edited succesfully', 'Success!')
                this.showDialogSolve = false
                this.clearFormSolution()
                this.$parent.getClosedReports()
            })
                .catch(error => {
                console.log(error.Response)
                this.$toastr.e('Something happend', 'Oops!')
                this.showDialogSolve = false
                this.clearFormSolution()        
            })
        },
        clearFormSolution() {
            this.$v.$reset()
            this.form.selectedClosedCode1 = null,
            this.form.selectedClosedCode2 = null,
            this.form.selectedClosedCode3 = null,
            this.form.solutionDesc = null,
            this.form.why1 = null,
            this.form.why2 = null,
            this.form.why3 = null,
            this.form.why4 = null,
            this.form.why5 = null
        }
    }
}
</script>

<style>
#dialog-closed-field .md-field {
  margin: 0 0 10px 0;
  height: 45px;
}
.header-style {
    padding: 10px 16px;
    background-color: rgb(66,139,202);
    color: #ffff;
    font: 400 20px 'Oswald';
    text-transform: uppercase;
}

</style>