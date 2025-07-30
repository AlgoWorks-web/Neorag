import React, { useEffect, useState } from 'react';

function VideoLectures({ courseId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    async function fetchMaterials() {
      if (!courseId) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`https://hydersoft.com/api/trainer/courses/${courseId}/videos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // Since it's a private route, token is required
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 403) {
            throw new Error(errorData.error || 'You are not enrolled in this course.');
          } else {
            throw new Error(errorData.error || `Failed to fetch videos`);
          }
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setVideos(data.data);
        } else {
          console.warn('Unexpected response structure:', data);
          setVideos([]);
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, [courseId]);

  if (loading) return <div>Loading videos...</div>;
  
  if (error) {
    return (
      <div style={{ 
        color: 'red', 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        borderRadius: '5px',
        margin: '20px'
      }}>
        <h3>Access Denied</h3>
        <p>{error}</p>
        {error.includes('not enrolled') && (
          <button 
            style={{
              background: '#3182ce',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
            onClick={() => window.location.href = '/courses/' + courseId}
          >
            Purchase Course
          </button>
        )}
      </div>
    );
  }
  
  if (!videos.length) return <div>No video lectures available for this course.</div>;

  return (
    <div style={{ maxWidth: 650, margin: '30px auto' }}>
      <h2>Video Lectures</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {videos.map(video => {
          const videoUrl = video.video_path 
            ? `https://hydersoft.com/storage/${video.video_path}`
            : video.video_url || video.url;

          return (
            <li
              key={video.video_id || video.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                padding: '16px 0'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{video.title}</div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {video.description && <div>{video.description}</div>}
                  <div>Sequence: {video.sequence}</div>
                </div>
              </div>

              {videoUrl && (
                <>
                  <button
                    style={{
                      background: '#8e44ad',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 14px',
                      cursor: 'pointer',
                      marginRight: 6
                    }}
                    onClick={() => setPlaying({ url: videoUrl, title: video.title })}
                  >
                    ▶️ Play
                  </button>
                  <a
                    href={videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#2980B9',
                      textDecoration: 'none',
                      marginLeft: 8,
                      padding: '8px 12px',
                      border: '1px solid #2980B9',
                      borderRadius: 5,
                      fontWeight: 500
                    }}
                  >
                    Download
                  </a>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {playing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 16,
              minWidth: 320,
              maxWidth: 600,
              width: '95vw'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <b>{playing.title}</b>
              <button
                style={{
                  fontSize: 24,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#222'
                }}
                onClick={() => setPlaying(null)}
              >
                ×
              </button>
            </div>
            <video
              src={playing.url}
              controls
              autoPlay
              style={{ width: '100%', borderRadius: 6 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLectures;
