import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, FileCode, Workflow, ArrowRight, ArrowDown, Cog, BarChart, HardDrive } from 'lucide-react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

interface DataEngineeringFlowchartProps {
  currentStep: number;
}

interface FlowNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  step: number;
  description: string;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  step: number;
  animated?: boolean;
}

const DataEngineeringFlowchart: React.FC<DataEngineeringFlowchartProps> = ({ currentStep }) => {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Theme-based colors
  const colors = {
    background: theme === 'dark' ? '#1e293b' : '#f8fafc',
    nodeFill: theme === 'dark' ? '#1e293b' : '#ffffff',
    nodeStroke: theme === 'dark' ? '#4f46e5' : '#3b82f6',
    edgeStroke: theme === 'dark' ? '#4f46e5' : '#3b82f6',
    text: theme === 'dark' ? '#ffffff' : '#1e293b',
    tooltipBg: theme === 'dark' ? '#0f172a' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
    tooltipText: theme === 'dark' ? '#cbd5e1' : '#334155',
    tooltipTitle: theme === 'dark' ? '#60a5fa' : '#2563eb',
  };

  // Define nodes for each step
  useEffect(() => {
    const baseNodes: FlowNode[] = [
      // Data Ingestion (Step 0)
      { id: 'source-db', label: 'Source Database', icon: <Database />, x: 100, y: 150, step: 0, description: 'Relational databases storing operational data' },
      { id: 'api-source', label: 'API Source', icon: <Server />, x: 100, y: 250, step: 0, description: 'REST/GraphQL APIs providing real-time data' },
      { id: 'file-source', label: 'File Source', icon: <FileCode />, x: 100, y: 350, step: 0, description: 'CSV, JSON, and Parquet files from various systems' },
      { id: 'kafka', label: 'Kafka', icon: <ArrowRight />, x: 300, y: 250, step: 0, description: 'Distributed event streaming platform' },
      
      // Data Processing (Step 1)
      { id: 'spark', label: 'Spark', icon: <Cog />, x: 500, y: 200, step: 1, description: 'Distributed data processing engine' },
      { id: 'flink', label: 'Flink', icon: <Cog />, x: 500, y: 300, step: 1, description: 'Stream processing framework' },
      
      // Data Transformation (Step 2)
      { id: 'dbt', label: 'dbt', icon: <FileCode />, x: 700, y: 150, step: 2, description: 'Data transformation tool' },
      { id: 'python-transform', label: 'Python', icon: <FileCode />, x: 700, y: 250, step: 2, description: 'Custom transformation scripts' },
      { id: 'sql-transform', label: 'SQL', icon: <FileCode />, x: 700, y: 350, step: 2, description: 'SQL-based transformations' },
      
      // Data Orchestration (Step 3)
      { id: 'airflow', label: 'Airflow', icon: <Workflow />, x: 900, y: 200, step: 3, description: 'Workflow orchestration platform' },
      { id: 'prefect', label: 'Prefect', icon: <Workflow />, x: 900, y: 300, step: 3, description: 'Modern workflow orchestration' },
      { id: 'data-warehouse', label: 'Data Warehouse', icon: <HardDrive />, x: 1100, y: 200, step: 3, description: 'Centralized repository for structured data' },
      { id: 'data-lake', label: 'Data Lake', icon: <HardDrive />, x: 1100, y: 300, step: 3, description: 'Storage repository for raw data' },
      { id: 'bi-tools', label: 'BI Tools', icon: <BarChart />, x: 1300, y: 250, step: 3, description: 'Business intelligence and visualization tools' },
    ];

    const baseEdges: FlowEdge[] = [
      // Data Ingestion Edges (Step 0)
      { id: 'source-db-to-kafka', source: 'source-db', target: 'kafka', step: 0, animated: true },
      { id: 'api-source-to-kafka', source: 'api-source', target: 'kafka', step: 0, animated: true },
      { id: 'file-source-to-kafka', source: 'file-source', target: 'kafka', step: 0, animated: true },
      
      // Data Processing Edges (Step 1)
      { id: 'kafka-to-spark', source: 'kafka', target: 'spark', step: 1, animated: true },
      { id: 'kafka-to-flink', source: 'kafka', target: 'flink', step: 1, animated: true },
      
      // Data Transformation Edges (Step 2)
      { id: 'spark-to-dbt', source: 'spark', target: 'dbt', step: 2, animated: true },
      { id: 'spark-to-python', source: 'spark', target: 'python-transform', step: 2, animated: true },
      { id: 'flink-to-sql', source: 'flink', target: 'sql-transform', step: 2, animated: true },
      
      // Data Orchestration Edges (Step 3)
      { id: 'dbt-to-airflow', source: 'dbt', target: 'airflow', step: 3, animated: true },
      { id: 'python-to-airflow', source: 'python-transform', target: 'airflow', step: 3, animated: true },
      { id: 'sql-to-prefect', source: 'sql-transform', target: 'prefect', step: 3, animated: true },
      { id: 'airflow-to-warehouse', source: 'airflow', target: 'data-warehouse', step: 3, animated: true },
      { id: 'prefect-to-lake', source: 'prefect', target: 'data-lake', step: 3, animated: true },
      { id: 'warehouse-to-bi', source: 'data-warehouse', target: 'bi-tools', step: 3, animated: true },
      { id: 'lake-to-bi', source: 'data-lake', target: 'bi-tools', step: 3, animated: true },
    ];

    // Filter nodes and edges based on current step
    const visibleNodes = baseNodes.filter(node => {
      if (currentStep === 0) return node.step === 0;
      if (currentStep === 1) return node.step <= 1;
      if (currentStep === 2) return node.step <= 2;
      return true; // Show all for step 3
    });

    const visibleEdges = baseEdges.filter(edge => {
      if (currentStep === 0) return edge.step === 0;
      if (currentStep === 1) return edge.step <= 1;
      if (currentStep === 2) return edge.step <= 2;
      return true; // Show all for step 3
    });

    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [currentStep]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw the flowchart using D3
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Calculate scale factors to fit the diagram
    const xValues = nodes.map(n => n.x);
    const yValues = nodes.map(n => n.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xScale = d3.scaleLinear()
      .domain([xMin - 50, xMax + 50])
      .range([50, dimensions.width - 50]);
    
    const yScale = d3.scaleLinear()
      .domain([yMin - 50, yMax + 50])
      .range([50, dimensions.height - 50]);

    // Draw edges
    const edgeGroup = svg.append('g').attr('class', 'edges');
    
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        const sourceX = xScale(source.x);
        const sourceY = yScale(source.y);
        const targetX = xScale(target.x);
        const targetY = yScale(target.y);
        
        // Create path
        const path = edgeGroup
          .append('path')
          .attr('d', `M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`)
          .attr('stroke', colors.edgeStroke)
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('marker-end', 'url(#arrowhead)')
          .attr('class', `edge-${edge.id}`);
        
        // Add animation if needed
        if (edge.animated) {
          path.attr('stroke-dasharray', '5,5')
            .attr('class', `edge-${edge.id} animated-edge`);
        }
      }
    });

    // Define arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', colors.edgeStroke);

    // Draw nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    
    nodes.forEach(node => {
      const nodeX = xScale(node.x);
      const nodeY = yScale(node.y);
      
      const nodeContainer = nodeGroup
        .append('g')
        .attr('class', `node-${node.id}`)
        .attr('transform', `translate(${nodeX},${nodeY})`)
        .style('cursor', 'pointer')
        .on('mouseover', () => setHoveredNode(node.id))
        .on('mouseout', () => setHoveredNode(null));
      
      // Node circle
      nodeContainer.append('circle')
        .attr('r', 25)
        .attr('fill', colors.nodeFill)
        .attr('stroke', colors.nodeStroke)
        .attr('stroke-width', 2);
      
      // Node icon (placeholder)
      nodeContainer.append('foreignObject')
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', -15)
        .attr('y', -15)
        .append('xhtml:div')
        .attr('class', 'icon-container')
        .style('color', theme === 'dark' ? 'white' : '#1e293b')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('width', '100%')
        .style('height', '100%')
        .html(`<div id="icon-${node.id}"></div>`);
      
      // Node label
      nodeContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 40)
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .text(node.label);
    });

    // Add animation to edges
    svg.selectAll('.animated-edge')
      .style('stroke-dashoffset', 0)
      .style('animation', 'dash 15s linear infinite');

  }, [nodes, edges, dimensions, hoveredNode, theme, colors]);

  // Render React icons into the SVG foreignObject elements
  useEffect(() => {
    nodes.forEach(node => {
      const iconContainer = document.getElementById(`icon-${node.id}`);
      if (iconContainer && node.icon) {
        // Use ReactDOM to render the icon
        const iconElement = React.cloneElement(node.icon as React.ReactElement, {
          size: 16,
          color: theme === 'dark' ? 'white' : '#1e293b'
        });
        
        // Create a temporary div to hold the icon's HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(node.icon as React.ReactElement).props.children}</svg>`;
        
        // Clear and append
        iconContainer.innerHTML = '';
        iconContainer.appendChild(tempDiv.firstChild as Node);
      }
    });
  }, [nodes, theme]);

  return (
    <div className={`w-full h-full relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: 100;
            }
          }
          .animated-edge {
            stroke-dasharray: 5;
            animation: dash 15s linear infinite;
          }
        `}
      </style>
      <svg ref={svgRef} width="100%" height="100%" className="overflow-visible">
        {/* D3 will render here */}
      </svg>
      
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute p-3 rounded-lg shadow-lg border z-10 max-w-xs ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}
            style={{
              left: `${dimensions.width / 2}px`,
              bottom: '20px',
              transform: 'translateX(-50%)'
            }}
          >
            <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {nodes.find(n => n.id === hoveredNode)?.label}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {nodes.find(n => n.id === hoveredNode)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Step indicators */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {[0, 1, 2, 3].map(step => (
          <motion.div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step === currentStep 
                ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600' 
                : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
            }`}
            animate={{
              scale: step === currentStep ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: step === currentStep ? Infinity : 0,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
      
      {/* Step title animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
          className={`absolute top-4 left-4 p-2 rounded-md ${
            theme === 'dark' 
              ? 'bg-gray-900 bg-opacity-80' 
              : 'bg-white bg-opacity-90 shadow-md'
          }`}
        >
          <div className="flex items-center">
            {currentStep === 0 && <Database className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />}
            {currentStep === 1 && <Server className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />}
            {currentStep === 2 && <FileCode className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />}
            {currentStep === 3 && <Workflow className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />}
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {currentStep === 0 && "Data Ingestion"}
              {currentStep === 1 && "Data Processing"}
              {currentStep === 2 && "Data Transformation"}
              {currentStep === 3 && "Data Orchestration"}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Animated data particles */}
      {currentStep > 0 && (
        <>
          <motion.div
            className={`absolute w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}
            animate={{
              x: [100, 300, 500, 700, 900, 1100, 1300],
              y: [150, 250, 200, 150, 200, 200, 250],
              opacity: [0, 1, 1, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 1, 1, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className={`absolute w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'}`}
            animate={{
              x: [100, 300, 500, 700, 900, 1100, 1300],
              y: [250, 250, 300, 250, 300, 300, 250],
              opacity: [0, 1, 1, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 1, 1, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
          <motion.div
            className={`absolute w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-600'}`}
            animate={{
              x: [100, 300, 500, 700, 900, 1100, 1300],
              y: [350, 250, 200, 350, 200, 200, 250],
              opacity: [0, 1, 1, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 1, 1, 0.5]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 4
            }}
          />
        </>
      )}
    </div>
  );
};

export default DataEngineeringFlowchart;
