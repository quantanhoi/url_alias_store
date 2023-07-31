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
});
