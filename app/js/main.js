(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function($) {

  'use strict';

  var TABS =                          '[data-target=tabs]';
  var TABS_CONTROL =                  '[data-tabs-control]';
  var TABS_ITEM_PREFIX =              'ts-';
  var TABS_ITEM =                     TABS_ITEM_PREFIX + 'tabs__item';
  var TABS_ITEM_SEL =                 '.' + TABS_ITEM;
  var TABS_ITEM_ACTIVE =              TABS_ITEM + '--active';
  var TABS_ITEM_ACTIVE_SEL =          '.' + TABS_ITEM_ACTIVE;
  var TABS_ITEM_START =               0;

  var PROGRESSBAR =                   '[data-target=progressbar]';
  var PROGRESSBAR_TOTAL =             'ts-progressbar__total';
  var PROGRESSBAR_TOTAL_SEL =         '.' + PROGRESSBAR_TOTAL;
  var PROGRESSBAR_VALUE =             'ts-progressbar__value';
  var PROGRESSBAR_VALUE_SEL =         '.' + PROGRESSBAR_VALUE;

  var PROGRESSBAR_STATUS =            'ts-progressbar__status';
  var PROGRESSBAR_STATUS_SEL =        '.' + PROGRESSBAR_STATUS;

  var PROGRESSBAR_START =             1;
  var PROGRESSBAR_STEP =              1;




  var console = window.console || {
    log: function() {}
  };

  function TabsTest() {
    var _this = this;

    this.$tabs =                    $(TABS);
    this.$tabsControl =             this.$tabs.find(TABS_CONTROL);
    this.$progressbar =             $(PROGRESSBAR);
    this.$progressbarTotal =        $(PROGRESSBAR_TOTAL_SEL);
    this.$progressbarValue =        $(PROGRESSBAR_VALUE);
    this.$progressbarStatus =       $(PROGRESSBAR_STATUS_SEL);
    this.progressbarStart =         PROGRESSBAR_START;
    this.progressbarStep =          PROGRESSBAR_STEP;

    this.currentItem =              TABS_ITEM_START;


    /*
    this.$tabsControlData = this.$tabsControl.data('tabs-control');
    this.$tabsControlTarget = this.$tabsControl.data('tabs-toggle');*/

    this.init();
  }

  TabsTest.prototype = {
    constructor: TabsTest,

    init: function() {
      this.initTabs();
      this.addListener();
      this.sendForm();
    },

    addListener: function() {
      this.$tabsControl.on('click', $.proxy(function(event) {this.clickTabsControl(event)}, this));
    },

    initTabs: function() {
      var _this = this;
      _this.$tabs.each(function() {
        _this.tabsItemChange($(this));
        _this.initProgressBar($(this));
      });
    },

    initProgressBar: function($tab) {
      var $progressbars = $tab.find(PROGRESSBAR),
          progressbarsTotal = $progressbars.length;
      $progressbars.find(PROGRESSBAR_TOTAL_SEL).html(progressbarsTotal);
      
      this.tabsProgressBar($progressbars, this.progressbarStart, progressbarsTotal);
    },

    clickTabsControl: function(el) {
      var self = el.target;
      this.tabsStep(self);
      el.preventDefault();
    },

    tabsItemChange: function($tab) {
      $tab.find(TABS_ITEM_SEL)
             .removeClass(TABS_ITEM_ACTIVE)
             .eq(this.currentItem)
             .addClass(TABS_ITEM_ACTIVE);
    },

    tabsStep: function(el) {
      var $currentControl = $(el),
          controlData = $currentControl.data('tabs-control'),
          $tab = $currentControl.closest(this.$tabs),
          $tabItems = $tab.find(TABS_ITEM_SEL),
          tabItemsTotal = $tabItems.length,
          activeItem = $tab.find(TABS_ITEM_ACTIVE_SEL).index(),
          progressbarsTotal = $tab.find(PROGRESSBAR).length,
          $progressbars = $tab.find(TABS_ITEM_SEL + ' ' + PROGRESSBAR),
          progressbarActive;
     
      if (controlData === 'prev') {
        activeItem = activeItem - 1;
        if (activeItem < 0) {
          return;
        }
        this.currentItem = activeItem;
        this.tabsItemChange($tab);
        progressbarActive = this.getValueProgressbar($tabItems);
        this.tabsProgressBar($progressbars, progressbarActive, progressbarsTotal);
      } else if (controlData === 'next') {
        activeItem = activeItem + 1;
        if (activeItem >= tabItemsTotal) {
          return;
        }
        this.currentItem = activeItem;
        this.tabsItemChange($tab);
        progressbarActive = this.getValueProgressbar($tabItems);
        this.tabsProgressBar($progressbars, progressbarActive, progressbarsTotal);
      } else if (controlData === 'index') {
        activeItem = parseInt(index, 10);
        if (activeItem < 0 || activeItem >= tabItemsTotal) {
          return;
        }
        progressbarActive = $tabItems.eq(activeItem).find(PROGRESSBAR).index();
        this.currentItem = activeItem;
        this.tabsItemChange($tab);
        this.tabsProgressBar($progressbars, progressbarActive, progressbarsTotal);
      }
    },

    getValueProgressbar: function($items) {
      var index = 0,
          $progressbar;
      $items.each(function() {
        $progressbar = $(this).find(PROGRESSBAR);
        if ($progressbar.length) {
          index = index + 1;
        }
        if ($(this).hasClass(TABS_ITEM_ACTIVE)) {
          return false;
        }
      });
      return index;
    },

    tabsProgressBar: function($el, value, total) {
      if (value < 0) {
        return;
      }
      var percentage = 100 / total * value;
      $el.find(PROGRESSBAR_VALUE).html(value);
      $el.find(PROGRESSBAR_STATUS_SEL).css({width: percentage + '%'});
    },
    sendForm: function() {

      $('.js-form').validator({focus: false}).on('submit', function (e) {
        var $form = $(this);
        if (e.isDefaultPrevented()) {
          // handle the invalid form...
        } else {
          e.preventDefault();
          $form.find("[type=submit]").prop("disabled", true).button('loading'); //prevent submit behaviour and display preloading

          var url =     $form.attr('action');
          var data =    new FormData($form[0]);
          var form =    $form.find("[type=submit]").val();

          data.append("form", form);

          $.ajax(url, {
            type: 'post',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false,
            cache: false,
            success: function(data) {
              // Success message

              if (data.error) {
                // Fail message
                $form.find('.success').html("<div class='alert alert-danger'>");
                $form.find('.success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                  .append("</button>");
                $form.find('.success > .alert-danger').append("<strong>" + data.error);
                $form.find('.success > .alert-danger').append('</div>');
              } else if (data.message) {
                $form.find('.success').html("<div class='alert alert-success'>");
                $form.find('.success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                  .append("</button>");
                $form.find('.success > .alert-success')
                  .append("<strong>Cообщение успешно отправлено.</strong>");
                $form.find('.success > .alert-success')
                  .append('</div>');
                // remove prevent submit behaviour and disable preloading
                //document.location.href="./success.html";
                //clear all fields
                $form.trigger("reset");
              }

              $form.find("[type=submit]").prop("disabled", false).button('reset');  
            },
            error: function() {
              // Fail message
              $form.find('.success').html("<div class='alert alert-danger'>");
              $form.find('.success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
              $form.find('.success > .alert-danger').append("<strong>Письмо не отправлено. Пожалуйста, проверьте ваше интернет соединения и попробуйте еще раз!");
              $form.find('.success > .alert-danger').append('</div>');

              // remove prevent submit behaviour and disable preloading
              $form.find("[type=submit]").prop("disabled", false).button('reset'); 

              //clear all fields
              //$form.trigger("reset");
            },
          });
        }
      }); 
    }
  };

  $(function() {
    return new TabsTest();
  });

});
