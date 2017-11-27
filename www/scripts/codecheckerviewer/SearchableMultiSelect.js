// -------------------------------------------------------------------------
//                     The CodeChecker Infrastructure
//   This file is distributed under the University of Illinois Open Source
//   License. See LICENSE.TXT for details.
// -------------------------------------------------------------------------

define([
  'dojo/_base/declare',
  'dojo/_base/window',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/keys',
  'dojo/on',
  'dojo/query',
  'dijit/form/CheckBox',
  'dijit/form/TextBox',
  'dijit/layout/ContentPane',
  'dojo/NodeList-traverse'],
function (declare, win, dom, domClass, keys, on, query, CheckBox, TextBox,
  ContentPane) {

  return declare(ContentPane, {
    class : 'searchable-multi-select',
    updateItems : true,
    selectedItems : {},
    items : null,
    delay : 300,

    postCreate : function () {
      var that = this;

      var searchWrapper = dom.create('div', {
        class : 'select-menu-filter-wrapper'
      }, this.domNode);

      this._searchBox = new TextBox({
        placeholder : this.label,
        class : 'select-menu-filter',
        onClick : function () {
          that.open();
        },
        onKeyUp : function (evt) {
          clearTimeout(this.timer);

          if (evt.keyCode === keys.ENTER) {
            that._select({ label : this.get('value') });
            this.set('value', null); // Reset the search box value.
          }

          var value = this.get('value');
          this.timer = setTimeout(function () {
            that.updateItems = true;
            that._getItems(value);
          }, that.delay);
        }
      });
      dom.place(this._searchBox.domNode, searchWrapper);

      this._filterItems = dom.create('div', {
        class : 'filter-items hide'
      });
      dom.place(this._filterItems, searchWrapper);

      this._selectedItems = dom.create('div', {
        class : 'selected-items'
      });
      dom.place(this._selectedItems, this.domNode);
    },

    /**
     * Shows filter drop down list. If necessary get items from the server.
     */
    open : function (str) {
      domClass.remove(this._filterItems, 'hide');
      if (this.updateItems)
        this._getItems(str);

      this._addEventListeners();
    },

    /**
     * Close filter drop-down.
     */
    close : function () {
      domClass.add(this._filterItems, 'hide');
    },

    _getItems : function (str) {
      var that = this;

      dom.empty(that._filterItems);
      this.getItems(str).then(function (items) {
        that.set('items', items);
      });
    },

    _select : function (item) {
      var that = this;

      var selectedItem = dom.create('span', {
        class : 'selected-item'
      }, this._selectedItems);

      dom.create('span', {
        class : 'compact',
        innerHTML : item.label
      }, selectedItem);

      dom.create('i', {
        class : 'customIcon remove',
        onclick : function () {
          that._onRemoveItem(selectedItem, item);
        }
      }, selectedItem);

      this.selectedItems[item.label] = {
        item : item,
        dom : selectedItem
      };
    },

    _onRemoveItem : function (selectedItem, item) {
      dom.destroy(selectedItem);
      this.onRemoveItem(item);
    },

    onRemoveItem : function () {
      // This can be overriden by the user
    },

    _setItemsAttr : function (items) {
      if (!items) return;

      this.items = items;

      var that = this;
      this.items.forEach(function (item) {
        var checkBox = new CheckBox({});

        var filterItem = dom.create('div', {
          class : 'filter-item',
          onclick : function () {
            if (!(item.label in that.selectedItems)) {
              that._select(item);
              checkBox.set('checked', true);
            } else {
              that._onRemoveItem(that.selectedItems[item.label].dom, item);
              delete that.selectedItems[item.label];
              checkBox.set('checked', false);
            }

          }
        }, that._filterItems);

        dom.place(checkBox.domNode, filterItem);
        dom.create('span', { innerHTML: item.label }, filterItem);
      });
      that.updateItems = false;
    },

    _addEventListeners : function () {
      var that = this;

      var signal = on(win.doc, 'click', function (evt) {
        if (!query(evt.target).closest('.select-menu-filter-wrapper').length) {
          that.close();
          signal.remove();
        }
      });
    }
  });
});
