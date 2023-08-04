// Parameters to be set by the user
const sideLength = 100;

// Internal parameters
const numCells = 5;
const debugGrid = false;

let x_logo = sideLength / numCells

// Function to draw the data to be used by the grid
function scaleMatrix(side, center, startValue, stepValue) {
    let res = new Array(side * side).fill(0);
    for (let i = 0; i < res.length; ++i) {
        const x = i % side;
        const y = Math.floor(i / side);
        const d = Math.abs(center[0] - x) + Math.abs(center[1] - y);
        const val = startValue - d * stepValue;
        res[i] = {
            pos: [x, y],
            index: i,
            val
        };
    }
    return res;
}

// Function to draw the grid
function drawGrid() {
    let invertedColors = false;
    let sideWidth = sideLength;
    const sScale = d3
        .scaleBand()
        .range([0, sideWidth])
        .domain(d3.range(5))
        // .paddingInner(0.05)
        .round(true);

    const cScale = d3.scaleOrdinal().domain([0, 1]).range(["#273580", "#e83947"]);


    function me(selection) {

        if (invertedColors) {
            cScale.domain([1, 0]);
        } else {
            cScale.domain([0, 1]);
        }

        let maxRange = d3.max(selection.datum(), (d) => d.pos[0]);
        sScale.domain(d3.range(maxRange + 1));


        const t = selection.transition().duration(750);

        const gs = selection
            .selectAll("g")
            .data(selection.datum())
            .join(
                (enter) =>
                    enter
                        .append("g")
                        .attr(
                            "transform",
                            (d) => `translate(${sScale(d.pos[0]) + sScale.bandwidth() / 2},${
                                sScale(d.pos[1]) + sScale.bandwidth() / 2
                            })
        scale(${(d.val - 10) / 100})rotate(0)`
                        )
                        .attr("opacity", (d) => d.val / 100)
                        .attr("fill", (d) => cScale((d.pos[0] + d.pos[1]) % 2)),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t)
                            .attr(
                                "transform",
                                (d) => `translate(${
                                    sScale(d.pos[0]) + sScale.bandwidth() / 2
                                },${sScale(d.pos[1]) + sScale.bandwidth() / 2})
        scale(${(d.val - 10) / 100})rotate(0)`
                            )
                            .attr("opacity", (d) => d.val / 100)
                            .attr("fill", (d) => cScale((d.pos[0] + d.pos[1]) % 2))
                    )
            );

        gs.selectAll("rect")
            .data((d) => [d])
            .join("rect")
            .attr("width", sScale.bandwidth())
            .attr("height", sScale.bandwidth())
            .attr("x", -sScale.bandwidth() / 2)
            .attr("y", -sScale.bandwidth() / 2);
    }

    me.invertedColors = function (value) {
        if (!arguments.length) return invertedColors;
        invertedColors = value;
        return me;
    };

    me.whiteVersion = function (value) {
        if (!arguments.length) return whiteVersion;
        whiteVersion = value;
        return me;
    };

    me.cellWidth = function (value) {
        return sScale.bandwidth();
    };

    return me;
}





