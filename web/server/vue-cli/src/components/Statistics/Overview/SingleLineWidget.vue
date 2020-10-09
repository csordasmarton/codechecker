<template>
  <v-card :loading="loading">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-avatar :color="color" size="64" tile>
            <v-icon dark size="48">
              {{ icon }}
            </v-icon>
          </v-avatar>
        </v-col>
        <v-col class="text-center">
          <div class="subtitle grey--text text-uppercase">
            {{ label }}
          </div>
          <div class="text-h3 font-weight-bold">
            {{ value }}

            <slot name="append-value" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "SingleLineWidget",
  props: {
    icon: { type: String, required: true },
    color: { type: String, required: true },
    label: { type: String, required: true },
    getValue: { type: Function, required: true }
  },
  data() {
    return {
      loading: false,
      value: null
    };
  },
  async mounted() {
    this.loading = true;

    this.value = await this.getValue();

    this.loading = false;
  }
};
</script>
