String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var disableAll = document.getElementById('disableAll'),
    version = "Orbit " + chrome.runtime.getManifest().version;

function RUNTIME(action, args, callback) {
    (args = args || {}).action = action;
    args.needResponse = callback !== undefined;
    chrome.runtime.sendMessage(args, callback);
}

function updateStatus(blocklist) {
    var disabled = blocklist.hasOwnProperty('.*');
    disableAll.textContent = (disabled ? 'Enable ' : 'Disable ') + version;
    RUNTIME('setSurfingkeysIcon', {
        status: disabled
    });
}

RUNTIME('getSettings', {
    key: 'blocklist'
}, function(response) {
    updateStatus(response.settings.blocklist);
});

disableAll.addEventListener('click', function() {
    RUNTIME('toggleBlocklist', {
        domain: ".*"
    }, function(response) {
        updateStatus(response.blocklist);
    });
});

document.getElementById('reportIssue').addEventListener('click', function () {
    window.close();
});