// Function to draw the logo name
function logoName(selection, data) {
    const logoGroup = selection.append("g") // Append to the selection
        .attr("class", "logo-text");
    if (debugGrid){
        logoGroup.append('g')
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", sideLength * 6)
            .attr("y2", 0)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", 0)
            .attr("y1", sideLength)
            .attr("x2", sideLength * 6)
            .attr("y2", sideLength)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength + x_logo)
            .attr("y1", 0)
            .attr("x2", sideLength + x_logo)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength)
            .attr("y1", 0)
            .attr("x2", sideLength)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")

        logoGroup.append('g')
            .attr("class", "debug-line")
            .append("line")
            .attr("x1", sideLength * 5.21)
            .attr("y1", 0)
            .attr("x2", sideLength * 5.21)
            .attr("y2", sideLength * 6)
            .attr("stroke", "#273580")


    }

    logoGroup.append('g')
        .attr("class", "logo-main-name")
        .attr("transform", `translate(${-(x_logo)/2.5},0)`) // to fix left padding
        .append("text")
        .attr("x", sideLength + x_logo)
        .attr("y", (x_logo) * 3 + (x_logo/4))
        .attr("font-size", `${(x_logo) * 3 * 1.5}px`)
        .attr("font-family", "Rajdhani")
        .attr("font-weight", 300)
        .attr("fill", "#E83947")
        .append("tspan")
        .text("SO")
        .append("tspan")
        .text("BIG")
        .attr("font-weight", 500)
        .attr("fill", "#273580")
        .append("tspan")
        .text("DATA")
        .attr("font-weight", 700)
        .attr("fill", "#E83947");

    console.log("data into logoName: ", data)

    logoGroup.append('g')
        .data(data)
        .append("text")
        .attr("class", "logo-subtitle")
        .attr("x", sideLength + x_logo)
        .attr("y", (sideLength))
        .attr("transform", `translate(-${(x_logo)*0.1},${-(x_logo)/4})`) // to fix left padding
        .attr("font-size", `${(x_logo)*1.27}px`)
        .attr("font-family", "Rajdhani")
        .attr("font-weight", 500)
        .attr("fill", "#273580")
        // .attr("alignment-baseline", "baseline")
        // .text(subText.toUpperCase())
        .text(d => d.label);

    logoGroup.append('g')
        .data(data)
        .append("text")
        .attr("class", "logo-suffix")
        .attr("x", sideLength * 5.21)
        .attr("y", x_logo *1.2)
        .attr("transform", `translate(-${(x_logo)*0.1},${-(x_logo)/4})`) // to fix left padding
        .attr("font-size", `${(x_logo)*1.27}px`)
        .attr("font-family", "Rajdhani")
        .attr("font-weight", 800)
        .attr("fill", "#273580")
        // .attr("alignment-baseline", "baseline")
        // .text(subText.toUpperCase())
        .text(d => d.suffix);
}

function visualize(data) {
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", sideLength * 5.6) //5.21 is the width of the logo
        .attr("height", sideLength);

    console.log("visualize data", data)
    // Crea la matrice scalata
    const matrix = scaleMatrix(5, [data[0].posX,data[0].posY], 100, 10);
    console.log("matrix", matrix)


    // Disegna la griglia utilizzando la matrice scalata
    const dg = drawGrid().invertedColors((data[0].posX + data[0].posY) % 2);
    const selection = svg.selectAll(".grid").data([matrix]);
    const symbol = selection.enter().append("g").attr("class", "grid").call(dg);
    const dt = logoName(symbol,data);
    const texts = svg.call(dt);
    return texts
}

document.getElementById("node-select").addEventListener("change", function () {
    const selectedNode = this.value; // Get the selected node value

    // Remove the old SVG
    d3.select("#chart").selectAll("svg").remove();

    d3.json("data/sbd-nodes.json").then(function (data) {

        console.log("data", data)
        const fData = data.filter(d => d.CODE === selectedNode);
        console.log("data filtered", fData)
        visualize(fData);
    });
});



// Start the script by visualizing the "SBD" value
d3.json("data/sbd-nodes.json").then(function (data) {
    const initialNode = "SBD"; // Change this to the desired initial value
    const initialData = data.filter(d => d.CODE === selectedNode);

    visualize(initialData);
});

function downloadButtons() {
    <!-- Crea due bottoni per il download e inseriscili nel DOM Sotto il tag con id download -->
    const downloadButtonSVG = document.createElement("button");
    downloadButtonSVG.innerText = "Download the logo as SVG";
    downloadButtonSVG.addEventListener("click", () => downloadImage("svg"));
    document.querySelector("#downlaod").appendChild(downloadButtonSVG);

    const downloadButtonPNG = document.createElement("button");
    downloadButtonPNG.innerText = "Download the logo as PNG";
    downloadButtonPNG.addEventListener("click", () => downloadImage("png"));
    document.querySelector("#downlaod2").appendChild(downloadButtonPNG);

// Scarica il file SVG o PNG a seconda del parametro passato
    function downloadImage(format) {
        const svg = document.querySelector("svg");
        const svgData = new XMLSerializer().serializeToString(svg);

        if (format === "svg") {
            const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
            const svgUrl = URL.createObjectURL(svgBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = "so_big_data.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else if (format === "png") {
            const canvas = document.createElement("canvas");
            canvg(canvas, svgData); // Convert SVG to canvas using canvg
            const pngUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG data URL

            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "so_big_data.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
}
downloadButtons();


