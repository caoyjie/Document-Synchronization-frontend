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
          <li><strong>1.</strong> Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer">Notion Integrations</a> and create a new integration</li>
          <li><strong>2.</strong> Copy your integration token - you'll need this for authentication</li>
          <li><strong>3.</strong> In your Notion workspace, open the database where you want to sync files,<span className="highlight">your database must inclue two columns: "Title" and "tags" (case-sensitive)</span></li>
          <li><strong>4.</strong> Click the "..." menu in the top right of your database</li>
          <li><strong>5.</strong> Select "Add connections" and choose your integration</li>
          <li><strong>6.</strong> Copy your database ID from the URL (it's the part after the workspace name and before the question mark)</li>
        </ol>
      </div>

      <div className="help-section">
        <h2>How to Use</h2>
        <p>Once you've completed the setup, you can upload file/files:</p>
        <ul>
          <li><strong>Select some Files:</strong> Drag and drop or click to select some files</li>
          <li><strong>Upload:</strong> Click the upload button</li>
        </ul>
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
          <li><strong>Upload Failed:</strong> Double-check your token, database ID and set the correct columns name in your database</li>
          <li><strong>Character Limit Errors:</strong> Notion has a 100-character limit for paragraphs, code blocks, and table cells. Content exceeding this limit will be truncated.</li>
          <li><strong>API Errors:</strong> If you see errors about specific blocks, the application will automatically remove problematic blocks and retry the upload.</li>
        </ul>
        
        <h3>Understanding Error Messages</h3>
        <div className="error-info">

        <div className="error-type">
            <h4>Authentication or Database Access Errors</h4>
            <p>If you see errors like <code>Invalid token</code> or <code>Unauthorized</code>:</p>
            <ul>
              <li>Your Notion API token is invalid or expired, Generate a new token from the Notion Integrations page. Make sure you've copied the entire token correctly</li>
              <li>The database ID is incorrect or your integration doesn't have access, Verify the database ID is copied correctly from the URL</li>
              <li>Ensure you've shared the database with your integration</li>
            </ul>
          </div>

          <div className="error-type">
            <h4>Character Limit Warning</h4>
            <p>If you see an error like <code>Warning: This part of the content is too long</code>, this means:</p>
            <ul>
              <li>A specific block in your content is causing the Notion API to reject the request (character limit 100)</li>
              <li>The application will automatically remove this block and retry the upload</li>
              <li>You'll see a warning in the logs about which block was removed</li>
            </ul>
          </div>

          
        </div>
      </div>

      <div className="help-section">
        <h2>Future Enhancements</h2>
        <p>
          We're constantly working to improve Sync to Notion. Here are some planned enhancements:
        </p>
        <ul>
          <li><strong>Math/LaTeX Support:</strong> Add support for rendering mathematical equations and LaTeX formulas in Notion pages</li>
          <li><strong>Split long content:</strong> Add support for split long content into multiple blocks</li>
          {/*<li><strong>User Authentication:</strong> Implement user login and account management</li>*/}
          {/*<li><strong>Database Integration:</strong> Use PostgreSQL to store user information and other application data</li>*/}
          {/*<li><strong>S3 Backup:</strong> Automatically backup temporary files to S3 for improved reliability</li>*/}
          <li><strong>Multi-Platform Support:</strong> Extend functionality to other platforms beyond Notion, such as:
            <ul>
              <li>Obsidian</li>
              <li>Feishu</li>
              <li>Confluence</li>
              <li>Evernote</li>
              <li>OneNote</li>
            </ul>
          </li>
        </ul>
      </div>


      <div className="help-section">
        <h2>Need More Help?</h2>
        <p>
          If you're still having issues, please contact us at{' '}
          <a href="mailto:support@sync2notion.com">support@sync2notion.com</a>
        </p>
      </div>

      <div className="help-actions">
        <Link to="/" className="help-button">Start Uploading</Link>
      </div>
    </div>
  );
};

export default Help; 