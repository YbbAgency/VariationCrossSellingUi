<template>
  <v-main class="pa-0"  >
    <v-toolbar height="41px">

    </v-toolbar>

    <v-row class="mt-1">
      <v-col cols="6">
      <v-card class="elevation-2 ml-2">
        <v-card-title >
          <div  class="flex-fill d-flex" style="margin-bottom: 5px">
            <v-text-field
                outlined
                readonly
                @click="$store.commit('searchingFor','var');$router.push({path: '/search'})"
                v-model="selectedVariation.varId"
                label="Varianten Id"
                class="mb-0 pb-0"
            ></v-text-field>
            <template v-if="selectedVariation.varId > 0" >
              <v-btn class="mr-4 mt-2 ml-3"  style="background: rgb(241 241 83);color: white" @click="$store.commit('searchingFor','var');$router.push({path: '/search'})">
                <v-icon >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <template v-else>
              <v-btn class="mr-4 mt-2 ml-3"   color="success" @click="$store.commit('searchingFor','var');$router.push({path: '/search'})">
                <v-icon>
                  mdi-magnify
                </v-icon>
              </v-btn>
            </template>
            <v-btn class="mt-2"  color="warning"
                   @click="$store.commit('selectedVariation',{});$store.commit('crossSeller',[])">
              <v-icon>
                mdi-arrow-u-left-bottom
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <template v-if="selectedVariation.varId > 0">
          <v-card-text style="padding: 12px!important">
            <v-row class="mt-1 pa-3" >
              <v-col cols="1" class="d-flex" style=" align-items: start;">
                <v-avatar style="width: unset;height: unset">
                  <img :src="selectedVariation.image" class="img-fluid" style="max-height: 80px;">
                </v-avatar>
              </v-col>
              <v-col cols="11">
                <v-row>
                  <v-col cols="12">
                    <h3>{{ selectedVariation.itemName }}</h3>
                    Varianten-Id: <b>{{ selectedVariation.varId }}</b> / Item-Id: {{ selectedVariation.itemId }} <template v-if="selectedVariation.varNumber"> / Varianten-Nummer: {{ selectedVariation.varNumber}}</template>
                    <template v-if="selectedVariation.manufacturer !== '' " >
                      Hersteller : {{ selectedVariation.manufacturer }}
                    </template>x
                    <template>
                      <br>
                      Attribute:
                      <ul v-if="selectedVariation.attributes.length > 0" class="list-unstyled list-inline">
                        <li :key="selectedVariation.varId+'_attr_'+attribute.value.names.name"  v-for="attribute in selectedVariation.attributes">
                          <span  class="font-weight-bold" v-html="attribute.attribute.names.name"></span>: <span v-html="attribute.value.names.name"></span>
                        </li>
                      </ul>
                    </template>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </template>
      </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="elevation-2" style="height:100%">
        <v-card-title>
          Verknüpfte Cross Seller
          <div class="d-flex align-center">
            <v-btn  @click="$store.commit('searchingFor','cross');$router.push({path: '/search'})"  :disabled="selectedVariation.varId == undefined " class="mr-4 mt-2" style="margin-left: 15px;margin-bottom: 5px"  color="success">
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
            <v-btn :disabled="crossSeller.length < 1" @click="modal.deleteAll = true" class="mr-4 mt-2" style="margin-left: 15px;margin-bottom: 5px"  color="error">
              <v-icon>
                mdi-delete-outline
              </v-icon>
            </v-btn>
          </div>

        </v-card-title>
        <v-card-text  class="colorList"  style="padding: 12px!important">
          <template v-for="(xSeller,index) in crossSeller">
            <v-row  :key="'delete_'+xSeller.varId"  class="mt-1 pa-3 coloredRow" >
              <template v-if="crossSeller.length > 0">
                <v-col cols="2" class="d-flex ">
                  <div style="display: flex;flex-direction: column; align-items: center;">
                    <v-btn :disabled="crossSeller.indexOf(xSeller) == 0" class="position-btn mb-1" @click="recalcPostitions(xSeller,index-1)">
                      <v-icon>
                        mdi-arrow-up-circle-outline
                      </v-icon>
                    </v-btn>
                    <template>
                    </template>
                    <v-btn  :disabled="crossSeller.indexOf(xSeller)  == crossSeller.length-1" class="position-btn" @click="recalcPostitions(xSeller,index+1)">
                      <v-icon>
                        mdi-arrow-down-circle-outline
                      </v-icon>
                    </v-btn>
                  </div>
                  <div class="ml-2 mt-1">
                    <v-text-field
                        type="number"
                        label="Position"
                        :value="index+1"
                        style="width: 64px"
                        :disabled="crossSeller.length < 2"
                        @change="recalcPostitions(xSeller,$event-1)"
                        :rules="[rules.notSame, rules.greaterZero]"
                        :loading="loading.position"
                    ></v-text-field>
                  </div>
                </v-col>
              </template>
              <v-col cols="1" class="d-flex" style=" align-items: start;">
                <v-avatar style="width: unset;height: unset">
                  <img :src="xSeller.image" class="img-fluid" style="max-height: 80px;">
                </v-avatar>
              </v-col>
              <v-col cols="7">
                <v-row>
                  <v-col cols="12">
                    <h3>{{ xSeller.itemName }}</h3>
                    Varianten-Id: <b>{{ xSeller.varId }}</b> / Item-Id: {{ xSeller.itemId }} <template v-if="xSeller.varNumber"> / Varianten-Nummer: {{ xSeller.varNumber}}</template>
                    <template v-if="xSeller.manufacturer !== '' " >
                      Hersteller : {{ xSeller.manufacturer }}
                    </template>x
                    <template>
                      <br>
                      Attribute:
                      <ul v-if="xSeller.attributes.length > 0" class="list-unstyled list-inline">
                        <li  :key="xSeller.varId+'_attr_'+index" v-for="(attribute,index) in xSeller.attributes">
                          <span class="font-weight-bold" v-html="attribute.attribute.names.name"></span>: <span v-html="attribute.value.names.name"></span>
                        </li>
                      </ul>
                    </template>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="1" class="d-flex align-center">
                <v-btn class="badge-btn"  color="error" @click="deleteCrossSeller([xSeller])">
                  <v-icon>
                    mdi-delete-outline
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
      </v-col>
    </v-row>
    <v-dialog
          transition="dialog-top-transition"
          max-width="600"
          v-model="modal.deleteAll"
      >
        <v-card>
          <v-toolbar color="error" class="text-h6" dark>
            Alle Verknüpften Cross Seller löschen
          </v-toolbar>
          <v-card-text>
            <div class="text-h5 pa-5"> Löscht alle Verknüpfungen für Cross Seller an der Variante: <br> <b>{{ selectedVariation.varId }} - {{ selectedVariation.itemName }}</b></div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="error" @click="deleteCrossSeller(crossSeller);modal.deleteAll = false">
              <v-icon>
                mdi-delete
              </v-icon>
              Löschen
            </v-btn>
            <v-btn color="primary"  @click="modal.deleteAll = false">
              Abbrechen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        top
        right
        elevation="15"
        :color="alerts.delete.type"
        :timeout="3000"
        v-model="alerts.delete.isActive"
      >
      {{ alerts.delete.message }}
    </v-snackbar>
    <v-snackbar
        top
        right
        elevation="15"
        :color="alerts.position.type"
        :timeout="3000"
        v-model="alerts.position.isActive"
    >
      {{ alerts.position.message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: 'Main',
  data: () => ({
    loading:
        {
          position:false,
        },
    modal:{
      deleteAll:false
    },
    rules: {
      notSame: value => value == value,
      greaterZero: value => value > 0 ,
    },
    alerts: {
      delete: {
        message: '',
        isActive: false,
        type: ''
      },
      position: {
        message: '',
        isActive: false,
        type: ''
      }
    }
  }),
  methods:
  {
        deleteCrossSeller(vars)
        {
          let _self = this;

          let data = {
            deleteFrom:_self.selectedVariation.varId,
            toDelete:[]
          }

          let replace  = [];


          for(let i = 0; i < vars.length; i++)
          {
            data.toDelete.push(vars[i])
          }

          for(let i = 0 ; i < this.crossSeller.length ; i++)
          {
            for(let a = 0 ; a <  data.toDelete.length ; a++)
            {
              if(this.crossSeller[i].varId == data.toDelete[a].varId)
              {
                this.crossSeller.splice(i,1)
              }
            }
          }


          _self.$http.post( process.env.VUE_APP_DELETE_CROSSSELLER+process.env.VUE_APP_PLUGIN_SET_PREVIEW,data).then((response) => {
            if(response)
            {
              _self.alerts.delete.isActive = true;
              _self.alerts.delete.type = 'success';
              _self.alerts.delete.message = "Cross Seller wurde erfolgreich gelöscht"
            }
          }).catch((error) => {
            _self.alerts.delete.isActive = true;
            _self.alerts.delete.type = 'error';
            _self.alerts.delete.message = "Cross Seller konnten nicht gelöscht werden"
          })
        },
        recalcPostitions(item,index = -1)
        {
          console.log('pos',index)
          if(index > -1) {
            let _self = this;

            let itemIndex = _self.crossSeller.indexOf(item);

            if (index == 0) {
              _self.crossSeller.splice(itemIndex, 1);
              _self.crossSeller.unshift(item)
            } else if (index > _self.crossSeller.length - 1) {
              _self.crossSeller.splice(itemIndex, 1)
              _self.crossSeller.push(item);
            } else {
              _self.crossSeller.splice(itemIndex, 1)
              _self.crossSeller.splice(index, 0, item)
            }

            let data =
                {
                  "updateOn": _self.selectedVariation.varId,
                  "toUpdate": []
                };

            for (let i = 0; i < _self.crossSeller.length; i++)
            {
              _self.crossSeller[i].position = i + 1;

              data.toUpdate.push
              (
                  {
                    "varId": _self.crossSeller[i].varId,
                    "position": _self.crossSeller[i].position,
                  }
              )
            }

            _self.crossSeller.sort(function (a, b) {
              let positionA = new Date(a.position)
              let positionB = new Date(b.position);
              if (positionA < positionB) return -1;
              if (positionA > positionB) return 1;
              return 0;
            });


            _self.$http.post(process.env.VUE_APP_UPDATE_POSITION + process.env.VUE_APP_PLUGIN_SET_PREVIEW, data).then((response) => {
              if (response) {
                _self.alerts.position.type = 'success';
                _self.alerts.position.message = "Die Positions Änderung war erfolgreich"
                _self.alerts.position.isActive = true;
              }
            }).catch((error) => {
              _self.alerts.position.type = 'error';
              _self.alerts.position.message = "Die Positions Änderung war NICHT erfolgreich"
              _self.alerts.position.isActive = true;

            })
          }
        },
      },
  computed:
    {
      selectedVariation: function () {
        return this.$store.state.selectedVariation;
      },
      crossSeller: function () {
        return this.$store.state.crossSeller;
      },
    }
}

</script>