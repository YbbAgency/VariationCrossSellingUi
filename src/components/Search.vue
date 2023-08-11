<template>
  <v-main class="pa-0" style="background: #f1f1f1" >
    <v-toolbar height="41px">
      <template v-if="searchingFor == 'var'">
        Variante auswählen
      </template>
      <template v-else>
        Cross Seller auswählen
      </template>
    </v-toolbar>
    <v-row  >
      <v-col class="mt-5" cols="2" style="background:white;padding-right :0">
        <div  class="d-flex flex-column elevation-1" style="width: 100%">
          <v-tabs
              v-model="tabSearch"
              fixed-tabs
          >
            <v-tab>
              Filter
            </v-tab>
            <v-tab>
              Kategorie
            </v-tab>
          </v-tabs>
          <template v-if="tabSearch == 0">
            <v-list-item>
              <v-row>
                <v-col cols="6" >
                  <v-btn color="primary" class="w-100" :disabled="loading.search" @click="search()">
                    <div v-if="loading.search == false">
                      <v-icon>
                        mdi-magnify
                      </v-icon>
                    </div>
                    <v-progress-circular style="width: 24px;height: 24px" v-else indeterminate>

                    </v-progress-circular>
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn color="orange"  class="w-100" style="color:white" :disabled="loading.search" @click="resetSearch()">
                    <div v-if="loading.search == false">
                      <v-icon>
                        mdi-arrow-u-left-top
                      </v-icon>
                    </div>
                    <v-progress-circular style="width: 24px;height: 24px" v-else indeterminate>

                    </v-progress-circular>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item  v-if="searchFilter.categories.length > 0">
              <v-list-item-title>
                <v-checkbox
                    v-model="useCategories"
                    label="Mit Kategorien suchen"
                ></v-checkbox>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-text-field
                    label="Artikel-Id"
                    hide-details="auto"
                    type="number"
                    @keydown.enter="search()"
                    v-model="searchFilter.itemId"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-text-field
                    label="Varianten-Id"
                    hide-details="auto"
                    type="number"
                    @keydown.enter="search()"
                    v-model="searchFilter.varId"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-text-field
                    label="Variantennummer"
                    hide-details="auto"
                    @keydown.enter="search()"
                    v-model="searchFilter.varNumber"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-text-field
                    label="Artikeldaten"
                    hide-details="auto"
                    type="text"
                    @keydown.enter="search()"
                    v-model="searchFilter.itemData"
                >
                </v-text-field>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-select
                    :items="manufacturer"
                    v-model="searchFilter.manufacturer"
                    label="Hersteller"
                    multiple
                >
                </v-select>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-select
                    :items="mandanten"
                    v-model="searchFilter.mandant"
                    label="Mandant"
                    multiple
                >
                </v-select>
              </v-list-item-title>
            </v-list-item>
            <v-list-item >
              <v-list-item-title>
                <v-select
                    :items="selectItems.isActive"
                    v-model="searchFilter.isActive"
                    label="Aktiv"
                >
                </v-select>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="mb-3 mt-2">
              <v-select
                  v-model="selectedTags"
                  :items="tags"
                  label="Tags"
                  multiple
                  persistent-hint
              >
                <template   v-slot:item="{ item }">
                  <div>
                    <v-badge
                        class="ml-1"
                        left
                        :color="item.color"

                    ></v-badge>
                    <span  class="ml-1"> {{ item.tagName }} </span>
                  </div>
                </template>
                <template v-slot:selection="{ item ,index }">
                  <template v-if="selectedTags.length > 2 && index == 2">
                    <v-chip class="ml-4 my-3">
                      (+ {{ selectedTags.length-2 }} Other )
                    </v-chip>
                  </template>
                  <template v-else-if="index < 2">
                    <div class="ml-4 my-3">
                      <v-badge
                          class="ml-1"
                          left
                          :color="item.color"

                      ></v-badge>
                      <span  class="ml-1"> {{ item.tagName }} </span>
                    </div>
                  </template>
                </template>

              </v-select>
            </v-list-item>
            <v-list-item>
              <v-select
                  v-model="searchFilter.mark1"
                  :items="mark1Items"
                  label="Markierung 1"
              >
              </v-select>
            </v-list-item>
            <v-list-item>
              <v-select
                  v-model="searchFilter.mark2"
                  :items="mark2Items"
                  label="Markierung 2"
              >
              </v-select>
            </v-list-item>
          </template>
          <template v-else>
            <v-row>
              <v-col cols="12" class="pa-5 pt-4">
                <v-btn color="orange"  class="w-100" style="color:white" :disabled="loading.search" @click="searchFilter.categories = []">
                  <div v-if="loading.search == false">
                    <v-icon>
                      mdi-arrow-u-left-top
                    </v-icon>
                  </div>
                  <v-progress-circular style="width: 24px;height: 24px" v-else indeterminate>

                  </v-progress-circular>
                </v-btn>
              </v-col>
            </v-row>

            <v-treeview
                selectable
                v-model="searchFilter.categories"
                hoverable
                return-object
                :items="categoryTree"
                open-on-click:true
            ></v-treeview>
          </template>
        </div>
      </v-col>
      <v-col class="mt-2" cols="10">
        <div class="loadingBackDrop" v-if="loading.add == true">
          <v-progress-circular style="width: 200px;height: 200px;" color="blue lighten--1 " indeterminate>
          </v-progress-circular>
        </div>
        <div  class="flex-fill">
          <v-data-table
              @click:row="setCrossSeller($event)"
              :loading="loading.search"
              :headers="searchResultHeader"
              :disabled="loading.add"
              :options="searchOptions"
              :items="searchResults"
              :footer-props="{'items-per-page-options':[15, 50, 100]}"
              item-key="varId"
              v-model="selected"
              :server-items-length="searchResultsTotal"
              :item-class="setClassAlreadyCrossSeller"
              :show-select="searchingFor !== 'var'"
              v-on:update:options="search($event)"
          >

            <template v-slot:top v-if="searchingFor !== 'var'">
              <v-btn color="success" class="ma-2" :disabled="selected.length <= 0" @click="addNewCrossSeller(selected)">
                <v-icon>
                  mdi-plus
                </v-icon>
                Cross Seller hinzufügen
              </v-btn>
            </template>
            <template v-slot:item.image="{ item }">
              <v-avatar>
                <img :src="item.image" class="img-fluid" style="height: 75px">
              </v-avatar>
            </template>
            <template v-slot:item.tags="{ item }">
              <template v-for="tag in item.tags">
                <div class="ml-4 my-3" :key="item.varId +'_tag_'+tag.tagId">
                  <v-badge
                      class="ml-1"
                      left
                      :color="tag.tag.color"
                  ></v-badge>
                  <span  class="ml-1"> {{ tag.tag.tagName }} </span>
                </div>
              </template>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-snackbar
        top
        :color="alerts.search.type"
        :timeout="3000"
        elevation="15"
        v-model="alerts.search.isActive"
        right
    >
      {{ alerts.search.message }}
    </v-snackbar>
    <v-snackbar
        top
        right
        elevation="15"
        :color="alerts.add.type"
        :timeout="3000"
        v-model="alerts.add.isActive"
    >
      {{ alerts.add.message }}
    </v-snackbar>
    <v-snackbar
        top
        right
        elevation="15"
        :color="alerts.delete.type"
        :timeout="3000"
        v-model="alerts.delete.isActive"
    >
      {{ alerts.add.message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: 'Main',
  data: () => ({
    tabSearch:0,
    searchOptions:{
      page:1,
      itemsPerPage:15,
    },
    selected:[],
    alerts: {
      add: {
        message:'',
        isActive:false,
        type:''
      },
      search:{
        message:'',
        isActive:false,
        type:''
      },
      delete:{
        message:'',
        isActive:false,
        type:''
      },
    },
    searchResultsTotal:0,
    useCategories:true,
    mark1Items:['',"Ohne",1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    mark2Items:['',"Ohne",1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selectedTags:[],
    searchResults:[],
    searchFilter:
        {
          categories:[],
          itemId:null,
          varId:null,
          varNumber:null,
          itemData:'',
          manufacturer:0,
          mandant:0,
          isActive:'JA',
          mark1:-1,
          mark2:-1
        },
    loading:{
      search:false,
      add:false
    },
    selectItems: {
      manufacturer: [],
      isActive:[
        'ALLE',
        'JA',
        'NEIN'
      ]
    }, searchResultHeader: [
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
        text: 'tags',
        sortable: false,
        value: 'tags',
      },
      {
        text:'Hersteller',
        sortable: false,
        value:'manufacturer'
      }
    ],
  }),
  computed:{
      selectedVariation: function () {
      return this.$store.state.selectedVariation;
      } ,
      manufacturerMap: function () {
      return this.$store.state.manufacturerMap;
      },
      mandantMap: function () {
      return this.$store.state.manufacturerMap;
      },
      tags: function () {
        console.log(this.$store.state.tags)
        return this.$store.state.tags;
      },
      crossSeller: function () {
        return this.$store.state.crossSeller;
      },
      categoryTree: function () {
        return this.$store.state.categoryTree;
      },
      searchingFor: function () {
        return this.$store.state.searchingFor;
      },
      mandanten: function () {
      return this.$store.state.mandanten;
      },
      manufacturer: function () {
      return this.$store.state.manufacturer;
      }



  },
  methods:
  {
    setCrossSeller(event)
    {

      if(this.searchingFor == 'var')
      {
        this.getCrossSellerById(event.varId)
      }
      else{
        if(this.selected.includes(event))
        {
          this.selected.splice(this.selected.indexOf(event),1)
        }
        else
        {
          this.selected.push(event)
        }
      }

    },
    getCrossSellerById(varId)
    {
      let _self = this;

      this.$store.commit('componentLoadingMessage','getting cross seller data');
      this.$store.commit('componentLoading',true);

      let crossSeller = [];

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
              crossSeller.push(object)
            }

          }
        }

        _self.$store.commit('crossSeller',crossSeller)
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

    addNewCrossSeller(vars)
    {
      let _self = this;

      _self.loading.add = true;

      let data = {
        addTo:{
          varId:_self.selectedVariation.varId,
          itemId:_self.selectedVariation.itemId,
          itemName:_self.selectedVariation.itemName,
          manufacturer:_self.selectedVariation.manufacturer,
          externalVarId:_self.selectedVariation.externalId,
          varNumber:_self.selectedVariation.varNumber,
          client:_self.selectedVariation.client
        },
        toAdd:[]
      }

      let highestPos = 0;

      for(let i = 0 ; i <  _self.crossSeller.length ; i++)
      {
        if(_self.crossSeller[i].position > highestPos)
        {
          highestPos = _self.crossSeller[i].position;
        }
      }

      console.log('addNewCrossSeller',vars)

      for(let i = 0; i < vars.length; i++)
      {
        data.toAdd.push(
            {
              varId:vars[i].varId,
              position:highestPos+1
            }
        )

        vars[i].position = highestPos+1;

        highestPos++;
      }

      _self.$http.post( process.env.VUE_APP_ADD_CROSSSELLER+process.env.VUE_APP_PLUGIN_SET_PREVIEW,data).then((response) => {
        if(response)
        {
          _self.mainTabs = 1;
          _self.alerts.add.isActive = true;
          _self.loading.add = false;
          _self.alerts.add.type = 'success';
          _self.alerts.add.message = "Cross Seller wurden erfolgreich verknüpft"
          _self.getCrossSellerById(_self.selectedVariation.varId)
        }
      }).catch((error) => {
        _self.loading.add = false;
        _self.alerts.add.type = 'error';
        _self.alerts.add.isActive = true;
        _self.alerts.add.message = "Cross Seller konnten nicht verknüpft werden"
        // _self.myAlerts.error = true;
        // _self.myAlerts.errorMessage = error
        // _self.resetErorr();
      })
    },
    setClassAlreadyCrossSeller(item)
    {
      if(this.alreadyCrossSeller(item.varId) == true && this.searchingFor !== 'var'  ||  item.varId == this.selectedVariation.varId)
      {
        return 'alreadyCrossSeller'
      }
      else{
        return ''
      }
    },
    alreadyCrossSeller(varId)
    {
      for(let i = 0; i < this.crossSeller.length; i++)
      {
        if(varId == this.crossSeller[i].varId)
        {
          return true;
        }
      }
      return false;
    },
    search(event = {}) {
      let _self = this;

      if (event !== {}) {
        _self.searchOptions.page = event.page;
        _self.searchOptions.itemsPerPage = event.itemsPerPage;
      }

      _self.loading.search = true;

      let data = {
        with: 'additionalSkus,attributeValues.attribute,attributeValues.attributeValue,barcodes.barcode,base.item,base.itemSerialNumber,base.feedback,base.characteristics,base.crossSelling,base.texts,base.availability,base.images,base.stock,base.stockStorageLocations,bundleComponents,categories.category,categories.categoryBranch,clients,defaultCategories.category,images.image,markets,marketIdentNumbers,salesPrices.salesPrice,skus,supplier.supplier,timestamps,warehouses.warehouse,unit.unit,tags.tag,base.shippingProfiles,comments,inheritance',
        page: _self.searchOptions.page,
        itemsPerPage: _self.searchOptions.itemsPerPage
      }


      if (_self.searchFilter.categories.length > 0 && _self.useCategories == true) {
        let catIds = [];
        for (let i = 0; i < _self.searchFilter.categories.length; i++) {
          catIds.push(_self.searchFilter.categories[i].id)
        }
        catIds = catIds.toString()

        data.categoryIds = 'in:' + catIds
      }
      if (_self.searchFilter.varId > 0) {
        data.ids = 'in:' + _self.searchFilter.varId
      }
      if (_self.searchFilter.varNumber > 0) {
        data.number = 'like:' + _self.searchFilter.varNumber
      }
      if (_self.searchFilter.itemId > 0) {
        data.itemIds = 'in:' + _self.searchFilter.itemId
      }
      if (_self.searchFilter.mandant.length > 0) {
        if (_self.searchFilter.mandant.length == 1) {
          data.clientIds = 'in:' + _self.mandantMap[_self.searchFilter.mandant]
        } else {
          data.clientIds = 'in:'
          for (let i = 0; i < _self.searchFilter.mandant.length; i++) {
            if (i + 1 == _self.searchFilter.mandant.length) {
              data.clientIds = data.clientIds + _self.mandantMap[_self.searchFilter.mandant[i]]
            } else {
              data.clientIds = data.clientIds + _self.mandantMap[_self.searchFilter.mandant[i]] + ','
            }
          }
        }
      }
      if (_self.selectedTags.length > 0) {
        data.tagIds = 'in:' + _self.selectedTags.toString()
      }
      if (_self.searchFilter.itemData.length > 0) {
        data.query = _self.searchFilter.itemData
      }
      if (_self.searchFilter.manufacturer.length > 0) {
        data.anyManufacturerId = []
        for (let i = 0; i < _self.searchFilter.manufacturer.length; i++) {
          data.anyManufacturerId.push(_self.manufacturerMap[_self.searchFilter.manufacturer[i]])
        }
      }
      if (_self.searchFilter.isActive !== 'ALLE') {
        if (_self.searchFilter.isActive == 'JA') {
          data.isActive = true;
        } else if (_self.searchFilter.isActive == 'NEIN') {
          data.isActive = false;
        }
      }
      if (_self.searchFilter.mark2 == "Ohne") {
        data.flag2 = 'in:0'
      } else if (_self.searchFilter.mark2 > -1) {
        data.flag2 = 'in:' + _self.searchFilter.mark2;
      }
      if (_self.searchFilter.mark1 == "Ohne") {
        data.flag1 = 'in:0'
      } else if (_self.searchFilter.mark1 > -1) {
        data.flag1 = 'in:' + _self.searchFilter.mark1;
      }
      _self.$http.get(process.env.VUE_APP_GET_VARIATIONS, {params: data}).then((response) => {

        let replaceTable = []

        if (response && response.data && response.data["entries"].length > 0) {
          let data = response.data;

          _self.searchResultsTotal = data.totalsCount;

          for (let i = 0; i < data["entries"].length; i++) {
            let image = ''
            if (data["entries"][i].base.images.length > 0) {
              image = data["entries"][i].base.images[0].urlPreview
            }

            let name = '';
            if (data["entries"][i].base.texts.length > 0) {

              name = data["entries"][i].base.texts[0].name
            }

            let manufacturer = ''

            for (let [key, value] of Object.entries(_self.manufacturerMap)) {
              if (value == data["entries"][i].base.item.manufacturerId) {
                manufacturer = key;
              }

            }
            let clients = []

            for (let [key, value] of Object.entries(_self.mandantMap)) {
              for (let a = 0; a < data["entries"][i].clients.length; a++) {
                if (value == data["entries"][i].clients[a]) {
                  clients.push(value);
                }
              }
            }

            let object = {
              itemId: data["entries"][i].base.itemId,
              varId: data["entries"][i].id,
              manufacturer: manufacturer,
              attributes: data["entries"][i].attributeValues,
              image: image,
              itemName: name,
              externalId: data["entries"][i].base.externalId,
              client: clients,
              tags: data["entries"][i].tags,
              varNumber: data["entries"][i].base.number,
              isSelectable: (!_self.alreadyCrossSeller(data["entries"][i].id) && data["entries"][i].id !== _self.selectedVariation.varId) || (_self.searchingFor == 'var' && data["entries"][i].id !== _self.selectedVariation.varId)
            }

            replaceTable.push(object)

            _self.loading.search = false;
            _self.searchResults = replaceTable
          }

        } else {
          _self.loading.search = false;
          _self.searchResults = replaceTable
        }
      }).catch((error) => {
        console.log(error)

        _self.loading.search = false;
        _self.searchResults = [];

        _self.alerts.search.isActive = true;
        _self.alerts.search.message = "Suche fehlgeschlagen"
        _self.alerts.search.type = "error"
        // _self.myAlerts.error = true;
        // _self.myAlerts.errorMessage = error
        // _self.resetErorr();
      })
    },
    resetSearch()
    {
      this.selected = [];
      this.searchResults = [];
      this.searchFilter = {
        categories:[],
        itemId:null,
        varId:null,
        varNumber:null,
        itemData:'',
        manufacturer:0,
        mandant:0,
        isActive:'JA',
        mark2:-1,
        mark1:-1
      }
    },
  }
}

</script>