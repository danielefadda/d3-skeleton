// describe the visualize function
/**
 * @param data The data to be visualized.
 * @returns {void}
 * @description visualizes the data
 * @example visualize(data)
 */
function visualize(data) {

    let sideLength= 150
    let numCells= 5

    // describe the scaleMatrix function
    /**
    *
    * @param side side length of the matrix
    * @param center center of the matrix
    * @param startValue starting value of the matrix
    * @param stepValue step value of the matrix
    * @returns {any[]}
    * @example scaleMatrix(5, [2, 2], 100, 10)
    * @description returns a matrix of size side x side, with the center value being startValue, and the values decreasing by stepValue as you move away from the center
    */
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

    // describe the randomMatric function
    /**
    *
    * @param side
    * @param center
    * @param startValue
    * @param stepValue
    * @returns {*}
    */
    function randomMatrix(side, center, startValue, stepValue) {
    let res = d3.range(side * side).map((d, i) => ({
        pos: [i % side, Math.floor(i / side)],
        index: i,
        val: Math.random() * startValue
    }));
    return res;
    }

    // describe the drawGrid function
    /**
    *  @param invertedColors  A boolean variable indicating whether the colors of the cells should be inverted.
    *  @param showGrid A boolean variable indicating whether the grid should be shown.
    *  @param sideWidth The width of the grid.
    *
    * @returns {me}
    * @description draws a grid of squares, with the center square being the largest, and the squares decreasing in size as you move away from the center
    * @example drawGrid().invertedColors(false).showGrid(false).sideWidth(150)
    */
    function drawGrid() {
    let invertedColors = false;
    let showGrid = false;
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

        // debugging grid
        if (showGrid) {
            selection
                .selectAll("line.vertical")
                .data(sScale.domain())
                .join("line")
                .attr("class", "vertical")
                .attr("x1", (d) => sScale(d))
                .attr("x2", (d) => sScale(d))
                .attr("y2", sideWidth)
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            selection
                .selectAll("line.horizontal")
                .data(sScale.domain())
                .join("line")
                .attr("class", "horizontal")
                .attr("y1", (d) => sScale(d))
                .attr("y2", (d) => sScale(d))
                .attr("x2", sideWidth)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }

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

    me.cellWidth = function (value) {
        return sScale.bandwidth();
    };

    return me;

    }

    // describe the redraw function
    /**
    *
    * @param x x coordinate
    * @param y y coordinate
    * @param f function to be called on the data to be drawn in the grid
    */
    function redraw(x, y, f) {
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", sideLength)
        .attr("height", sideLength);

    const dg = drawGrid().invertedColors((x + y) % 2);

    svg.datum(f(numCells, [x, y], 100, 10)).call(dg);

    const logoName = svg
        .append("text")
        .attr("x", sideLength + sideLength / numCells)
        .attr("y", (sideLength / numCells) * 3)
        .attr("font-size", `${(sideLength / numCells) * 3 * 1.5}px`)
        .attr("font-family", "Rajdhani")
        .attr("font-weight", 300)
        .attr("fill", "#E83947")
        .text("SO")
        .append("tspan")
        .text("BIG")
        .attr("font-weight", 500)
        .attr("fill", "#273580")
        .append("tspan")
        .text("DATA")
        .attr("font-weight", 700)
        .attr("fill", "#E83947");

    return svg
    }

    // Crea un elemento SVG
    redraw(2, 2, scaleMatrix)
}

// crea uno slider per la dimensione della sideWidth e inseriscilo nel DOM sotto il tag con id slider
const slider = document.createElement("input");
slider.type = "range";
slider.min = 1;
slider.max = 400;
slider.value = 200;


slider.addEventListener("input", function () {
    sideWidth = this.value;
    d3.select("svg");
    redraw(2, 2, scaleMatrix(sideWidth, [2, 2], 100, 10));
});
document.querySelector("#slider").appendChild(slider);



// Carica il file JSON
d3.json("data/istance_5.json").then(function(data) {
    visualize(data);
});
