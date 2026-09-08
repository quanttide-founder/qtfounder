package creative

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSecretKeyAuth(t *testing.T) {
	t.Setenv("QTFOUNDER_SECRET_KEY", "test-secret")
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	t.Run("未设置密钥时不启用鉴权", func(t *testing.T) {
		t.Setenv("QTFOUNDER_SECRET_KEY", "")
		req := httptest.NewRequest("GET", "/api/chapters", nil)
		rec := httptest.NewRecorder()
		SecretKeyAuth(next).ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Errorf("code = %d, want 200", rec.Code)
		}
	})

	t.Run("缺少密钥返回 401", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/chapters", nil)
		rec := httptest.NewRecorder()
		SecretKeyAuth(next).ServeHTTP(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Errorf("code = %d, want 401", rec.Code)
		}
	})

	t.Run("Bearer 密钥正确返回 200", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/chapters", nil)
		req.Header.Set("Authorization", "Bearer test-secret")
		rec := httptest.NewRecorder()
		SecretKeyAuth(next).ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Errorf("code = %d, want 200", rec.Code)
		}
	})

	t.Run("query 密钥正确返回 200", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/chapters?key=test-secret", nil)
		rec := httptest.NewRecorder()
		SecretKeyAuth(next).ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Errorf("code = %d, want 200", rec.Code)
		}
	})

	t.Run("错误密钥返回 401", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/chapters", nil)
		req.Header.Set("Authorization", "Bearer wrong")
		rec := httptest.NewRecorder()
		SecretKeyAuth(next).ServeHTTP(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Errorf("code = %d, want 401", rec.Code)
		}
	})
}
