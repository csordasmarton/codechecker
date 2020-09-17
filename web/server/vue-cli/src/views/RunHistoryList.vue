<template>
  <v-card flat>
    <!-- TODO: Refactor this component and move things which are common
         with RunList component into separate components. -->
    <v-dialog
      v-model="showCheckCommandDialog"
      content-class="check-command"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline primary white--text"
          primary-title
        >
          Check command

          <v-spacer />

          <v-btn icon dark @click="showCheckCommandDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            {{ checkCommand }}
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <analyzer-statistics-dialog
      :value.sync="analyzerStatisticsDialog"
      :run-history-id="selectedRunHistoryId"
    />

    <v-data-table
      :headers="headers"
      :items="formattedRunHistories"
      :options.sync="pagination"
      :loading="loading"
      loading-text="Loading run histories..."
      :server-items-length.sync="totalItems"
      :footer-props="footerProps"
      :must-sort="true"
      :mobile-breakpoint="1000"
      item-key="name"
    >
      <template v-slot:top>
        <run-history-filter
          @initalized="initByUrl"
          @on-filter-changed="onFilterChanged"
        >
          <v-col align="right" align-self="center" class="text-no-wrap">
            <v-btn
              color="primary"
              class="diff-run-history-btn mr-2"
              outlined
              :to="diffTargetRoute"
              :disabled="isDiffBtnDisabled"
            >
              <v-icon left>
                mdi-select-compare
              </v-icon>
              Diff
            </v-btn>

            <v-btn
              icon
              title="Reload run history"
              color="primary"
              @click="fetchRunHistories"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </run-history-filter>
      </template>
      <template #item.runName="{ item }">
        <run-name-column
          :id="item.id.toNumber()"
          :name="item.runName"
          :description="item.description"
          :report-filter-query="getReportFilterQuery(item)"
          :statistics-filter-query="getStatisticsFilterQuery(item)"
          :show-run-history="false"
          :open-check-command-dialog="openCheckCommandDialog"
        />
      </template>

      <template #item.analyzerStatistics="{ item }">
        <analyzer-statistics-btn
          v-if="Object.keys(item.analyzerStatistics).length"
          :value="item.analyzerStatistics"
          @click.native="openAnalyzerStatisticsDialog(item)"
        />
      </template>

      <template #item.time="{ item }">
        <v-chip
          class="ma-2"
          color="primary"
          outlined
        >
          <v-icon left>
            mdi-calendar-range
          </v-icon>
          {{ item.time | prettifyDate }}
        </v-chip>
      </template>

      <template #item.user="{ item }">
        <v-chip
          class="ma-2"
          color="success"
          outlined
        >
          <v-icon left>
            mdi-account
          </v-icon>
          {{ item.user }}
        </v-chip>
      </template>

      <template #item.versionTag="{ item }">
        <v-chip
          v-if="item.versionTag"
          outlined
        >
          <v-avatar left>
            <v-icon
              :color="strToColor(item.versionTag)"
            >
              mdi-tag-outline
            </v-icon>
          </v-avatar>
          <span
            class="grey--text text--darken-3"
          >
            {{ item.versionTag }}
          </span>
        </v-chip>
      </template>

      <template #item.codeCheckerVersion="{ item }">
        <span :title="item.codeCheckerVersion">
          {{ item.$codeCheckerVersion }}
        </span>
      </template>

      <template #item.diff="{ item }">
        <v-row class="flex-nowrap">
          <v-checkbox
            v-model="selectedBaselineTags"
            :value="item"
            multiple
          />

          <v-checkbox
            v-model="selectedComparedToTags"
            :value="item"
            multiple
          />
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { format, max, min, parse } from "date-fns";
import { mapGetters } from "vuex";
import {
  AnalyzerStatisticsBtn,
  AnalyzerStatisticsDialog,
  RunNameColumn
} from "@/components/Run";
import { DateMixin, StrToColorMixin } from "@/mixins";
import { RunHistoryFilter } from "@/components/RunHistory";

import { ccService, handleThriftError } from "@cc-api";

