import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
    id: string | number;
    name?: string;
    group?: number;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | number | Node;
    target: string | number | Node;
    value?: number;
}

export interface GraphData {
    nodes: Node[];
    edges: Link[];
}

export function renderGraph(container: HTMLElement, data: GraphData) {
    // Clear previous graph
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(container).append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation<Node>(data.nodes)
        .force('link', d3.forceLink<Node, Link>(data.edges).id(d => d.id as string).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(20));

    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 15) // Position of the arrow relative to the node center (adjust based on node radius)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    // Render links
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.edges)
        .join('line')
        .attr('class', 'link')
        .attr('stroke-width', d => Math.sqrt(d.value || 1))
        .attr('marker-end', 'url(#arrowhead)');

    // Render nodes
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(data.nodes)
        .join('g')
        .attr('class', 'node')
        .call(d3.drag<any, Node>()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('circle')
        .attr('r', 5)
        .attr('fill', d => color(d.group));

    node.append('text')
        .attr('x', 8)
        .attr('y', '0.31em')
        .text(d => d.name || d.id as string);

    node.append('title')
        .text(d => d.id as string);

    simulation.on('tick', () => {
        link
            .attr('x1', d => (d.source as Node).x!)
            .attr('y1', d => (d.source as Node).y!)
            .attr('x2', d => (d.target as Node).x!)
            .attr('y2', d => (d.target as Node).y!);

        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function color(group?: number) {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return scale(group ? group.toString() : '0');
    }
}
