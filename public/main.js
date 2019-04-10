(function (d3) {
    
    const MARGIN = 10;

    let width = window.screen.availWidth;
    let height = window.screen.availHeight;
    
    let linkPath = d3.linkRadial().angle( (d) => d.x ).radius((d) => d.y);
    let nodePosition = (d) => `translate(${d3.pointRadial(d.x, d.y)})`;

    let layout = d3.cluster().size([2 * Math.PI, Math.min(width, height)/2 - 2*MARGIN]);

    function requestPage(url) {

        //TODO: Check that it is in fact a URL
        let currentURL = new URL(document.URL);
        let serverRequestURL = new URL('/tree', currentURL.origin);
        serverRequestURL.searchParams.append('url', url);
        d3.json(serverRequestURL).then(displayPageStructure);
        console.log('The end requestPage');
    }

    function updateNodes(root) {
        let nodes = d3.select('#nodes').selectAll('circle.node')
            .data(root.descendants());

        nodes.exit().remove();

        nodes.enter()
            .append('circle')
            .classed('node', true)
            .attr('r', 8)
            .attr('transform', nodePosition)
        ;

        nodes.transition()
            .attr('transform', nodePosition);

    }

    function updateLinks(root) {
        let links = d3.select('#links').selectAll('path.link')
            .data(root.links());
        links.exit().remove();
        links.enter().append('path').classed('link', true).attr('d', linkPath);
        links.transition().attr('d', linkPath);
    }

    function displayPageStructure(structure) {
        console.log('displayPageStructure');
        let root = d3.hierarchy(structure);
        layout(root);
        updateNodes(root);
        updateLinks(root);
    }

    window.onload = function () {
        document.getElementById('searchbox').onkeydown = function (evt) {
            if(evt.keyCode == 13 && searchbox.value != "") {
                //TODO: Same action from a button
                requestPage(searchbox.value);
            }
        };

        let canvas = d3.select('#canvas')
            .attr('width',  width)
            .attr('height', height);

        let centerX = width/2;
        let centerY = height/2;
        canvas.select('#nodes').attr('transform', `translate(${centerX},${centerY})`);
        canvas.select('#links').attr('transform', `translate(${centerX},${centerY})`);

    }

})(d3) 


