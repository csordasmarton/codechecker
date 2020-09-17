<template>
  <v-autocomplete
    v-model="selectedRuns"
    :items="runs"
    :loading="loading"
    :search-input.sync="search"
    hide-selected
    hide-details
    item-text="name"
    item-value="name"
    label="Run names"
    placeholder="Start typing a run name"
    prepend-inner-icon="mdi-play"
    multiple
    cache-items
    chips
    return-object
    dense
    outlined
    solo
    flat
    @blur="onBlur"
  >
    <template v-slot:no-data>
      <v-list-item v-if="search">
        <v-list-item-title>No matching runs.</v-list-item-title>
      </v-list-item>

      <v-list-item v-else>
        <v-list-item-title>Type to search for run name...</v-list-item-title>
      </v-list-item>
    </template>

    <template v-slot:selection="{ attr, on, item, selected }">
      <v-chip
        v-bind="attr"
        :input-value="selected"
        :color="strToColor(item.name)"
        :title="item.name"
        class="white--text"
        close
        v-on="on"
        @click:close="remove(item)"
      >
        <span v-text="item.name" />
      </v-chip>
    </template>

    <template v-slot:item="{ item }">
      <v-list-item-avatar
        :color="strToColor(item.name)"
        class="headline font-weight-light white--text"
      >
        {{ item.name.charAt(0) }}
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name" />
        <v-list-item-subtitle v-text="item.runDate" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapMutations } from "vuex";
import { ccService, handleThriftError } from "@cc-api";
import { RunFilter } from "@cc/report-server-types";
import { SET_RUN_HISTORY_RUN_IDS } from "@/store/mutations.type";

import { StrToColorMixin } from "@/mixins";

export default {
  name: "RunNameAutocomplete",
  mixins: [ StrToColorMixin ],
  data() {
    return {
      loading: false,
      search: null,
      runs: [],
      selectedRuns: null
    };
  },

  computed: {
    ...mapGetters("runHistory", [
      "runIds"
    ])
  },

  watch: {
    search: {
      handler: _.debounce(function (val) {
        if (!val) return;
        if (this.loading) return;

        this.loading = true;

        const runFilter = new RunFilter({ names: [ `*${val}*` ] });
        const limit = null;
        const offset = null;
        const sortMode = null;

        ccService.getClient().getRunData(runFilter, limit, offset, sortMode,
          handleThriftError(runs => {
            this.runs = runs;
            this.loading = false;
          }));
      }, 500)
    }
  },

  created() {
    this.initByUrl();
  },

  methods: {
    ...mapMutations("runHistory", [
      SET_RUN_HISTORY_RUN_IDS
    ]),

    async initByUrl() {
      let runNames = this.$router.currentRoute.query["run"];
      if (runNames) {
        if (!Array.isArray(runNames))
          runNames = [ runNames ];

        this.selectedRuns = await ccService.getRuns(null, runNames);
        this.runs = this.selectedRuns;
        this.setRunIds(this.selectedRuns.map(r => r.runId));
      }

      this.$emit("initalized");
    },

    remove(run) {
      const index = this.selectedRuns.findIndex(r => r.runId === run.runId);
      if (index >= 0)
        this.selectedRuns.splice(index, 1);
    },

    onBlur() {
      let runIds = null;

      if (this.selectedRuns.length)
        runIds = this.selectedRuns.map(r => r.runId);

      this.setRunIds(runIds);

      const runNames = this.selectedRuns.map(r => r.name);
      this.$router.replace({
        query: {
          ...this.$route.query,
          run: runNames.length ? runNames : undefined
        }
      }).catch(() => {});

      this.$emit("on-filter-changed");
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-chip {
  display: inline-block;
  max-width: 250px;

  .v-chip__content span {
    line-height: 32px;
    display: inline-block !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }
}
</style>