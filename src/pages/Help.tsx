import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

const Help: React.FC = () => {
  return (
    <div className="help-container">
      <h1>Read Me Before You Start</h1>
      
      <div className="help-section">
        <h2>Important Setup Steps</h2>
        <p>
          Before you can use Sync2Notion, you need to complete these essential setup steps:
        </p>
        <ol>
          <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer">Notion Integrations</a> and create a new integration</li>
          <li>Copy your integration token - you'll need this for authentication</li>
          <li>In your Notion workspace, open the database where you want to sync files</li>
          <li>Click the "..." menu in the top right of your database</li>
          <li>Select "Add connections" and choose your integration</li>
          <li>Copy your database ID from the URL (it's the part after the workspace name and before the question mark)</li>
        </ol>
      </div>

      <div className="help-section">
        <h2>How to Use</h2>
        <p>Once you've completed the setup, you can upload files in three ways:</p>
        <ul>
          <li><strong>Single File:</strong> Drag and drop a markdown file or click to select one</li>
          <li><strong>Folder Upload:</strong> Select an entire folder of markdown files</li>
          <li><strong>URL:</strong> Enter a URL to a markdown file hosted online</li>
        </ul>
        <p>Supported file types: .md, .markdown</p>
      </div>

      <div className="help-section">
        <h2>Required Information</h2>
        <p>For each upload, you'll need to provide:</p>
        <ul>
          <li><strong>Notion Token:</strong> The integration token you copied earlier</li>
          <li><strong>Database ID:</strong> The ID of your target Notion database</li>
          <li><strong>Tags (Optional):</strong> Add tags to organize your content</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>Troubleshooting</h2>
        <h3>Common Issues</h3>
        <ul>
          <li><strong>Upload Failed:</strong> Double-check your token and database ID</li>
          <li><strong>Character Limit Errors:</strong> Notion has a 100-character limit for paragraphs, code blocks, and table cells. Content exceeding this limit will be truncated.</li>
          <li><strong>API Errors:</strong> If you see errors about specific blocks, the application will automatically remove problematic blocks and retry the upload.</li>
        </ul>
        
        <h3>Understanding Error Messages</h3>
        <div className="error-info">
          <div className="error-type">
            <h4>Notion API Validation Errors</h4>
            <p>If you see an error like <code>body failed validation: body.children[63]</code>, this means:</p>
            <ul>
              <li>A specific block in your content is causing the Notion API to reject the request</li>
              <li>The number in brackets (e.g., [63]) indicates which block is problematic</li>
              <li>The application will automatically remove this block and retry the upload</li>
              <li>You'll see a warning in the logs about which block was removed</li>
            </ul>
          </div>
          
          <div className="error-type">
            <h4>Authentication Errors</h4>
            <p>If you see errors like <code>Invalid token</code> or <code>Unauthorized</code>:</p>
            <ul>
              <li>Your Notion API token is invalid or expired</li>
              <li>Generate a new token from the Notion Integrations page</li>
              <li>Make sure you've copied the entire token correctly</li>
            </ul>
          </div>
          
          <div className="error-type">
            <h4>Database Access Errors</h4>
            <p>If you see errors like <code>Database not found</code> or <code>Access denied</code>:</p>
            <ul>
              <li>The database ID is incorrect or your integration doesn't have access</li>
              <li>Verify the database ID is copied correctly from the URL</li>
              <li>Ensure you've shared the database with your integration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="help-section">
        <h2>Character Limits</h2>
        <p>Notion has specific limitations on content length that you should be aware of:</p>
        <ul>
          <li><strong>100 Character Limit:</strong> Paragraphs, code blocks, and table cells are limited to 100 characters</li>
          <li><strong>Content Truncation:</strong> Any content exceeding 100 characters will be truncated and the excess content will be removed</li>
          <li><strong>Workarounds:</strong> For longer content, consider breaking it into multiple blocks or paragraphs</li>
          <li><strong>Automatic Handling:</strong> The application will automatically detect and handle blocks that exceed these limits</li>
        </ul>
        <p>These limitations are imposed by the Notion API and cannot be bypassed.</p>
      </div>

      <div className="help-section">
        <h2>Checking Logs for Errors</h2>
        <p>For detailed information about errors, check the application logs:</p>
        <ul>
          <li><strong>Docker Deployment:</strong> Run <code>docker logs sync2notion-container</code></li>
          <li><strong>Local Development:</strong> Check the terminal where the server is running</li>
        </ul>
        <p>The logs will show:</p>
        <ul>
          <li>Which blocks were removed due to API errors</li>
          <li>Which content was truncated due to character limits</li>
          <li>Authentication and database access issues</li>
          <li>Other technical details that can help with troubleshooting</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>Need More Help?</h2>
        <p>
          If you're still having issues, please contact us at{' '}
          <a href="mailto:support@sync2notion.com">support@sync2notion.com</a>
        </p>
      </div>

      <div className="help-section">
        <h2>Future Enhancements</h2>
        <p>
          We're constantly working to improve Sync2Notion. Here are some planned enhancements:
        </p>
        <ul>
          <li><strong>Math/LaTeX Support:</strong> Add support for rendering mathematical equations and LaTeX formulas in Notion pages</li>
          <li><strong>AI-Assisted Markdown:</strong> Integrate AI capabilities with MarkItDown to improve content conversion</li>
          <li><strong>User Authentication:</strong> Implement user login and account management</li>
          <li><strong>Database Integration:</strong> Use PostgreSQL to store user information and other application data</li>
          <li><strong>S3 Backup:</strong> Automatically backup temporary files to S3 for improved reliability</li>
          <li><strong>Additional Format Support:</strong> Expand support for more file formats and content types</li>
          <li><strong>Performance Improvements:</strong> Optimize processing for large documents and batch uploads</li>
          <li><strong>Nested List Support:</strong> Improve handling of nested structures in unordered (ul) and ordered (ol) lists</li>
          <li><strong>Multi-Platform Support:</strong> Extend functionality to other platforms beyond Notion, such as:
            <ul>
              <li>Obsidian</li>
              <li>Feishu</li>
              <li>Confluence</li>
              <li>Evernote</li>
              <li>OneNote</li>
            </ul>
          </li>
          <li><strong>Text Formatting Support:</strong> Add support for analyzing and preserving italic, underline, and strikethrough text formatting</li>
        </ul>
        <p>Stay tuned for updates as we continue to enhance Sync2Notion!</p>
      </div>

      <div className="help-actions">
        <Link to="/" className="help-button">Start Uploading</Link>
      </div>
    </div>
  );
};

export default Help; 