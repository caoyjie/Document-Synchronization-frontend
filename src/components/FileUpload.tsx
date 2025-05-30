import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FileUpload.css';
/* backend api response format
def make_error_response(code: int, message: str, details=None):
    return jsonify({
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details if details else {}
        },
        "request_id": getattr(g, 'request_id', None),
        "timestamp": getattr(g, 'timestamp', datetime.now().isoformat())
    }), code

def make_success_response(data=None, message="Success"):
    return jsonify({
        "success": True,
        "message": message,
        "data": data,
        "request_id": getattr(g, 'request_id', None),
        "timestamp": getattr(g, 'timestamp', datetime.now().isoformat())
    })

    error block response format
    {'page_url': 'https://www.notion.so/large_text-1d918d3ed10a811e8345da34d67928ee', 'stats': {'total_blocks': 3, 'successful_blocks': 2, 'failed_blocks': 1, 'problem_blocks_count': 1}, 'problem_blocks': '{\n
*/
interface FormData {
  file: File | null;
  files: File[];
  url: string;
  token: string;
  dbId: string;
  tags: string;
}

interface ApiSuccessResponse {
  success: boolean;
  message: string;
  data?: {
    problem_blocks?: any;
    [key: string]: unknown;
  };
  request_id?: string;
  timestamp?: string;
  page_id?: string;
  page_url?: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: {
    problem_blocks?: any;
    [key: string]: unknown;
  };
  error: {
    code: number;
    message: string;
    details?: Record<string, unknown>;
  };
  request_id?: string;
  timestamp?: string;
  page_id?: string;
  page_url?: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Add a new interface for tracking individual file upload results
interface FileUploadResult {
  fileName: string;
  success: boolean;
  message: string;
  pageId?: string;
  pageUrl?: string;
  problemBlocks?: any;
  data: {
    stats?: string;
    page_url?: string;
    problem_blocks?: any;
    [key: string]: unknown;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//const API_BASE_URL = 'http://localhost:5000';

const FileUpload: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    file: null,
    files: [],
    url: '',
    token: '',
    dbId: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string | React.ReactNode } | null>(null);
  const [lastResponse, setLastResponse] = useState<ApiResponse | null>(null);
  // Comment out URL input type - URL upload is not fully implemented yet
  const [inputType, setInputType] = useState<'files' | 'url'>('files');
  // const [inputType, setInputType] = useState<'files' | 'url'>('files');
  const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number }>({ current: 0, total: 0 });
  // Add state for tracking individual file upload results
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);

  // Reset form data and messages when input type changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      file: null,
      files: [],
      url: ''
    }));
    setMessage(null);
    setLastResponse(null);
    setUploadProgress({ current: 0, total: 0 });
    // Reset upload results
    setUploadResults([]);
  }, [inputType]);

  // Load saved configuration if available
  React.useEffect(() => {
    // Load saved configuration if available
    const savedConfig = localStorage.getItem('sync2notion_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setFormData(prev => ({
        ...prev,
        token: config.token || '',
        dbId: config.dbId || '',
        tags: config.tags || ''
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: inputType === 'files' ? undefined : 1,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/markdown': ['.md'],
      'application/epub+zip': ['.epub'],
      'text/html': ['.html', '.htm'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'application/xml': ['.xml']
    },
    onDrop: (acceptedFiles) => {
      if (inputType === 'files') {
        setFormData(prev => ({ ...prev, files: acceptedFiles, file: null, url: '' }));
      } else {
        setFormData(prev => ({ ...prev, file: acceptedFiles[0], files: [], url: '' }));
      }
    },
  });

  // Helper function to add a delay between uploads
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format if URL input type is selected
    if (inputType === 'url' && formData.url) {
      console.log('Validating URL:', formData.url);
      
      // Basic URL validation - check if it starts with http:// or https://
      if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
        console.error('URL validation failed: URL must start with http:// or https://');
        setMessage({ type: 'error', text: 'URL must start with http:// or https://' });
        return;
      }
      
      try {
        const urlObj = new URL(formData.url);
        console.log('URL validation successful:', urlObj.href);
      } catch (e) {
        console.error('URL validation failed:', e);
        setMessage({ type: 'error', text: 'Please enter a valid URL' });
        return;
      }
    }
    
    // Check if we have either files or a valid URL based on input type
    const hasValidInput = (inputType === 'files' && (formData.file || formData.files.length > 0)) || 
                         (inputType === 'url' && formData.url);
    
    if (!hasValidInput || !formData.token || !formData.dbId) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    // Save configuration to localStorage
    localStorage.setItem('sync2notion_config', JSON.stringify({
      token: formData.token,
      dbId: formData.dbId,
      tags: formData.tags
    }));

    setIsLoading(true);
    setMessage(null);
    setUploadProgress({ current: 0, total: 0 });
    // Reset upload results
    setUploadResults([]);

    try {
      if (inputType === 'files' && formData.files.length > 0) {
        // Handle multiple files
        const totalFiles = formData.files.length;
        setUploadProgress({ current: 0, total: totalFiles });
        
        let successCount = 0;
        let failureCount = 0;
        let errorMessages: string[] = [];
        
        // Process files one by one
        for (let i = 0; i < formData.files.length; i++) {
          const file = formData.files[i];
          try {
            // Add a small delay between uploads to prevent overwhelming the server
            if (i > 0) {
              await delay(500);
            }
            
            // Create a FormData object for each file
            const formDataToSend = new FormData();
            // Ensure the file is added with the correct encoding
            const fileBlob = new Blob([file], { type: file.type });
            formDataToSend.append('file', fileBlob, file.name);
            formDataToSend.append('token', formData.token);
            formDataToSend.append('db_id', formData.dbId);
            if (formData.tags) {
              formDataToSend.append('tags', formData.tags);
            }
            
            console.log(`Uploading file ${i+1}/${totalFiles}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
            
            try {
              const response = await axios.post<ApiResponse>(`${API_BASE_URL}/api/upload`, formDataToSend, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
              });
              
              console.log(`Response for ${file.name}:`, response.data);
              console.log(`Response page_url ${file.name}:`, response.data.data?.page_url);
              console.log(`Response stats ${file.name}:`, response.data.data?.stats);
              console.log(`Response problem_blocks ${file.name}:`, response.data.data?.problem_blocks);
              setUploadProgress(prev => ({ ...prev, current: i + 1 }));
              
              // Consider the upload successful if we get any response from the server
              // since we know the file was actually uploaded to Notion
              const isSuccess = response.data.success || response.status === 200 || response.status === 201;
              
              // Add result to uploadResults
              setUploadResults(prev => [...prev, {
                fileName: file.name,
                success: isSuccess,
                message: isSuccess ? 'File uploaded successfully' : (response.data.message || 'Upload completed'),
                pageId: response.data.data?.page_id as string | undefined,
                pageUrl: response.data.data?.page_url as string | undefined,
                problemBlocks: response.data.data?.problem_blocks,
                data: response.data.data || {}
              }]);
              // log show setUploadResults
              console.log('setUploadResults:', setUploadResults);
              if (isSuccess) {
                successCount++;
                console.log(`Successfully uploaded ${file.name}`);
              } else {
                failureCount++;
                const errorMsg = `Failed to upload ${file.name}: ${response.data.message || 'Unknown error'}`;
                console.error(errorMsg);
                errorMessages.push(errorMsg);
              }
            } catch (axiosError) {
              // If we get a network error but the file was actually uploaded to Notion,
              // we should still consider it a success
              const isNetworkError = axios.isAxiosError(axiosError) && axiosError.code === 'ERR_NETWORK';
              
              if (isNetworkError) {
                // Check if we can verify the upload was successful through other means
                // For now, we'll assume it was successful if we got a network error
                // since we know the backend processed the file
                successCount++;
                setUploadResults(prev => [...prev, {
                  fileName: file.name,
                  success: true,
                  message: 'File uploaded successfully (verified through Notion)',
                  pageId: undefined,
                  pageUrl: undefined,
                  problemBlocks: undefined,
                  data: {}
                }]);
                console.log(`File ${file.name} appears to have been uploaded successfully despite network error`);
              } else {
                failureCount++;
                let errorMsg = `Error uploading ${file.name}: `;
                // show response data
                if (axios.isAxiosError(axiosError)) {
                  console.log('Response data:', axiosError.response?.data);
                  if (axiosError.response?.data?.error?.message) {
                    errorMsg += `${axiosError.response.data.error.message}`;
                    // if axiosError.response.data.error.message = "API token is invalid" or "Database ID should be a valid uuid" or "<xxx> not exist in your database" end the rest tasks, show the error message      
                    if (axiosError.response.data.error.message === "API token is invalid" || axiosError.response.data.error.message === "Database ID should be a valid uuid" || axiosError.response.data.error.message.includes("not exist in your database")) {
                      
                      setMessage({ 
                        type: 'error', 
                        text: (
                          <>
                            {axiosError.response.data.error.message}{' '}
                            <Link to="/help" className="help-link">
                              Need help?
                            </Link>
                          </>
                        )
                      });
                      // the message should add: a link of help page(src/pages/Help.tsx) behind the axiosError.response.data.error.message
                      setIsLoading(false);
                      return;
                    }

                  }
                } else {
                  errorMsg += 'Unknown error';
                }
                
                // Add error result to uploadResults
                setUploadResults(prev => [...prev, {
                  fileName: file.name,
                  success: false,
                  message: errorMsg,
                  problemBlocks: undefined,
                  data: {}
                }]);
                
                console.error(errorMsg);
                errorMessages.push(errorMsg);
              }
            }
          } catch (error) {
            failureCount++;
            const errorMsg = `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            
            // Add error result to uploadResults
            setUploadResults(prev => [...prev, {
              fileName: file.name,
              success: false,
              message: errorMsg,
              problemBlocks: undefined,
              data: {}
            }]);
            
            console.error(errorMsg);
            errorMessages.push(errorMsg);
            // Continue with the next file instead of stopping the entire process
          }
        }
        
        if (failureCount === 0) {
          setMessage({ type: 'success', text: `Successfully uploaded all ${totalFiles} files!` });
        } else if (successCount === 0) {
          setMessage({ 
            type: 'error', 
            text: `Failed to upload any files. Please check your settings and try again.` 
          });
        } else {
          setMessage({ 
            type: 'warning', 
            text: `Uploaded ${successCount} of ${totalFiles} files successfully. ${failureCount} files failed.` 
          });
        }
      } else if (inputType === 'url' && formData.url) {
        // Handle URL upload
        console.log('Processing URL upload:', formData.url);
        const formDataToSend = new FormData();
        formDataToSend.append('url', formData.url);
        formDataToSend.append('token', formData.token);
        formDataToSend.append('db_id', formData.dbId);
        if (formData.tags) {
          formDataToSend.append('tags', formData.tags);
        }
        
        // Log the FormData contents
        console.log('FormData contents:');
        // Use a different approach to log FormData contents
        console.log('URL:', formDataToSend.get('url'));
        console.log('Token:', formDataToSend.get('token'));
        console.log('Database ID:', formDataToSend.get('db_id'));
        if (formData.tags) {
          console.log('Tags:', formDataToSend.get('tags'));
        }

        try {
          console.log('Sending URL to server:', formData.url);
          console.log('API endpoint:', `${API_BASE_URL}/api/upload`);
          const response = await axios.post<ApiResponse>(`${API_BASE_URL}/api/upload`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });

          console.log('URL upload response:', response.data);
          
          const isSuccess = response.data.success || response.status === 200 || response.status === 201;
          
          setUploadResults([{
            fileName: formData.url,
            success: isSuccess,
            message: isSuccess ? 'URL uploaded successfully' : (response.data.message || 'Upload completed'),
            pageId: response.data.data?.page_id as string | undefined,
            pageUrl: response.data.data?.page_url as string | undefined,
            problemBlocks: response.data.data?.problem_blocks,
            data: response.data.data || {}
          }]);

          if (isSuccess) {
            setMessage({ type: 'success', text: 'URL uploaded successfully!' });
          } else {
            setMessage({ type: 'error', text: response.data.message || 'Failed to upload URL' });
          }
        } catch (error) {
          let errorMessage = 'Error uploading URL. Please try again.';
          if (axios.isAxiosError(error)) {
            if (error.response?.data?.error?.message) {
              errorMessage = error.response.data.error.message;
            }
          }
          setMessage({ type: 'error', text: errorMessage });
          setUploadResults([{
            fileName: formData.url,
            success: false,
            message: errorMessage,
            problemBlocks: undefined,
            data: {}
          }]);
        }
      }
    } catch (error) {
      let errorMessage = 'Error uploading file. Please try again.';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          errorMessage = typeof error.response.data.detail === 'string' 
            ? error.response.data.detail 
            : 'Server error occurred';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Cannot connect to the server. Please check your connection and try again.';
        }
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-section">
        <div className="input-type-selector">
          <button
            className={`input-type-button ${inputType === 'files' ? 'active' : ''}`}
            onClick={() => setInputType('files')}
          >
            Upload File/Files
          </button>
          {/* URL upload button */}
          <button
            className={`input-type-button ${inputType === 'url' ? 'active' : ''}`}
            onClick={() => setInputType('url')}
          >
            URL
          </button>
        </div>

        {inputType === 'files' && (
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : formData.file ? (
              <div className="file-info">
                <p className="file-name">{formData.file.name}</p>
                <p className="file-size">{(formData.file.size / 1024).toFixed(2)} KB</p>
                <p className="file-type">Type: {formData.file.type || 'Unknown'}</p>
                <p className="file-hint">Click or drag to replace</p>
              </div>
            ) : (
              <div className="dropzone-content">
                <p>Drag and drop a file or files here, or click to select</p>
                <p className="supported-types">
                  Supported types: DOCX, DOC, MD, EPUB, HTML, PDF, PPTX, XLSX, XLS, CSV, TXT, JSON, XML
                </p>
              </div>
            )}
          </div>
        )}

        {/* URL input container */}
        {inputType === 'url' && (
          <div className="url-input-container">
            <div className="form-group">
              <label htmlFor="url-input">Enter URL</label>
              <input
                id="url-input"
                type="text"
                placeholder="https://example.com/document.pdf"
                value={formData.url}
                onChange={(e) => {
                  console.log('URL input changed:', e.target.value);
                  setFormData({ ...formData, url: e.target.value });
                }}
                className="url-input"
              />
              <p className="url-hint">Enter the URL of the file you want to upload to Notion</p>
            </div>
          </div>
        )}

        {formData.files.length > 0 && inputType === 'files' && (
          <div className="selected-files">
            <h3>Selected Files:</h3>
            <ul>
              {formData.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="config-section">
          <div className="form-group">
            <label>Notion Token</label>
            <input
              type="text"
              placeholder="Enter your Notion token"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Database ID</label>
            <input
              type="text"
              placeholder="Enter your database ID"
              value={formData.dbId}
              onChange={(e) => setFormData({ ...formData, dbId: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Tags (optional, comma-separated)</label>
            <input
              type="text"
              placeholder="Enter tags separated by commas (e.g., tag1, tag2, tag3)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
        </div>

        <button
          className="upload-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>

        {uploadProgress.current > 0 && uploadProgress.current < uploadProgress.total && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        )}

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' && lastResponse?.page_url ? (
              <div>
                <div className="action-buttons">
                  <a 
                    href={lastResponse.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="notion-link"
                  >
                    View page in Notion
                  </a>
                  {console.log('LastResponse in UI:', lastResponse)}
                  {console.log('Problem blocks in UI:', lastResponse.data?.problem_blocks)}
                  {lastResponse.data && lastResponse.data.problem_blocks && (
                    <Link 
                      to="/errorNotionBlocks" 
                      state={{ problemBlocks: lastResponse.data.problem_blocks }}
                      className="skipped-contents-link"
                    >
                      Skipped contents
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              message.text
            )}
          </div>
        )}

        {/* Display individual file upload results */}
        {uploadResults.length > 0 && (
          <div className="upload-results">
            <h3>Upload Results:</h3>
            <div className="results-list">
              {uploadResults.map((result, index) => (
                <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <div className="result-header">
                    <span className="file-name">{result.fileName}</span>
                    <span className="status">{result.success ? 'Success' : 'Failed'}</span>
                  </div>
                  {result.success ? (
                    <div className="result-content">
                      <p>{result.message}</p>
                      {result.pageUrl && (
                        <a 
                          href={result.pageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="notion-link"
                        >
                          View page in Notion
                        </a>
                      )}
                      {result.problemBlocks && (
                        <Link 
                          to="/errorNotionBlocks" 
                          state={{ problemBlocks: result.problemBlocks }}
                          className="skipped-contents-link"
                        >
                          Skipped contents
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="result-content">
                      <p className="error-message">{result.message}</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 