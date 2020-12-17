<template>
  <v-btn
    color="primary"
    outlined
    small
    @click="toggleBlameView"
  >
    <span v-if="value">Normal view</span>
    <span v-else>Blame view</span>
  </v-btn>
</template>

<script>
export default {
  name: "ToggleBlameViewBtn",
  props: {
    value: { type: Boolean, required: true }
  },
  methods: {
    toggleBlameView() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
