import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processInlineContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let currentText = '';
    let inBold = false;
    
    // Process text character by character
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '*' && text[i + 1] === '*') {
        // Add accumulated text before processing bold
        if (currentText) {
          parts.push(<span key={`text-${currentIndex}`}>{currentText}</span>);
          currentIndex++;
          currentText = '';
        }
        
        inBold = !inBold;
        i++; // Skip the second asterisk
        continue;
      }
      
      currentText += text[i];
      
      // If we reach the end of the text, add the remaining content
      if (i === text.length - 1 && currentText) {
        parts.push(
          inBold ? 
            <strong key={`text-${currentIndex}`} className="font-semibold">{currentText}</strong> :
            <span key={`text-${currentIndex}`}>{currentText}</span>
        );
      }
    }

    // Process links in the non-bold text segments
    const processedParts: React.ReactNode[] = [];
    parts.forEach((part, index) => {
      if (React.isValidElement(part) && part.type === 'span') {
        const text = part.props.children;
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        let lastIndex = 0;
        const linkParts: React.ReactNode[] = [];

        while ((match = linkRegex.exec(text)) !== null) {
          // Add text before the link
          if (match.index > lastIndex) {
            linkParts.push(<span key={`link-text-${index}-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
          }

          // Add the link
          linkParts.push(
            <a 
              key={`link-${index}-${match.index}`}
              href={match[2]}
              className="text-blue-600 hover:underline"
            >
              {match[1]}
            </a>
          );
          
          lastIndex = match.index + match[0].length;
        }

        // Add remaining text after the last link
        if (lastIndex < text.length) {
          linkParts.push(<span key={`link-text-${index}-${lastIndex}`}>{text.slice(lastIndex)}</span>);
        }

        processedParts.push(...(linkParts.length ? linkParts : [part]));
      } else {
        processedParts.push(part);
      }
    });

    return processedParts.length ? processedParts : [text];
  };

  // Helper function to process markdown content
  const processContent = (content: string) => {
    const lines = content.split('\n').map(line => line.trim());
    const result: JSX.Element[] = [];
    let currentTable: string[] = [];
    let isInTable = false;
    let isInCodeBlock = false;
    let codeLines: string[] = [];
    let currentList: string[] = [];
    let isInList = false;

    const renderTable = (tableLines: string[]) => {
      if (tableLines.length < 3) return null;

      const headers = tableLines[0]
        .split('|')
        .filter(cell => cell.trim())
        .map(cell => cell.trim());

      const rows = tableLines.slice(2)
        .map(line => 
          line
            .split('|')
            .filter(cell => cell.trim())
            .map(cell => cell.trim())
        );

      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const flushTable = () => {
      if (currentTable.length > 0) {
        const tableElement = renderTable(currentTable);
        if (tableElement) {
          result.push(
            <div key={`table-${result.length}`}>
              {tableElement}
            </div>
          );
        }
        currentTable = [];
        isInTable = false;
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        const listItems = currentList.map((item, index) => (
          <li key={index} className="ml-4 mb-2">
            {processInlineContent(item.replace(/^-\s*/, ''))}
          </li>
        ));
        result.push(
          <ul key={`list-${result.length}`} className="list-disc mb-4">
            {listItems}
          </ul>
        );
        currentList = [];
        isInList = false;
      }
    };

    const renderLine = (line: string) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={result.length} className="text-4xl font-bold mt-8 mb-4">{processInlineContent(line.slice(2))}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={result.length} className="text-2xl font-semibold mt-6 mb-3">{processInlineContent(line.slice(3))}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={result.length} className="text-xl font-semibold mt-5 mb-2">{processInlineContent(line.slice(4))}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={result.length} className="text-lg font-semibold mt-4 mb-2">{processInlineContent(line.slice(5))}</h4>;
      }

      // Regular paragraph with possible links and bold text
      return <p key={result.length} className="mb-4">{processInlineContent(line)}</p>;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith('```')) {
        if (!isInCodeBlock) {
          isInCodeBlock = true;
          codeLines = [];
          continue;
        } else {
          const codeId = `code-${result.length}`;
          const codeContent = codeLines.join('\n');
          result.push(
            <div key={codeId} className="relative group">
              <pre className="bg-gray-800 text-white p-4 rounded-lg mb-4 overflow-x-auto">
                <code className="text-sm font-mono">{codeContent}</code>
              </pre>
              <button
                onClick={() => handleCopy(codeContent, codeId)}
                className="absolute top-2 right-2 p-2 bg-opacity-50 bg-gray-800 rounded hover:bg-opacity-75 transition-colors"
                aria-label="Copy code"
              >
                {copiedId === codeId ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          );
          isInCodeBlock = false;
          continue;
        }
      }

      if (isInCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Handle tables
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!isInTable) {
          flushList();
          isInTable = true;
        }
        currentTable.push(line);
        continue;
      } else if (isInTable) {
        flushTable();
      }

      // Handle lists
      if (line.startsWith('- ')) {
        if (!isInList) {
          flushTable();
          isInList = true;
        }
        currentList.push(line);
        continue;
      } else if (isInList && line.trim() !== '') {
        flushList();
      }

      // Handle regular content
      if (line.trim() !== '') {
        flushTable();
        flushList();
        result.push(renderLine(line));
      }
    }

    // Flush any remaining content
    flushTable();
    flushList();

    return result;
  };

  return (
    <div className="markdown-content prose max-w-none">
      {processContent(content)}
    </div>
  );
};

export default MarkdownRenderer;