var request = require("request");
var moment = require("moment");
var util = require("util");

module.exports = function(options) {
    return new Client(options);
}

function Client(options) {
    options = options || {};
    this.key = options.key;
    this.culture = options.culture || "tr";
    this.serviceBase = options.serviceBase || "http://444.kimola.com/";
    this.partSpace = options.partSpace || "ps";
}

Client.prototype._serialize = function(document) {
    var doc = merge({}, {
        PartSpace: this.partSpace,
        Culture: this.culture
    }, document);

    doc.DocumentDate = dateSerialize(doc.DocumentDate);

    return doc;
}

Client.prototype.index = function(document, next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/document",
        method: "POST",
        json: this._serialize(document)
    }, responseHandler(function(err) {
        if (err) return next(err);
        next();
    }));
};

Client.prototype.batchIndex = function(documents, next) {
    if (!util.isArray(documents))
        return process.nextTick(function() { next(new Error("documents parameter is expected to be an array.")); });

    var self = this;

    documents = documents.map(function(doc) {
        return self._serialize(doc);
    });

    request({
        url: this.serviceBase + "api/" + this.key + "/documents",
        method: "POST",
        json: documents
    }, responseHandler(function(err) {
        if (err) return next(err);
        next();
    }));
};

Client.prototype.unIndex = function(url, next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/document",
        method: "DELETE",
        qs: { url: url }
    }, responseHandler(function(err) {
        if (err) return next(err);
        next();
    }));
};

Client.prototype.truncate = function(next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/documents",
        method: "DELETE"
    }, responseHandler(function(err) {
        if (err) return next(err);
        next();
    }));
};

Client.prototype.getPartSpaces = function(next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/partspaces",
        method: "GET"
    }, responseHandler(returnJson(next)));
};

Client.prototype.deletePartSpace = function(partspace, next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/partspaces/" + encodeURIComponent(partspace),
        method: "DELETE"
    }, responseHandler(function(err) {
        if (err) return next(err);
        next();
    }));
};

Client.prototype.search = function(options, next) {
    options = merge({
        partspace: "",
        pageIndex: 0,
        pageLength: 25,
        criteria: 0
    }, options);

    if (!options.term)
        return process.nextTick(function() { next(new Error("term can not be null or empty.")); });

    request({
        url: this.serviceBase + "api/" + this.key + "/search",
        method: "GET",
        qs: options
    }, responseHandler(function(err, data) {
        if (err)
            return next(err);

        try {
            data = JSON.parse(data);
        } catch (e) {
            return next(new Error("Unable to parse response: " + e.message));
        }

        if (data.Items && util.isArray(data.Items)) {
            data.Items.forEach(function(item) {
                if (item.DocumentDate) item.DocumentDate = dateParse(item.DocumentDate);
            });
        }

        next(null, data);
    }));
};

Client.prototype.getPhrases = function(url, next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/phrases",
        method: "GET",
        qs: { url: url }
    }, responseHandler(returnJson(next)));
};

Client.prototype.getSuggestions = function(term, next) {
    request({
        url: this.serviceBase + "api/" + this.key + "/suggestions/" + encodeURIComponent(term),
        method: "GET"
    }, responseHandler(returnJson(next)));
};

function returnJson(next) {
    return function(err, data) {
        if (err)
            return next(err);

        try {
            next(null, JSON.parse(data));
        } catch(e) {
            next(e);
        }
    }
}

function responseHandler(next) {
    return function(err, response, body) {
        if (err)
            return next(err);

        if (Math.floor(response.statusCode / 100) != 2)
            return next(new Error(body || "Unknown error."));

        next(null, body);
    };
};

function dateSerialize(date) {
    if (date) {
        var md = moment(date);
        if (md.isValid())
            return md.format("YYYY-MM-DDTHH:mm:ss")
    }

    return date;
};

function dateParse(date) {
    if (date) {
        var md = moment(date, "YYYY-MM-DDTHH:mm:ss");
        if (md.isValid())
            return md.toDate();
    }

    return date;
};

function merge(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source)
                obj[prop] = source[prop];
        }
    });

    return obj;
};
