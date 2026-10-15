import React, { useEffect, useMemo, useRef, useState } from 'react';

const CURRENT_USER = {
  id: 'me', name: 'Dharani Vasan', handle: '@dharani.codes', initials: 'DV',
  bio: 'Building things, learning loudly, and collecting tiny wins. ✨',
  location: 'Tamil Nadu, India', color: 'lavender', joined: 'Joined August 2024'
};

const USERS = [
  CURRENT_USER,
  { id: 'maya', name: 'Maya Krishnan', handle: '@mayamakes', initials: 'MK', color: 'peach', bio: 'Designing little things for the internet.', location: 'Chennai, India', joined: 'Joined March 2022' },
  { id: 'arjun', name: 'Arjun Rao', handle: '@arjunbuilds', initials: 'AR', color: 'mint', bio: 'Software engineer. Coffee-powered problem solver.', location: 'Bengaluru, India', joined: 'Joined June 2021' },
  { id: 'nisha', name: 'Nisha S', handle: '@nishathinks', initials: 'NS', color: 'blue', bio: 'Tech, books, and everything in between.', location: 'Coimbatore, India', joined: 'Joined January 2023' },
  { id: 'kavin', name: 'Kavin Kumar', handle: '@kavin.codes', initials: 'KK', color: 'yellow', bio: 'Learning in public, one commit at a time.', location: 'Madurai, India', joined: 'Joined October 2022' },
  { id: 'tech', name: 'The Build Log', handle: '@thebuildlog', initials: 'BL', color: 'rose', bio: 'Ideas, tools, and stories from people who build.', location: 'Internet', joined: 'Joined May 2020' },
  { id: 'sara', name: 'Sara John', handle: '@sarajohn', initials: 'SJ', color: 'mint', bio: 'Product thinking and user-first design.', location: 'Hyderabad, India', joined: 'Joined April 2021' },
];

const initialPosts = [
  {
    id: 'p1', userId: 'maya', text: 'A good interface should feel obvious after you use it, not before. Been thinking about that all morning while redesigning my portfolio.',
    createdAt: Date.now() - 1000 * 60 * 14, likes: 128, reposts: 19, replies: 8, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: '',
    comments: [
      { id: 'c1', userId: 'arjun', text: 'That is such a useful way to put it. The hard part is making the obvious feel effortless.', createdAt: Date.now() - 1000 * 60 * 9 },
      { id: 'c2', userId: 'nisha', text: 'Saving this thought for my next project ✍️', createdAt: Date.now() - 1000 * 60 * 4 },
    ]
  },
  {
    id: 'p2', userId: 'arjun', text: 'Tiny system design lesson: queues help you handle work later. Your user does not have to wait while every downstream task finishes. Decouple the request, return quickly, process reliably.',
    createdAt: Date.now() - 1000 * 60 * 47, likes: 246, reposts: 62, replies: 17, likedByMe: true, repostedByMe: false, bookmarkedByMe: true, image: '',
    comments: [{ id: 'c3', userId: 'kavin', text: 'Kafka finally makes sense when you explain it like this.', createdAt: Date.now() - 1000 * 60 * 32 }]
  },
  {
    id: 'p3', userId: 'nisha', text: 'Weekend plan: clean up my GitHub, finish one small project, and finally write the README I have been avoiding for two weeks. Progress over perfection. 🌱',
    createdAt: Date.now() - 1000 * 60 * 93, likes: 73, reposts: 11, replies: 5, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=80',
    comments: []
  },
  {
    id: 'p4', userId: 'tech', text: 'A practical checklist before shipping a feature:\n• Does the empty state make sense?\n• What happens when the network fails?\n• Can the user undo an action?\n• Does it work on a small screen?\nThe tiny details are the product.',
    createdAt: Date.now() - 1000 * 60 * 181, likes: 512, reposts: 180, replies: 34, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: '',
    comments: []
  },
  {
    id: 'p5', userId: 'kavin', text: 'Finally understood the difference between authentication and authorization. Authentication asks “who are you?” Authorization asks “what are you allowed to do?” Writing it here so future-me remembers 😅',
    createdAt: Date.now() - 1000 * 60 * 280, likes: 91, reposts: 7, replies: 12, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: '',
    comments: []
  },
  {
    id: 'p6', userId: 'sara', text: 'Friendly reminder: your first version is allowed to be small. Solve one real problem for one real person. Then learn, refine, and repeat.',
    createdAt: Date.now() - 1000 * 60 * 460, likes: 339, reposts: 94, replies: 21, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80',
    comments: []
  },
];

