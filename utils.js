var exports = {};

var fs = require('fs');

exports.readFile = function(filePath, lineHandler, callback) {

    var stream = fs.createReadStream(filePath, {flags: 'r', encoding: 'utf-8'});
    var buf = '';

    stream.on('data', function(d) {
        buf += d.toString(); // when data is read, stash it in a string buffer
        pump(); // then process the buffer
    });
    stream.on('end', function() {
        callback();
    })

    function pump() {
        var pos;

        while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
            if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
                buf = buf.slice(1); // discard it
                continue; // so that the next iteration will start with data
            }
            process(buf.slice(0,pos)); // hand off the line
            buf = buf.slice(pos+1); // and slice the processed data off the buffer
        }
    }

    function process(line) { // here's where we do something with a line

        if (line[line.length-1] == '\r') line=line.substr(0,line.length-1); // discard CR (0x0D)

        if (line.length > 0) { // ignore empty lines
            var obj = JSON.parse(line); // parse the JSON
            lineHandler(obj);
        }
    }
}

// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
exports.lineIntersects = function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
 
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
 
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return 1;
    }
    return 0; // No collision
}

module.exports = exports;