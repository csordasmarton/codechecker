// -------------------------------------------------------------------------
//                     The CodeChecker Infrastructure
//   This file is distributed under the University of Illinois Open Source
//   License. See LICENSE.TXT for details.
// -------------------------------------------------------------------------

define([
  'dojo/_base/declare',
  'dojo/dom-construct',
  'dojo/data/ItemFileWriteStore',
  'dojo/topic',
  'dijit/Dialog',
  'dijit/form/Button',
  'dijit/form/RadioButton',
  'dijit/form/TextBox',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dojox/grid/DataGrid',
  'codechecker/hashHelper',
  'codechecker/util'],
function (declare, dom, ItemFileWriteStore, topic, Dialog, Button,
  RadioButton, TextBox, BorderContainer, ContentPane, DataGrid, hashHelper,
  util) {

  /**
   * This function helps to format a data grid cell with two radio buttons.
   * @param args {runData, listOfRunsGrid} - the value from the data store that
   * is passed as a parameter to this function.
   */
  function diffBtnFormatter(args) {
    var infoPane = args.listOfRunsGrid.infoPane;
    var container = new ContentPane({ style : 'padding: 0px' });

    var diffBtnBase = new RadioButton({
      name    : 'diff-base',
      checked : infoPane.baseline &&
                args.runData.runId === infoPane.baseline.runId,
      onClick : function () {
        infoPane.setBaseline(args.runData);
      }
    });

    var diffBtnNew = new RadioButton({
      name    : 'diff-new',
      checked : infoPane.newcheck &&
                args.runData.runId === infoPane.newcheck.runId,
      onClick : function () {
        infoPane.setNewcheck(args.runData);
      }
    });

    container.addChild(diffBtnBase);
    container.addChild(diffBtnNew);

    return container;
  }

  function versionTagFormatter(param) {
    var versionTag = util.createRunTag(param.runName, param.versionTag);
    return versionTag ? versionTag.outerHTML : '';
  }

  function numOfReportsFormatter(num) {
    return num === -1 ? '<div class="loading-overlay"></div>' : num;
  }

  function detectionStatusFormatter(statusCounts) {
    if (statusCounts === -1)
      return '<div class="loading-overlay"></div>';

    return Object.keys(statusCounts).map(function (statusCount) {
      var status = util.detectionStatusFromCodeToString(statusCount);

      return '<div class="detection-status-wrapper" title="' + status + '">'
        +'<i class="customIcon detection-status-' + status.toLowerCase()
        + '"></i><span class="num">(' + statusCounts[statusCount]
        + ')</span></div>';
    }).join(', ');
  }

  var ListOfRunsGrid = declare(DataGrid, {
    constructor : function () {
      this.store = new ItemFileWriteStore({
        data : { identifier : 'id', items : [] }
      });

      this.structure = [
        { name : 'Diff', field : 'diff', styles : 'text-align: center;', formatter : diffBtnFormatter},
        { name : 'Name', field : 'name', styles : 'text-align: left;', width : '100%' },
        { name : 'Number of reports', field : 'numberofbugs', styles : 'text-align: center;', width : '20%', formatter : numOfReportsFormatter },
        { name : 'Storage date', field : 'date', styles : 'text-align: center;', width : '30%' },
        { name : 'Analysis duration', field : 'duration', styles : 'text-align: center;' },
        { name : 'Check command', field : 'checkcmd', styles : 'text-align: center;' },
        { name : 'Detection status', field : 'detectionstatus', styles : 'text-align: center;', width : '30%', formatter : detectionStatusFormatter },
        { name : 'Version tag', field : 'versionTag', formatter : versionTagFormatter },
        { name : 'Delete', field : 'del', styles : 'text-align: center;', type : 'dojox.grid.cells.Bool', editable : true }
      ];

      this.focused = true;
      this.selectable = true;
      this.keepSelection = true;
      this.escapeHTMLInData = false;
      this.rowsPerPage = CC_OBJECTS.MAX_QUERY_SIZE;

      this._dialog = new Dialog({ title : 'Check command' });
    },

    postCreate : function () {
      this.inherited(arguments);
      this.layout.setColumnVisibility(7, this.get('showDelete'));
      this._populateRuns();
    },

    onRowClick : function (evt) {
      var item = this.getItem(evt.rowIndex);
      var runId = item.runid[0];

      switch (evt.cell.field) {
        case 'name':
          if (!evt.target.classList.contains('link'))
            return;

          hashHelper.setStateValues({
            'run' : item.runData[0].name,
            'tab' : item.runData[0].name
          });
          break;

        case 'del':
          if (evt.target.type !== 'checkbox') {
            item.del[0] = !item.del[0];
            this.update();
          }

          if (item.del[0])
            this.infoPane.addToDeleteList(runId);
          else
            this.infoPane.removeFromDeleteList(runId);

          break;

        case 'checkcmd':
          this._dialog.set('content', item.runData[0].runCmd);
          this._dialog.show();

          break;
      }
    },

    /**
     * Sorts run data list by date (newest comes first).
     */
    _sortRunData : function (runDataList) {
      runDataList.sort(function (lhs, rhs) {
        return new Date(rhs.runDate) - new Date(lhs.runDate);
      });
    },

    /**
     * This function refreshes grid with available run data based on text run
     * name filter.
     */
    refreshGrid : function (runFilter) {
      var that = this;

      this.store.fetch({
        onComplete : function (runs) {
          runs.forEach(function (run) {
            that.store.deleteItem(run);
          });
          that.store.save();
        }
      });

      this._populateRuns(runFilter);
    },

    /**
     * This function adds a new run data to the store.
     */
    _addRunData : function (runData) {
      var currItemDate = runData.runDate.split(/[\s\.]+/);
      this.store.newItem({
        id           : runData.runId,
        runid        : runData.runId,
        name         : '<span class="link">' + runData.name + '</span>',
        versionTag   : { runName : runData.name,
                         versionTag : runData.versionTag },
        date         : currItemDate[0] + ' ' + currItemDate[1],
        numberofbugs : -1,
        duration     : util.prettifyDuration(runData.duration),
        runData      : runData,
        checkcmd     : '<span class="link">Show</span>',
        del          : false,
        diff         : { 'runData' : runData, 'listOfRunsGrid' : this },
        detectionstatus : -1
      });
    },

    _populateRuns : function (runFilter) {
      var that = this;

      CC_SERVICE.getRunData(runFilter, function (runDataList) {
        that._updateRunCount(runDataList.length);
        that._sortRunData(runDataList);

        // In Firefox the onLoaded function called immediately before topics
        // have been registered.
        setTimeout(function () { that.onLoaded(runDataList); }, 0);

        topic.publish("hooks/RunsListed", runDataList.length);

        runDataList.forEach(function (item) {
          topic.publish("hooks/run/Observed", item);
          that._addRunData(item);
        });

        that.render();
        that._populateNumOfBug(runFilter);
        that._populateDetectionStatusCounts(runFilter);
      });
    },

    _populateNumOfBug : function (runFilter) {
      var reportFilter = new CC_OBJECTS.ReportFilter();
      reportFilter.runName = runFilter ? runFilter.names : null;

      var that = this;
      CC_SERVICE.getRunReportCounts(null, reportFilter, null, 0,
      function (res) {
        that.store.fetch({
          onComplete : function (runs) {
            runs.forEach(function (run) {
              var current = res.filter(function (r) {
                return r.runId === run.runid[0];
              });

              if (current.length)
                that.store.setValue(run, 'numberofbugs',
                  current[0].reportCount);
            });
          }
        });
      });
    },

    _populateDetectionStatusCounts : function (runFilter) {
      var that = this;
      CC_SERVICE.getRunDetectionStatusCounts(runFilter, function (res) {
        that.store.fetch({
          onComplete : function (runs) {
            runs.forEach(function (run) {
                that.store.setValue(run, 'detectionstatus', res[run.runid[0]]);
            });
          }
        });
      });
    },

    _updateRunCount : function (num) {
      this.parent._runCount.innerHTML = num;
      this.parent.updateTitle();
    },

    onLoaded : function (runDataList) {}
  });

  var RunsInfoPane = declare(ContentPane, {
    constructor : function () {
      var that = this;

      this.deleteRunIds = [];

      //--- Text box for searching runs. ---//

      this._runFilter = new TextBox({
        id          : 'runs-filter',
        placeHolder : 'Search for runs...',
        onKeyUp     : function (evt) {
          clearTimeout(this.timer);

          var runNameFilter = this.get('value');
          this.timer = setTimeout(function () {
            var runFilter = new CC_OBJECTS.RunFilter();
            runFilter.names = [runNameFilter];
            that.listOfRunsGrid.refreshGrid(runFilter);
          }, 500);
        }
      });

      //--- Diff Button ---//

      this._diffBtn = new Button({
        label    : 'Diff',
        class    : 'diff-btn',
        disabled : true,
        onClick  : function () {
          hashHelper.setStateValues({
            baseline : that.baseline.name,
            newcheck : that.newcheck.name,
            difftype : CC_OBJECTS.DiffType.NEW,
            tab : that.baseline.name + '_diff_' + that.newcheck.name
          });
        }
      });

      //--- Delete Button ---//

      this._deleteBtn = new Button({
        label    : 'Delete',
        class    : 'del-btn',
        disabled : true,
        onClick  : function () {
          that.listOfRunsGrid.store.fetch({
            onComplete : function (runs) {
              var runCount = runs.length;
              runs.forEach(function (run) {
                if (that.deleteRunIds.indexOf(run.runid[0]) !== -1) {
                  that.listOfRunsGrid.store.deleteItem(run);
                  --runCount;
                }
              });
              that.listOfRunsGrid._updateRunCount(runCount);
            }
          });

          CC_SERVICE.removeRunResults(that.deleteRunIds, function (success) {});

          that.deleteRunIds = [];
          that.update();
        }
      });
    },

    postCreate : function () {
      this.addChild(this._runFilter);

      if (this.get('showDelete'))
        this.addChild(this._deleteBtn);
      this.addChild(this._diffBtn);
    },

    addToDeleteList : function (runId) {
      if (this.deleteRunIds.indexOf(runId) === -1)
        this.deleteRunIds.push(runId);
      this.update();
    },

    removeFromDeleteList : function (runId) {
      var index = this.deleteRunIds.indexOf(runId);
      if (index !== -1)
        this.deleteRunIds.splice(index, 1);
      this.update();
    },

    setBaseline : function (runData) {
      if (runData)
        this.baseline = runData;

      this.update();
    },

    setNewcheck : function (runData) {
      if (runData)
        this.newcheck = runData;

      this.update();
    },

    update : function () {
      //--- Update delete button settings. ---//

      this._deleteBtn.set('disabled', this.deleteRunIds.length === 0);

      //--- Update diff button settings. ---//

      var activateDiff = this.baseline && this.newcheck &&
                         this.baseline !== this.newcheck;

      this._diffBtn.set('disabled', !activateDiff);
      this._diffBtn.set('label', activateDiff
        ? 'Diff ' + this.baseline.name + ' to ' + this.newcheck.name
        : 'Diff');
    }
  });

  return declare(BorderContainer, {
    postCreate : function () {
      var that = this;

      this._runCountWrapper = dom.create('span', {
        class : 'run-count-wrapper',
        innerHTML : this.get('title')
      });

      this._runCount = dom.create('span', {
        class : 'run-count',
        innerHTML : '?'
      }, this._runCountWrapper);

      this.updateTitle();

      var showDelete = CC_AUTH_SERVICE.hasPermission(
        Permission.PRODUCT_STORE, util.createPermissionParams({
          productID : CURRENT_PRODUCT.id
        }));

      var runsInfoPane = new RunsInfoPane({
        region : 'top',
        showDelete : showDelete
      });

      var listOfRunsGrid = new ListOfRunsGrid({
        region : 'center',
        infoPane : runsInfoPane,
        parent : this,
        onLoaded : that.onLoaded,
        showDelete : showDelete
      });

      runsInfoPane.set('listOfRunsGrid', listOfRunsGrid);

      this.addChild(runsInfoPane);
      this.addChild(listOfRunsGrid);
    },

    updateTitle : function () {
      this.set('title', this._runCountWrapper.innerHTML);
    },

    onLoaded : function (runDataList) {}
  });
});
