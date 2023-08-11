<template>
  <div>
    <v-main class="pa-0"  >
      <v-toolbar height="41px">
        <plenty-input-search  :search="searchSelect"   style="height: 32px" :filter="searchFilterInputSearch" v-on:filterupdate="filterUpdaten($event)" v-on:searchselect="searchSelectUpdate($event)" :actions="actions"></plenty-input-search>

        <div class="d-flex flex-fill" style="justify-content: end">
          <v-btn color="success" @click="$store.commit('searchingFor','var');$router.push({path: '/search'})">
            Neue Verknüpfung anlegen
          </v-btn>
       </div>
      </v-toolbar>
      <v-container fluid  >
        <div style="background: #fff" class="mt-1 pa-3">
          <v-row class="h-100 elevation-2">
            <v-col cols="12">
              <v-data-table
                    :loading="loading.dashboardSearch"
                    :headers="searchResultHeader"
                    @click:row="setNewVariant($event)"
                    :items="dashboardCrossSeller"
                    :footer-props="{'items-per-page-options':[15, 50, 100]}"
                    :sort-desc="options.orderDesc"
                    :options="options"
                    :server-items-length="totalCrossSeller"
                    v-on:update:options="updateData($event)"
                    item-key="cartId"
                    :items-per-page="15"
                >
                  <template v-slot:item.image="{ item }">
                    <v-avatar>
                      <img :src="item.image" class="img-fluid" style="height: 75px">
                    </v-avatar>
                  </template>
                </v-data-table>
            </v-col>
          </v-row>
        </div>

      </v-container>
    </v-main>
    <v-snackbar
        top
        right
        elevation="15"
        :color="alerts.dashboardSearch.type"
        :timeout="3000"
        v-model="alerts.dashboardSearch.isActive"
    >
      {{ alerts.dashboardSearch.message }}
    </v-snackbar>

  </div>
</template>

