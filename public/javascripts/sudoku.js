let size = 9
let blocksize =3


function toScalar(house, cell) {
    return house*size + cell;
}

function row(scalar) {
    return (Math.floor((scalar % size) /blocksize)) + (blocksize * Math.floor((scalar /(size*blocksize))));
}

function col(scalar) {
    return (scalar %blocksize) + (blocksize *Math.floor((scalar/size))) - (size*Math.floor((scalar/(size*blocksize))));
}

function cell(houseIndex, cellIndex) {
    return row(toScalar(houseIndex,cellIndex)),col(toScalar(houseIndex,cellIndex))
}

class Grid {
    constructor(size){
        this.size = size;
        this.cellvalue = [];
        this.cellgiven = [];
        this.cellshowCandidates = [];
    }

    fill(json) {
        for (let scalar=0; scalar <this.size*this.size;scalar++) {
            this.cellvalue[scalar]=(json[scalar].cell.value);
            this.cellgiven[scalar]=(json[scalar].cell.given);
            this.cellshowCandidates[scalar]=(json[scalar].cell.showCandidates);
        }
    }
}

let grid = new Grid(9)

function updateGrid(grid) {
    for (let scalar=0; scalar <grid.size*grid.size;scalar++) {
        if (grid.cellvalue[scalar] != 0) {
            $("#scalar"+scalar).html(grid.cellvalue[scalar]);
        }
        if (grid.cellgiven[scalar] == true) {
            $("#scalar"+scalar).addClass("given");
        }

    }
}

function showCandidates(scalar) {
    let html =""
    for (let candidateIndex=1; candidateIndex <= size;candidateIndex++) {
        html = html + " <div class='candidatecell' onclick='setCell("+scalar+","+candidateIndex+")'> " +candidateIndex + "</div>"
        if (candidateIndex % blocksize == blocksize) html = html + "<div class='clear'></div>"
    }
    $("#scalar"+scalar).html(html)
}

function setCell(scalar, value) {
    console.log("Setting cell " + scalar + " to " + value);
    grid.cellvalue[scalar] = value;
    $("#scalar"+scalar).html(" "+grid.cellvalue[scalar]);
    $("#scalar"+scalar).off("click");

}

function registerClickListener() {
    for (let scalar=0; scalar <grid.size*grid.size;scalar++) {
        if (grid.cellvalue[scalar] == 0) {
            $("#scalar"+scalar).click(function() {showCandidates(scalar)});
        }
    }
}

function loadJson() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            grid = new Grid(result.grid.size);
            grid.fill(result.grid.cells);
            updateGrid(grid);
            registerClickListener();
        }
    });
}

$( document ).ready(function() {
    console.log( "Document is ready, filling grid" );
    loadJson();
});


