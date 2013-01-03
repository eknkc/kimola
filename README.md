# kimola - Node.JS Kimola API Client

This client library enables you to develop powerful search applications or quickly implement scalable search functionality to your existing desktop, web or mobile applications.

This powerful library supports all the features of [Kimola Cloud Search](http://444.kimola.com/).

Refer to [API Documentation](http://444.kimola.com/services/search/developer-center/using-api) for detailed information.

## Install

    npm install kimola


## Setup
You can instantiate a new kimola api client by passing a configuration object to the kimola module:


    var kimola = require("kimola");

    // You can omit any property but your api key. Default values are listed on the sample below:
    var client = kimola({
        "key": "YOUR_API_KEY",
        "culture": "tr",
        "partSpace": "ps",
        "serviceBase": "http://444.kimola.com/"
    });


## Indexing

### client.index(document, fn)
index function queues a document for indexing

    var kimola = require("kimola");
    var client = kimola({ "key": "YOUR_API_KEY" });

    kimola.index({
        Url: "http://www.yourdomain/article/wozniaks-travel-backpack",
        PartSpace: "technology",
        Content: "Sometimes TSA takes a long time unpacking it, Wozniak says. A couple of times they asked me to take out everything electronic and I asked for seven bins, all of which I filled (only 2 half-size), plus my MacBook Pro, plus the bag. All of that through the X-ray machine. Then repack it.,
        DocumentDate: "2012-06-15T13:00:00",
        Culture: "en-US",
        Fields: {
            "Foo": "Bar"
        }
    }, function(err) {
        if (err)
            console.log("ERROR: " + err.message);
        else
            console.log("Indexing successful!");
    });

### client.batchIndex(documents, fn)
You can supply an array of `documents` to index more than one document at once.

### client.unIndex(url, fn)
Removes the document with specified url from index.

### client.truncate(fn)
Removes all documents from the index.

## Part Spaces

### client.getPartSpaces(fn)
Returns a string array of all part spaces.

### client.deletePartSpace(fn)
Removes the specified part space.

## Searching

### client.search(options, fn)
Search function requires a `term` string and returns a list of entries according to this search term:

    var kimola = require("kimola");
    var client = kimola({ "key": "YOUR_API_KEY" });

    // You can omit any property but your search term. Default values are listed on the sample below:
    kimola.search({
        // Search term can be a single or more than one word.
        term: "wozniak",
        // Provide a part space to limit the search. If none specified, all documents are searched.
        partspace: "",
        // Starting page
        pageIndex : 0,
         // # of items per page
        pageLength: 25,
        // Search order: 0 for Relational Descending, 1 for Relational Ascending, 2 for Chronological Descending, 3 for Chronological Ascending
        criteria: 0
    }, function(err, response) {
        if (err)
            console.log("ERROR: " + err.message);
        else
            console.log(response);
    });

## Phrases
The API orders search suggestions by their frequency in the database. This also allows to show the terms that have high probability of being searched on the upper ranks.

### client.getPhrases(url, fn)
Returns an array of phrases.

## Suggestions
The API orders search suggestions by their frequency in the database. This also allows to show the terms that have high probability of being searched on the upper ranks.

### client.getSuggestions(term, fn)
Returns an array of suggestions.

# License
(**The MIT License**)

Copyright (c) 2013 Ekin Koc <ekin@eknkc.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
