// -------------------------------------------------------------------------
//                     The CodeChecker Infrastructure
//   This file is distributed under the University of Illinois Open Source
//   License. See LICENSE.TXT for details.
// -------------------------------------------------------------------------

define([
  'dojo/_base/declare',
  'dojo/data/ItemFileWriteStore',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dijit/form/Button',
  'dijit/form/DropDownButton',
  'dijit/form/TextBox',
  'dijit/ConfirmDialog',
  'dijit/layout/ContentPane',
  'dijit/popup',
  'dijit/TooltipDialog',
  'dojox/grid/DataGrid',
  'dojox/widget/ColorPicker',
  'codechecker/util'],
function (declare, ItemFileWriteStore, dom, style, Button, DropDownButton,
  TextBox, ConfirmDialog, ContentPane, popup, TooltipDialog, DataGrid,
  ColorPicker, util) {
  function labelNameFormatter(label) {
    return '<span class="label" style="background-color:' + label.color
      + '; color:' + util.invertColor(label.color, true) + '">' + label.name
      + '</span>';
  }

  function editBtnFormatter(args) {
    return new Button({
        label: 'Edit',
        iconClass : 'customIcon edit',
        onClick : function () {
          console.log('edit', args.label);
        }
    });
  }

  function removeBtnFormatter(args) {
    return new Button({
      label: 'Remove',
      iconClass : 'customIcon delete',
      onClick : function () {
        args.listOfLabels.removeLabel(args.label.id);
      }
    });
  }

  var NewLabelPane = declare(ContentPane, {
    postCreate : function () {
      var that = this;

      this._labelName = new TextBox({
        placeholder:  'Name...'
      });
      this.addChild(this._labelName);

      this._colorPicker = new ColorPicker();

      var dialog = new TooltipDialog({
        content : this._colorPicker,
        onBlur : function () {
          popup.close(this);

          style.set(that._colorBox,
            'background-color', that._colorPicker.get('value'));
        }
      });

      this._colorBox = dom.create('span', {
        class : 'color-box',
        onclick : function () {
          popup.open({
            popup : dialog,
            around : this
          });
        }
      }, this.domNode);

      this._createButton = new Button({
        label : 'Create',
        onClick : function () {
          var labelData = new CC_OBJECTS.LabelData()
          labelData.color = that._colorPicker.get('value');
          labelData.name = that._labelName.get('value');

          if (labelData.name.trim().length !== 0) {
            CC_SERVICE.newLabel(labelData);
            that.listOfLabel.refreshGrid();
          }
        }
      });
      this.addChild(this._createButton);
    }
  });

  var ListOfLabels = declare(DataGrid, {
    constructor : function () {
      var that = this;

      this.store = new ItemFileWriteStore({
        data : { identifier : 'id', items : [] }
      });

      this.structure = [
        { name : 'Name', field : 'name', width : '100%', formatter : labelNameFormatter},
        { name : '&nbsp;', field : 'edit', width : '20%', formatter : editBtnFormatter},
        { name : '&nbsp;', field : 'remove', width : '20%', formatter : removeBtnFormatter}
      ];

      this.focused = true;
      this.selectable = true;
      this.keepSelection = true;
      this.escapeHTMLInData = false;
      this.autoHeight = true;
    },

    postCreate : function () {
      this.inherited(arguments);

      var that = this;

      this._removeDialog = new ConfirmDialog({
        title     : 'Remove label',
        content   : 'Are you sure you want to delete this?',
        onExecute : function () {
          that.store.fetch({
            onComplete : function (labels) {
              labels.forEach(function (label) {
                if (label.id.indexOf(that._labelId) !== -1) {
                  var res = CC_SERVICE.removeLabel(label.id);
                  if (res) {
                    that.store.deleteItem(label);
                    that.store.save();
                  }
                }
              });
            }
          });
        }
      });

      this._populateLabels();
    },

    addLabel : function (label) {
      this.store.newItem({
        id            : label.id,
        name          : label,
        edit          : { label : label, listOfLabels : this},
        remove        : { label : label, listOfLabels : this}
      });
    },

    removeLabel : function (id) {
      this._labelId = id;

      this._removeDialog.show();
    },

    _populateLabels : function () {
      var that = this;

      CC_SERVICE.getLabels(function (labels) {
        labels.forEach(function (label) {
          that.addLabel(label);
        });
      });
    },

    refreshGrid : function () {
      var that = this;

      this.store.fetch({
        onComplete : function (labels) {
          labels.forEach(function (label) {
            that.store.deleteItem(label);
          });
          that.store.save();
        }
      });

      this._populateLabels();
    }
  });

  return declare(ContentPane, {
    postCreate : function () {
      this._listOfLabels = new ListOfLabels();
      this._newLabelPane = new NewLabelPane({
        listOfLabel : this._listOfLabels
      });

      this.addChild(this._newLabelPane);
      this.addChild(this._listOfLabels);
    }
  })
});