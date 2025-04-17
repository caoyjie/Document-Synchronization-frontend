# <img src="public/icon.png" alt="Document Synchronization Icon" width="30" height="30" /> Document Synchronization to Notion

A modern web application that allows users to easily upload and synchronize documents to Notion databases. This tool simplifies the process of importing various document formats into Notion, making it easier to organize and access your content.

## Features

- **Multiple File Upload**: Upload one or multiple files at once
- **Wide Format Support**: Supports various document formats including:
  - Microsoft Office (DOCX, DOC, PPTX, XLSX, XLS)
  - PDF files
  - Markdown (MD)
  - EPUB e-books
  - HTML web pages
  - Plain text (TXT)
  - Data files (CSV, JSON, XML)
- **Notion Integration**: Seamlessly connects with your Notion workspace
- **Tagging System**: Add tags to organize your content in Notion
- **Progress Tracking**: Visual feedback during upload process
- **Error Handling**: Robust error handling with clear user feedback
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Notion account
- A Notion integration token
- A Notion database with "Title" and "tags" columns

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Document-Synchronization-frontend.git
   cd Document-Synchronization-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8001
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Setup Instructions

Before you can use the application, you need to set up your Notion integration:

1. Go to [Notion Integrations](https://www.notion.so/my-integrations) and create a new integration
2. Copy your integration token - you'll need this for authentication
3. In your Notion workspace, open the database where you want to sync files
4. Click the "..." menu in the top right of your database, your database must include two columns: "Title" and "tags" (case-sensitive)
5. Select "Add connections" and choose your integration
6. Copy your database ID from the URL (it's the part after the workspace name and before the question mark)

## Usage

1. **Select Files**: Drag and drop files into the upload area or click to select files
2. **Configure**: Enter your Notion token and database ID
3. **Add Tags (Optional)**: Add tags to organize your content
4. **Upload**: Click the upload button to start the synchronization process
5. **View Results**: See the upload results and access your Notion pages

## Troubleshooting

### Common Issues

- **Upload Failed**: Double-check your token, database ID and set the correct columns name in your database
- **Character Limit Errors**: Notion has a 100-character limit for paragraphs, code blocks, and table cells. Content exceeding this limit will be truncated.
- **API Errors**: If you see errors about specific blocks, the application will automatically remove problematic blocks and retry the upload.

### Understanding Error Messages

- **Notion API Validation Errors**: If you see an error like `body failed validation: body.children[63]`, this means a specific block in your content is causing the Notion API to reject the request.
- **Authentication Errors**: If you see errors like `Invalid token` or `Unauthorized`, your Notion API token is invalid or expired.
- **Database Access Errors**: If you see errors like `Database not found` or `Access denied`, the database ID is incorrect or your integration doesn't have access.

## Character Limits

Notion has specific limitations on content length that you should be aware of:

- **100 Character Limit**: Paragraphs, code blocks, and table cells are limited to 100 characters
- **Content Truncation**: Any content exceeding 100 characters will be truncated and the excess content will be removed
- **Workarounds**: For longer content, consider breaking it into multiple blocks or paragraphs
- **Automatic Handling**: The application will automatically detect and handle blocks that exceed these limits

## Future Enhancements

We're constantly working to improve Sync to Notion. Here are some planned enhancements:

- **Math/LaTeX Support**: Add support for rendering mathematical equations and LaTeX formulas in Notion pages
- **User Authentication**: Implement user login and account management
- **Database Integration**: Use PostgreSQL to store user information and other application data
- **S3 Backup**: Automatically backup temporary files to S3 for improved reliability
- **Multi-Platform Support**: Extend functionality to other platforms beyond Notion, such as:
  - Obsidian
  - Feishu
  - Confluence
  - Evernote
  - OneNote
- **Text Formatting Support**: Add support for analyzing and preserving italic, underline, and strikethrough text formatting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions or need help, please contact us at [support@sync2notion.com](mailto:support@sync2notion.com).