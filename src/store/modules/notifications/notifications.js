const state = {
    message: '',
    type: '',
    status: '',
    alert: false
  }
  
  const mutations = {
    SET_ALERT_MESSAGE: (state, payload) => (
        state.message = payload.message,
        state.type = payload.messageType,
        state.alert = payload.alert
    ),
  }
  
  const getters = {
    getMessage: state => state.message,
    getAlertType: state => state.type,
    getAlert: state => state.alert
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    getters,
  }
