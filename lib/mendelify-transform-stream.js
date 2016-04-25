/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var through = require('through2');
var variationMatches = require('./variation-matches');

function mendelifyTransformStream(variations) {
    return through.obj(function mendelify(row, enc, next) {
        var match = variationMatches(variations, row.file);
        if (match) {
            row.id = match.file;
            row.variation = match.dir;
        }

        Object.keys(row.deps).forEach(function (key) {
            var file = row.deps[key];
            if (file) {
                var depMatch = variationMatches(variations, file);
                if (depMatch) {
                    row.deps[key] = depMatch.file
                }
            }
        });

        this.push(row);
        next();
    });
}

module.exports = mendelifyTransformStream;
