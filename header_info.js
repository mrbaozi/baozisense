document.getElementById("infotable").deleteRow(0);

fname = "sensehat_data.rrd";
load_info(fname);

function load_info(fname) {
    try {
        FetchBinaryURLAsync(fname, setData);
    } catch (err) {
        alert("Failed loading " + fname + "\n" + err);
    }
}

function setData(bf) {
    var rrd_data = undefined;
    try {
        var rrd_data = new RRDFile(bf);
    } catch (err) {
        alert("File " + fname + " is not a valid RRD archive!\n" + err);
    }
    if (rrd_data != undefined) {
        update_info(fname, rrd_data);
    }
}

function update_info(fname, rrd_data) {
    var oTable = document.getElementById("infotable");
    while (oTable.rows.length >= 3) {
        oTable.deleteRow(2);
    }
    document.getElementById("fname").firstChild.data = fname;
    document.getElementById("step").firstChild.data = rrd_data.getMinStep();
    document.getElementById("last_update").firstChild.data = rrd_data.getLastUpdate();

    var nrDSs = rrd_data.getNrDSs();
    var oRow = oTable.insertRow(-1);
    var oCell = oRow.insertCell(0);
    oCell.innerHTML = "<b>DS list</b>";
    oCell.colSpan = 5;
    for (var i = 0; i < nrDSs; i++) {
        var oDS = rrd_data.getDS(i);
        oRow = oTable.insertRow(-1);
        oCell = oRow.insertCell(0);
        oCell.innerHTML = "<b>" + oDS.getName() + "</b>";
        oCell = oRow.insertCell(1);
        oCell.innerHTML = oDS.getType();
        oCell.colSpan = 4;
    }

    var nrRRAs = rrd_data.getNrRRAs();
    oRow = oTable.insertRow(-1);
    oCell = oRow.insertCell(0);
    oCell.innerHTML = "<b>RRA list</b>";
    oCell.colSpan = 5;
    for (var i = 0; i < nrRRAs; i++) {
        var oRRA = rrd_data.getRRAInfo(i);
        oRow = oTable.insertRow(-1);
        oCell = oRow.insertCell(0);
        oCell.innerHTML = i;
        oCell.align = "center";
        oCell = oRow.insertCell(1);
        oCell.innerHTML = "<b>Rows</b>";
        oCell = oRow.insertCell(2);
        oCell.innerHTML = oRRA.getNrRows();
        oCell.align = "right";
        oCell = oRow.insertCell(3);
        oCell.innerHTML = "<b>Step</b>";
        oCell = oRow.insertCell(4);
        oCell.innerHTML = oRRA.getStep();
        oCell.align = "right";
    }
}
