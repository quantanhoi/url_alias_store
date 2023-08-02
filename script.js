document.getElementById('alias-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var url = document.getElementById('url').value;
    var alias = document.getElementById('alias').value;
    if (!url || !alias) {
        return;
    }
    var row = document.createElement('tr');
    var aliasCell = document.createElement('td');
    var urlCell = document.createElement('td');
    aliasCell.innerText = alias;
    urlCell.innerText = url;
    row.appendChild(aliasCell);
    row.appendChild(urlCell);
    document.getElementById('alias-table').appendChild(row);

    storeAlias({ alias, url });
});

function storeAlias(aliasObj) {
    // get the current state of the stored aliases
    chrome.storage.local.get({aliases: []}, function(result) {
        // add the new alias to the array
        result.aliases.push(aliasObj);

        // save the new state back to Chrome storage
        chrome.storage.local.set({aliases: result.aliases}, function() {
            console.log('New alias stored.');
        });
    });
}

// Function to load stored aliases on startup
function loadAliases() {
    chrome.storage.local.get({aliases: []}, function(result) {
        result.aliases.forEach(function(aliasObj) {
            var row = document.createElement('tr');
            var aliasCell = document.createElement('td');
            var urlCell = document.createElement('td');
            aliasCell.innerText = aliasObj.alias;
            urlCell.innerText = aliasObj.url;
            row.appendChild(aliasCell);
            row.appendChild(urlCell);
            document.getElementById('alias-table').appendChild(row);
        });
    });
}

// Load aliases when the document is ready
document.addEventListener('DOMContentLoaded', loadAliases);


chrome.omnibox.onInputEntered.addListener((text) => {
    // text is the alias entered by the user

    // Get the URL corresponding to the alias from storage
    chrome.storage.sync.get([text], function(result) {
        if (chrome.runtime.lastError) {
            // Handle error
            console.log(chrome.runtime.lastError);
        } else {
            // Check if there's a URL stored for the alias
            if (result[text]) {
                // If a URL is found, open it in a new tab
                chrome.tabs.create({ url: result[text] });
            } else {
                // If no URL is found, you could fall back to a Google search, or show an error, etc.
                const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
                chrome.tabs.create({ url: newURL });
            }
        }
    });
});