<script>
import PlentyInputSearch from "./Input/plentyInputSearch";
export default {
  name: 'Main',
  components: {PlentyInputSearch},
  data: () => (
      {
        totalCrossSeller:0,
        searchOptions:
        {
          page:1,
          itemsPerPage:15,
        },
        options:
        {
              page:1,
              itemsPerPage:15,
              orderBy:'varId',
              filter:[],
            },
        actions:
        {
          focusSearch: false,
          focusFilter: false
        },
        searchSelect:
        [
              {
                "key": "varId",
                "name": 'Varianten Id:',
                "operator": "=",
                "value": '',
              },
              {
                "key": "itemId",
                "name": 'Artikel Id:',
                "operator": "=",
                "value": '',
              },
              {
                "key": "varNumber",
                "name": 'Varianten Nummer:',
                "operator": "=",
                "value": '',
              },
              {
                "key": "varName",
                "name": 'Varianten Name:',
                "operator": "=",
                "value": '',
              }

            ],
        searchFilterInputSearch:
        [
            {
              "key":"manufacturer",
              "name": 'Hersteller:',
              "operator": "=",
              "type":"select",
              "items":[],
            },
            {
              "key":"client",
              "name": 'Mandant:',
              "operator": "LIKE",
              "type":"select",
              "items":[],
            }
        ],
        searchResultHeader:
        [
              {
                text:'',
                sortable: false,
                value:'image'
              },
              {
                text: 'Varianten-Id',
                sortable: true,
                value: 'varId',
              },
              {
                text: 'Artikel-Id',
                sortable: true,
                value: 'itemId',
              },
              {
                text: 'Name',
                sortable: false,
                value: 'itemName',
              },
              {
                text:'Hersteller',
                sortable: false,
                value:'manufacturer'
              }
            ],
        loading:
        {
          dashboard:true,
          dashboardSearch:false
        },
        selected:[],
        dashboardCrossSeller:[],
        alerts: {
          dashboardSearch:
              {
                message:'',
                isActive:false,
                type:''
              },
        }
      }),
  watch:
  {
    manufacturer()
    {
      this.searchFilterInputSearch[0].items = this.$store.state.manufacturer;
    },
    mandanten()
    {
      this.searchFilterInputSearch[1].items = this.$store.state.mandanten;
    }
  },
  methods:
  {
        setNewVariant(data)
        {
          this.getCrossSellerById(data.varId)
        },
        getCrossSellerById(varId)
        {
          let _self = this;

          this.$store.commit('componentLoadingMessage','getting cross seller data');
          this.$store.commit('componentLoading',true);

          let currentCrossSeller = [];

          _self.$http.get( process.env.VUE_APP_GET_CROSSSELLER+varId+'/'+'de'+'/'+process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if(response)
            {
              console.log('crossbyid',response)
              let selectVar = response.data.selectedVar.data;

              let image = '';

              if(selectVar.images.variation.length > 0)
              {
                let varImages  = selectVar.images.variation[0];

                if(varImages.urlPreview !== '')
                {
                  image = varImages.urlPreview
                }
                else if(varImages.urlSecondPreview == '')
                {
                  image = varImages.urlSecondPreview
                }
                else if(varImages.urlMiddle == '')
                {
                  image = varImages.urlMiddle
                }
              }
              else if(selectVar.images.all.length > 0)
              {
                let allImages  = selectVar.images.all[0];

                if(allImages.urlPreview !== '')
                {
                  image = allImages.urlPreview
                }
                else if(allImages.urlSecondPreview == '')
                {
                  image = allImages.urlSecondPreview
                }
                else if(allImages.urlMiddle == '')
                {
                  image = allImages.urlMiddle
                }
              }

              let name  = '';

              if(selectVar.texts.name1 !== "N / A")
              {
                name = selectVar.texts.name1
              }
              else if(selectVar.texts.name2 !== 'N / A')
              {
                name = selectVar.texts.name2
              }
              else if(selectVar.texts.name3 !== 'N / A')
              {
                name = selectVar.texts.name3
              }
              let manufacturer = '';

              if(selectVar.filter.hasManufacturer !== false)
              {
                manufacturer = selectVar.item.manufacturer.name
              }
              _self.varId = selectVar.variation.id;

              _self.$store.commit('selectedVariation', {
                attributes:selectVar.attributes,
                itemId:selectVar.variation.itemId,
                varId:selectVar.variation.id,
                itemName:name,
                manufacturer:manufacturer,
                image:image,
                externalId:selectVar.variation.externalId,
                varNumber:selectVar.variation.number,
                client:selectVar.ids.clients
              })

              if(response.data && response.data.vars.length > 0 )
              {
                for(let i = 0 ; i < response.data.vars.length ; i++)
                {
                  let currentItemData = response.data.vars[i].data;

                  let image = '';

                  if(currentItemData.images.variation.length > 0)
                  {
                    let varImages  = currentItemData.images.variation[0];

                    if(varImages.urlPreview !== '')
                    {
                      image = varImages.urlPreview
                    }
                    else if(varImages.urlSecondPreview == '')
                    {
                      image = varImages.urlSecondPreview
                    }
                    else if(varImages.urlMiddle == '')
                    {
                      image = varImages.urlMiddle
                    }
                  }
                  else if(currentItemData.images.all.length > 0)
                  {
                    let allImages  = currentItemData.images.all[0];

                    if(allImages.urlPreview !== '')
                    {
                      image = allImages.urlPreview
                    }
                    else if(allImages.urlSecondPreview == '')
                    {
                      image = allImages.urlSecondPreview
                    }
                    else if(allImages.urlMiddle == '')
                    {
                      image = allImages.urlMiddle
                    }
                  }

                  let name  = '';

                  if(currentItemData.texts.name1 !== "N / A")
                  {
                    name = currentItemData.texts.name1
                  }
                  else if(currentItemData.texts.name2 !== 'N / A')
                  {
                    name = currentItemData.texts.name2
                  }
                  else if(currentItemData.texts.name3 !== 'N / A')
                  {
                    name = currentItemData.texts.name3
                  }

                  let manufacturer = '';

                  if(currentItemData.filter.hasManufacturer !== false)
                  {
                    manufacturer = currentItemData.item.manufacturer.name
                  }

                  let object = {
                    itemId:currentItemData.variation.itemId,
                    varId:response.data.vars[i].id,
                    itemName:name,
                    manufacturer:manufacturer,
                    image:image,
                    position:response.data.vars[i].position,
                    externalId:currentItemData.variation.externalId,
                    varNumber:currentItemData.variation.number,
                    client:currentItemData.ids.clients,
                    attributes:currentItemData.attributes
                  }
                  currentCrossSeller.push(object)
                }

              }
            }

            console.log(currentCrossSeller)
            _self.$store.commit('crossSeller',currentCrossSeller)
            _self.$store.commit('componentLoading',false);

            _self.$router.push({path: '/CrossSeller/'+varId})

          }).catch((error) => {
            _self.$store.commit('componentLoading',false);
            console.log(error)
            // _self.myAlerts.error = true;
            // _self.myAlerts.errorMessage = error
            // _self.resetErorr();
          })

        },
        updateData(event)
        {
          let _self   = this;

          _self.options.itemsPerPage  = event.itemsPerPage;
          _self.options.page          = event.page;
          _self.options.orderBy       = event.sortBy[0];
          _self.options.orderDesc     = event.sortDesc[0]

          this.dynamicGet('crossSeller',this.options.itemsPerPage,this.options.page,this.options.orderBy,this.options.orderDesc,this.options.filter)
        },
        searchSelectUpdate(event)
        {
          let needArray = [];
          needArray.push(event);
          this.filterUpdaten(needArray);
        },
        filterUpdaten(data)
        {
          let filter = [];
          for(let i = 0; i < data.length; i++ )
          {

            if(data[i].value != "" && data[i].value != null )
            {
              let option =
                  {
                    "where":data[i].key
                  }
              if(data[i].type == 'date')
              {
                option.value = new Date(data[i].value).getTime()/1000
              }
              else
              {
                option.value = data[i].value;
              }
              if(data[i].type == "switch")
              {
                option.value = (data[i].value == true) ? 1 : 0;
              }
              if(Object.prototype.hasOwnProperty.call(data[i], 'operator'))
              {
                option.operator = data[i].operator
              }
              if(data[i].key == "client")
              {
                for (let [key, value] of Object.entries(this.mandantMap)) {
                  if(data[i].value == key)
                  {
                    option.value = '%'+value+'%';
                  }
                }
              }
              filter.push(option)
            }
          }
          this.options.filter = filter;

          this.dynamicGet('crossSeller',this.options.itemsPerPage,this.options.page,this.options.orderBy,this.options.orderDesc,this.options.filter)
        },
        dynamicGet(db = 'crossSeller',itemsPerPage = 20,page = 1,orderBy = 'id',order = 'desc',filter = []) {
          let _self = this;

          let link = process.env.VUE_APP_DYNAMIC_GET + process.env.VUE_APP_PLUGIN_SET_PREVIEW

          let orderDesc = 'desc';

          let data = {
            "db":db,
            "itemsPerPage":itemsPerPage,
            "page":page,
            "orderBy":orderBy,
            "orderDesc":orderDesc,
            "filter":filter,
            "getItemData":true
          }

          _self.loading.dashboardSearch = true;
          _self.dashboardCrossSeller = [];

          _self.$http.post(link,data).then((response) =>
          {
            let replaceTable = [];

            if(response.data && response.data.dynamicEntries && response.data.dynamicEntries.entries.length > 0)
            {
              _self.totalCrossSeller = response.data.dynamicEntries.itemsTotal;

              for(let i = 0 ; i < response.data.dynamicEntries.entries.length ; i++)
              {
                let currentItemData = response.data.dynamicEntries.entries[i].data;

                let image = '';

                if(currentItemData.images.variation.length > 0)
                {
                  let varImages  = currentItemData.images.variation[0];

                  if(varImages.urlPreview !== '')
                  {
                    image = varImages.urlPreview
                  }
                  else if(varImages.urlSecondPreview == '')
                  {
                    image = varImages.urlSecondPreview
                  }
                  else if(varImages.urlMiddle == '')
                  {
                    image = varImages.urlMiddle
                  }
                }
                else if(currentItemData.images.all.length > 0)
                {
                  let allImages  = currentItemData.images.all[0];

                  if(allImages.urlPreview !== '')
                  {
                    image = allImages.urlPreview
                  }
                  else if(allImages.urlSecondPreview == '')
                  {
                    image = allImages.urlSecondPreview
                  }
                  else if(allImages.urlMiddle == '')
                  {
                    image = allImages.urlMiddle
                  }
                }

                let name  = '';

                if(currentItemData.texts.name1 !== "N / A")
                {
                  name = currentItemData.texts.name1
                }
                else if(currentItemData.texts.name2 !== 'N / A')
                {
                  name = currentItemData.texts.name2
                }
                else if(currentItemData.texts.name3 !== 'N / A')
                {
                  name = currentItemData.texts.name3
                }

                let manufacturer = '';

                if(currentItemData.filter.hasManufacturer !== false)
                {
                  manufacturer = currentItemData.item.manufacturer.name
                }


                let object = {
                  attributes:currentItemData.attributes,
                  itemId:currentItemData.variation.itemId,
                  varId: response.data.dynamicEntries.entries[i].id,
                  itemName:name,
                  manufacturer:manufacturer,
                  image:image,
                  externalId:currentItemData.variation.externalId,
                  varNumber:currentItemData.variation.number,
                  client:currentItemData.ids.clients,
                  isSelectable:true
                }

                replaceTable.push(object)
              }
            }

            if(replaceTable.length == 0)
            {
              _self.alerts.dashboardSearch.isActive = true;
              _self.alerts.dashboardSearch.type = 'rgb(235, 153, 52)';
              _self.alerts.dashboardSearch.message = "Es konnten keine Ergbnisse für die Suche gefunden werden"
            }

            _self.dashboardCrossSeller = replaceTable;

            _self.loading.dashboard = false;

            _self.loading.dashboardSearch = false;

          }).catch((error) => {

            console.log(error)
            _self.loading.dashboardSearch = false;
          })
        },
      },
  computed:{

    mandanten: function () {

      return this.$store.state.mandanten;
    },
    manufacturer: function () {

      return this.$store.state.manufacturer;
    }
  },


};
</script>