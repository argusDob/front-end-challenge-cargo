<template>
  <div>
    <v-btn depressed :color="color">{{text}}</v-btn>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    color: { type: String, default: "Primary" },
    text: { type: String, default: "Button" }
  },

  data: () => ({})
};
</script>
