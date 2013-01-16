(function(M) {
    "use strict";

    var parent = Backbone.View.prototype;
    M.views.Item = Backbone.View.extend({
        tagName: 'li',

        initialize: function (opt) {
            this.todo = opt.todo;
            this.template = $('#item-template').html();
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:completed change:title', this.render);
        },

        events: {
            'click button.destroy': 'modelDestroy',
            'dblclick'            : 'edit',
            'blur .edit'          : 'closeEdit',
            'click input.toggle'  : 'toggle'
        },

        dragging: function () {
            var that = this;
            this.$('.drop').draggable({
                axis: 'y',
                revert: 'invalid',
                helper: 'clone',
                cursor: 'move',
                containment: this.todo.$list,
                //grid: [0, this.$el.height()],
                start: function () {
                    that.todo.draggingView = that;
                },
                stop: function () {
                    that.todo.draggingView = '';
                }
            });
        },

        dropping: function () {
            var that = this;
            this.$el.droppable({
                hoverClass: 'drop-to-me',
                drop: function () {
                    var drItem = that.todo.draggingView;
                    if (drItem && !drItem.$el.is(that.$el)) {
                        drItem.$el.insertAfter(that.$el);
                        that.todo.collection.changePos(drItem.model, that.model);
                    }
                }
            });
        },

        edit: function () {
            this.$el.addClass('editing');
            this.input.focus();
        },

        toggle: function () {
            if (!this.model.isComplete()) {
                this.model.complete();
            } else {
                this.model.uncomplete();
            }
        },

        closeEdit: function () {
            this.$el.removeClass('editing');
            var val = this.input.val();
            if (val) {
                this.model.save({title: val}, {wait: true});
            } else {
                this.modelDestroy();
            }
        },

        modelDestroy : function () {
            this.model.destroy();
        },

        render: function () {
            this.$el.html(M.tempSystem.render(this.template, this.model.toJSON()));
            if (this.model.isComplete()) {
                this.$el.addClass('completed');
            } else {
                this.$el.removeClass('completed');
            }

            this.input = this.$('.edit');

            this.$('.id-helper').text(this.model.cid);

            this.dragging();
            this.dropping();
            return this;
        }
    });
})(module);

