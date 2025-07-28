package backend

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) StartServer(port string) error {
	a.mu.Lock()
	if a.httpServer != nil {
		a.mu.Unlock()
		return fmt.Errorf("o servidor já está em execução")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/auth/login", handleLogin)

	for _, ep := range a.endpoints {
		endpoint := ep
		mux.HandleFunc(endpoint.Path, func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			if r.Method != endpoint.Method {
				http.Error(w, `{"error": "Método não permitido"}`, http.StatusMethodNotAllowed)
				return
			}

			if endpoint.RequiresAuth && !isAuthorized(r) {
				w.Header().Set("Content-Type", "application/json")
				http.Error(w, `{"error": "Token de autenticação inválido ou ausente"}`, http.StatusUnauthorized)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			fmt.Fprint(w, endpoint.Response)
		})
	}

	addr := ":" + port
	a.httpServer = &http.Server{
		Addr:    addr,
		Handler: mux,
	}
	a.mu.Unlock()

	runtime.EventsEmit(a.ctx, "server-status", "Servidor rodando em", fmt.Sprintf("http://localhost%s", addr), true)

	go func() {
		if err := a.httpServer.ListenAndServe(); err != http.ErrServerClosed {
			runtime.EventsEmit(a.ctx, "server-error", fmt.Sprintf("Erro no servidor: %v", err))
			a.mu.Lock()
			a.httpServer = nil
			a.mu.Unlock()
		}
	}()

	return nil
}

func (a *App) StopServer() error {
	a.mu.Lock()
	defer a.mu.Unlock()

	if a.httpServer == nil {
		return nil
	}

	ctx, cancel := context.WithTimeout(a.ctx, 5*time.Second)
	defer cancel()

	err := a.httpServer.Shutdown(ctx)
	a.httpServer = nil

	if err != nil {
		runtime.EventsEmit(a.ctx, "server-error", fmt.Sprintf("Erro ao parar o servidor: %v", err))
		return err
	}

	runtime.EventsEmit(a.ctx, "server-status", "Servidor parado", "", false)
	return nil
}