export default {
  name: "RunHistoryList",
  components: {
    AnalyzerStatisticsBtn,
    AnalyzerStatisticsDialog,
    RunNameColumn,
    RunHistoryFilter
  },
  mixins: [ DateMixin, StrToColorMixin ],

  data() {
    const itemsPerPageOptions = [ 25, 50, 100 ];

    const page = parseInt(this.$router.currentRoute.query["page"]) || 1;
    const itemsPerPage =
      parseInt(this.$router.currentRoute.query["items-per-page"]) ||
      itemsPerPageOptions[0];
    const sortBy = this.$router.currentRoute.query["sort-by"];
    const sortDesc = this.$router.currentRoute.query["sort-desc"];

    return {
      showCheckCommandDialog: false,
      analyzerStatisticsDialog: false,
      selectedRunHistoryId: null,
      checkCommand: null,
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        sortBy: sortBy ? [ sortBy ] : [],
        sortDesc: sortDesc !== undefined ? [ !!sortDesc ] : []
      },
      footerProps: {
        itemsPerPageOptions: itemsPerPageOptions
      },
      totalItems: 0,
      loading: false,
      selectedBaselineTags: [],
      selectedComparedToTags: [],
      headers: [
        {
          text: "Name",
          value: "runName",
          sortable: false
        },
        {
          text: "Analyzer statistics",
          value: "analyzerStatistics",
          sortable: false
        },
        {
          text: "Storage date",
          value: "time",
          align: "center",
          sortable: false
        },
        {
          text: "User",
          value: "user",
          align: "center",
          sortable: false
        },
        {
          text: "Version tag",
          value: "versionTag",
          sortable: false
        },
        {
          text: "CodeChecker version",
          value: "codeCheckerVersion",
          align: "center",
          sortable: false
        },
        {
          text: "Diff",
          value: "diff",
          align: "center",
          sortable: false
        }
      ],
      histories: []
    };
  },

  computed: {
    ...mapGetters("runHistory", [
      "runIds",
      "runHistoryFilter"
    ]),

    formattedRunHistories() {
      return this.histories.map(history => {
        const ccVersion = this.prettifyCCVersion(history.codeCheckerVersion);

        return {
          ...history,
          $codeCheckerVersion: ccVersion
        };
      });
    },

    isDiffBtnDisabled() {
      return !this.selectedBaselineTags.length ||
             !this.selectedComparedToTags.length;
    },

    diffTargetRoute() {
      const urlState = {};

      const { runs: bRuns, tags: bTags, times: firstDetectionDates } =
        this.getSelectedTagData(this.selectedBaselineTags);

      urlState["run"] = bRuns;
      urlState["run-tag"] = bTags.length ? bTags : undefined;

      const { runs: nRuns, tags: nTags, times: fixDates } =
        this.getSelectedTagData(this.selectedComparedToTags);

      urlState["newcheck"] = nRuns;
      urlState["run-tag-newcheck"] = nTags.length ? nTags : undefined;

      if (firstDetectionDates.length || fixDates.length) {
        const dates = [ ...firstDetectionDates, ...fixDates ];

        const minDate = min(dates.map(d =>
          parse(d, "yyyy-MM-dd HH:mm:ss.SSSSSS", new Date())));
        const maxDate = max(dates.map(d =>
          parse(d, "yyyy-MM-dd HH:mm:ss.SSSSSS", new Date())));
        urlState["detected-after"] = format(minDate, "yyyy-MM-dd HH:mm:ss");
        urlState["detected-before"] = format(maxDate, "yyyy-MM-dd HH:mm:ss");
      }

      return {
        name: "reports",
        query: {
          ...this.$router.currentRoute.query,
          ...urlState
        }
      };
    },
  },

  methods: {
    initByUrl() {
      this.$watch("pagination", this.onPaginationChange, { deep: true });

      // Change the pagination to init and fetch items.
      this.pagination = { ...this.pagination };
    },

    onPaginationChange() {
      const defaultItemsPerPage = this.footerProps.itemsPerPageOptions[0];
      const itemsPerPage =
        this.pagination.itemsPerPage === defaultItemsPerPage
          ? undefined
          : this.pagination.itemsPerPage;

      const page = this.pagination.page === 1
        ? undefined : this.pagination.page;
      const sortBy = this.pagination.sortBy.length
        ? this.pagination.sortBy[0] : undefined;
      const sortDesc = this.pagination.sortDesc.length
        ? this.pagination.sortDesc[0] : undefined;

      this.$router.replace({
        query: {
          ...this.$route.query,
          "items-per-page": itemsPerPage,
          "page": page,
          "sort-by": sortBy,
          "sort-desc": sortDesc,
        }
      }).catch(() => {});

      this.fetchRunHistories();
    },

    onFilterChanged() {
      if (this.pagination.page !== 1) {
        this.pagination.page = 1;
      } else {
        this.fetchRunHistories();
      }
    },

    async fetchRunHistories() {
      this.loading = true;

      // Get total item count.
      ccService.getClient().getRunHistoryCount(this.runIds,
        this.runHistoryFilter, (err, totalItems) => {
          this.totalItems = totalItems.toNumber();
        });

      
      const limit = this.pagination.itemsPerPage;
      const offset = limit * (this.pagination.page - 1);

      ccService.getClient().getRunHistory(this.runIds, limit, offset,
        this.runHistoryFilter, handleThriftError(histories => {
          this.histories = histories;
          this.loading = false;
        }));
    },

    openCheckCommandDialog(runHistoryId) {
      ccService.getClient().getCheckCommand(runHistoryId, null,
        handleThriftError(checkCommand => {
          if (!checkCommand) {
            checkCommand = "Unavailable!";
          }
          this.checkCommand = checkCommand;
          this.showCheckCommandDialog = true;
        }));
    },

    closeCheckCommandDialog() {
      this.showCheckCommandDialog = false;
      this.checkCommand = null;
    },

    getSelectedTagData(selected) {
      const runs = [];
      const tags = [];
      const times = [];

      selected.forEach(t => {
        runs.push(t.runName);
        times.push(t.time);

        if (t.versionTag) {
          tags.push(t.versionTag);
        }
      });

      return { runs, tags, times };
    },

    openAnalyzerStatisticsDialog(runHistory) {
      this.selectedRunHistoryId = runHistory.id;
      this.analyzerStatisticsDialog = true;
    },

    // TODO: same function in the RunList component.
    prettifyCCVersion(version) {
      if (!version) return version;

      return version.split(" ")[0];
    },

    getReportFilterQuery(history) {
      return {
        run: history.runName,
        "run-tag": history.versionTag || undefined,
        "detected-before": history.versionTag ? undefined : history.time

      };
    },

    getStatisticsFilterQuery(history) {
      return {
        run: history.runName
      };
    }
  }
};
</script>