const initialNotifications = [
  { id: 'n1', type: 'like', from: 'maya', postId: 'p2', text: 'liked your post', createdAt: Date.now() - 1000 * 60 * 18, read: false },
  { id: 'n2', type: 'follow', from: 'sara', text: 'followed you', createdAt: Date.now() - 1000 * 60 * 60 * 3, read: true },
  { id: 'n3', type: 'reply', from: 'arjun', postId: 'p1', text: 'replied to a conversation you follow', createdAt: Date.now() - 1000 * 60 * 60 * 7, read: true },
];

const STORAGE_KEY = 'chirp-demo-state-v1';
const starterState = () => ({
  posts: JSON.parse(JSON.stringify(initialPosts)),
  following: ['maya', 'arjun', 'nisha', 'tech'],
  notifications: JSON.parse(JSON.stringify(initialNotifications)),
  messages: [
    { id: 'm1', userId: 'maya', messages: [ { id: 'mm1', from: 'maya', text: 'Hey! Loved your latest project update.', time: Date.now() - 1000 * 60 * 60 * 2 }, { id: 'mm2', from: 'me', text: 'Thank you! Still polishing a few things 😊', time: Date.now() - 1000 * 60 * 55 } ] },
    { id: 'm2', userId: 'kavin', messages: [ { id: 'mm3', from: 'kavin', text: 'Do you have a good resource for system design basics?', time: Date.now() - 1000 * 60 * 60 * 26 } ] },
  ],
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.posts) && Array.isArray(parsed.following)) return parsed;
    }
  } catch (e) { console.warn('Could not read demo state:', e); }
  return starterState();
}

