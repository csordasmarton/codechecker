import { DateInterval, RunHistoryFilter } from "@cc/report-server-types";
import {
  SET_RUN_HISTORY_RUN_IDS,
  SET_RUN_HISTORY_RUN_TAG,
  SET_RUN_HISTORY_STORED_AFTER,
  SET_RUN_HISTORY_STORED_BEFORE
} from "../mutations.type";

import { DateMixin } from "@/mixins";

const getUnixTime = DateMixin.methods.getUnixTime;

const state = {
  runIds: null,
  runTag: null,
  storedAfter: null,
  storedBefore: null
};

const getters = {
  runIds(state) {
    return state.runIds;
  },
  runTag(state) {
    return state.runTag;
  },
  storedBefore(state) {
    return state.storedBefore;
  },
  storedAfter(state) {
    return state.storedAfter;
  },
  runHistoryFilter(state) {
    if (!state.runTag && !state.storedAfter && !state.storedBefore)
      return null;

    let storedAt = null;
    if (state.storedAfter || state.storedBefore) {
      storedAt = new DateInterval({
        before: state.storedBefore ? getUnixTime(state.storedBefore) : null,
        after: state.storedAfter ? getUnixTime(state.storedAfter) : null
      });
    }

    return new RunHistoryFilter({
      tagNames: state.runTag ? [ `*${state.runTag}*` ] : null,
      stored: storedAt
    });
  }
};

const mutations = {
  [SET_RUN_HISTORY_RUN_IDS](state, runIds) {
    state.runIds = runIds;
  },
  [SET_RUN_HISTORY_RUN_TAG](state, runTag) {
    state.runTag = runTag;
  },
  [SET_RUN_HISTORY_STORED_AFTER](state, storedAfter) {
    state.storedAfter = storedAfter;
  },
  [SET_RUN_HISTORY_STORED_BEFORE](state, storedBefore) {
    state.storedBefore = storedBefore;
  }
};

export default {
  namespaced: true,

  state,
  mutations,
  getters
};
