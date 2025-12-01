import './style.css';
import { renderGraph, type GraphData } from './d3-graph';

const renderBtn = document.getElementById('render-btn') as HTMLButtonElement;
const jsonInput = document.getElementById('json-input') as HTMLTextAreaElement;
const graphContainer = document.getElementById('graph-container') as HTMLDivElement;

// Default sample data
const defaultData = {
  "nodes": [{ "id": "A" }, { "id": "B" }, { "id": "C" }],
  "edges": [{ "source": "A", "target": "B", "value": 4 }, { "source": "B", "target": "C", "value": 4 }, { "source": "C", "target": "A", "value": 4 }]
};

// Set default input
jsonInput.value = JSON.stringify(defaultData, null, 2);

renderBtn.addEventListener('click', () => {
  try {
    const rawData = JSON.parse(jsonInput.value);

    // Basic validation and transformation
    if (!rawData.nodes || !Array.isArray(rawData.nodes)) {
      throw new Error('JSON must have a "nodes" array');
    }
    if (!rawData.edges || !Array.isArray(rawData.edges)) {
      throw new Error('JSON must have an "edges" array');
    }

    // Map "edges" to "links" if needed, or just pass as is if d3-graph expects edges
    // Our d3-graph.ts expects 'edges' in GraphData interface but d3 forceLink expects 'links' usually?
    // Actually I defined GraphData to have 'edges', so I should pass it as is.
    // However, d3.forceLink(data.edges) works if we pass the array.

    // Ensure nodes have IDs. If not, use index or name.
    // User said: "Each edge object should have source and target fields that are either names of nodes or indices of nodes."
    // If nodes don't have explicit IDs, we might need to assign them or use indices.
    // Let's assume nodes have 'id' or 'name' that matches source/target.
    // If source/target are indices, D3 handles it if nodes are in order.

    // We need to make a deep copy because D3 mutates data
    const data: GraphData = {
      nodes: rawData.nodes.map((n: any) => ({ ...n })),
      edges: rawData.edges.map((e: any) => ({ ...e }))
    };

    // If nodes don't have 'id', use 'name' as 'id'.
    data.nodes.forEach((n: any) => {
      if (n.id === undefined && n.name !== undefined) {
        n.id = n.name;
      }
    });

    renderGraph(graphContainer, data);

  } catch (e: any) {
    alert('Error parsing JSON: ' + e.message);
    console.error(e);
  }
});

// Initial render
renderBtn.click();
