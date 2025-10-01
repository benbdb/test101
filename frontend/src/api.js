export async function fetchMe() {
  const res = await fetch('/me', { credentials: 'include' });
  return res.json();
}

export function login() {
  window.location.href = '/login';
}

export function logout() {
  window.location.href = '/logout';
}

export async function getPresignedUpload() {
  const res = await fetch('/upload-video', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to get presigned upload URL');
  return res.json();
}

export async function uploadToS3(presignedPost, file) {
  const formData = new FormData();
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);
  const res = await fetch(presignedPost.url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('S3 upload failed');
}

export async function getDownloadUrl(videoId) {
  const res = await fetch('/download-video', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to get download URL');
  return res.json();
}


