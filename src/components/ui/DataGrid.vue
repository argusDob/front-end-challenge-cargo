<template>
  <div>
    <v-card>
      <v-card-title>
        Shipments
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="items"
      :nestedData="nestedData"
      item-key="id"
      sort-by="name"
      class="elevation-1 mt-1"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      @item-expanded="sendRowDataToParent"
      :loading="loading"
      loading-text="Loading... Please wait"
      :search="search"
    >
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <v-container fluid>
            <v-row class="mb-2">
              <v-col cols="4">
                <v-row class="d-flex flex-column mt-4">
                  <strong>Customer:</strong>
                  {{ item.customer}}
                </v-row>
                <v-row class="d-flex flex-column mt-4">
                  <strong>Vessel:</strong>
                  {{item.vessel}}
                </v-row>
              </v-col>
              <v-divider inset vertical></v-divider>
              <v-col cols="4">
                <v-row class="d-flex flex-column mt-4">
                  <strong>Vessel-ETA:</strong>
                  {{ nestedData["vessel-eta"] }}
                </v-row>
                <v-row class="d-flex flex-column mt-4">
                  <strong>Shipment-ETA:</strong>
                  {{ item["shipment-eta"] }}
                </v-row>
                <v-row class="d-flex flex-column mt-4">
                  <strong>Delay:</strong>
                  {{ nestedData.delay + " " }} days
                </v-row>
              </v-col>
              <v-divider inset vertical></v-divider>
              <v-col class="d-flex justify-content-center align-items-center mt-6" cols="4">
                <UpdateBtn
                  color="success"
                  text="Update Shipment ETA"
                  @click.native="sendRowandNestedDataToParent(nestedData, null)"
                />
              </v-col>
            </v-row>
          </v-container>
        </td>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-icon
            class="mr-2"
            color="green darken-2"
            medium
            @click="sendRowandNestedDataToParent(null, item)"
          >mdi-pencil</v-icon>
          <v-icon color="red" medium disabled>mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UpdateBtn from "./Button";

export default {
  name: "DataGrid",
  components: {
    UpdateBtn
  },
  props: {
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    nestedData: { type: Object, required: false },
    loading: { type: Boolean, default: true }
  },
  data: () => ({
    expanded: [],
    singleExpand: true,
    search: ""
  }),
  methods: {
    /**-----------------------------------Events---------------------------------------*/
    /**
     * Triggers on expand row action
     *
     * @property { Object } value the row data
     */
    sendRowDataToParent(value) {
      this.$emit("sendRowDataToParent", value);
    },
        /**
     * Triggers on update action
     *
     * @property { Object } nestedData the nested data
     * @property { Object } rowData the row data

     */
    sendRowandNestedDataToParent(nestedData, rowData) {
      this.$emit("sendRowandNestedDataToParent", nestedData, rowData);
    }
    /**-----------------------------------End of Events---------------------------------------*/
  }
};
</script>
