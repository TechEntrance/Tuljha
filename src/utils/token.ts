// Utility functions for token handling
export const encode = (data: string): string => {
  // Use URL-safe base64 encoding
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decode = (token: string): string => {
  // Restore base64 padding
  token = token.replace(/-/g, '+').replace(/_/g, '/');
  const pad = token.length % 4;
  if (pad) {
    token += '='.repeat(4 - pad);
  }
  return atob(token);
};