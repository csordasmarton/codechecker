<template>
  <v-container class="pa-0">
    <v-row>
      <v-col
        v-for="bug in bugs"
        :key="bug.label"
        md="12"
        lg="6"
      >
        <v-card :color="bug.color" dark>
          <v-card-title class="text-h4">
            <v-icon class="mr-2">
              {{ bug.icon }}
            </v-icon>
            {{ bug.label }}
          </v-card-title>
          <v-row>
            <v-col
              v-for="c in bug.cols"
              :key="c.label"
              :cols="12 / bug.cols.length"
            >
              <v-card
                class="text-center"
                color="transparent"
                :loading="c.loading"
                flat
              >
                <div class="text-h2">
                  {{ c.value }}
                </div>
                <v-card-title class="justify-center">
                  {{ c.label }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  endOfYesterday,
  startOfToday,
  startOfYesterday,
  subDays
} from "date-fns";
import { ccService, handleThriftError } from "@cc-api";
import {
  CompareData,
  DateInterval,
  DiffType,
  ReportDate,
  ReportFilter
} from "@cc/report-server-types";
import { DateMixin } from "@/mixins";

export default {
  name: "Bugs",
  mixins: [ DateMixin ],
  data() {
    const now = new Date();
    const last7Days = subDays(now, 7);
    const last31Days = subDays(now, 31);

    const cols = [
      { label: "Today",  date: [ startOfToday(), now ] },
      { label: "Yesterday", date: [ startOfYesterday(), endOfYesterday() ] },
      { label: "Last 7 days", date: [ last7Days, now ] },
      { label: "Last 31 days", date: [ last31Days, now ] }
    ];

    return {
      bugs: [
        {
          label: "New bugs",
          color: "red",
          icon: "mdi-arrow-up",
          getValue: this.getNewBugs,
          cols: cols.map(c => ({ ...c, value: null, loading: null }))
        },
        {
          label: "Number of resolved bugs",
          color: "green",
          icon: "mdi-arrow-down",
          getValue: this.getResolvedBugs,
          cols: cols.map(c => ({ ...c, value: null, loading: null }))
        },
      ]
    };
  },

  mounted() {
    this.bugs.forEach(b => b.cols.forEach(c =>  b.getValue(c, c.date)));
  },

  methods: {
    getBugs(column, runIds, reportFilter, cmpData) {
      column.loading = "white";

      ccService.getClient().getRunResultCount(runIds, reportFilter, cmpData,
        handleThriftError(res => {
          column.value = res.toNumber();
          column.loading = null;
        }));
    },

    getNewBugs(column, date) {
      const runIds = null; // TODO

      const reportFilter = new ReportFilter({
        openReportsDate: this.getUnixTime(date[0])
      });

      const cmpData = new CompareData({
        openReportsDate: this.getUnixTime(date[1]),
        diffType: DiffType.NEW
      });

      this.getBugs(column, runIds, reportFilter, cmpData);
    },

    getResolvedBugs(column, date) {
      const runIds = null; // TODO
      const cmpData = null;

      const reportFilter = new ReportFilter({
        date: new ReportDate({
          fixed: new DateInterval({
            after: this.getUnixTime(date[0]),
            before: this.getUnixTime(date[1])
          })
        })
      });

      this.getBugs(column, runIds, reportFilter, cmpData);
    },
  }
};
</script>
