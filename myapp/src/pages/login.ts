export const loginPage = /* html */`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ログイン</title>
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
      max-width: 400px;
    }
    h1 {
      color: #333;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background-color: #3a80d2;
    }
    .error {
      color: #e53935;
      margin-top: 1rem;
      text-align: center;
    }
    .link {
      text-align: center;
      margin-top: 1.5rem;
    }
    a {
      color: #4a90e2;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ログイン</h1>
    <div id="error" class="error"></div>
    <div class="form-group">
      <label for="email">メールアドレス</label>
      <input type="email" id="email" required>
    </div>
    <div class="form-group">
      <label for="password">パスワード</label>
      <input type="password" id="password" required>
    </div>
    <button id="loginBtn">ログイン</button>
    <div class="link">
      <a href="/register">新規登録はこちら</a>
    </div>
  </div>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
    import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

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
    
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('error');
      
      if (!email || !password) {
        errorDiv.textContent = 'メールアドレスとパスワードを入力してください';
        return;
      }
      
      try {
        errorDiv.textContent = '';
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/';
      } catch (error) {
        console.error(error);
        errorDiv.textContent = 'ログインに失敗しました。メールアドレスとパスワードを確認してください。';
      }
    });
  </script>
</body>
</html>
`; 