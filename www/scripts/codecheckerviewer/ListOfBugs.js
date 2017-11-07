// -------------------------------------------------------------------------
//                     The CodeChecker Infrastructure
//   This file is distributed under the University of Illinois Open Source
//   License. See LICENSE.TXT for details.
// -------------------------------------------------------------------------

define([
  'dojo/_base/declare',
  'dojo/dom-construct',
  'dojo/Deferred',
  'dojo/data/ObjectStore',
  'dojo/data/ItemFileWriteStore',
  'dojo/store/api/Store',
  'dojo/store/util/QueryResults',
  'dojo/topic',
  'dijit/layout/BorderContainer',
  'dijit/layout/TabContainer',
  'dijit/Tooltip',
  'dojox/grid/DataGrid',
  'dojox/grid/LazyTreeGrid',
  'dijit/tree/ForestStoreModel',
  'codechecker/BugViewer',
  'codechecker/BugFilterView',
  'codechecker/RunHistory',
  'codechecker/hashHelper',
  'codechecker/util'],
function (declare, dom, Deferred, ObjectStore, ItemFileWriteStore, Store, QueryResults, topic,
  BorderContainer, TabContainer, Tooltip, DataGrid, LazyTreeGrid, ForestStoreModel, BugViewer, BugFilterView,
  RunHistory, hashHelper, util) {

  function getRunData(runIds, runNames) {
    var runFilter = new CC_OBJECTS.RunFilter();

      if (runIds) {
        if (!(runIds instanceof Array))
          runIds = [runIds];

        runFilter.ids = runIds;
      }

      if (runNames) {
        if (!(runNames instanceof Array))
          runNames = [runNames];

        runFilter.names = runNames;
        runFilter.exactMatch = true;
      }

    var runData = CC_SERVICE.getRunData(runFilter);
    return runData.length ? runData[0] : null;
  }

  function initByUrl(grid, tab) {
    var state = hashHelper.getValues();

    if (!(state.tab === undefined && tab === 'allReports') && tab !== state.tab)
      return;

    if (state.report !== undefined || state.reportHash !== undefined) {
      topic.publish('openFile',
        state.report !== undefined ? state.report : null,
        state.reportHash !== undefined ? state.reportHash : null,
        grid);
      return;
    }

    switch (state.subtab) {
      case undefined:
        topic.publish('subtab/bugOverview');
        return;
      case 'runHistory':
        topic.publish('subtab/runHistory');
        return;
    }
  }

  var filterHook = function(filters, isDiff) {
    var length = 0;

    Object.keys(filters).map(function (key) {
      if (filters[key])
        length += filters[key].length;
    })

    topic.publish("hooks/FilteringChanged" + (isDiff ? "Diff" : ""), length);
  };

  var createRunResultFilterParameter = function (reportFilters) {
    var cmpData = null;
    var runIds = null;
    if (reportFilters.run)
      runIds = reportFilters.run;
    else if (reportFilters.baseline || reportFilters.newcheck) {
      runIds = reportFilters.baseline;

      if (reportFilters.newcheck) {
        cmpData = new CC_OBJECTS.CompareData();
        cmpData.runIds = reportFilters.newcheck;
        cmpData.diffType = reportFilters.difftype
          ? reportFilters.difftype
          : CC_OBJECTS.DiffType.NEW;
      }
    }

    return {
      runIds  : runIds,
      cmpData : cmpData
    };
  };

  var BugStore = declare(Store, {
    constructor : function () {
      this.sortType = [];
    },

    get : function (id) {
      var deferred = new Deferred();

      CC_SERVICE.getReport(id, function (reportData) {
        if (typeof reportData === 'string')
          deferred.reject('Failed to get report ' + id + ': ' + reportData);
        else
          deferred.resolve(reportData);
      });

      return deferred;
    },

    getIdentity : function (reportData) {
      return reportData.id;
    },

    query : function (query, options) {
      var that = this;
      var deferred = new Deferred();

      // Lazy tree grid automatically calls this function without report filter.
      if (!query.reportFilter) {
        deferred.reject("");
        return deferred;
      }

      console.log(query.reportFilter);
      var runResultParam = createRunResultFilterParameter(query.reportFilter);

      CC_SERVICE.getRunResults(
        runResultParam.runIds,
        CC_OBJECTS.MAX_QUERY_SIZE,
        options.start,
        options.sort ? options.sort.map(this._toSortMode) : null,
        query.reportFilter,
        runResultParam.cmpData,
        function (reportDataList) {
          if (reportDataList instanceof RequestFailed)
            deferred.reject('Failed to get reports: ' + reportDataList.message);
          else {
            var items = query.formatter
              ? query.formatter(reportDataList)
              : reportDataList;

            console.log(query);
            deferred.resolve(items);
            filterHook(query.reportFilter, false);
          }
        });

      return deferred;
    },

    _toSortMode : function (sort) {
      var sortMode = new CC_OBJECTS.SortMode();

      sortMode.type
        = sort.attribute === 'checkedFile'
        ? CC_OBJECTS.SortType.FILENAME
        : sort.attribute === 'checkerId'
        ? CC_OBJECTS.SortType.CHECKER_NAME
        : sort.attribute === 'detectionStatus'
        ? CC_OBJECTS.SortType.DETECTION_STATUS
        : sort.attribute === 'reviewStatus'
        ? CC_OBJECTS.SortType.REVIEW_STATUS
        : CC_OBJECTS.SortType.SEVERITY;
      sortMode.ord
        = sort.descending
        ? CC_OBJECTS.Order.DESC
        : CC_OBJECTS.Order.ASC;

      return sortMode;
    }
  });

  function severityFormatter(severity) {
    // When loaded from URL then report data is originally a number.
    // When loaded by clicking on a table row, then severity is already
    // changed to its string representation.
    if (typeof severity === 'number')
      severity = util.severityFromCodeToString(severity);

    var title = severity.charAt(0).toUpperCase() + severity.slice(1);
    return '<span title="' + title  + '" class="customIcon icon-severity-'
      + severity + '"></span>';
  }

  function detectionStatusFormatter(detectionStatus) {
    if (detectionStatus !== null) {
      var status = util.detectionStatusFromCodeToString(detectionStatus);

      return '<span title="' + status  + '" class="customIcon detection-status-'
        + status.toLowerCase() + '"></span>';
    }

    return 'N/A';
  }

  function reviewStatusFormatter(reviewStatus) {
    var className = util.reviewStatusCssClass(reviewStatus);
    var status =
      util.reviewStatusFromCodeToString(reviewStatus);

    return '<span title="' + status
      + '" class="customIcon ' + className + '"></span>';
  }

  function checkerMessageFormatter(msg) {
    return msg !== null ? msg : 'N/A';
  }

  var ListOfBugsGrid = declare(DataGrid, {
    constructor : function () {
      var width = (100 / 5).toString() + '%';

      this.structure = [
        { name : 'File', field : 'checkedFile', cellClasses : 'link compact', width : '100%' },
        { name : 'Message', field : 'checkerMsg', width : '100%', formatter : checkerMessageFormatter },
        { name : 'Checker name', field : 'checkerId', cellClasses : 'link', width : '50%' },
        { name : 'Severity', field : 'severity', cellClasses : 'severity', width : '15%', formatter : severityFormatter },
        { name : 'Review status', field : 'reviewStatus', cellClasses : 'review-status', width : '15%', formatter : reviewStatusFormatter },
        { name : 'Review comment', cellClasses : 'review-comment-message compact', field : 'reviewComment', width : '50%' },
        { name : 'Detection status', field : 'detectionStatus', cellClasses : 'detection-status', width : '15%', formatter : detectionStatusFormatter }
      ];

      this.focused = true;
      this.selectable = true;
      this.keepSelection = true;
      this.store = new ObjectStore({ objectStore : new BugStore() });
      this.escapeHTMLInData = false;
      this.selectionMode = 'single';
      this._lastSelectedRow = 0;
    },

    refreshGrid : function (reportFilters) {
      this.setQuery({ reportFilters : reportFilters });
    },

    canSort : function (inSortInfo) {
      var cell = this.getCell(Math.abs(inSortInfo) - 1);

      return cell.field === 'checkedFile' ||
             cell.field === 'checkerId'   ||
             cell.field === 'severity'    ||
             cell.field === 'reviewStatus' ||
             cell.field === 'detectionStatus';
    },

    scrollToLastSelected : function () {
      this.scrollToRow(this._lastSelectedRow);
    },

    onRowClick : function (evt) {
      var item = this.getItem(evt.rowIndex);

      this._lastSelectedRow = evt.rowIndex;

      switch (evt.cell.field) {
        case 'checkedFile':
          topic.publish('openFile', item, item.bugHash, this);
          break;

        case 'checkerId':
          topic.publish('showDocumentation', item.checkerId);
          break;
      }
    },

    onRowMouseOver : function (evt) {
      if (!evt.cell)
        return;

      var item = this.getItem(evt.rowIndex);
      switch (evt.cell.field) {
        case 'reviewComment':
          if (item.reviewData.author) {
            var content = util.reviewStatusTooltipContent(item.reviewData);
            Tooltip.show(content.outerHTML, evt.target, ['below']);
          }
          break;
      }
    },

    onCellMouseOut : function (evt) {
      switch (evt.cell.field) {
        case 'reviewComment':
          Tooltip.hide(evt.target);
          break;
      }
    }
  });

  var ListOfBugsTreeGrid = declare(LazyTreeGrid, {
    constructor : function () {
      var that = this;

      this.structure = [
        { name : 'File', field : 'checkedFile', cellClasses : 'link compact', width : '100%' },
        { name : 'Message', field : 'checkerMsg', width : '100%' },
        { name : 'Checker name', field : 'checkerId', cellClasses : 'link', width : '50%' },
        { name : 'Severity', field : 'severity', cellClasses : 'severity', width : '15%', formatter : severityFormatter },
        { name : 'Review status', field : 'reviewStatus', cellClasses : 'review-status', width : '15%', formatter : reviewStatusFormatter },
        { name : 'Review comment', cellClasses : 'review-comment-message compact', field : 'reviewComment', width : '50%' },
        { name : 'Detection status', field : 'detectionStatus', cellClasses : 'detection-status', width : '15%', formatter : detectionStatusFormatter }
      ];

      this.store = new ObjectStore({ objectStore : new BugStore() });

      this.treeModel = ForestStoreModel({
        store: this.store,
        getChildren : function (parentItem, onComplete, onError) {
          var prevQuery = that.get('query');
          var query = dojo.clone(prevQuery);

          query.reportFilter.reportHash = [ parentItem.bugHash ];
          query.reportFilter.isUnique = false;
          query.formatter = function (reportDataList) {
            return reportDataList.map(function (reportData) {
              reportData.id = reportData.reportId;

              //--- Review status ---//

              var review = reportData.reviewData;
              reportData.reviewStatus = review.status;
              reportData.reviewComment = review.author && review.comment
                ? review.comment
                : review.author ? '-' : '';

              return reportData;
            });
          }

          this.store.fetch({
            query : query,
            onComplete: onComplete,
            onError: onError
          });

          that.set('query', prevQuery);
        },
        mayHaveChildren : function (item) {
          return item.hasChildren;
        }
      });

      this._lastSelectedRow = 0;
    },

    refreshGrid : function (reportFilter) {
      this.setQuery({
        reportFilter : reportFilter,
        formatter : function (reportDataList) {
          return reportDataList.map(function (reportData) {
            reportData.id = reportData.bugHash;

            if (reportFilter.isUnique)
              reportData.checkedFile = reportData.bugHash;
            else if (reportData.line)
              reportData.checkedFile = reportData.checkedFile +
                ' @ Line ' + reportData.line;

            reportData.hasChildren = reportFilter.isUnique;

            console.log(reportData.hasChildren);
            //--- Review status ---//

            var review = reportData.reviewData;
            reportData.reviewStatus = review.status;
            reportData.reviewComment = review.author && review.comment
              ? review.comment
              : review.author ? '-' : '';

            return reportData;
          });
        }
      });

    },

    scrollToLastSelected : function () {
      this.scrollToRow(this._lastSelectedRow);
    },
  });

  return declare(TabContainer, {
    constructor : function (args) {
      dojo.safeMixin(this, args);

      var that = this;

      this._grid = new ListOfBugsTreeGrid({
        region : 'center',
        runData : this.runData,
        baseline : this.baseline,
        newcheck : this.newcheck,
        difftype : this.difftype
      });

      this._bugOverview = new BorderContainer({
        title : 'Bug Overview',
        iconClass : 'customIcon list-opened',
        onShow : function () {
          if (!this.initalized) {
            this.initalized = true;
            return;
          }

          that._grid.scrollToLastSelected();
          hashHelper.setStateValues({
            'report' : null,
            'reportHash' : null,
            'subtab' : null
          });
        }
      });

      //--- Bug filters ---//

      this._bugFilterView = new BugFilterView({
        class    : 'bug-filters',
        region   : 'left',
        style    : 'width: 300px; padding: 0px;',
        splitter : true,
        diffView : this.diffView,
        parent   : this,
        runData  : this.runData,
        baseline : this.baseline,
        newcheck : this.newcheck,
        difftype : this.difftype,
        allReportView : this.allReportView
      });

      //--- Run history ---//

      this._runHistory = new RunHistory({
        title : 'Run history',
        iconClass : 'customIcon run',
        runData : this.runData,
        bugOverView : this._bugOverview,
        bugFilterView : this._bugFilterView,
        parent : this,
        onShow : function () {
          var state = hashHelper.getState();

          hashHelper.setStateValues({
            'tab' : state.tab,
            'subtab' : 'runHistory'
          });
          that.subtab = 'runHistory';
        }
      });

      this._bugViewerHashToTab = {};

      this._subscribeTopics();
    },

    postCreate : function () {
      var that = this;

      this._bugOverview.addChild(this._bugFilterView);

      this._bugOverview.addChild(this._grid);
      this.addChild(this._bugOverview);

      this.addChild(this._runHistory);

      initByUrl(this._grid, this.tab);
    },

    _subscribeTopics : function () {
      var that = this;

      this._runHistoryTopic = topic.subscribe('subtab/runHistory', function () {
        that.selectChild(that._runHistory);
      });

      this._bugOverviewTopic = topic.subscribe('subtab/bugOverview', function () {
        that.selectChild(that._bugOverview);
      });

      this._hashChangeTopic = topic.subscribe('/dojo/hashchange',
      function (url) {
        var state = hashHelper.getState();
        if (state.tab === that.tab && state.subtab !== that.subtab)
          initByUrl(that._grid, that.tab);
      });

      this._openFileTopic = topic.subscribe('openFile',
      function (reportData, reportHash, sender) {
        if (sender && sender !== that._grid)
          return;

        if (reportData !== null && !(reportData instanceof CC_OBJECTS.ReportData))
          reportData = CC_SERVICE.getReport(reportData);

        var getAndUseReportHash = reportHash && (!reportData ||
          reportData.reportId === null || reportData.bugHash !== reportHash);

        var reportFilters = that._bugFilterView.getReportFilters();
        var runResultParam = createRunResultFilterParameter(reportFilters);

        if (getAndUseReportHash) {
          // Get all reports by report hash
          var reportFilter = new CC_OBJECTS.ReportFilter();
          reportFilter.reportHash = [reportHash];
          reportFilter.isUnique = false;

          reports = CC_SERVICE.getRunResults(runResultParam.runIds,
            CC_OBJECTS.MAX_QUERY_SIZE,  0, null, reportFilter, null);
          reportData = reports[0];
        } else {
          runResultParam.runIds = [reportData.runId];
          runResultParam.cmpData = null;
        }

        if (that.reportData &&
            that.reportData.reportId === reportData.reportId) {
          var tab = that._bugViewerHashToTab[reportData.bugHash];
          if (tab)
            that.selectChild(tab);
          return;
        }

        that.reportData = reportData;

        var filename = reportData.checkedFile.substr(
          reportData.checkedFile.lastIndexOf('/') + 1);

        var bugViewer = new BugViewer({
          title : filename,
          iconClass : 'customIcon bug',
          closable : true,
          reportData : reportData,
          runResultParam : runResultParam,
          listOfBugsGrid : that._grid,
          onShow : function () {
            hashHelper.setStateValues({
              'reportHash' : reportData.bugHash,
              'report' : reportData.reportId,
              'subtab' : reportData.bugHash
            });
            that.subtab = reportData.bugHash;
          },
          onClose : function () {
            delete that._bugViewerHashToTab[reportData.bugHash];
            that.reportData = null;

            topic.publish('subtab/bugOverview');

            return true;
          }
        });
        that.addChild(bugViewer);
        that.selectChild(bugViewer);

        // Remove the old child with the same report hash if it's exists
        if (that._bugViewerHashToTab[reportData.bugHash])
          that.removeChild(that._bugViewerHashToTab[reportData.bugHash]);

        that._bugViewerHashToTab[reportData.bugHash] = bugViewer;

        topic.publish('showComments', reportData.reportId, bugViewer._editor);
      });

      this._filterChangeTopic = topic.subscribe('filterchange',
      function (state) {
        if (state.parent !== that._bugFilterView)
          return;

        var reportFilters = that._bugFilterView.getReportFilters();
        that._grid.refreshGrid(reportFilters);
      });
    },

    onShow : function () {
      var state  = this._bugFilterView.getUrlState();
      state.tab  = this.tab;

      if (!this.initalized) {
        this.initalized = true;

        this._bugFilterView.initLoad();
        this._grid.refreshGrid(this._bugFilterView.getReportFilters());

        var urlState = hashHelper.getState();
        if (urlState.tab === state.tab)
          return;
      }

      hashHelper.setStateValues(state, true);

      //--- Call show method of the selected children ---//

      this.getChildren().forEach(function (child) {
        if (child.selected)
          child.onShow();
      });
    },

    destroy : function () {
      this.inherited(arguments);
      this._openFileTopic.remove();
      this._filterChangeTopic.remove();
      this._hashChangeTopic.remove();
      this._bugOverviewTopic.remove();
      this._runHistoryTopic.remove();

      // Clear URL if list of bugs view is closed.
      hashHelper.clear();
    }
  });
});
