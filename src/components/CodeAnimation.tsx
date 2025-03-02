import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { Maximize2, Minimize2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import useSound from 'use-sound';

// Define the code snippet type
interface CodeSnippet {
  id: string;
  name: string;
  language: 'javascript' | 'python' | 'sql';
  extension: string;
  code: string;
  originalCode: string;
}

const CodeAnimation: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [typingEffectComplete, setTypingEffectComplete] = useState<Record<string, boolean>>({});
  
  // Sound effects
  const [playClick] = useSound('/click.mp3', { volume: 0.5 });
  const [playType] = useSound('/typing.mp3', { volume: 0.2 });
  
  // Initial code snippets
  const initialSnippets: CodeSnippet[] = [
    {
      id: 'python-1',
      name: 'data_pipeline.py',
      language: 'python',
      extension: 'py',
      code: `def process_data(data_source, output_path):
    """
    Process data from source and save to output path
    """
    # Initialize data pipeline
    pipeline = DataPipeline(
        source=data_source,
        transformers=[
            CleanseData(),
            NormalizeValues(),
            EnrichFeatures()
        ]
    )
    
    # Process data in batches
    results = pipeline.process_in_batches(
        batch_size=1000,
        workers=8
    )
    
    # Save processed data
    with open(output_path, 'w') as f:
        for batch in results:
            f.write(json.dumps(batch))
    
    return {
        "status": "success",
        "records_processed": pipeline.stats.total_records,
        "time_elapsed": pipeline.stats.elapsed_time
    }`,
      originalCode: `def process_data(data_source, output_path):
    """
    Process data from source and save to output path
    """
    # Initialize data pipeline
    pipeline = DataPipeline(
        source=data_source,
        transformers=[
            CleanseData(),
            NormalizeValues(),
            EnrichFeatures()
        ]
    )
    
    # Process data in batches
    results = pipeline.process_in_batches(
        batch_size=1000,
        workers=8
    )
    
    # Save processed data
    with open(output_path, 'w') as f:
        for batch in results:
            f.write(json.dumps(batch))
    
    return {
        "status": "success",
        "records_processed": pipeline.stats.total_records,
        "time_elapsed": pipeline.stats.elapsed_time
    }`
    },
    {
      id: 'react-1',
      name: 'DataDashboard.jsx',
      language: 'javascript',
      extension: 'jsx',
      code: `function DataDashboard({ dataSource, filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.getData(dataSource, filters);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [dataSource, filters]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="dashboard">
      <MetricsPanel data={data.metrics} />
      <DataVisualization 
        chartData={data.chartData}
        options={data.options}
      />
      <DataTable 
        records={data.records}
        columns={data.schema}
        pagination={true}
      />
    </div>
  );
}`,
      originalCode: `function DataDashboard({ dataSource, filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.getData(dataSource, filters);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [dataSource, filters]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="dashboard">
      <MetricsPanel data={data.metrics} />
      <DataVisualization 
        chartData={data.chartData}
        options={data.options}
      />
      <DataTable 
        records={data.records}
        columns={data.schema}
        pagination={true}
      />
    </div>
  );
}`
    },
    {
      id: 'sql-1',
      name: 'analytics.sql',
      language: 'sql',
      extension: 'sql',
      code: `-- Create analytics view for dashboard
CREATE OR REPLACE VIEW user_engagement_metrics AS
SELECT
  date_trunc('day', event_time) AS day,
  user_id,
  COUNT(DISTINCT session_id) AS session_count,
  SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
  SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS clicks,
  AVG(session_duration) AS avg_session_duration,
  MAX(session_duration) AS max_session_duration
FROM
  events
WHERE
  event_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY
  date_trunc('day', event_time),
  user_id
HAVING
  COUNT(DISTINCT session_id) > 0;

-- Create index for performance
CREATE INDEX idx_events_user_time ON events(user_id, event_time);`,
      originalCode: `-- Create analytics view for dashboard
CREATE OR REPLACE VIEW user_engagement_metrics AS
SELECT
  date_trunc('day', event_time) AS day,
  user_id,
  COUNT(DISTINCT session_id) AS session_count,
  SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
  SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS clicks,
  AVG(session_duration) AS avg_session_duration,
  MAX(session_duration) AS max_session_duration
FROM
  events
WHERE
  event_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY
  date_trunc('day', event_time),
  user_id
HAVING
  COUNT(DISTINCT session_id) > 0;

-- Create index for performance
CREATE INDEX idx_events_user_time ON events(user_id, event_time);`
    }
  ];
  
  // State for code snippets
  const [snippets, setSnippets] = useState<CodeSnippet[]>(initialSnippets);
  
  // Typing effect for code snippets
  const [displayedCode, setDisplayedCode] = useState<Record<string, string>>({});
  
  // Initialize displayed code with empty strings
  useEffect(() => {
    const initialDisplayCode: Record<string, string> = {};
    snippets.forEach(snippet => {
      initialDisplayCode[snippet.id] = '';
    });
    setDisplayedCode(initialDisplayCode);
    
    // Initialize typing effect completion status
    const initialTypingStatus: Record<string, boolean> = {};
    snippets.forEach(snippet => {
      initialTypingStatus[snippet.id] = false;
    });
    setTypingEffectComplete(initialTypingStatus);
  }, []);
  
  // Typing effect animation
  useEffect(() => {
    snippets.forEach(snippet => {
      if (typingEffectComplete[snippet.id]) return;
      
      let currentText = displayedCode[snippet.id] || '';
      const targetText = snippet.code;
      
      if (currentText.length < targetText.length) {
        const timer = setTimeout(() => {
          const nextChar = targetText.charAt(currentText.length);
          const newText = currentText + nextChar;
          
          setDisplayedCode(prev => ({
            ...prev,
            [snippet.id]: newText
          }));
          
          // Play typing sound if enabled
          if (soundEnabled && nextChar.trim() !== '') {
            playType();
          }
          
          // Check if typing is complete
          if (newText.length === targetText.length) {
            setTypingEffectComplete(prev => ({
              ...prev,
              [snippet.id]: true
            }));
          }
        }, Math.random() * 10 + 5); // Random delay for more natural typing effect
        
        return () => clearTimeout(timer);
      }
    });
  }, [displayedCode, snippets, typingEffectComplete, soundEnabled, playType]);
  
  // Handle code changes
  const handleCodeChange = (value: string, snippetId: string) => {
    setSnippets(prevSnippets => 
      prevSnippets.map(snippet => 
        snippet.id === snippetId 
          ? { ...snippet, code: value } 
          : snippet
      )
    );
  };
  
  // Reset code to original
  const resetCode = (snippetId: string) => {
    if (soundEnabled) playClick();
    
    setSnippets(prevSnippets => 
      prevSnippets.map(snippet => 
        snippet.id === snippetId 
          ? { ...snippet, code: snippet.originalCode } 
          : snippet
      )
    );
  };
  
  // Toggle expanded view
  const toggleExpand = (snippetId: string | null) => {
    if (soundEnabled) playClick();
    setExpandedSnippet(snippetId);
  };
  
  // Get language extension for CodeMirror
  const getLanguageExtension = (language: string) => {
    switch (language) {
      case 'javascript':
        return javascript({ jsx: true });
      case 'python':
        return python();
      case 'sql':
        return sql();
      default:
        return javascript();
    }
  };
  
  // Handle key press for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedSnippet) {
        toggleExpand(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedSnippet]);
  
  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) playClick(); // Play sound when enabling
  };
  
  // Render code snippet
  const renderCodeSnippet = (snippet: CodeSnippet, index: number) => {
    const dragControls = useDragControls();
    
    return (
      <Reorder.Item
        key={snippet.id}
        value={snippet}
        id={snippet.id}
        dragControls={dragControls}
        dragListener={!expandedSnippet}
        className="code-snippet"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotate: expandedSnippet ? 0 : (index - 1) * 5,
          zIndex: expandedSnippet === snippet.id ? 50 : 10 - index
        }}
        transition={{ 
          duration: 0.5, 
          delay: expandedSnippet ? 0 : index * 0.2,
          type: "spring",
          stiffness: 100
        }}
        whileHover={expandedSnippet ? {} : { 
          y: -10, 
          zIndex: 20,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        style={{ 
          position: 'absolute',
          top: expandedSnippet === snippet.id ? '50%' : `${index * 50}px`,
          left: expandedSnippet === snippet.id ? '50%' : `${index * 20}px`,
          transform: expandedSnippet === snippet.id 
            ? 'translate(-50%, -50%)' 
            : `rotate(${(index - 1) * 5}deg)`,
          width: expandedSnippet === snippet.id ? '90%' : '400px',
          height: expandedSnippet === snippet.id ? '80%' : '300px',
          maxWidth: expandedSnippet === snippet.id ? '1200px' : '400px',
          maxHeight: expandedSnippet === snippet.id ? '800px' : '300px',
        }}
      >
        <div 
          className={`rounded-lg overflow-hidden shadow-xl border transition-all duration-300 h-full ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
          onPointerDown={(e) => {
            if (!expandedSnippet) dragControls.start(e);
          }}
        >
          {/* Code editor header */}
          <div className={`h-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          } flex items-center justify-between px-4`}>
            <div className="flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-xs text-gray-500">
                {snippet.name}
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => resetCode(snippet.id)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="Reset code"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={() => toggleExpand(expandedSnippet === snippet.id ? null : snippet.id)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title={expandedSnippet === snippet.id ? "Minimize" : "Maximize"}
              >
                {expandedSnippet === snippet.id ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          </div>
          
          {/* Code content */}
          <div className="h-[calc(100%-32px)] overflow-auto">
            {typingEffectComplete[snippet.id] ? (
              <CodeMirror
                value={snippet.code}
                height={expandedSnippet === snippet.id ? "calc(100% - 8px)" : "268px"}
                theme={theme === 'dark' ? githubDark : githubLight}
                extensions={[getLanguageExtension(snippet.language)]}
                onChange={(value) => handleCodeChange(value, snippet.id)}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  foldGutter: true,
                  drawSelection: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  syntaxHighlighting: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: true,
                  crosshairCursor: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                  closeBracketsKeymap: true,
                  searchKeymap: true,
                  foldKeymap: true,
                  completionKeymap: true,
                  lintKeymap: true,
                }}
              />
            ) : (
              <div className={`p-4 font-mono text-xs overflow-hidden h-full ${
                theme === 'dark' ? 'text-gray-300 bg-gray-900' : 'text-gray-800 bg-white'
              }`}>
                <pre>
                  <code>
                    {displayedCode[snippet.id] || ''}
                    <span className="animate-pulse">|</span>
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </Reorder.Item>
    );
  };
  
  // Render backdrop for expanded view
  const renderBackdrop = () => {
    if (!expandedSnippet) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => toggleExpand(null)}
      />
    );
  };
  
  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">      
      {/* Backdrop for expanded view */}
      <AnimatePresence>
        {renderBackdrop()}
      </AnimatePresence>
      
      {/* Code snippets */}
      <Reorder.Group
        axis="y"
        values={snippets}
        onReorder={setSnippets}
        className="relative w-full h-full"
      >
        {snippets.map((snippet, index) => renderCodeSnippet(snippet, index))}
      </Reorder.Group>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-10 right-10 w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 opacity-70"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0],
          opacity: [0.7, 0.5, 0.7]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-70"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0],
          opacity: [0.7, 0.4, 0.7]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute bottom-40 right-20 w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 opacity-70"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, -10, 0],
          opacity: [0.7, 0.3, 0.7]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default CodeAnimation;
