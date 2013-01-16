(function(module) {
    "use strict";

    var parent = Backbone.Router.prototype;
    module.Router = Backbone.Router.extend({
        routes: {
            '*filter': 'filter'
        },

        filter: function (filter) {
            app.todo.filter(filter);
        }
    });
})(module);

