// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function(thisp) {
    var fn = this;
    var args = [].slice.apply(arguments);
    args.shift();

    return function() {
        return fn.apply(thisp, args);
    };
};
