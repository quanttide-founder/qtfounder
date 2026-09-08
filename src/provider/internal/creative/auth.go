package creative

import (
	"crypto/subtle"
	"net/http"
	"os"
	"strings"
)

// SecretKeyAuth 基于 SECRET_KEY 的访问限制中间件。
// 客户端通过 Authorization: Bearer <SECRET_KEY> 或 ?key=<SECRET_KEY> 携带密钥；
// 环境变量 QTFOUNDER_SECRET_KEY 未设置时不启用鉴权（本地开发模式）。
func SecretKeyAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		secret := os.Getenv("QTFOUNDER_SECRET_KEY")
		if secret == "" {
			next.ServeHTTP(w, r)
			return
		}
		// /health 免鉴权：FC 健康检查期望 2xx，应用层拦截会导致实例无法就绪
		if r.URL.Path == "/health" {
			next.ServeHTTP(w, r)
			return
		}
		if !matches(secret, r) {
			w.Header().Set("WWW-Authenticate", `Bearer realm="qtfounder"`)
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// matches 用常量时间比较校验密钥，防止时序攻击
func matches(secret string, r *http.Request) bool {
	const bearer = "Bearer "
	if got := r.Header.Get("Authorization"); strings.HasPrefix(got, bearer) {
		return subtle.ConstantTimeCompare([]byte(got[len(bearer):]), []byte(secret)) == 1
	}
	return subtle.ConstantTimeCompare([]byte(r.URL.Query().Get("key")), []byte(secret)) == 1
}
