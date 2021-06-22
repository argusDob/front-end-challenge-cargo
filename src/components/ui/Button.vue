<template>
  <div>
    <v-btn depressed :color="color">{{text}}</v-btn>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    color: String,
    text: String
  },

  data: () => ({})
};
</script>
