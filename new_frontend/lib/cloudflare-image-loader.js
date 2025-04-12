// Cloudflare Image Loader for Next.js
export default function cloudflareImageLoader({ src, width, quality }) {
  // For relative URLs, prepend the base URL
  const url = src.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_BASE_URL || ''}${src}`
    : src;
  
  // Set default quality if not provided
  const imageQuality = quality || 75;
  
  // Return the Cloudflare optimized image URL
  // This works with Cloudflare's image resizing service
  return `${url}?width=${width}&quality=${imageQuality}&format=auto`;
}
