import axios from "axios";

const saveShipmentRequest = async ({ commit }, payload) => {
  let data = {};
  if (typeof (payload) !== "undefined") {
    data = JSON.stringify(payload);
  }
  return new Promise((resolve, reject) => {
    axios
      .post("http://localhost:9898/shipment", data, {})
      .then(function(response) {
        commit("SET_SHIPMENT_INTO_LIST", response.data);
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

const updateShipmentRequest = async ({ commit }, payload) => {
  let data = {};
  if (typeof (payload) !== "undefined") {
    data = JSON.stringify(payload);
  }
  return new Promise((resolve, reject) => {
    axios
      .put("http://localhost:9898/shipment/" + payload.id, data)
      .then(function(response) {
        commit("UPDATE_SHIPMENT", data);
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};
const getAllShipmentsRequest = async ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:9898/shipment")
      .then(function(response) {
        commit("SET_SHIPMENT_INTO_LIST_LIST", response.data);
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

const getShipmentRequest = async (context, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:9898/shipment/" + payload.id)
      .then(function(response) {
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

export default {
  saveShipmentRequest,
  getAllShipmentsRequest,
  updateShipmentRequest,
  getShipmentRequest
};
