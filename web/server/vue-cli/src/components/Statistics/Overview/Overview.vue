<template>
  <v-container>
    <bugs />

    <v-row>
      <v-col>
        <single-line-widget
          icon="mdi-bell-ring"
          color="red"
          label="Outstanding bugs"
          :get-value="getNumberOfOutstandingBugs"
        >
          <template #append-value>
            <v-icon color="red">
              mdi-arrow-down-bold
            </v-icon>
          </template>
        </single-line-widget>
      </v-col>

      <v-col>
        <single-line-widget
          icon="mdi-bell-ring"
          color="red"
          label="Outstanding bugs (SEI-CERT)"
          :get-value="getNumberOfOutstandingSeiCertBugs"
        >
          <template #append-value>
            <v-icon color="red">
              mdi-arrow-down-bold
            </v-icon>
          </template>
        </single-line-widget>
      </v-col>

      <v-col>
        <single-line-widget
          icon="mdi-close"
          color="red"
          label="Number of failed files"
          :get-value="getNumberOfFailedFiles"
        >
          <template #append-value>
            <v-icon color="red">
              mdi-arrow-down-bold
            </v-icon>
          </template>
        </single-line-widget>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <single-line-widget
          icon="mdi-card-account-details"
          color="grey"
          label="Active checkers"
          :get-value="getNumberOfActiveCheckers"
        />
      </v-col>

      <v-col>
        <single-line-widget
          icon="mdi-card-account-details"
          color="grey"
          label="Active SEI-CERT rules"
          :get-value="getNumberOfActiveSeiCertCheckers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Number of bugs introduced in the last 1,7,31 days
// Number of resolved bugs introduced in the last 1,7,31 days
// Number of failed files
// Number of checkers
// Number of sei cert rules enabled and its coverage
// Number of outstanding bugs latest status
// Number of outstanding bugs that correspond to sei-cert

// Bug density: how many reports we have per lines of code
import { ccService, handleThriftError } from "@cc-api";
import { ReportFilter } from "@cc/report-server-types";
import { DateMixin } from "@/mixins";
import Bugs from "./Bugs";
import SingleLineWidget from "./SingleLineWidget";

export default {
  name: "Overview",
  components: { Bugs, SingleLineWidget },
  mixins: [ DateMixin ],
  methods: {
    getNumberOfBugs(runIds, reportFilter, cmpData) {
      return new Promise(resolve => {
        ccService.getClient().getRunResultCount(runIds, reportFilter, cmpData,
          handleThriftError(res => {
            resolve(res.toNumber());
          }));
      });
    },

    getNumberOfOutstandingBugs() {
      const runIds = null;
      const cmpData = null;

      const reportFilter = new ReportFilter({
        openReportsDate: this.getUnixTime(new Date)
      });

      return this.getNumberOfBugs(runIds, reportFilter, cmpData);
    },

    getNumberOfOutstandingSeiCertBugs() { return 42; },
    getNumberOfFailedFiles() { return 42; },

    getNumberOfActiveCheckers() {
      const runIds = null;
      const reportFilter = null;
      const cmpData = null;
      const limit = null;
      const offset = 0;

      return new Promise(resolve => {
        ccService.getClient().getCheckerCounts(runIds, reportFilter, cmpData,
          limit, offset, handleThriftError(res => {
            resolve(res.length);
          }));
      })
    },
    getNumberOfActiveSeiCertCheckers() { return 42; },
  }
};
</script>
