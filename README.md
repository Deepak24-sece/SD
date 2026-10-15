# Chirp — Social Networking Frontend Demo

A responsive, front-end-only Twitter-like social networking platform built with React and Vite. It uses sample users/posts and persists demo interactions in the browser using `localStorage`. No backend, database, API keys, or environment variables are needed.

## Run locally

1. Install Node.js (version 20.19+ or 22.12+ recommended).
2. Extract this folder and open a terminal inside `chirp-social-demo`.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Included demo features

- Home feed with For You and Following tabs
- Create posts with text and optional image upload (up to 2 MB)
- Like, repost, reply/comment, bookmark, copy/share text, and report-menu demo action
- Explore/search posts by keyword, person, or hashtag-style topic
- Profile pages and follow/unfollow buttons
- Notifications page
- Demo inbox with selectable conversations and send-message interaction
- Persistent state through browser `localStorage`
- Reset demo data control in the left sidebar
- Responsive desktop, tablet, and mobile layouts

## Important

This is a frontend demo only. Likes, follows, posts, messages, and notifications are saved locally in the current browser. They are not shared with other users, and messages are not sent to any real service. Sample post images and the optional Google Font load from the internet; the rest of the UI works without a backend.
