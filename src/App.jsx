import { useState, useRef, useEffect } from 'react'
import { searchTracks } from './api/musicApi'

function HeartIcon({ filled = false }) {
  const pathD = "M12 20.75l-1.35-1.23C5.8 15.41 3 12.78 3 9.3c0-2.54 2.02-4.55 4.5-4.55 1.67 0 3.29.92 4.15 2.24h1.7c.86-1.32 2.48-2.24 4.15-2.24C20.48 4.75 22.5 6.76 22.5 9.3c0 3.48-2.8 6.11-7.65 10.22L12 20.75z"
  if (filled) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path d={pathD} fill="#1DB954" />
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={pathD}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 15a4 4 0 0 1-4 4H9l-4 3v-3H5a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function App() {
  const [musicShorts, setMusicShorts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [highlightStart, setHighlightStart] = useState(0)
  const [highlightEnd, setHighlightEnd] = useState(15)
  const [creatorComment, setCreatorComment] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCommentPopup, setShowCommentPopup] = useState(false)
  const [comment, setComment] = useState('')
  const [commentHighlightStart, setCommentHighlightStart] = useState(0)
  const [commentHighlightEnd, setCommentHighlightEnd] = useState(15)
  const [previewPlayingTrackId, setPreviewPlayingTrackId] = useState(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

  const audioRef = useRef(null)
  const previewAudioRef = useRef(null)
  const commentPlaybackRef = useRef({ timer: null, cleanup: null, isPlayingComment: false, commentEnd: null })
  const currentShort = musicShorts[currentIndex]

  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        // Search for Radwimps - Sparkle
        const sparkleResults = await searchTracks('Radwimps Sparkle')
        if (sparkleResults && sparkleResults.length > 0) {
          const sparkleTrack = sparkleResults.find(t => t.name.toLowerCase().includes('sparkle')) || sparkleResults[0]
          
          const defaultShorts = [
            {
              id: 1,
              track: sparkleTrack,
              highlightStart: 0,
              highlightEnd: 15,
              comment: 'Such a beautiful melody... This part makes my heart race 💫',
              likes: 1247,
              liked: false,
              comments: [
                {
                  id: 101,
                  text: 'I tear up every time I listen to this song 😭 So emotional',
                  highlightStart: 5,
                  highlightEnd: 15,
                  timestamp: new Date(Date.now() - 86400000).toISOString(),
                  likes: 89,
                  liked: false
                },
                {
                  id: 102,
                  text: 'This section is absolutely amazing! The piano melody is incredible 👍',
                  highlightStart: 0,
                  highlightEnd: 12,
                  timestamp: new Date(Date.now() - 172800000).toISOString(),
                  likes: 156,
                  liked: false
                },
                {
                  id: 103,
                  text: 'I actually cried when this scene came out in the movie... This song fits perfectly',
                  highlightStart: 8,
                  highlightEnd: 18,
                  timestamp: new Date(Date.now() - 259200000).toISOString(),
                  likes: 234,
                  liked: false
                },
                {
                  id: 104,
                  text: 'This song gets better and better over time! A timeless masterpiece 🎵',
                  highlightStart: 2,
                  highlightEnd: 15,
                  timestamp: new Date(Date.now() - 345600000).toISOString(),
                  likes: 312,
                  liked: false
                }
              ]
            }
          ]

          // Fetch and add additional popular songs
          const popularSongs = [
            { query: 'YOASOBI racing into the night', start: 10, end: 25, comment: 'The bass in this song is incredible! The dreamy atmosphere is overwhelming 🎸', likes: 2156, comments: [
              { text: 'I was so surprised when I first heard this song!', start: 12, end: 22, likes: 423, liked: false },
              { text: 'The bass line is absolutely insane', start: 15, end: 28, likes: 567, liked: false }
            ]},
            { query: 'BTS Dynamite', start: 5, end: 20, comment: 'Bright and cheerful vibes! This song instantly lifts my mood 🎉', likes: 3421, comments: [
              { text: 'This song is so danceable!', start: 8, end: 18, likes: 789, liked: false },
              { text: 'The opening is so good', start: 5, end: 15, likes: 634, liked: false },
              { text: 'Perfect for working out!', start: 10, end: 25, likes: 892, liked: false }
            ]},
            { query: 'Ed Sheeran Shape of You', start: 15, end: 30, comment: 'The melody in this section is so addictive! Can\'t stop listening 🎵', likes: 1890, comments: [
              { text: 'This song is a true classic', start: 18, end: 28, likes: 445, liked: false },
              { text: 'Ed Sheeran\'s voice is amazing', start: 15, end: 25, likes: 321, liked: false }
            ]},
            { query: 'Post Malone Circles', start: 0, end: 15, comment: 'I love the dreamy atmosphere of this song... Perfect for relaxing 🌙', likes: 1678, comments: [
              { text: 'This song helps me fall asleep', start: 3, end: 13, likes: 234, liked: false },
              { text: 'One of Post Malone\'s best songs!', start: 5, end: 15, likes: 567, liked: false },
              { text: 'This section is so good', start: 8, end: 18, likes: 412, liked: false }
            ]},
            { query: 'Taylor Swift Anti Hero', start: 20, end: 35, comment: 'Taylor Swift\'s honest lyrics are so impressive. This part is especially great! ✨', likes: 2987, comments: [
              { text: 'The lyrics are so relatable', start: 22, end: 32, likes: 678, liked: false },
              { text: 'This song is absolutely amazing', start: 25, end: 35, likes: 890, liked: false },
              { text: 'Taylor Swift is a genius', start: 20, end: 30, likes: 1234, liked: false },
              { text: 'This part is so moving', start: 23, end: 33, likes: 567, liked: false }
            ]}
          ]

          for (const song of popularSongs) {
            const results = await searchTracks(song.query)
            if (results && results.length > 0) {
              const track = results[0]
              const comments = song.comments.map((c, idx) => ({
                id: Date.now() + idx + 1000,
                text: c.text,
                highlightStart: c.start,
                highlightEnd: c.end,
                timestamp: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
                likes: c.likes || 0,
                liked: c.liked || false
              }))
              
              defaultShorts.push({
                id: defaultShorts.length + 1,
                track: track,
                highlightStart: song.start,
                highlightEnd: song.end,
                comment: song.comment,
                likes: song.likes,
                liked: false,
                comments: comments
              })
            }
          }

          setMusicShorts(defaultShorts)
          localStorage.setItem('musicShorts', JSON.stringify(defaultShorts))
        }
      } catch (error) {
        console.error('Failed to load default data:', error)
      }
    }

    const saved = localStorage.getItem('musicShorts')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        const migratedData = parsedData.map(short => ({
          ...short,
          id: short.id || Date.now() + Math.random(),
          liked: short.liked === true,
          likes: short.likes || 0,
          comments: (short.comments || []).map(comment => ({
            ...comment,
            likes: comment.likes || 0,
            liked: comment.liked === true
          }))
        }))
        console.log('Loaded from localStorage:', migratedData)
        console.log('Like states:', migratedData.map(s => ({ id: s.id, liked: s.liked })))
        setMusicShorts(migratedData)
      } catch (error) {
        console.error('Failed to parse saved data:', error)
        localStorage.removeItem('musicShorts')
        // Load default sample data
        loadDefaultData()
      }
    } else {
      // Load default sample data
      loadDefaultData()
    }
  }, [])

  // Persist musicShorts to localStorage whenever the state changes
  useEffect(() => {
    if (musicShorts.length > 0) {
      localStorage.setItem('musicShorts', JSON.stringify(musicShorts))
    }
  }, [musicShorts])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (commentPlaybackRef.current.isPlayingComment) {
        if (commentPlaybackRef.current.commentEnd && audio.currentTime >= commentPlaybackRef.current.commentEnd) {
          audio.pause()
          setIsPlaying(false)
          commentPlaybackRef.current.isPlayingComment = false
          commentPlaybackRef.current.commentEnd = null
        }
        return
      }
      
      if (currentShort && audio.currentTime >= currentShort.highlightEnd) {
        audio.pause()
        audio.currentTime = currentShort.highlightStart
        setIsPlaying(false)
      }
    }

    const handleEnded = () => {
      if (commentPlaybackRef.current.isPlayingComment) {
        commentPlaybackRef.current.isPlayingComment = false
        commentPlaybackRef.current.commentEnd = null
      }
      
      setIsPlaying(false)
      if (currentShort) {
        audio.currentTime = currentShort.highlightStart
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentShort])

  useEffect(() => {
    if (!audioRef.current || !currentShort) return
    
    audioRef.current.pause()
    setIsPlaying(false)
    
    if (currentShort.track.preview_url) {
      audioRef.current.src = currentShort.track.preview_url
      audioRef.current.currentTime = currentShort.highlightStart
    }
  }, [currentIndex, currentShort])

  const closeModal = () => {
    // Stop preview playback
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.src = ''
      setIsPreviewPlaying(false)
      setPreviewPlayingTrackId(null)
    }
    setShowAddModal(false)
    setSearchQuery('')
    setSearchResults([])
    setSelectedTrack(null)
    setCreatorComment('')
    setHighlightStart(0)
    setHighlightEnd(15)
    setHasSearched(false)
    setSearchError(null)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchError(null)
    setHasSearched(true)
    try {
      const results = await searchTracks(searchQuery)
      setSearchResults(results)
      setSearchError(null)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
      setSearchError('Search failed. Check your internet connection or try again shortly.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectTrack = (track) => {
    setSelectedTrack(track)
    setHighlightStart(0)
    setHighlightEnd(15)
  }

  const handleAddShort = () => {
    if (!selectedTrack || !creatorComment.trim()) {
      alert('Please select a song and add a comment.')
      return
    }

    if (!selectedTrack.preview_url) {
      alert('This song does not have a preview. Please choose another track.')
      return
    }

    // Validate highlight length (10-30 seconds)
    const duration = highlightEnd - highlightStart;
    if (duration < 10 || duration > 30) {
      alert('Highlights must be between 10 and 30 seconds.')
      return
    }

    const newShort = {
      id: Date.now(),
      track: selectedTrack,
      highlightStart,
      highlightEnd,
      comment: creatorComment,
      likes: 0,
      liked: false,
      comments: []
    }

    setMusicShorts(prevShorts => {
      const updatedShorts = [...prevShorts, newShort]
      return updatedShorts
    })
    closeModal()
  }

  const handleNext = () => {
    if (currentIndex < musicShorts.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const toggleLike = () => {
    if (!currentShort) {
      console.error('currentShort is missing!')
      return
    }
    
    setMusicShorts(prevShorts => {
      const updatedShorts = prevShorts.map(short => {
        if (short.id === currentShort.id) {
          const newLikedState = !short.liked
          const newLikes = newLikedState ? (short.likes + 1) : Math.max(0, short.likes - 1)
          return { 
            ...short, 
            liked: newLikedState,
            likes: newLikes
          }
        }
        return short
      })
      return updatedShorts
    })
  }

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !currentShort || !currentShort.track.preview_url) {
      alert('This song cannot be played.')
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      // Jump to the start of the user-defined highlight range
      audio.currentTime = currentShort.highlightStart
      audio.play().catch(err => {
        console.error('Playback error:', err)
        alert('Playback failed.')
      })
      setIsPlaying(true)
    }
  }

  const closeCommentPopup = () => {
    // Stop any comment highlight playback
    const audio = audioRef.current
    if (commentPlaybackRef.current.cleanup) {
      commentPlaybackRef.current.cleanup({ shouldPause: true })
    } else if (audio && !audio.paused && commentPlaybackRef.current.isPlayingComment) {
      audio.pause()
      setIsPlaying(false)
      commentPlaybackRef.current.isPlayingComment = false
      commentPlaybackRef.current.commentEnd = null
    }
    setShowCommentPopup(false)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    // Validate comment highlight length (10-30 seconds)
    const commentDuration = commentHighlightEnd - commentHighlightStart;
    if (commentDuration < 10 || commentDuration > 30) {
      alert('Comment highlights must be between 10 and 30 seconds.');
      return;
    }

    const newComment = {
      id: Date.now(),
      text: comment,
      highlightStart: Math.min(Math.max(commentHighlightStart, 0), 30),
      highlightEnd: Math.min(Math.max(commentHighlightEnd, commentHighlightStart + 1), 30),
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false
    }

    setMusicShorts(prevShorts => {
      const updatedShorts = prevShorts.map((short, index) => {
        if (index === currentIndex) {
          return {
            ...short,
            comments: [...short.comments, newComment]
          }
        }
        return short
      })
      return updatedShorts
    })
    
    setComment('')
    setCommentHighlightStart(0)
    setCommentHighlightEnd(15)
    closeCommentPopup()
  }

  const handleCommentClick = (commentData) => {
    const audio = audioRef.current
    if (!audio || !currentShort?.track.preview_url) return

    // Stop any existing playback (either main track or previous comment highlight)
    if (commentPlaybackRef.current.cleanup) {
      commentPlaybackRef.current.cleanup({ shouldPause: false })
    } else if (audio && !audio.paused) {
      // If main track is playing, pause it
      audio.pause()
      setIsPlaying(false)
    }

    commentPlaybackRef.current.isPlayingComment = true
    commentPlaybackRef.current.commentEnd = commentData.highlightEnd
    
    audio.currentTime = commentData.highlightStart
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error('Playback error:', err)
        setIsPlaying(false)
      })

    const stopPlayback = ({ shouldPause = false } = {}) => {
      if (shouldPause && !audio.paused) {
        try {
          audio.pause()
        } catch (error) {
          console.error('Pause error:', error)
        }
      }
      setIsPlaying(false)
      commentPlaybackRef.current.isPlayingComment = false
      commentPlaybackRef.current.commentEnd = null
      
      if (commentPlaybackRef.current.timer) {
        clearInterval(commentPlaybackRef.current.timer)
        commentPlaybackRef.current.timer = null
      }
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePaused)
      commentPlaybackRef.current.cleanup = null
    }

    const handleEnded = () => stopPlayback({ shouldPause: false })
    const handlePaused = () => stopPlayback({ shouldPause: false })

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePaused)

    commentPlaybackRef.current.cleanup = (options = {}) => {
      const normalized = typeof options === 'boolean' ? { shouldPause: options } : options
      stopPlayback({ shouldPause: normalized.shouldPause !== false })
    }
  }

  return (
    <div className="app-container">
      <audio ref={audioRef} />
      
      <button className="add-button" onClick={() => setShowAddModal(true)}>
        +
      </button>

      {musicShorts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h2>No music shorts yet</h2>
          <p>Tap the + button to create your first music short!</p>
        </div>
      ) : (
        <div className="player-card">
          <div 
            className="nav-touch-area left"
            onClick={handlePrevious}
          />
          <div 
            className="nav-touch-area right"
            onClick={handleNext}
          />

          <div 
            className={`cover-container ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="cover-front">
              <div className="cover-image">
                {currentShort.track.album.images[0] ? (
                  <img src={currentShort.track.album.images[0].url} alt={currentShort.track.name} />
                ) : (
                  <div className="placeholder-icon">🎵</div>
                )}
              </div>
            </div>
            <div className="cover-back">
              <div className="creator-comment">
                <p>"{currentShort.comment}"</p>
                <button className="full-track-btn" onClick={(e) => {
                  e.stopPropagation()
                  if (currentShort.track.external_urls?.spotify) {
                    window.open(currentShort.track.external_urls.spotify, '_blank')
                  }
                }}>
                  Listen to full track
                </button>
              </div>
            </div>
          </div>

          <h1 className="song-title">{currentShort.track.name}</h1>
          <p className="artist-name">{currentShort.track.artists[0].name}</p>

          <div className="controls-row">
            <button 
              className="icon-button like-button"
              onClick={toggleLike}
            >
              <span>
                <HeartIcon filled={currentShort.liked} />
              </span>
              <span className="like-count">{currentShort.likes || 0}</span>
            </button>

            <div className="progress-container">
              <div className="progress-bar">
                {(() => {
                  const totalDuration = currentShort.track.duration_ms / 1000; // convert to seconds
                  const startPercent = (currentShort.highlightStart / totalDuration) * 100;
                  const widthPercent = ((currentShort.highlightEnd - currentShort.highlightStart) / totalDuration) * 100;
                  return (
                    <div 
                      className="progress-highlight"
                      style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />
                  );
                })()}
              </div>
              <div className="progress-time">
                {currentShort.highlightStart}s - {currentShort.highlightEnd}s
              </div>
            </div>

            <button 
              className="icon-button comment-button"
              onClick={() => {
                // Initialize comment highlight within 0-30 second range
                setCommentHighlightStart(0)
                setCommentHighlightEnd(15)
                setShowCommentPopup(true)
              }}
            >
              <span>
                <CommentIcon />
              </span>
              <span className="comment-count">{currentShort.comments?.length || 0}</span>
            </button>
          </div>

          <div className="play-controls">
            <button 
              className="side-arrow"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 12l8 5V7l-8 5Z" fill="#FFFFFF"/>
                <path d="M5 7v10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>

            <button 
              className={`play-button ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            />

            <button 
              className="side-arrow"
              onClick={handleNext}
              disabled={currentIndex === musicShorts.length - 1}
              aria-label="Next"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 12L5 7v10l8-5Z" fill="#FFFFFF"/>
                <path d="M19 17V7" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {showCommentPopup && (
        <div className="popup-overlay" onClick={closeCommentPopup}>
          <div className="comment-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Leave a Comment</h3>
            
            {currentShort?.comments && currentShort.comments.length > 0 && (
              <div className="comments-list">
                <h4>Other highlights ({currentShort.comments.length})</h4>
                {currentShort.comments.map((c) => (
                  <div 
                    key={c.id} 
                    className="comment-item"
                  >
                    <div 
                      className="comment-content"
                      onClick={() => handleCommentClick(c)}
                    >
                      <div className="comment-highlight-badge">
                        {c.highlightStart}s - {c.highlightEnd}s
                      </div>
                      <div className="comment-text">{c.text}</div>
                    </div>
                    <button 
                      className="comment-like-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMusicShorts(prevShorts => {
                          return prevShorts.map(short => {
                            if (short.id === currentShort.id) {
                              return {
                                ...short,
                                comments: short.comments.map(comment => {
                                  if (comment.id === c.id) {
                                    const newLikedState = !comment.liked;
                                    const newLikes = newLikedState ? (comment.likes + 1) : Math.max(0, comment.likes - 1);
                                    return {
                                      ...comment,
                                      liked: newLikedState,
                                      likes: newLikes
                                    };
                                  }
                                  return comment;
                                })
                              };
                            }
                            return short;
                          });
                        });
                      }}
                    >
                      <span>
                        <HeartIcon filled={c.liked} />
                      </span>
                      <span className="comment-like-count">{c.likes || 0}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCommentSubmit}>
              <div className="comment-highlight-section">
                <h4>Select highlight range</h4>
                <div className="time-slider">
                  <label>
                    Start: {commentHighlightStart}s
                    <input
                      type="range"
                      min="0"
                      max="29"
                      value={commentHighlightStart}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setCommentHighlightStart(val)
                        if (commentHighlightEnd - val > 30) {
                          setCommentHighlightEnd(Math.min(val + 30, 30))
                        } else if (commentHighlightEnd - val < 10) {
                          setCommentHighlightEnd(Math.min(val + 10, 30))
                        }
                      }}
                    />
                  </label>
                  <label>
                    End: {commentHighlightEnd}s
                    <input
                      type="range"
                      min={Math.max(commentHighlightStart + 10, 10)}
                      max={Math.min(commentHighlightStart + 30, 30)}
                      value={commentHighlightEnd}
                      onChange={(e) => setCommentHighlightEnd(parseInt(e.target.value))}
                    />
                  </label>
                  <div className="duration-info">
                    Comment highlight length: {commentHighlightEnd - commentHighlightStart}s (10-30s)
                  </div>
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this highlight..."
                rows="4"
              />
              <div className="popup-buttons">
                <button type="button" onClick={closeCommentPopup}>
                  Cancel
                </button>
                <button type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="popup-overlay" onClick={closeModal}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create music short</h2>
            
            {!selectedTrack ? (
              <>
                <div className="search-section">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by song title or artist..."
                    className="search-input"
                  />
                  <button 
                    onClick={handleSearch} 
                    className="search-btn"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searchError && (
                  <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <p>{searchError}</p>
                  </div>
                )}

                <div className="search-results">
                  {searchResults.length === 0 ? (
                    <div className="empty-search-state">
                      <div className="empty-icon">{hasSearched ? '😢' : '🔍'}</div>
                      <p>
                        {hasSearched 
                          ? 'No results found. Try a different search term!' 
                          : 'Enter a query and press the search button.'}
                      </p>
                    </div>
                  ) : (
                    searchResults.map((track) => (
                      <div 
                        key={track.id} 
                        className="track-item"
                        onClick={() => handleSelectTrack(track)}
                      >
                        <img src={track.album.images[2]?.url || track.album.images[0]?.url} alt={track.name} />
                        <div className="track-info">
                          <div className="track-name">{track.name}</div>
                          <div className="track-artist">{track.artists[0].name}</div>
                          {!track.preview_url && (
                            <div className="no-preview">⚠️ Preview unavailable</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="selected-track">
                  <img src={selectedTrack.album.images[1]?.url || selectedTrack.album.images[0]?.url} alt={selectedTrack.name} />
                  <div>
                    <h3>{selectedTrack.name}</h3>
                    <p>{selectedTrack.artists[0].name}</p>
                  </div>
                  <button onClick={() => setSelectedTrack(null)} className="change-track-btn">
                    Change
                  </button>
                </div>

                <div className="highlight-section">
                  <h3>Select highlight range (10-30s)</h3>
                  <div className="time-slider">
                    <label>
                      Start: {highlightStart}s
                      <input
                        type="range"
                        min="0"
                        max={selectedTrack.duration_ms ? Math.min(selectedTrack.duration_ms / 1000 - 30, 20) : 20}
                        value={highlightStart}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          setHighlightStart(val)
                          if (highlightEnd - val > 30) {
                            setHighlightEnd(val + 30)
                          } else if (highlightEnd - val < 10) {
                            setHighlightEnd(Math.min(val + 10, selectedTrack.duration_ms ? selectedTrack.duration_ms / 1000 : 30))
                          }
                        }}
                      />
                    </label>
                    <label>
                      End: {highlightEnd}s
                      <input
                        type="range"
                        min={Math.min(highlightStart + 10, selectedTrack.duration_ms ? selectedTrack.duration_ms / 1000 : 30)}
                        max={Math.min(highlightStart + 30, selectedTrack.duration_ms ? selectedTrack.duration_ms / 1000 : 30)}
                        value={highlightEnd}
                        onChange={(e) => setHighlightEnd(parseInt(e.target.value))}
                      />
                    </label>
                    <div className="duration-info">
                      Highlight length: {highlightEnd - highlightStart}s (10-30s)
                    </div>
                  </div>
                </div>

                <div className="comment-section">
                  <h3>Write a comment</h3>
                  <textarea
                    value={creatorComment}
                    onChange={(e) => setCreatorComment(e.target.value)}
                    placeholder="Share your thoughts about this song's highlight..."
                    rows="3"
                    className="comment-textarea"
                  />
                </div>

                <div className="popup-buttons">
                  <button type="button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button onClick={handleAddShort} className="add-short-btn">
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
