var app = app || {};

(function($, app, M) {
    "use strict";
    app.router = new M.Router();

    $(function() {
        app.todo = new M.views.Todo({el: $('#todoapp'), collection: new M.Collection});

        Backbone.history.start();

        app.todo.collection.fetch();
    });

})($, app, module);


