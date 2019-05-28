'use strict';

var lastHeight;
var lastWidth;
var returnchildHeights = function (children) {
    var maxHeight = 0;
    if (children.length) {
        maxHeight = 0;
        children.each(function (key, child) {
            if ($(child).is(':visible')) {
                var childtop = ($(child).offset().top + $(child).outerHeight());
                if (childtop > maxHeight) {
                    maxHeight = childtop;
                }
            }        
        });
    }

    return maxHeight;
};

exports.aceEditEvent = function (event, args, callback) {
    var editbar = $('#editbar');

    var elem = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]');
    var newHeight = elem.outerHeight() + (editbar.length ? editbar.outerHeight() : 0);
    var newWidth = elem.outerWidth();

    var maxChild = returnchildHeights($('iframe[name=ace_outer]').contents().find('body').children());
    var maxChildBody = returnchildHeights($('body').children());
    if (maxChildBody > maxChild) {
        maxChild = maxChildBody
    }

    if (maxChild > newHeight) {
        newHeight = maxChild;
    }
    if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
        sendResizeMessage(newWidth, newHeight);
    }
    
};

exports.goToRevisionEvent = function (hook_name, context, cb) {
    
    var editbar = $('#timeslider-top')
    var elem = $('#padeditor');

    var newHeight = elem.outerHeight() + (editbar.length ? editbar.outerHeight() : 0);
    var newWidth = elem.outerWidth();

    if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
        sendResizeMessage(newWidth, newHeight);
    }
};

var sendResizeMessage = function (width, height) {
    lastHeight = height;
    lastWidth = width;
    

    window.parent.postMessage({
        name: 'ep_resize',
        data: {
            width:  width,
            height: height
        }
    }, '*');
} 