function Icon({ name, size = 20, fill = 'none', strokeWidth = 1.9 }) {
  const common = { fill, stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.5 4.5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    bookmark: <><path d="M6 4h12v17l-6-4-6 4z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    smile: <><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 3 4 3 4-3 4-3M9 9h.01M15 9h.01"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></>,
    heart: <path d="M20.8 8.6c0 4.2-8.8 10-8.8 10S3.2 12.8 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z"/>,
    repeat: <><path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2.9-1.2 2-1.5-.6a8 8 0 0 1-1.5.9l-.3 1.6h-2.4l-.3-1.6a8 8 0 0 1-1.5-.9l-1.5.6-1.2-2 1.2-.9a8 8 0 0 1 0-1.8l-1.2-.9 1.2-2 1.5.6a8 8 0 0 1 1.5-.9l.3-1.6h2.4l.3 1.6a8 8 0 0 1 1.5.9l1.5-.6 1.2 2-1.2.9a8 8 0 0 1 0 1.8Z" transform="translate(-1 -1) scale(1.08)"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    hash: <><path d="M4 9h16M3 15h16M10 3 8 21M16 3l-2 18"/></>,
    trend: <><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" {...common}>{paths[name] || paths.spark}</svg>;
}

function Avatar({ user, size = 'md', onClick }) {
  if (!user) return null;
  return <button type="button" onClick={onClick} className={`avatar avatar-${size} avatar-${user.color || 'lavender'}`} aria-label={`View ${user.name} profile`} title={user.name}>{user.initials}</button>;
}

function shortCount(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace('.0', '')}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace('.0', '')}K`;
  return String(value || 0);
}

function timeAgo(time) {
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function App() {
  const [data, setData] = useState(loadState);
  const [activePage, setActivePage] = useState('Home');
  const [feedTab, setFeedTab] = useState('For you');
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeImage, setComposeImage] = useState('');
  const [commentPostId, setCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [profileId, setProfileId] = useState('me');
  const [toast, setToast] = useState('');
  const [messageUserId, setMessageUserId] = useState('maya');
  const [messageText, setMessageText] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const fileRef = useRef(null);
  const toastTimer = useRef(null);

  const updateData = (updater) => setData(prev => typeof updater === 'function' ? updater(prev) : updater);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.warn('Could not save demo state:', e); }
  }, [data]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { setComposeOpen(false); setCommentPostId(null); setMobileNavOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };
  const userById = (id) => USERS.find(user => user.id === id) || CURRENT_USER;
  const currentCommentPost = data.posts.find(post => post.id === commentPostId);

  const postsForPage = useMemo(() => {
    let posts = [...data.posts].sort((a, b) => b.createdAt - a.createdAt);
    if (activePage === 'Bookmarks') posts = posts.filter(post => post.bookmarkedByMe);
    else if (activePage === 'Profile') posts = posts.filter(post => post.userId === profileId);
    else if (activePage === 'Home' && feedTab === 'Following') posts = posts.filter(post => data.following.includes(post.userId) || post.userId === 'me');
    if (query.trim()) {
      const q = query.toLowerCase().replace(/^#/, '');
      posts = posts.filter(post => {
        const user = userById(post.userId);
        return `${post.text} ${user.name} ${user.handle}`.toLowerCase().includes(q) || (q && post.text.toLowerCase().includes(`#${q}`));
      });
    }
    return posts;
  }, [data.posts, data.following, activePage, feedTab, query, profileId]);

  const navigate = (page) => {
    setActivePage(page);
    setQuery('');
    setSearchText('');
    setMobileNavOpen(false);
    if (page === 'Notifications') {
      updateData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
    }
  };

  const search = (value = searchText) => {
    setQuery(value.trim());
    setActivePage('Explore');
    setMobileNavOpen(false);
  };

  const createPost = (event) => {
    event?.preventDefault();
    const text = composeText.trim();
    if (!text && !composeImage) { notify('Write something before posting.'); return; }
    const post = { id: `p-${Date.now()}`, userId: 'me', text, createdAt: Date.now(), likes: 0, reposts: 0, replies: 0, likedByMe: false, repostedByMe: false, bookmarkedByMe: false, image: composeImage, comments: [] };
    updateData(prev => ({ ...prev, posts: [post, ...prev.posts] }));
    setComposeText(''); setComposeImage(''); setComposeOpen(false); setActivePage('Home'); setQuery(''); setFeedTab('For you');
    notify('Your post is live!');
  };

  const togglePostFlag = (postId, flag) => {
    const currentPost = data.posts.find(post => post.id === postId);
    if (!currentPost) return;
    const nextValue = !currentPost[flag];
    updateData(prev => ({ ...prev, posts: prev.posts.map(post => {
      if (post.id !== postId) return post;
      if (flag === 'likedByMe') return { ...post, likedByMe: nextValue, likes: Math.max(0, post.likes + (nextValue ? 1 : -1)) };
      if (flag === 'repostedByMe') return { ...post, repostedByMe: nextValue, reposts: Math.max(0, post.reposts + (nextValue ? 1 : -1)) };
      return { ...post, bookmarkedByMe: nextValue };
    }) }));
    if (flag === 'bookmarkedByMe') notify(nextValue ? 'Added to your bookmarks' : 'Removed from bookmarks');
    if (flag === 'repostedByMe') notify(nextValue ? 'Reposted to your profile' : 'Repost removed');
  };

  const addComment = (event) => {
    event?.preventDefault();
    const text = commentText.trim();
    if (!text || !commentPostId) return;
    updateData(prev => ({ ...prev, posts: prev.posts.map(post => post.id === commentPostId ? { ...post, replies: post.replies + 1, comments: [...(post.comments || []), { id: `c-${Date.now()}`, userId: 'me', text, createdAt: Date.now() }] } : post) }));
    setCommentText(''); notify('Reply added');
  };

  const followToggle = (userId) => {
    const alreadyFollowing = data.following.includes(userId);
    const followingNow = !alreadyFollowing;
    updateData(prev => ({ ...prev, following: prev.following.includes(userId) ? prev.following.filter(id => id !== userId) : [...prev.following, userId] }));
    notify(followingNow ? `Following ${userById(userId).name}` : `Unfollowed ${userById(userId).name}`);
  };

  const selectProfile = (id) => { setProfileId(id); setActivePage('Profile'); setQuery(''); setSearchText(''); setMobileNavOpen(false); };

  const onSelectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify('Choose an image file.'); return; }
    if (file.size > 2 * 1024 * 1024) { notify('Demo image uploads must be under 2 MB.'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => setComposeImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const resetDemo = () => {
    if (!window.confirm('Reset all demo interactions and return to the original sample data?')) return;
    const fresh = starterState();
    updateData(fresh); setActivePage('Home'); setFeedTab('For you'); setQuery(''); setSearchText(''); setProfileId('me');
    notify('Demo data has been reset');
  };

  const unreadCount = data.notifications.filter(n => !n.read).length;
  const navItems = [
    { name: 'Home', icon: 'home' }, { name: 'Explore', icon: 'search' }, { name: 'Notifications', icon: 'bell', badge: unreadCount },
    { name: 'Messages', icon: 'mail' }, { name: 'Bookmarks', icon: 'bookmark' }, { name: 'Profile', icon: 'user' },
  ];

  return <div className="app-shell">
    <div className="mobile-topbar">
      <button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(v => !v)} aria-label="Open menu"><Icon name="menu" size={22}/></button>
      <button className="brand brand-small" onClick={() => navigate('Home')}><span className="brand-mark">c</span> chirp<span className="brand-dot">.</span></button>
      <Avatar user={CURRENT_USER} size="sm" onClick={() => selectProfile('me')}/>
    </div>

    <aside className={`left-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
      <button className="brand" onClick={() => navigate('Home')} aria-label="Chirp home"><span className="brand-mark">c</span><span>chirp<span className="brand-dot">.</span></span></button>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(item => <button key={item.name} onClick={() => item.name === 'Profile' ? selectProfile('me') : navigate(item.name)} className={`nav-link ${activePage === item.name ? 'active' : ''}`}>
          <span className="nav-icon"><Icon name={item.icon} size={22}/></span><span>{item.name}</span>
          {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
        </button>)}
      </nav>
      <button className="compose-button" onClick={() => { setComposeOpen(true); setMobileNavOpen(false); }}><span>Post</span><Icon name="plus" size={19}/></button>
      <div className="sidebar-bottom">
        <button className="profile-mini" onClick={() => selectProfile('me')}>
          <Avatar user={CURRENT_USER} size="md"/><span className="profile-mini-copy"><strong>Dharani Vasan</strong><span>@dharani.codes</span></span><Icon name="more" size={19}/>
        </button>
        <button className="reset-button" onClick={resetDemo}><Icon name="settings" size={15}/> Reset demo data</button>
      </div>
    </aside>
    {mobileNavOpen && <button aria-label="Close navigation" className="mobile-scrim" onClick={() => setMobileNavOpen(false)}/>}

    <main className="main-column">
      <header className="page-header">
        <div className="page-heading"><span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span><h1>{activePage === 'Profile' ? (profileId === 'me' ? 'Your profile' : userById(profileId).name) : activePage}</h1></div>
        <form className="top-search" onSubmit={e => { e.preventDefault(); search(); }}><Icon name="search" size={18}/><input aria-label="Search Chirp" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search Chirp"/><kbd>↵</kbd></form>
      </header>

      {activePage === 'Home' && <>
        <div className="feed-tabs"><button className={feedTab === 'For you' ? 'selected' : ''} onClick={() => setFeedTab('For you')}>For you</button><button className={feedTab === 'Following' ? 'selected' : ''} onClick={() => setFeedTab('Following')}>Following</button><span className="tab-spark"><Icon name="spark" size={17}/></span></div>
        <form className="quick-compose" onSubmit={e => { e.preventDefault(); setComposeOpen(true); }}>
          <Avatar user={CURRENT_USER} size="lg" onClick={() => selectProfile('me')}/><button type="button" className="quick-compose-placeholder" onClick={() => setComposeOpen(true)}>What's on your mind, Dharani?</button><button type="submit" className="quick-post-button">Post</button>
        </form>
        <div className="feed-label"><span>{feedTab === 'For you' ? 'FRESH FROM YOUR CIRCLE' : 'PEOPLE YOU FOLLOW'}</span><span className="feed-count">{postsForPage.length} posts</span></div>
        {postsForPage.length ? postsForPage.map(post => <PostCard key={post.id} post={post} user={userById(post.userId)} currentUser={CURRENT_USER} onLike={() => togglePostFlag(post.id, 'likedByMe')} onRepost={() => togglePostFlag(post.id, 'repostedByMe')} onBookmark={() => togglePostFlag(post.id, 'bookmarkedByMe')} onComment={() => setCommentPostId(post.id)} onProfile={() => selectProfile(post.userId)} notify={notify}/>) : <EmptyState icon="home" title="Your feed is taking a breather" text="Follow a few people or switch back to For you to find something good." action={() => setFeedTab('For you')} actionText="Show For you"/>}
      </>}

      {activePage === 'Explore' && <>
        <section className="explore-intro"><div className="explore-orb"><Icon name="spark" size={26}/></div><div><p className="eyebrow">THE INTERNET, REMIXED</p><h2>Find your next rabbit hole.</h2><p>Search posts, people, and ideas worth following.</p></div></section>
        <form className="explore-search" onSubmit={e => { e.preventDefault(); search(); }}><Icon name="search" size={21}/><input autoFocus value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Try “system design” or “weekend projects”"/><button type="submit">Search</button></form>
        {query && <div className="section-title-row"><h3>Results for “{query}”</h3><button className="text-button" onClick={() => { setQuery(''); setSearchText(''); }}>Clear</button></div>}
        {!query && <TrendingCard onChoose={term => { setSearchText(term); search(term); }} />}
        <div className="feed-label"><span>{query ? 'MATCHING POSTS' : 'PICKING UP MOMENTUM'}</span><span className="feed-count">{postsForPage.length} posts</span></div>
        {postsForPage.length ? postsForPage.map(post => <PostCard key={post.id} post={post} user={userById(post.userId)} currentUser={CURRENT_USER} onLike={() => togglePostFlag(post.id, 'likedByMe')} onRepost={() => togglePostFlag(post.id, 'repostedByMe')} onBookmark={() => togglePostFlag(post.id, 'bookmarkedByMe')} onComment={() => setCommentPostId(post.id)} onProfile={() => selectProfile(post.userId)} notify={notify}/>) : <EmptyState icon="search" title="No posts found" text="Try another keyword. Your next favorite idea might be one search away." action={() => { setQuery(''); setSearchText(''); }} actionText="Clear search"/>}
      </>}

      {activePage === 'Bookmarks' && <>
        <div className="page-subtitle"><Icon name="bookmark" size={18}/> <span>Posts you tucked away for later.</span></div>
        {postsForPage.length ? postsForPage.map(post => <PostCard key={post.id} post={post} user={userById(post.userId)} currentUser={CURRENT_USER} onLike={() => togglePostFlag(post.id, 'likedByMe')} onRepost={() => togglePostFlag(post.id, 'repostedByMe')} onBookmark={() => togglePostFlag(post.id, 'bookmarkedByMe')} onComment={() => setCommentPostId(post.id)} onProfile={() => selectProfile(post.userId)} notify={notify}/>) : <EmptyState icon="bookmark" title="A little room for later" text="Bookmark posts from your feed and they will show up right here." action={() => navigate('Home')} actionText="Explore the feed"/>}
      </>}

      {activePage === 'Profile' && <ProfilePage user={userById(profileId)} posts={postsForPage} following={data.following} onFollow={() => followToggle(profileId)} currentUserId="me" onLike={id => togglePostFlag(id, 'likedByMe')} onRepost={id => togglePostFlag(id, 'repostedByMe')} onBookmark={id => togglePostFlag(id, 'bookmarkedByMe')} onComment={id => setCommentPostId(id)} onProfile={selectProfile} userById={userById} notify={notify} onCompose={() => setComposeOpen(true)}/>}

      {activePage === 'Notifications' && <NotificationsPage notifications={data.notifications} userById={userById} onPost={id => { setActivePage('Home'); setQuery(''); setTimeout(() => setCommentPostId(id), 0); }} onProfile={selectProfile}/>}

      {activePage === 'Messages' && <MessagesPage conversations={data.messages} userById={userById} activeId={messageUserId} setActiveId={setMessageUserId} text={messageText} setText={setMessageText} onSend={() => {
        const text = messageText.trim(); if (!text) return;
        updateData(prev => ({ ...prev, messages: prev.messages.map(convo => convo.userId === messageUserId ? { ...convo, messages: [...convo.messages, { id: `mm-${Date.now()}`, from: 'me', text, time: Date.now() }] } : convo) }));
        setMessageText(''); notify('Message sent (demo)');
      }} onNewMessage={() => { const id = 'kavin'; setMessageUserId(id); if (!data.messages.some(c => c.userId === id)) updateData(prev => ({ ...prev, messages: [...prev.messages, { id: `m-${Date.now()}`, userId: id, messages: [] }] })); }}/>
      }

      <footer className="main-footer"><span>Chirp is a frontend demo.</span><span>Made for curious minds <span className="footer-heart">♥</span></span></footer>
    </main>

    <aside className="right-sidebar">
      <div className="right-search-wrap"><form className="right-search" onSubmit={e => { e.preventDefault(); search(searchText); }}><Icon name="search" size={18}/><input aria-label="Search posts" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search posts & people"/></form></div>
      <section className="side-card welcome-card"><div className="welcome-decoration"><span/><span/><span/></div><p className="eyebrow">A QUICK HELLO</p><h2>Good ideas grow<br/>when shared.</h2><p>Follow curious people, join conversations, and add your own voice.</p><button onClick={() => setComposeOpen(true)}>Share a thought <Icon name="arrow" size={17}/></button></section>
      <TrendingCard compact onChoose={term => { setSearchText(term); search(term); }}/>
      <section className="side-card follow-card"><div className="side-card-heading"><h3>People to know</h3><button className="dots-button" onClick={() => notify('More suggestions coming soon')} aria-label="More suggestions"><Icon name="more" size={19}/></button></div>
        {USERS.filter(user => user.id !== 'me' && !data.following.includes(user.id)).slice(0, 3).map(user => <div className="suggestion" key={user.id}><Avatar user={user} size="md" onClick={() => selectProfile(user.id)}/><button className="suggestion-info" onClick={() => selectProfile(user.id)}><strong>{user.name}</strong><span>{user.handle}</span></button><button className="follow-pill" onClick={() => followToggle(user.id)}>Follow</button></div>)}
        {USERS.filter(user => user.id !== 'me' && !data.following.includes(user.id)).length === 0 && <p className="all-followed">You’re all caught up. Nice circle! ✨</p>}
        <button className="see-more" onClick={() => navigate('Explore')}>Discover more people <Icon name="arrow" size={15}/></button>
      </section>
      <div className="side-footer"><span>About</span><span>Guidelines</span><span>Privacy</span><span>© 2026 Chirp</span><p>Demo experience · No real messages sent</p></div>
    </aside>

    {composeOpen && <Modal onClose={() => { setComposeOpen(false); setComposeImage(''); }} title="Create a post" className="compose-modal">
      <form onSubmit={createPost}>
        <div className="modal-compose-row"><Avatar user={CURRENT_USER} size="lg"/><div className="modal-compose-main"><div className="modal-who">Dharani Vasan <span>· Posting to everyone</span></div><textarea autoFocus value={composeText} onChange={e => setComposeText(e.target.value)} maxLength={500} placeholder="What would you like to share?" rows={5}/></div></div>
        {composeImage && <div className="compose-image-preview"><img src={composeImage} alt="Selected upload preview"/><button type="button" onClick={() => { setComposeImage(''); if (fileRef.current) fileRef.current.value = ''; }} aria-label="Remove image"><Icon name="close" size={17}/></button></div>}
        <div className="compose-modal-bottom"><div className="compose-tools"><button type="button" title="Add image (max 2 MB)" onClick={() => fileRef.current?.click()}><Icon name="image" size={20}/><span>Photo</span></button><input ref={fileRef} type="file" accept="image/*" hidden onChange={onSelectImage}/><span className="char-count">{composeText.length}/500</span></div><button className="primary-button" type="submit" disabled={!composeText.trim() && !composeImage}>Publish post</button></div>
      </form>
    </Modal>}

    {commentPostId && currentCommentPost && <Modal onClose={() => { setCommentPostId(null); setCommentText(''); }} title="Conversation" className="comments-modal">
      <PostCard post={currentCommentPost} user={userById(currentCommentPost.userId)} currentUser={CURRENT_USER} compact onLike={() => togglePostFlag(currentCommentPost.id, 'likedByMe')} onRepost={() => togglePostFlag(currentCommentPost.id, 'repostedByMe')} onBookmark={() => togglePostFlag(currentCommentPost.id, 'bookmarkedByMe')} onComment={() => {}} onProfile={() => {}} notify={notify}/>
      <div className="reply-heading">Replies <span>{(currentCommentPost.comments || []).length}</span></div>
      <div className="comment-list">{(currentCommentPost.comments || []).map(comment => <div className="comment-item" key={comment.id}><Avatar user={userById(comment.userId)} size="sm"/><div className="comment-body"><div className="comment-meta"><strong>{userById(comment.userId).name}</strong><span>{userById(comment.userId).handle}</span><span>· {timeAgo(comment.createdAt)}</span></div><p>{comment.text}</p></div></div>)}{!(currentCommentPost.comments || []).length && <div className="no-comments">No replies yet. Start the conversation.</div>}</div>
      <form className="reply-form" onSubmit={addComment}><Avatar user={CURRENT_USER} size="md"/><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a reply…" maxLength={300}/><button className="primary-button" disabled={!commentText.trim()}>Reply</button></form>
    </Modal>}

    {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={16}/></span>{toast}</div>}
  </div>;
}

function PostCard({ post, user, currentUser, onLike, onRepost, onBookmark, onComment, onProfile, notify, compact = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  return <article className={`post-card ${compact ? 'post-card-compact' : ''}`}>
    <Avatar user={user} size="lg" onClick={onProfile}/>
    <div className="post-content">
      <div className="post-head"><button className="identity-button" onClick={onProfile}><strong>{user.name}</strong>{user.id === 'tech' && <span className="verified">✓</span>}<span>{user.handle}</span><span className="post-dot">·</span><time>{timeAgo(post.createdAt)}</time></button><div className="post-menu-wrap"><button className="dots-button post-dots" aria-label="Post options" onClick={() => setMenuOpen(v => !v)}><Icon name="more" size={19}/></button>{menuOpen && <><button className="click-catcher" aria-label="Close menu" onClick={() => setMenuOpen(false)}/><div className="post-menu"><button onClick={() => { navigator.clipboard?.writeText(post.text || ''); setMenuOpen(false); notify('Post text copied (if clipboard is available)'); }}>Copy post text</button><button onClick={() => { onBookmark(); setMenuOpen(false); }}> {post.bookmarkedByMe ? 'Remove bookmark' : 'Save post'} </button><button onClick={() => { setMenuOpen(false); notify('Thanks for helping keep Chirp welcoming.'); }}>Report post</button></div></>}</div></div>
      {post.userId === 'me' && <div className="posted-label"><span className="mini-check"><Icon name="check" size={10}/></span> You posted</div>}
      {post.repostedByMe && <div className="repost-note"><Icon name="repeat" size={13}/> You reposted</div>}
      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && !imageError && <div className="post-image-wrap"><img src={post.image} alt="Post attachment" loading="lazy" onError={() => setImageError(true)}/></div>}
      {!compact && <div className="post-actions">
        <button className="action-reply" onClick={onComment} aria-label="Reply"><span className="action-icon"><Icon name="message" size={18}/></span><span>{shortCount(post.replies || 0)}</span></button>
        <button className={`action-repost ${post.repostedByMe ? 'engaged' : ''}`} onClick={onRepost} aria-label="Repost"><span className="action-icon"><Icon name="repeat" size={18}/></span><span>{shortCount(post.reposts || 0)}</span></button>
        <button className={`action-like ${post.likedByMe ? 'engaged' : ''}`} onClick={onLike} aria-label={post.likedByMe ? 'Unlike post' : 'Like post'}><span className="action-icon"><Icon name="heart" size={18} fill={post.likedByMe ? 'currentColor' : 'none'}/></span><span>{shortCount(post.likes || 0)}</span></button>
        <button className={`action-bookmark ${post.bookmarkedByMe ? 'engaged' : ''}`} onClick={onBookmark} aria-label={post.bookmarkedByMe ? 'Remove bookmark' : 'Bookmark post'}><span className="action-icon"><Icon name="bookmark" size={18} fill={post.bookmarkedByMe ? 'currentColor' : 'none'}/></span></button>
        <button className="action-share" onClick={() => { navigator.clipboard?.writeText(`${user.name} ${user.handle}: ${post.text}`); notify('Share text copied (if clipboard is available)'); }} aria-label="Share post"><span className="action-icon"><Icon name="share" size={18}/></span></button>
      </div>}
    </div>
  </article>;
}

function TrendingCard({ onChoose, compact = false }) {
  const trends = [
    { category: 'TECHNOLOGY · TRENDING', tag: 'SystemDesign', search: 'system design', posts: '2,408 posts' },
    { category: 'CREATORS · POPULAR', tag: 'BuildInPublic', search: 'project', posts: '1,296 posts' },
    { category: 'COMMUNITY · THIS WEEK', tag: 'WeekendProjects', search: 'weekend', posts: '864 posts' },
  ];
  return <section className={`side-card trending-card ${compact ? 'trending-compact' : ''}`}><div className="side-card-heading"><h3>{compact ? 'What’s happening' : 'Explore topics'}</h3><span className="heading-flare"><Icon name="trend" size={18}/></span></div>
    {trends.map((trend, i) => <button className="trend-item" key={trend.tag} onClick={() => onChoose(trend.search)}><span className="trend-category">{trend.category}</span><strong>#{trend.tag}</strong><span className="trend-posts">{trend.posts}</span><span className="trend-number">0{i + 1}</span></button>)}
    <button className="see-more" onClick={() => onChoose('')}>Explore all topics <Icon name="arrow" size={15}/></button>
  </section>;
}

function EmptyState({ icon, title, text, action, actionText }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={25}/></span><h2>{title}</h2><p>{text}</p><button onClick={action}>{actionText}</button></div>;
}

function ProfilePage({ user, posts, following, onFollow, currentUserId, onLike, onRepost, onBookmark, onComment, onProfile, userById, notify, onCompose }) {
  const isMe = user.id === currentUserId;
  return <>
    <div className="profile-cover"><div className="cover-circle circle-a"/><div className="cover-circle circle-b"/><div className="cover-grid"/><span className="cover-label">A WORK IN PROGRESS, JUST LIKE ALL OF US.</span></div>
    <div className="profile-summary"><div className="profile-avatar-row"><Avatar user={user} size="xl"/><div className="profile-actions">{isMe ? <button className="outline-button" onClick={onCompose}>Write a post</button> : <button className={`follow-pill profile-follow ${following.includes(user.id) ? 'is-following' : ''}`} onClick={onFollow}>{following.includes(user.id) ? <><Icon name="check" size={14}/> Following</> : 'Follow'}</button>}</div></div>
      <h2>{user.name}</h2><p className="profile-handle">{user.handle}</p><p className="profile-bio">{user.bio}</p><div className="profile-facts">{user.location && <span><Icon name="pin" size={15}/>{user.location}</span>}<span><Icon name="calendar" size={15}/>{user.joined}</span></div>
      <div className="profile-stats"><button onClick={() => notify('Following list is demo data')}><strong>{user.id === 'me' ? following.length : Math.max(7, following.length * 4)}</strong> Following</button><button onClick={() => notify('Follower list is demo data')}><strong>{user.id === 'me' ? 128 : 642}</strong> Followers</button></div>
    </div>
    <div className="profile-tabs"><span className="selected">Posts <span>{posts.length}</span></span><span>Replies</span><span>Media</span></div>
    {posts.length ? posts.map(post => <PostCard key={post.id} post={post} user={userById(post.userId)} currentUser={CURRENT_USER} onLike={() => onLike(post.id)} onRepost={() => onRepost(post.id)} onBookmark={() => onBookmark(post.id)} onComment={() => onComment(post.id)} onProfile={() => onProfile(post.userId)} notify={notify}/>) : <EmptyState icon="user" title="The first chapter starts here" text={isMe ? 'Share your first thought and let your profile tell your story.' : 'No posts here yet. Check back when there is something new.'} action={isMe ? onCompose : () => {}} actionText={isMe ? 'Create your first post' : ' '} />}
  </>;
}

function NotificationsPage({ notifications, userById, onPost, onProfile }) {
  const sorted = [...notifications].sort((a, b) => b.createdAt - a.createdAt);
  return <div className="notifications-view"><div className="notification-summary"><span className="notification-bubble"><Icon name="bell" size={23}/></span><div><h2>You’re in the loop.</h2><p>Little signals from your corner of Chirp.</p></div></div>
    {sorted.map(note => { const user = userById(note.from); return <div key={note.id} className={`notification-row ${!note.read ? 'unread' : ''}`}><span className={`notification-type type-${note.type}`}><Icon name={note.type === 'like' ? 'heart' : note.type === 'follow' ? 'user' : 'message'} size={17}/></span><Avatar user={user} size="md" onClick={() => onProfile(user.id)}/><div className="notification-copy"><p><button onClick={() => onProfile(user.id)}>{user.name}</button> {note.text}</p>{note.postId && <button className="notification-post-link" onClick={() => onPost(note.postId)}>View conversation <Icon name="arrow" size={14}/></button>}<time>{timeAgo(note.createdAt)}</time></div><span className="notification-dot"/></div>; })}
    {!sorted.length && <EmptyState icon="bell" title="All quiet for now" text="When people interact with your posts, you’ll see it here." action={() => {}} actionText=""/>}
  </div>;
}

function MessagesPage({ conversations, userById, activeId, setActiveId, text, setText, onSend, onNewMessage }) {
  const active = conversations.find(c => c.userId === activeId) || conversations[0];
  useEffect(() => {
    const box = document.querySelector('.message-thread-body');
    if (box) box.scrollTop = box.scrollHeight;
  }, [active?.messages.length, activeId]);
  return <div className="messages-layout"><div className="conversation-list"><div className="conversation-header"><h2>Inbox</h2><button className="icon-button light" onClick={onNewMessage} title="New conversation"><Icon name="plus" size={19}/></button></div>
    {conversations.map(convo => { const user = userById(convo.userId); const last = convo.messages[convo.messages.length - 1]; return <button key={convo.id} className={`conversation-item ${activeId === convo.userId ? 'active' : ''}`} onClick={() => setActiveId(convo.userId)}><Avatar user={user} size="md"/><span><strong>{user.name}</strong><small>{last ? last.text : 'Start a conversation'}</small></span>{last && <time>{timeAgo(last.time)}</time>}</button>; })}</div>
    <div className="message-thread"><div className="thread-header">{active && <><Avatar user={userById(active.userId)} size="sm"/><div><strong>{userById(active.userId).name}</strong><span>{userById(active.userId).handle}</span></div></>}</div>
      <div className="message-thread-body">{active?.messages.length ? active.messages.map(msg => <div key={msg.id} className={`message-bubble ${msg.from === 'me' ? 'mine' : ''}`}><p>{msg.text}</p><time>{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>) : <div className="message-empty">Say hello. Keep it kind. ☀️</div>}</div>
      <form className="message-send" onSubmit={e => { e.preventDefault(); onSend(); }}><input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message…"/><button disabled={!text.trim()} aria-label="Send message"><Icon name="arrow" size={18}/></button></form>
      <div className="demo-note">Demo inbox · messages stay in this browser</div>
    </div>
  </div>;
}

function Modal({ children, onClose, title, className = '' }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><button className="icon-button light" onClick={onClose} aria-label="Close modal"><Icon name="close" size={20}/></button><strong>{title}</strong><span/></header>{children}</section></div>;
}

export default App;
