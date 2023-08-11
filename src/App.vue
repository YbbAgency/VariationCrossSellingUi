<template>
  <v-app>
    <template >

      <v-overlay style="opacity:0.5;z-index:9999999" v-if="componentLoading == true" >
        <div class="text-center" >
        <v-progress-circular  color="primary"  indeterminate :size="70" :width="5"></v-progress-circular>
          <h3 style="color:black">{{ componentLoadingMessage }}</h3>
        </div>
      </v-overlay>
    </template>
    <v-navigation-drawer app :mini-variant.sync="mini">
      <div class="border-bottom toggleButton" style="line-height:41px;">
        <v-btn @click="goMiniOrMax()" fab x-small icon>
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </div>
      <div v-for="item in treeItems" :key="item.name" class="border-bottom">
        <ul class="plenty-treeview">
          <template v-if="item.hasOwnProperty('children')">
            <TreeItem :items="item" :has-child="true"></TreeItem>
          </template>
          <template v-else>
            <TreeItem :items="item"></TreeItem>
          </template>
        </ul>
      </div>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import TreeItem from "./components/Tree/TreeItem";

export default {
  name: 'App',
  components:
      {
        TreeItem
      },
  data: () => (
      {

        mini  :false,
      }),
  created() {
    this.getInitialData();
  },

  methods:
      {
        goMiniOrMax:function()
        {
          if(this.mini)
          {
            this.mini = false
          }
          else
          {
            this.mini = true
          }
        },
        setCurrentActive:function(current)
        {
          for(let i = 0; i < this.treeItems.length; i++)
          {
            this.treeItems[i].active = false
          }
          for(let i = 0; i < this.treeItems.length; i++)
          {
            if(this.treeItems[i].highlight == current.name)
            {
              this.treeItems[i].active = true
            }
          }
        },
        getInitialData()
        {
          let _self = this;

          _self.$http.get( process.env.VUE_APP_GET_DATA+'0'+process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if(response)
            {

              let data = response.data
              _self.buildCategoryTreeData(data.categoryTree)

              let tags = []

              for(let i = 0  ; i < data.tags.length ; i++)
              {
                data.tags[i].text  = data.tags[i].tagName
                data.tags[i].value  = data.tags[i].id

                tags.push(data.tags[i])
              }

              this.$store.commit('tags',tags);

              let manfacMap = {}
              let manufacturer = [];

              for(let i = 0 ; i < data.manufacturer.entries.length ; i++)
              {
                manfacMap[data.manufacturer.entries[i].name] = data.manufacturer.entries[i].id
                manufacturer.push(data.manufacturer.entries[i].name)
              }

              this.$store.commit('manufacturer',manufacturer);
              this.$store.commit('manufacturerMap',manfacMap);

              let mandanten = [];
              let mandantMap = {};

              for(let i = 0 ; i < data.webStoreConfig.length ; i++)
              {
                mandantMap[data.webStoreConfig[i].name] = data.webStoreConfig[i].storeIdentifier
                mandanten.push(data.webStoreConfig[i].name)
              }

              this.$store.commit('mandantMap',mandantMap);
              this.$store.commit('mandanten',mandanten);


            }
          }).catch((error) => {
            console.log(error)
            // _self.myAlerts.error = true;
            // _self.myAlerts.errorMessage = error
            // _self.resetErorr();
          })

        },
        buildCategoryTreeData(data)
        {
          let categories = [];

          for(let i = 0 ; i < data.length ; i++)
          {
            let category = {}
            if(data[i].hasOwnProperty("details") && data[i].details[0].hasOwnProperty("name"))
            {
              category.name = data[i].details[0].name
            }
            if(data[i].hasOwnProperty("id"))
            {
              category.id =  data[i].id;
            }
            if(data[i].hasOwnProperty("parentCategoryId"))
            {
              category.parentCategoryId =  data[i].parentCategoryId;
            }

            if(data[i].hasOwnProperty("childCount") && data[i].childCount > 0)
            {
              category.children = this.buildChildTree(data[i])
            }
            categories.push(category)
          }

          this.$store.commit('categoryTree',categories);
        },
        buildChildTree(data)
        {
          let children = [];

          for(let i = 0 ; i < data.childCount ; i++)
          {
            if(data.children[i])
            {

              let child = {
                children: []
              }

              if(data.children[i].hasOwnProperty("id"))
              {
                child.id =  data.children[i].id;
              }
              if(data.children[i].hasOwnProperty("parentCategoryId"))
              {
                child.parentCategoryId =  data.children[i].parentCategoryId;
              }

              if(data.children[i].hasOwnProperty("details") && data.children[i].details.length > 0 && data.children[i].details[0].name)
              {
                child.name = data.children[i].details[0].name
              }
              if(data.children[i].childCount > 0)
              {
                child.children = this.buildChildTree(data.children[i])
              }

              children.push(child)
            }
          }
          return children;
        },

      },
  watch: {
    $route() {
      this.setCurrentActive(this.$router.currentRoute)
    }
  },
  computed:
      {

        componentLoadingMessage:function () {
          return this.$store.state.componentLoadingMessage;
        },
        componentLoading:function () {
          return this.$store.state.componentLoading;
        },
        treeItems:function ()
        {
          let items =
              [
                {
                  name: "Dashboard",
                  icon:'chart-bar',
                  key:'dashboard',
                  url:'/',
                  active:true
                },
              ];
          return items;
        }
      }
};
</script>

