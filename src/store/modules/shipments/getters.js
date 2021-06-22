const getShipmentsList = state => state.shipments.theShipmentsList.sort((a, b) => (a.id > b.id) ? 1 : -1);

const getShipment = state => state.shipments.theShipment

export default {
    getShipmentsList,
    getShipment
}