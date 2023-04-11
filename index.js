/********************************************************
* Sets up event listeners for a button search which
* allows the user to traverse the database, insert button
* which allows user to insert data into the database,
* delete-button which as the name suggests ensures the
* user can delete information from a database, and lastly
* modify button to let the user change info in a database
*
* @author Jake Brockbank
* @version One
*******************************************************/
jQuery(function () {
    /******************************************************************************
    * Method: Click (For #buttonSearch): This code ensures that once the button
    * with id: #buttonSearch is clicked an AJAX request is made to the server to
    * retrieve a table in our database UNBDB.db that is based on the users input.
    * If there happens to be a succesful request, then the table will appeat in the
    * format of a table with a header in HTML.
    *
    * Input: Click
    *
    * Output: Corresponding data for the table inputted.
    *
    ******************************************************************************/
    jQuery("#buttonSearch").on("click", function () {
        var theTableName = jQuery("#inputtedSearch").val();
        jQuery.ajax({
            url: "/getTableDB",
            type: "POST",
            data: { theTableName: theTableName },
            success: function (data) {
                var headerVals = Object.keys(data[0]);
                var htmlHeaderVal = "";
                headerVals.forEach(function (i) {
                    htmlHeaderVal += "<th>" + i + "</th>";
                });
                jQuery("#resultantTable").html(
                    "<tr>" + htmlHeaderVal + "</tr>"
                );

                var htmlRowPlaceholder = "";
                data.forEach(function (rows) {
                    var htmlRow = "";
                    headerVals.forEach(function (cols) {
                        htmlRow += "<td>" + rows[cols] + "</td>";
                    });
                    htmlRowPlaceholder += "<tr>" + htmlRow + "</tr>";
                });
                jQuery("#resultantTable").append(htmlRowPlaceholder);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error:", errorThrown);
            },
        });
    });

    /******************************************************************************
    * Method: Click (For #insert-button): This code esnures that once the button 
    * with id: #insert-button is clicked an AJAX request is made to insert a new
    * row into the specified table made by the user which will then contain the
    * values inputted.
    *
    * Input: Click
    *
    * Output: Corresponding inserted row with data for the table inputted.
    *
    ******************************************************************************/
    jQuery("#insert-button").on("click", function () {
        var theTableName = jQuery("#table-name").val();
        var columns = jQuery("#column-names").val();
        var values = jQuery("#values").val();
        jQuery.ajax({
            url: "/insertIntoTable",
            type: "POST",
            data: {
                theTableName: theTableName,
                columns: columns,
                values: values,
            },
            success: function (data) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error:", errorThrown);
            },
        });
    });

    /******************************************************************************
    * Method: Click (For #delete-button): This code esnures that once the button 
    * with id: #delete-button is clicked an AJAX request is made to delete a row
    * from the specified table provided with specific conditions.
    * 
    * Input: Click
    *
    * Output: Deleted row.
    *
    ******************************************************************************/
    jQuery("#delete-button").on("click", function () {
        // Retrieve the values entered by the user
        var tableName = jQuery("#table-name-delete").val();
        var whereClause = jQuery("#where-clause").val();

        // Send an AJAX request to the server to delete the specified row
        jQuery.ajax({
            url: "/deleteFromTable",
            type: "POST",
            data: {
                tableName: tableName,
                whereClause: whereClause,
            },
            success: function (data) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error:", errorThrown);
            },
        });
    });

    /******************************************************************************
    * Method: Click (For #modify-button): This code esnures that once the button 
    * with id: #modify-button is clicked an AJAX request is made to run an SQL
    * statement to modify a specific with new data provided.
    * 
    * Input: Click
    *
    * Output: Modified row.
    *
    ******************************************************************************/
    jQuery("#modify-button").on("click", function () {
        var tableName = jQuery("#table-name-modify").val();
        var setClause = jQuery("#set-clause").val();
        var whereClause = jQuery("#where-clause-modify").val();

        jQuery.ajax({
            url: "/modifyTable",
            type: "POST",
            data: {
                tableName: tableName,
                setClause: setClause,
                whereClause: whereClause,
            },
            success: function (data) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error:", errorThrown);
            },
        });
    });
});