import html2pdf from 'html2pdf.js';

/**
 * Clone element and fix unsupported CSS for PDF generation
 * @param {HTMLElement} element - The element to clone and fix
 * @returns {HTMLElement} - Fixed clone
 */
const cloneAndFixElement = (element) => {
  const clone = element.cloneNode(true);

  // Remove all oklch colors and other unsupported CSS
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    const computedStyle = window.getComputedStyle(element.querySelector(`[data-clone-id="${el.dataset.cloneId || ''}"]`) || element);

    // Get all inline styles and convert oklch to rgb
    const inlineStyle = el.getAttribute('style');
    if (inlineStyle) {
      el.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/g, (match) => {
        // Replace with a fallback color or computed color
        return 'rgb(0, 0, 0)';
      }));
    }
  });

  return clone;
};

/**
 * Prepare element for PDF export by fixing CSS issues
 * @param {HTMLElement} element - The element to prepare
 * @returns {HTMLElement} - Prepared element
 */
const prepareElementForPDF = (element) => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = element.offsetWidth + 'px';
  document.body.appendChild(container);

  // Clone the element
  const clone = element.cloneNode(true);

  // Remove all class attributes to avoid Tailwind CSS issues
  clone.removeAttribute('class');
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    el.removeAttribute('class');
  });

  container.appendChild(clone);

  // Get all elements in both original and clone
  const originalElements = Array.from(element.querySelectorAll('*'));
  originalElements.unshift(element); // Add root element

  const clonedElements = Array.from(clone.querySelectorAll('*'));
  clonedElements.unshift(clone); // Add root clone

  // Map through both and copy computed styles
  originalElements.forEach((originalEl, index) => {
    const clonedEl = clonedElements[index];
    if (!clonedEl) return;

    const styles = window.getComputedStyle(originalEl);

    // Copy ALL computed styles as inline styles
    const cssText = Array.from(styles).map(prop => {
      let value = styles.getPropertyValue(prop);

      // Replace oklch colors with fallbacks
      if (value && value.includes('oklch')) {
        if (prop.includes('color') && !prop.includes('background')) {
          value = 'rgb(0, 0, 0)'; // black for text
        } else if (prop.includes('background')) {
          value = 'rgb(255, 255, 255)'; // white for background
        } else if (prop.includes('border')) {
          value = 'rgb(204, 204, 204)'; // gray for borders
        } else {
          return ''; // Skip other oklch values
        }
      }

      return value ? `${prop}: ${value};` : '';
    }).filter(Boolean).join(' ');

    clonedEl.setAttribute('style', cssText);
  });

  return { clone, container };
};

/**
 * Export resume to PDF
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {string} filename - The name of the PDF file
 * @param {Object} options - Additional options for PDF generation
 */
export const exportToPDF = async (element, filename = 'resume.pdf', options = {}) => {
  let tempContainer = null;

  try {
    if (!element) {
      throw new Error('No element provided for PDF export');
    }

    // Prepare element (fixes CSS issues)
    const { clone, container } = prepareElementForPDF(element);
    tempContainer = container;

    // Wait a bit for styles to be applied
    await new Promise(resolve => setTimeout(resolve, 100));

    // Default options for high-quality PDF
    const defaultOptions = {
      margin: 0,
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    };

    // Merge with custom options
    const pdfOptions = { ...defaultOptions, ...options };

    // Generate PDF from the fixed clone
    await html2pdf()
      .set(pdfOptions)
      .from(clone)
      .save();

    // Clean up temp container
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }

    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('PDF export error:', error);

    // Clean up temp container on error
    if (tempContainer && tempContainer.parentNode) {
      try {
        tempContainer.parentNode.removeChild(tempContainer);
      } catch (cleanupError) {
        console.error('Error cleaning up temp container:', cleanupError);
      }
    }

    return { success: false, error: error.message };
  }
};

/**
 * Generate PDF blob for preview or upload
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {Object} options - Additional options for PDF generation
 */
export const generatePDFBlob = async (element, options = {}) => {
  try {
    if (!element) {
      throw new Error('No element provided for PDF generation');
    }

    const defaultOptions = {
      margin: 0,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      }
    };

    const pdfOptions = { ...defaultOptions, ...options };

    // Generate PDF as blob
    const pdfBlob = await html2pdf()
      .set(pdfOptions)
      .from(element)
      .outputPdf('blob');

    return { success: true, blob: pdfBlob };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Open PDF in new tab for preview
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {Object} options - Additional options for PDF generation
 */
export const previewPDF = async (element, options = {}) => {
  try {
    if (!element) {
      throw new Error('No element provided for PDF preview');
    }

    const defaultOptions = {
      margin: 0,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    const pdfOptions = { ...defaultOptions, ...options };

    // Generate PDF and open in new tab
    const pdf = await html2pdf()
      .set(pdfOptions)
      .from(element)
      .toPdf()
      .get('pdf');

    // Open in new window
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');

    return { success: true, message: 'PDF preview opened' };
  } catch (error) {
    console.error('PDF preview error:', error);
    return { success: false, error: error.message };
  }
};
