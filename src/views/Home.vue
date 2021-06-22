<template>
  <div>
    <v-container>
      <Alert v-if="getAlert"/>
      <CreateShipmentModal
        @passDataToparent="getDataFromChildForm"
        isModalVisible="true"
        inputLabel1="Customer"
        inputLabel2="Vessel"
        inputLabel3="Shipment-ETA"
        :items="returnSelectOptionsItems()"
        :visible="showShipmentForm"
        @close="showShipmentForm=false"
      />
      <v-row class="d-flex justify-end mt-10">
        <CreateShipmentBtn
          @click.native="openDialog()"
          :color="buttons.createShipmentBtnColor"
          :text="buttons.createShipmentBtnText"
        />
      </v-row>
      <ShipmentGrid
        class="mt-10"
        :headers="headers"
        :items="fillInTableWithShipmentData()"
        :nestedData="newShipmentAndVesselData"
        @sendRowDataToParent="getVesselFromGrid"
        @sendRowandNestedDataToParent="isShipmentOrVessel"
        :loading="loading"
      />
    </v-container>
  </div>
</template>

<script>
/**
 * Components
 */
import ShipmentGrid from "@/components/ui/DataGrid";
import CreateShipmentBtn from "@/components/ui/Button";
import CreateShipmentModal from "@/components/ui/Modal";
import Alert from "@/components/ui/Notifications";
/**
 * Components end
 */

/**
 * Helpers
 */
import Vessels from "@/utilities/vessels";
/**
 * Helpers end
 */

import { mapActions, mapGetters, mapMutations } from "vuex";
import { bus } from "../main";

