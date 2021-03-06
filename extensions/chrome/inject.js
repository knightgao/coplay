(function () {
    function loadScript(url, callback) {
        function doCallback() {
            if (typeof callback === 'function') {
                callback();
            }
        }

        var elem = document.createElement('script');
        elem.type = 'text/javascript';
        elem.charset = 'utf-8';
        if (elem.addEventListener) {
            elem.addEventListener('load', doCallback, false);
        } else { // IE
            elem.attachEvent('onreadystatechange', doCallback);
        }
        elem.src = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    function url(file) {
        return chrome.extension.getURL(file);
    }

    function data(key, value) {
        var dataset = document.body.dataset;
        if (arguments.length === 0) {
            return dataset;
        } else if (arguments.length === 2) {
            dataset[key] = value;
        }
        return dataset[key];
    }

    let coplayOptions = {
        server: '',
        key: '',
        autoActivate: false
    };

    let storage = chrome.storage.sync || chrome.storage.local;
    storage.get(coplayOptions, options => {
        coplayOptions = Object.assign(coplayOptions, options);
        data('coplayOptions', JSON.stringify(coplayOptions));
        if (data('coplay')) {
            loadScript(url('run.js'));
            return;
        } else {
            data('coplay', true);
            loadScript(url('peer.min.js'), function () {
                loadScript(url('coplay.js'));
            });
        }
    });
})();
