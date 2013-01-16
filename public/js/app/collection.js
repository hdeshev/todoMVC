(function(M) {
    "use strict";

    var parent = Backbone.Collection.prototype;
    M.Collection = Backbone.Collection.extend({
        url: '/todos',
        model: M.models.Item,

        getCompleted: function () {
            return this.filter(function(model) {
                return model.has('completed');
            });
        },

        getUncompleted: function () {
            return this.filter(function(model) {
                return !model.has('completed');
            });
        },

        parse: function (models) {
            var a = [];
            _.each(models, function(model) {
                a[parseInt(model.position)] = model;
            });

            return a;
        },

        changePos: function (dragModel, dropModel) {
            var fromIndex = _.indexOf(this.models, dragModel), toIndex;
            this.models.splice(fromIndex, 1);

            if (dropModel) {
                toIndex = _.indexOf(this.models, dropModel);
                this.models.splice(toIndex + 1, 0, dragModel);
            }

            this.updatePos();
        },

        updatePos: function () {
            this.each(function(model, index) {
                model.save({position: index});
            });
        },

        comparator: function (model) {
            return  model.getPos();
        },

        clearCompleted: function () {
            var completed = this.getCompleted();
            _.each(completed, function(model) {
                model.destroy();
            });
        },

        add: function (opt) {
            parent.add.call(this, opt);
            if (this.models.length == 1) this.trigger('fillup');
        },

        remove: function (opt) {
            parent.remove.call(this, opt);
            this.updatePos();
            if (!this.length) this.trigger('empty');
        }
    });
})(module);

