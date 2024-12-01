function copyToClipboard(command) {
    navigator.clipboard.writeText(command).then(function() {
        alert('Command copied to clipboard: ' + command);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}