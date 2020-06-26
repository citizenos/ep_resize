'use strict';

var lastHeight;
var lastWidth;
var returnchildHeights = function (children, offsetTop) {
    offsetTop = offsetTop + 10 || 10; //Some extra padding for possible shadows etc.

    var maxHeight = 0;

    if (children.length) {
        maxHeight = 0;
        children.each(function (key, child) {
            if ($(child).is(':visible') && $(child).attr('id') !== 'editorcontainerbox' && $(child).attr('id') !== 'editbar' && !$(child).is('iframe') && $(child)[0].offsetHeight > 0) { // Avoid infinit increasing
                var childtop = ($(child).offset().top + $(child)[0].offsetHeight) + offsetTop;
                if (childtop > maxHeight) {
                    maxHeight = childtop;
                }
            }
        });
    }

    return maxHeight;
};

exports.aceEditEvent = function (event, context, callback) {
    var ace_outer_top = $('iframe[name=ace_outer]').offset().top;
    var ace_inner_top = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]').offset().top;
    var getFinalLine = context.rep.lines.atIndex(context.rep.lines.length()-1);
    var finalLine =  $(getFinalLine.lineNode);

    var elem = $('iframe[name=ace_outer]').contents().find('iframe[name=ace_inner]');
    var newHeight = finalLine.offset().top + finalLine.outerHeight() + ace_outer_top + ace_inner_top;
    var newWidth = elem.outerWidth();

    var maxChild = returnchildHeights($('iframe[name=ace_outer]').contents().find('body').children(), ace_outer_top);
    var maxChildBody = returnchildHeights($('body').children());

    if (maxChildBody > maxChild) {
        maxChild = maxChildBody
    }

    if (maxChild > newHeight) {
        newHeight = maxChild;
    }
    if (!lastHeight || !lastWidth || lastHeight !== newHeight || lastWidth !== newWidth) {
        if (newHeight - lastHeight !== 10)
            sendResizeMessage(newWidth, newHeight);
    }

};

exports.goToRevisionEvent = function (hook_name, context, cb) {

    var editbar = $('#editbar')
    var elem = $('#outerdocbody');
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
