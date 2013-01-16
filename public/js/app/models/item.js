(function(M) {
    "use strict";

    var parent = Backbone.Model.prototype;
    M.models.Item = Backbone.Model.extend({
        complete: function () {
            this.save({completed: true}, {wait: true});
        },

        uncomplete: function () {
            this.unset('completed');
            this.save({wait: true});
        },

        getPos: function () {
            return parseInt(this.get('position'));
        },

        isComplete: function () {
            return this.has('completed');
        }
    });
})(module);