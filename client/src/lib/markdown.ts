import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  breaks: true,           // Add <br> on a single line break
  gfm: true,              // GitHub Flavored Markdown
  headerIds: true,        // Add id attributes to headings
  mangle: false,          // Don't escape HTML in headings
  smartLists: true,       // Use smarter list behavior
  smartypants: true,      // Use smart punctuation
});

// Define custom renderer
const renderer = new marked.Renderer();

// Override checkbox rendering for task lists
renderer.checkbox = function(checked) {
  return `<div class="inline-flex items-center justify-center w-5 h-5 mr-2 ${
    checked ? 'bg-primary' : 'bg-transparent'
  } border ${
    checked ? 'border-primary' : 'border-muted-foreground'
  } rounded">${
    checked 
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 text-primary-foreground"><path d="M20 6L9 17l-5-5"/></svg>' 
      : ''
  }</div>`;
};

// Override list item rendering for task lists
const originalListItem = renderer.listitem;
renderer.listitem = function(text, task, checked) {
  if (task) {
    return `<li class="flex items-start my-1">${text}</li>`;
  }
  return originalListItem.call(this, text, task, checked);
};

// Override link rendering to open external links in new tabs
renderer.link = function(href, title, text) {
  const isExternal = href && href.startsWith('http');
  const attributes = isExternal 
    ? ' target="_blank" rel="noopener noreferrer"' 
    : '';
  
  return `<a href="${href}" title="${title || ''}" class="text-primary hover:underline"${attributes}>${text}</a>`;
};

// Set the custom renderer
marked.use({ renderer });

// Render markdown to HTML with sanitization
export function renderMarkdown(markdown: string): string {
  try {
    // Convert markdown to HTML
    const html = marked.parse(markdown);
    
    // Sanitize HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target'],  // Allow target attribute for links
    });
    
    return sanitizedHtml;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return '<p>Error rendering markdown</p>';
  }
}
