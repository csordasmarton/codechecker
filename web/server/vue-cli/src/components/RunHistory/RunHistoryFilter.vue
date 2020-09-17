<template>
  <v-row>
    <v-col align-self="center">
      <run-name-autocomplete
        @initalized="initByUrl"
        @on-filter-changed="$emit('on-filter-changed')"
      />
    </v-col>
    <v-col align-self="center">
      <v-text-field
        :value="runTag"
        class="search-run-tag"
        prepend-inner-icon="mdi-tag"
        label="Filter by run tag..."
        clearable
        single-line
        hide-details
        outlined
        solo
        flat
        dense
        @input="setRunTag"
      />
    </v-col>

    <v-col align-self="center" cols="2">
      <date-time-picker
        :value="storedAfter"
        input-class="stored-after"
        dialog-class="stored-after"
        label="Stored after..."
        prepend-inner-icon="mdi-calendar-arrow-right"
        outlined
        dense
        @input="setStoredAfter"
      />
    </v-col>

    <v-col align-self="center" cols="2">
      <date-time-picker
        :value="storedBefore"
        input-class="stored-before"
        dialog-class="stored-befpre"
        label="Stored before..."
        prepend-inner-icon="mdi-calendar-arrow-left"
        outlined
        dense
        @input="setStoredBefore"
      />
    </v-col>

    <slot />
  </v-row>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapMutations } from "vuex";
import {
  SET_RUN_HISTORY_RUN_TAG,
  SET_RUN_HISTORY_STORED_AFTER,
  SET_RUN_HISTORY_STORED_BEFORE
} from "@/store/mutations.type";
import { DateMixin } from "@/mixins";
import DateTimePicker from "@/components/DateTimePicker";

import RunNameAutocomplete from "./RunNameAutocomplete";

export default {
  name: "RunHistoryFilter",
  components: {
    DateTimePicker,
    RunNameAutocomplete
  },
  mixins: [ DateMixin ],

  computed: {
    ...mapGetters("runHistory", [
      "runTag",
      "storedBefore",
      "storedAfter",
    ])
  },

  watch: {
    runTag: {
      handler: _.debounce(function () {
        this.onChange("run-tag", this.runTag);
      }, 500)
    },

    storedAfter: {
      handler: _.debounce(function () {
        const date = this.storedAfter
          ? this.dateTimeToStr(this.storedAfter) : null;

        this.onChange("stored-after", date);
      }, 500)
    },

    storedBefore: {
      handler: _.debounce(function () {
        const date = this.storedBefore
          ? this.dateTimeToStr(this.storedBefore) : null;

        this.onChange("stored-before", date);
      }, 500)
    }
  },

  methods: {
    ...mapMutations("runHistory", [
      SET_RUN_HISTORY_RUN_TAG,
      SET_RUN_HISTORY_STORED_BEFORE,
      SET_RUN_HISTORY_STORED_AFTER
    ]),

    onChange(name, val) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          [ name ]: val ? val : undefined
        }
      }).catch(() => {});

      this.$emit("on-filter-changed");
    },

    initByUrl() {
      const runTag = this.$router.currentRoute.query["run-tag"];
      if (runTag)
        this.setRunTag(runTag);

      const storedAfter = this.$router.currentRoute.query["stored-after"];
      if (storedAfter)
        this.setStoredAfter(new Date(storedAfter));

      const storedBefore = this.$router.currentRoute.query["stored-before"];
      if (storedBefore)
        this.setStoredBefore(new Date(storedBefore));

      this.$emit("initalized");
    }
  }
};
</script>
