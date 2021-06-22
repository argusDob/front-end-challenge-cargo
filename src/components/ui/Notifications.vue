<template>
  <div>
    <v-alert v-if="getAlert" :type="getAlertType">{{ showMessage }}</v-alert>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "Alerts",
  created() {
    setTimeout(() => {
      const payload = { message: "", messageType: "error", alert: false };
      this.SET_ALERT_MESSAGE(payload);
    }, 5000);
  },
  computed: {
    ...mapGetters({
      showMessage: "notifications/getMessage",
      getAlertType: "notifications/getAlertType",
      getAlert: "notifications/getAlert"
    })
  },
  methods: {
    ...mapMutations({
      SET_ALERT_MESSAGE: "notifications/SET_ALERT_MESSAGE"
    })
  }
};
</script>