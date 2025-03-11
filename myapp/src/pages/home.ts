export const homePage = /* html */`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ホーム</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    h1 {
      color: #333;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    .user-info {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: #f0f7ff;
      border-radius: 8px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #4a90e2;
      color: white;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .username {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }
    .email {
      color: #666;
      margin-bottom: 1rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover {
      background-color: #3a80d2;
    }
    .loading {
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ホーム</h1>
    <div id="loading" class="loading">ユーザー情報を読み込み中...</div>
    <div id="user-info" class="user-info" style="display: none;">
      <div class="avatar" id="avatar"></div>
      <div class="username" id="displayName"></div>
      <div class="email" id="email"></div>
    </div>
    <button id="logoutBtn" style="display: none;">ログアウト</button>
  </div>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
    import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

    const firebaseConfig = {
      apiKey: "${process.env.FIREBASE_API_KEY}",
      authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
      databaseURL: "${process.env.FIREBASE_DATABASE_URL}",
      projectId: "${process.env.FIREBASE_PROJECT_ID}",
      storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${process.env.FIREBASE_APP_ID}"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    const loadingEl = document.getElementById('loading');
    const userInfoEl = document.getElementById('user-info');
    const avatarEl = document.getElementById('avatar');
    const displayNameEl = document.getElementById('displayName');
    const emailEl = document.getElementById('email');
    const logoutBtn = document.getElementById('logoutBtn');
    
    onAuthStateChanged(auth, (user) => {
      loadingEl.style.display = 'none';
      
      if (user) {
        userInfoEl.style.display = 'block';
        logoutBtn.style.display = 'inline-block';
        
        const displayName = user.displayName || 'ユーザー';
        displayNameEl.textContent = displayName;
        emailEl.textContent = user.email;
        
        // ユーザー名のイニシャルをアバターに表示
        avatarEl.textContent = displayName.charAt(0).toUpperCase();
      } else {
        window.location.href = '/login';
      }
    });
    
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        window.location.href = '/login';
      } catch (error) {
        console.error(error);
      }
    });
  </script>
</body>
</html>
`; 