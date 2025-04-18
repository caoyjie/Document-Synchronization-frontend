import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './errorNotionBlocks.css';

const ErrorNotionBlocks: React.FC = () => {
  const location = useLocation();
  const problemBlocks = location.state?.problemBlocks || [];
  
  console.log('Problem blocks data:', problemBlocks);
  console.log('Problem blocks type:', typeof problemBlocks);
  
  return (
    <div className="error-blocks-container">
      <h1>Skipped Contents</h1>
      <p>The following blocks could not be processed due to Notion's content restrictions or unsupported characters:</p>
      {Array.isArray(problemBlocks) && problemBlocks.length > 0 ? (
        <div className="problem-blocks-list">
          {problemBlocks.map((block, index) => (
            <div key={index} className="problem-block-item">
              <div className="code-block-container">
                <SyntaxHighlighter 
                  language="json" 
                  style={docco}
                  className="code-block"
                >
                  {typeof block === 'string' ? block : JSON.stringify(block, null, 2)}
                </SyntaxHighlighter>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No problem blocks found.</p>
      )}
      
      <div className="actions">
        <Link to="/" className="back-button">Back to Upload</Link>
      </div>
    </div>
  );
};

export default ErrorNotionBlocks;