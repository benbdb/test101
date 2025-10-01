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

export async function getPresignedUpload(filename) {
  const formData = new FormData();
  formData.append('filename', filename);
  
  console.log('Sending filename:', filename);
  console.log('FormData entries:', Array.from(formData.entries()));
  
  const res = await fetch('/upload-video', { 
    method: 'POST',
    credentials: 'include',
    body: formData
  });
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

export async function transcodeVideo(videoId) {
  const res = await fetch(`/transcode?videoId=${encodeURIComponent(videoId)}`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to transcode video');
  return res.json();
}

export async function listVideos() {
  const res = await fetch('/list-videos', {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to get video list');
  return res.json();
}


