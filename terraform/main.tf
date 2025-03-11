terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "google-beta" {
  user_project_override = false
  region                = "asia-northeast1"
}

# Firebase プロジェクト用の GCP プロジェクトを立ち上げる
resource "google_project" "default" {
  provider = google-beta

  # project_id は全世界で一意になる必要がある。
  # 今回は、各自で適当にidを変更すること。しかし、大文字は使えない。
  project_id      = "c4s-cloudf2-sandbox-20250304"
  # これはなんでもいい。
  name            = "C4s-CloudF-sandbox"

  # Firebase のプロジェクトとして表示するために必要
  labels = {
    "firebase" = "enabled"
  }
}

# 各APIの有効化
resource "google_project_service" "default" {
  provider = google-beta
  project = google_project.default.project_id
  for_each = toset([
    "serviceusage.googleapis.com",
    "firebase.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
    "firebasehosting.googleapis.com",
  ])
  service = each.key
  disable_on_destroy = false
}

# Firebase のプロジェクトを立ち上げる
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  depends_on = [
    google_project_service.default,
  ]
}

# Firebase Webアプリの作成
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = "Todoアプリ"
  depends_on   = [google_firebase_project.default]
}

# Firebase Web SDKの設定ファイル取得（リソースではなくデータソースとして使用）
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  project    = google_project.default.project_id
  web_app_id = google_firebase_web_app.default.app_id
}

# 環境変数ファイル用の変数を設定
locals {
  env_content = <<-EOT
    FIREBASE_API_KEY=${data.google_firebase_web_app_config.default.api_key}
    FIREBASE_AUTH_DOMAIN=${google_project.default.project_id}.firebaseapp.com
    FIREBASE_DATABASE_URL=https://${google_project.default.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app
    FIREBASE_PROJECT_ID=${google_project.default.project_id}
    FIREBASE_STORAGE_BUCKET=${google_project.default.project_id}.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=${data.google_firebase_web_app_config.default.messaging_sender_id}
    FIREBASE_APP_ID=${google_firebase_web_app.default.app_id}
  EOT
}

# 設定ファイルをJSONとしても出力
locals {
  firebase_config_json = jsonencode({
    apiKey            = data.google_firebase_web_app_config.default.api_key
    authDomain        = "${google_project.default.project_id}.firebaseapp.com"
    databaseURL       = "https://${google_project.default.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app"
    projectId         = google_project.default.project_id
    storageBucket     = "${google_project.default.project_id}.appspot.com"
    messagingSenderId = data.google_firebase_web_app_config.default.messaging_sender_id
    appId             = google_firebase_web_app.default.app_id
  })
}

# .envファイルを自動生成
resource "local_file" "env_file" {
  content  = local.env_content
  filename = "${path.module}/.env"
  
  depends_on = [
    data.google_firebase_web_app_config.default
  ]
}

# firebaseConfig.jsonファイルも生成
resource "local_file" "firebase_config_json" {
  content  = local.firebase_config_json
  filename = "${path.module}/firebaseConfig.json"
  
  depends_on = [
    data.google_firebase_web_app_config.default
  ]
}