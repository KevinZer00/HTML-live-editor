document.addEventListener('DOMContentLoaded', function () {
    var showingJson = false; // track whether showing JSON or not; default is false
    var showingXml = false; // track whether showing XML or not; default is false
    var jsonButton = document.getElementById('jsonButton');
    var xmlButton = document.getElementById('xmlButton');

    // initialize CodeMirror on the textarea
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: "htmlmixed"
    });

    // function to update the preview based on current conversion mode
    function updatePreview() {
        var content = editor.getValue();
        if (showingJson) {
            document.getElementById('preview').textContent = tableToJson(content);
        } else if (showingXml) {
            document.getElementById('preview').textContent = htmlToXml(content);
        } else {
            document.getElementById('preview').innerHTML = content;
        }
    }

    // listen for changes in the editor to update the preview
    editor.on("change", updatePreview);

    // function to convert HTML table to JSON 
    function tableToJson(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const table = doc.querySelector('table');

        if (!table) {
            return "No table found in the provided HTML.";
        }

        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
        const rows = table.querySelectorAll('tbody tr');
        const jsonData = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            let obj = {};
            cells.forEach((cell, index) => {
                obj[headers[index]] = cell.innerText.trim();
            });
            return obj;
        });

        return JSON.stringify(jsonData, null, 2);
    }


    // function to convert HTML to XML
    function htmlToXml(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const serializer = new XMLSerializer(); // serialize DOM object to an XML string
        let xmlString = serializer.serializeToString(doc.body); // serialize only body of HTML
        return xmlString;
    }



    // button event to toggle JSON view
    jsonButton.addEventListener('click', function () {
        showingJson = !showingJson; // toggle the showingJson state
        showingXml = false; // make sure XML isn't toggled on
        updatePreview(); // update the preview immediately
        jsonButton.textContent = showingJson ? "Show HTML" : "Show JSON"; // Toggle button text
        xmlButton.textContent = "Show XML"; // reset XML button text
    });

    // button event to toggle XML view
    xmlButton.addEventListener('click', function () {
        showingXml = !showingXml; // toggle showingXml state
        showingJson = false; // make sure JSON isn't toggled on
        updatePreview(); // update the preview immediately
        xmlButton.textContent = showingXml ? "Show HTML" : "Show XML";
        jsonButton.textContent = "Show JSON"; // reset JSON button text
    });

    // initial preview update
    updatePreview();
});
