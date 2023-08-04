let aliases = [];

// Load aliases from storage into memory
chrome.storage.sync.get({aliases: []}, function(result) {
    aliases = result.aliases;
});

// Listen for alias updates
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === 'sync' && changes.aliases) {
        aliases = changes.aliases.newValue;
    }
});

chrome.omnibox.onInputEntered.addListener((text) => {
    // find the alias corresponding to the input text
    const aliasObj = aliases.find((aliasObj) => aliasObj.alias === text);

    if (aliasObj) {
        // If an alias is found, open the corresponding URL in a new tab
        chrome.tabs.create({ url: aliasObj.url });
        console.log("Loaded alias " + aliasObj.alias)
    } else {
        // If no alias is found, you could fall back to a Google search, or show an error, etc.
        const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
        chrome.tabs.create({ url: newURL });
    }
});
