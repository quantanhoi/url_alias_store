document.getElementById('alias-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var url = document.getElementById('url').value;
    var alias = document.getElementById('alias').value;
    if (!url || !alias) {
        return;
    }
    //creating new row and data for table "alias-form"
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
    chrome.storage.sync.get({aliases: []}, function(result) {
    // get the current state of the stored aliases
    //aliases[] is default value, when there is no data stored
    //under key "aliases" in result,
    //then chrome.storage.sync.get() will return {aliases: []} 
    //and result.aliases will be an empty array
        result.aliases.push(aliasObj);
        chrome.storage.sync.set({aliases: result.aliases}, function() {
            console.log('New alias stored.');
        });
    });
}

// Function to load stored aliases on startup
function loadAliases() {
    chrome.storage.sync.get({aliases: []}, function(result) {
        result.aliases.forEach(function(aliasObj) {
            var row = document.createElement('tr');
            var aliasCell = document.createElement('td');
            var urlCell = document.createElement('td');

            // create a new cell for the checkbox
            var removeCell = document.createElement('td');
            var removeCheckbox = document.createElement('input');
            removeCheckbox.type = "checkbox";
            removeCell.appendChild(removeCheckbox);

            aliasCell.innerText = aliasObj.alias;
            urlCell.innerText = aliasObj.url;
            row.appendChild(aliasCell);
            row.appendChild(urlCell);
            row.appendChild(removeCell); // append the remove cell to the row
            document.getElementById('alias-table').appendChild(row);
        });
    });
}

// Load aliases when the document is ready
document.addEventListener('DOMContentLoaded', loadAliases);


chrome.omnibox.onInputEntered.addListener((text) => {
    // text is the alias entered by the user
    // Get the array of aliases from storage
    chrome.storage.sync.get({aliases: []}, function(result) {
        if (chrome.runtime.lastError) {
            // Handle error
            console.log(chrome.runtime.lastError);
        } else {
            // Find the alias object that matches the entered text
            const aliasObj = result.aliases.find(aliasObj => aliasObj.alias === text);

            if (aliasObj) {
                // If a matching alias object is found, open its URL in a new tab
                chrome.tabs.create({ url: aliasObj.url });
            } else {
                // If no matching alias object is found, you could fall back to a Google search, or show an error, etc.
                const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
                chrome.tabs.create({ url: newURL });
            }
        }
    });
});

document.getElementById('remove-btn').addEventListener('click', function() {
    var table = document.getElementById('alias-table');
    var checkboxes = table.getElementsByTagName('input');

    // Iterate over the checkboxes (in reverse order because we're modifying the list)
    for (var i = checkboxes.length - 1; i >= 0; i--) {
        var checkbox = checkboxes[i];
        if (checkbox.checked) {
            /*parentNode return the parent element
            *checkbox.parentNode is the td element of table cell containing checkbox
            *td element is nested within a 'tr' element
            *therefore checkbox.parentNode.parentNode will return 'tr'
            */
            
            var row = checkbox.parentNode.parentNode;

            //getting the alias from the alias column of this row (therefore row.children[0])
            var aliasToRemove = row.children[0].innerText;

            // Remove the row from the table
            row.parentNode.removeChild(row);

            // Remove the alias from Chrome storage
            chrome.storage.sync.get({aliases: []}, function(result) {
                var index = result.aliases.findIndex(aliasObj => aliasObj.alias === aliasToRemove);
                if (index > -1) {
                    result.aliases.splice(index, 1);
                    chrome.storage.sync.set({aliases: result.aliases}, function() {
                        console.log('Alias removed.');
                    });
                }
            });
        }
    }
});


