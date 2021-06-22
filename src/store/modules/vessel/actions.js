import axios from "axios";

const getVesselRequest = async ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:9898/vessel/" + payload)
      .then(function(response) {
        commit("SET_VESSEL", response.data);
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

export default {
  getVesselRequest
};
