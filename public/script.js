function visualize(data) {
    // Estrai l'array "feature_importance_all" dal JSON
    var featureImportance = data.feature_importance_all;
    var featureData = Object.entries(featureImportance).map(([feature, value]) => ({
        "feature": feature,
        "feature importance": value
    }));
    // Ordina l'array in base al valore della feature
    featureData.sort(function (a, b) {
        return d3.descending(a["feature importance"], b["feature importance"]);
    });
    // Calcola il valore massimo all'interno dell'array
    var maxValue = d3.max(featureData, function (d) {
        return d["feature importance"];
    });
    // Calcola il valore minimo all'interno dell'array
    var minValue = d3.min(featureData, function (d) {
        return d["feature importance"];
    });
    // Crea la scala lineare per la larghezza delle barre
    width_fi = 100
    height_fi = 15
    font_size = 12
    var widthScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, width_fi]);  // Imposta la larghezza massima desiderata in width_fi (px)

    // Crea un elemento SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", 1000)  // Imposta la larghezza desiderata
        .attr("height", featureData.length * (height_fi + 5));  // Altezza basata sulla lunghezza dell'array

    // Crea gli elementi "g" per ogni coppia di chiave-valore
    var bars = svg.selectAll("g")
        .data(featureData)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * (height_fi + 5) + ")";  // Spaziatura verticale tra le barre
        });

    bars.append("line")
        .style("stroke-width", 1)
        .style("stroke", "#ccc")
        .attr("x1", 0)
        .attr("y1", height_fi / 2)
        .attr("x2", width_fi)
        .attr("y2", height_fi / 2)

    // Aggiungi le barre orizzontali
    bars.append("rect")
        .attr("height", height_fi)  // Altezza desiderata
        .attr("fill", function (d) {
            return d['feature importance'] < 0 ? "red" : "#AFEEEE";  // Colore rosso se negativo, altrimenti blu
        })
        .transition() // Applica la transizione
        .duration(800) // Durata della transizione in millisecondi
        .attr("width", function (d) {
            return widthScale(Math.abs(d['feature importance']));  // Utilizza il valore assoluto per la larghezza
        }).delay(function (d, i) {
        return (i * 100)
    })


    // Aggiungi i testi delle feature sull'asse delle y

    bars.append("text")
        .attr("x", width_fi + 5)  // Posizione x del testo
        .attr("y", height_fi / 2 + font_size * 0.3)  // Posizione y del testo
        .text(function (d) {
            const t = d['feature'].toLowerCase()
            return t.replaceAll("_", " ");  // Testo da visualizzare
        })
        .attr("font-size", font_size)  // Dimensione del testo
        .attr("font-family", "Helvetica") // Tipo di font
}

// Carica il file JSON
d3.json("data/istance_5.json").then(function(data) {
    visualize(data);
});
