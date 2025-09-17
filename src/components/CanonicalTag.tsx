import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CanonicalTagProps {
  path?: string;
}

const CanonicalTag: React.FC<CanonicalTagProps> = ({ path }) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://www.salamatlab.com';
    const canonicalPath = path || location.pathname;
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    // Remove existing canonical tag if any
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical tag
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    document.head.appendChild(canonicalLink);

    // Cleanup function
    return () => {
      if (canonicalLink.parentNode) {
        canonicalLink.parentNode.removeChild(canonicalLink);
      }
    };
  }, [location.pathname, path]);

  return null;
};

export default CanonicalTag;
