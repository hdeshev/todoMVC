(function(M) {
    "use strict";

    var parent = Backbone.View.prototype;
    M.views.Todo = Backbone.View.extend({
        initialize: function (opt) {
            this.collection = opt.collection;
            this.listenTo(this.collection, 'add', this.newItem);
            this.listenTo(this.collection, 'change:completed', this.setInfo);
            this.listenTo(this.collection, 'remove', this.setInfo);

            this.templates = {
                footer: $('#stats-template').html()
            };

            this.$newInput = this.$('#new-todo');
            this.$list = this.$('#todo-list');
            this.$toggleAll = this.$('#toggle-all');
        },

        events: {
            'keyup'                  : 'keyup',
            'click #toggle-all'      : 'toggleAll',
            'click #clear-completed' : 'clearCompleted'
        },

        clearCompleted: function () {
            this.collection.clearCompleted();
        },

        filter: function (filter) {
            this.filterVal = filter;
            switch (filter) {
                case 'completed':
                    this.$list.removeClass('filter-active');
                    this.$list.addClass('filter-completed');
                    break;
                case 'active':
                    this.$list.addClass('filter-active');
                    this.$list.removeClass('filter-completed');
                    break;
                default:
                    this.$list.removeClass('filter-completed filter-active');
                    break;
            }
            this.setInfo();
        },

        toggleAll: function () {
            if (this.$toggleAll[0].checked) {
                this.collection.each(function(model) {
                    model.complete();
                });
            } else {
                this.collection.each(function(model) {
                    model.uncomplete();
                });
            }
        },

        hideInfo: function () {
            this.$toggleAll.hide();
            this.$('#main').hide();
            this.$('#footer').hide();
        },

        showInfo: function () {
            this.$toggleAll.show();
            this.$('#main').show();
            this.$('#footer').show();
        },

        setInfo: function () {
            var itemsNumb = this.collection.models.length;
            if (itemsNumb) {
                this.showInfo();
                this.renderFooter();
            } else {
                this.hideInfo();
            }
        },

        renderFooter: function () {
            var numb = this.collection.getUncompleted().length,
                all  = this.collection.models.length,
                completed = all - numb;

            this.$('#footer').html(M.tempSystem.render(this.templates.footer, {
                remaining : numb,
                items     : numb === 1 ? 'item' : 'items',
                completed : completed > 0 ? {completed: completed} : ''
            }));
            this.$('#filters li.' + (this.filterVal || 'all') + ' a').addClass('selected');

            return this;
        },

        keyup: function (event) {
            //enter
            if (event.keyCode == '13' && $.trim(this.$newInput.val())) {
                this.addToCollection();
                this.clearInput();
            }
        },

        clearInput: function () {
            this.$newInput.val('');
        },

        addToCollection: function () {
            var len = this.collection.length;
            this.collection.create({
                title: this.$newInput.val(),
                position: len
            }, {wait: true});
        },

        newItem: function (model) {
            var item = new M.views.Item({
                model: model,
                todo: this
            });
            this.$list.append(item.render().$el);
            this.setInfo();
        }
    });
})(module);

