const SET_SHIPMENT_INTO_LIST_LIST = (state, payload) => {
  state.shipments.theShipmentsList = payload;
};

const SET_SHIPMENT_INTO_LIST = (state, payload) => {
  state.shipments.theShipmentsList.push(payload);
};

const UPDATE_SHIPMENT = (state, payload) => {
  let data = {};
  if (typeof payload !== "undefined") {
    data = JSON.parse(payload);
  }
  state.shipments.theShipmentsList.forEach(shipment => {
    if (data.id == shipment.id) {
      if ("delay" in data) {
        shipment["shipment-eta"] = data["vessel-eta"];
      } else {
        shipment["id"] = data["id"];
        shipment["customer"] = data["customer"];
        shipment["shipment-eta"] = data["shipment-eta"];
        shipment["vessel"] = data["vessel"];
      }
    }
  });
};

export default {
  SET_SHIPMENT_INTO_LIST_LIST,
  SET_SHIPMENT_INTO_LIST,
  UPDATE_SHIPMENT
};