export default {
  name: "ShipmnetsList",
  components: {
    ShipmentGrid,
    CreateShipmentBtn,
    CreateShipmentModal,
    Alert
  },
  data: () => ({
    showShipmentForm: false,
    newShipmentAndVesselData: {},
    loading: true,
    headers: [
      {
        text: "id",
        align: "start",
        value: "id"
      },
      {
        text: "Customer",
        align: "right",
        value: "customer"
      },
      { text: "Shipment-ETA", value: "shipment-eta", align: "right" },
      { text: "Vessel", value: "vessel", align: "right" },
      { text: "Actions", value: "actions", align: "right" }
    ],
    buttons: {
      createShipmentBtnColor: "primary",
      createShipmentBtnText: "Create"
    }
  }),
  created: function() {
    this.getAllShipmentsRequest().then(() => {
      this.loading = false;
    });
  },
  computed: {
    ...mapGetters("shipments", ["getShipmentsList", "getShipment"]),
    ...mapGetters("vessel", ["getVessel"]),
    ...mapGetters("notifications", ["getAlert"])
  },
  methods: {
    ...mapActions("shipments", [
      "saveShipmentRequest",
      "getAllShipmentsRequest",
      "updateShipmentRequest",
      "getShipmentRequest"
    ]),
    ...mapActions("vessel", ["getVesselRequest"]),
    ...mapMutations("notifications", ["SET_ALERT_MESSAGE"]),
    /**---------------------Emit---------------------------------------- */
    /**
     * This function gets all the data from the child form.
     * It creates a shipment obj
     * Send the constructed shipment to the srver
     * @param  { Object } formsData
     */
    getDataFromChildForm(formsData) {
      if (typeof formsData !== "undefined") {
        const theShipment = {};
        const theNewShipment = this.createShipmentObj(theShipment, formsData);
        this.createOrUpdateShipment(theNewShipment);
      }
    },
    /**
     * It gets the shipment from the Child Grid
     */
    getVesselFromGrid(shipment) {
      const theShipment = { ...shipment.item };
      this.doGetVesselRequest(theShipment);
    },
    /**
     * It gets the row and nested data from the table
     * Update a a shipment based on the data that are coming
     * If the function gets the first parameter update shipment-eta based on vessel data
     * If the fuction gets the second parameter update a pure shipment.
     * @param  { Object } shipmentVesselData
     * @return { Object }  A object with vessel and shipment data.
     */
    isShipmentOrVessel(shipmentVesselData, shipment) {
      if (shipment === null) {
        //it is vessel
        const theUpdatedShipment = this.updateShipmentBasedOnVessel(
          shipmentVesselData
        );
        this.doUpdateRequest(theUpdatedShipment);
        this.fillInTableWithShipmentData();
      } else if (shipmentVesselData === null) {
        //it is shipment
        this.doGetShipmentRequest(shipment);
      }
    },
    /**---------------------End Of Emit---------------------------------------- */

    /**
     * It opens the form on click
     */
    openDialog() {
      this.showShipmentForm = true;
    },

    /**
     * This function check if the form has all the mandatory fields.
     * If yes based on the id it create or update a shipment.
     * If not it throw an error on the screen
     * @param  { Object } shipment
     */
    createOrUpdateShipment(shipment) {
      const formIsValid = this.hasShipmentAllRequiredValues(shipment);
      if (formIsValid) {
        if (typeof shipment["id"] === "undefined") {
          //create
          this.doSaveRequest(shipment);
          this.showShipmentForm = false;
        } else {
          //update
          this.doUpdateRequest(shipment);
          this.showShipmentForm = false;
        }
      } else {
        this.SET_ALERT_MESSAGE({
          message: "All fields are mandatory",
          messageType: "warning",
          alert: true
        });
      }
    },

    /**
     * This function checks if the keys of the given object have all the values.
     * @param  { Object } shipment
     */
    hasShipmentAllRequiredValues(shipment) {
      for (let key in shipment) {
        if (typeof shipment[key] === "undefined") {
          return false;
        } else {
          return true;
        }
      }
    },
    /**
     * Return the list with the shipments
     * @return { Array }  The list with the shipments
     */
    fillInTableWithShipmentData() {
      return this.getShipmentsList;
    },
    /**
     * Return the list with the vessels
     * @return { Array }  The list with the Vessels
     */
    returnSelectOptionsItems() {
      return Vessels.getVessels();
    },
    /**
     * It megrge two objects in one
     * @param  { Object } shipment
     * @param  { Object } vessel
     * @return { Object }  An object with vessel and shipment data.
     */
    mergeVesselIntoShipment(theShipment, theVessel) {
      const theShipmentAndVesselData = { ...theShipment, ...theVessel };
      return theShipmentAndVesselData;
    },
    /**
     * It finds the difference between shipment-ETA and the vessel-ETA
     * It adds a new property delay into the object
     * @param  { Object } shipmentVesselData
     * @return { Object }  A object with vessel and shipment data.
     */
    findVesselDelay(theShipmentAndVesselData) {
      const shipmentEta = new Date(theShipmentAndVesselData["shipment-eta"]);
      const vesselEta = new Date(theShipmentAndVesselData["vessel-eta"]);
      const diffTime = Math.abs(vesselEta - shipmentEta);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      theShipmentAndVesselData.delay = diffDays;
      this.newShipmentAndVesselData = theShipmentAndVesselData;
      return theShipmentAndVesselData;
    },
    /**
     * Update shipment obj based on vessel-ETA
     * @param  { Object } shipment
     */
    updateShipmentBasedOnVessel(shipment) {
      shipment["shipment-eta"] = shipment["vessel-eta"];
      shipment.delay = 0;
      return shipment;
    },

    /**
     * Construct an obj to get accepted by parent form
     * @param  { Object } shipment
     */
    constructShipmentToGetAcceptedByForm(shipment) {
      const inputData = {};
      inputData["id"] = shipment["id"];
      inputData["input1"] = shipment["customer"];
      inputData["input2"] = shipment["vessel"];
      inputData["input3"] = shipment["shipment-eta"];
      this.passDataTochildForm(inputData);
      return shipment;
    },

    /**
     * Pass the constructed data to parent form
     * @param  { Object } shipment
     */
    passDataTochildForm(shipment) {
      bus.$emit("fillInInputsFromParent", shipment);
    },
    /**
     * It creates an shipment object with the proper keys
     * @param  { Object } shipment
     * @param  { Object } formsData
     * @return { Object } shipment
     */
    createShipmentObj(theShipment, formsData) {
      if (typeof formsData["id"] !== "undefined") {
        theShipment["id"] = formsData.id;
      }
      theShipment["customer"] = formsData.input1;
      theShipment["vessel"] = formsData.input2;
      theShipment["shipment-eta"] = formsData.input3;
      return theShipment;
    },
    /**---------------------Requests---------------------------------------- */

    /**
     * It triggers the save request from actions store.
     * @param  { Object } shipment
     */
    doSaveRequest(theShipment) {
      this.saveShipmentRequest(theShipment).then(
        response => {
          const theResponse = {
            status: response.status,
            code: 200,
            message: "A shipment has been added in the list",
            messageType: "success",
            alert: true
          };
          this.successfulRequestMsg(theResponse);
        },
        error => {
          this.failedRequestMsg(error);
        }
      );
    },
    /**
     * It triggers the update request from actions store.
     * @param  { Object } shipment
     */
    doUpdateRequest(theShipment) {
      this.updateShipmentRequest(theShipment).then(response => {
        const theResponse = {
          status: response.status,
          code: 200,
          message: "A shipment has been updated",
          messageType: "success",
          alert: true
        };
        this.successfulRequestMsg(theResponse);
      }),
        error => {
          this.failedRequestMsg(error);
        };
    },
    /**
     * It triggers the get vessel request from actions store.
     * @param  { Object } shipment
     */
    doGetVesselRequest(theShipment) {
      this.getVesselRequest(theShipment.vessel).finally(() => {
        const theVessel = this.getVessel;
        const theShipmentAndVesselData = this.mergeVesselIntoShipment(
          theShipment,
          theVessel
        );
        this.findVesselDelay(theShipmentAndVesselData);
      });
    },
    /**
     * It triggers the get shipment request from actions store.
     * @param  { Object } shipment
     */
    doGetShipmentRequest(shipment) {
      this.getShipmentRequest(shipment).then(response => {
        this.openDialog();
        this.constructShipmentToGetAcceptedByForm(response.data);
      });
    },
    /**---------------------End of Requests---------------------------------------- */

    /**---------------------Messages---------------------------------------- */

    /**
     * It creates successfull message based on the server response.
     * @param  { Object } response
     */
    successfulRequestMsg(response) {
      if (response.status === response.code) {
        this.alertMutation(response);
      } else if (response.status !== response.code) {
        response.message = "Given Data are not correct";
        response.messageType = "warning";
        this.alertMutation(response);
      }
    },
    /**
     * It creates failed message based on the server response.
     * @param  { Object } response
     */
    failedRequestMsg(error) {
      this.SET_ALERT_MESSAGE({
        message: "Unexpected Error, please try again later: " + " " + error,
        messageType: "error",
        alert: true
      });
    },
    /**
     * It trigers the alert mutation to shoow msgs on the screen
     * @param  { Object } response
     */
    alertMutation(response) {
      this.SET_ALERT_MESSAGE({
        message: response.message,
        messageType: response.messageType,
        alert: response.alert
      });
    }
    /**---------------------End of Messages---------------------------------------- */
  }
};
</script>