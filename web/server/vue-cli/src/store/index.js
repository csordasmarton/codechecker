import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import config from "./modules/config";
import error from "./modules/error";
import product from "./modules/product";
import runHistory from "./modules/run-history";
import serverInfo from "./modules/server-info";
import url from "./modules/url";

import report from "./modules/report";
import statistics from "./modules/statistics";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    config,
    error,
    product,
    report,
    runHistory,
    statistics,
    serverInfo,
    url
  }
});