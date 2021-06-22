     <template>
  <v-dialog v-model="show" @input="onCloseCleanInputs()" height="800" width="500">
    <v-card height="420">
      <v-card-title class="text-h5 grey lighten-2">Create Shipment</v-card-title>
      <v-form>
        <v-container>
          <v-row class="d-flex justify-center">
            <v-col>
              <v-text-field v-model="theForm.input1" :label="inputLabel1" outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="theForm.input2" :items="items" :label="inputLabel2" outlined></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="theForm.input3"
                    :label="inputLabel3"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="theForm.input3" @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <input type="hidden" name="id" class="form-control" :value="theForm.id">
        </v-container>
      </v-form>

      <v-card-actions>
        <v-row class="d-flex justify-space-between">
          <Button color="primary" text="Submit" @click.native="returnDataToParent"/>
          <Button color="warning" text="Cancel"/>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from "../ui/Button";

import { bus } from "../../main";

export default {
  name: "Modal",
  components: {
    Button
  },
  props: {
    inputLabel1: String,
    inputLabel2: String,
    inputLabel3: String,
    items: Array,
    visible: Boolean,
    inputData: Object
  },
  data: () => ({
    menu2: false,
    theForm: {
      id: undefined,
      input1: undefined,
      input2: undefined,
      input3: undefined
    }
  }),
  mounted() {
    bus.$on("fillInInputsFromParent", this.fillInInputsFromParent);
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },
  methods: {
    returnDataToParent() {
      const inputsFormData = this.getFormData();
      this.$emit("passDataToparent", inputsFormData);
    },
    closeModal() {
      this.dialog = false;
    },
    getFormData() {
      const inputsFormData = {};
      inputsFormData["id"] = this.theForm.id;
      this.createFormObj(inputsFormData, this.theForm);
      return inputsFormData;
    },
    fillInInputsFromParent(value) {
      this.theForm.id = value.id;
      this.createFormObj(this.theForm, value);
    },
    createFormObj(inputsFormData, theForm) {
      inputsFormData["input1"] = theForm["input1"];
      inputsFormData["input2"] = theForm["input2"];
      inputsFormData["input3"] = theForm["input3"];
      return inputsFormData;
    },
    onCloseCleanInputs() {
      this.theForm["id"] = undefined;
      this.theForm["input1"] = undefined;
      this.theForm["input2"] = undefined;
      this.theForm["input3"] = undefined;
    }
  }
};
</script>