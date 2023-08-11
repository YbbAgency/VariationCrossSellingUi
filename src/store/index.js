import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchingFor:'',
    crossSeller:[],
    selectedVariation:{},
    componentLoadingMessage:'',
    componentLoading:false,
    categoryTree:{},
    mandantMap:{},
    mandanten:[],
    manufacturer:[],
    tags:[],
    manufacturerMap:{}
  },
  mutations:
  {
    searchingFor(state,data)
    {
      // string 'var' o. 'cross'
      state.searchingFor = data
    },
    crossSeller(state,data)
    {
      // crossseller array
      state.crossSeller = data
    },
    selectedVariation(state,data)
    {
      // var object
      state.selectedVariation = data
    },
    componentLoadingMessage(state,data)
    {
      // string
      state.componentLoadingMessage = data
    },
    componentLoading(state,data)
    {
      // true false
      state.componentLoading = data
    },
    categoryTree(state,data)
    {
      // category tree object
      state.categoryTree = data
    },
    mandantMap(state,data)
    {
      // mandantmap object
      state.componentLoading = data
    },
    mandanten(state,data)
    {
      // array with mandant select values
      state.mandanten = data
    },
    manufacturerMap(state,data)
    {
      // manufacturerMap object
      state.manufacturerMap = data
    },
    manufacturer(state,data)
    {
      // manufacturer array with manufacturer names
      state.manufacturer = data
    },
    tags(state,data)
    {
      // array with tag objects
      state.tags = data
    },
  }
})
