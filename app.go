package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Endpoint define a estrutura de um endpoint da API
type Endpoint struct {
	ID       string `json:"id"`
	Method   string `json:"method"`
	Path     string `json:"path"`
	Response string `json:"response"` // Armazena a resposta como uma string JSON bruta
}

// App struct
type App struct {
	ctx        context.Context
	httpServer *http.Server
	endpoints  map[string]*Endpoint
	mu         sync.RWMutex // Mutex para acesso concorrente seguro ao mapa de endpoints
}

// NewApp cria uma nova instância de App
func NewApp() *App {
	return &App{
		endpoints: make(map[string]*Endpoint),
	}
}

// startup é chamada quando a aplicação inicia.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// shutdown é chamada quando a aplicação está prestes a fechar.
// Ela garante que o servidor HTTP seja desligado graciosamente.
func (a *App) shutdown(ctx context.Context) {
	a.StopServer()
}

// --- Métodos Expostos para o Frontend ---

// AddEndpoint adiciona um novo endpoint para a API.
// Retorna o endpoint criado ou um erro se o JSON for inválido.
func (a *App) AddEndpoint(method, path, response string) (*Endpoint, error) {
	var js json.RawMessage
	if err := json.Unmarshal([]byte(response), &js); err != nil {
		return nil, fmt.Errorf("JSON de resposta inválido: %w", err)
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	newEndpoint := &Endpoint{
		ID:       uuid.New().String(),
		Method:   method,
		Path:     path,
		Response: response,
	}

	a.endpoints[newEndpoint.ID] = newEndpoint
	fmt.Printf("Endpoint adicionado: ID=%s %s %s\n", newEndpoint.ID, method, path)

	return newEndpoint, nil
}

// GetEndpoints retorna a lista de todos os endpoints configurados.
func (a *App) GetEndpoints() []*Endpoint {
	a.mu.RLock()
	defer a.mu.RUnlock()

	endpointsList := make([]*Endpoint, 0, len(a.endpoints))
	for _, ep := range a.endpoints {
		endpointsList = append(endpointsList, ep)
	}
	return endpointsList
}

// RemoveEndpoint remove um endpoint usando seu ID.
func (a *App) RemoveEndpoint(id string) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.endpoints[id]; ok {
		delete(a.endpoints, id)
		fmt.Printf("Endpoint removido: ID=%s\n", id)
	}
}

// StartServer inicia o servidor HTTP em uma goroutine separada.
func (a *App) StartServer(port string) error {
	a.mu.Lock()
	if a.httpServer != nil {
		a.mu.Unlock()
		return fmt.Errorf("o servidor já está em execução")
	}

	mux := http.NewServeMux()
	for _, ep := range a.endpoints {
		endpoint := ep
		mux.HandleFunc(endpoint.Path, func(w http.ResponseWriter, r *http.Request) {
			if r.Method != endpoint.Method {
				http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			w.WriteHeader(http.StatusOK)
			fmt.Fprint(w, endpoint.Response)
			fmt.Printf("Servindo requisição: %s %s\n", r.Method, r.URL.Path)
		})
	}

	addr := ":" + port
	a.httpServer = &http.Server{
		Addr:    addr,
		Handler: mux,
	}
	a.mu.Unlock()

	fmt.Printf("Iniciando servidor em http://localhost%s\n", addr)

	// Emite evento de SUCESSO
	runtime.EventsEmit(a.ctx, "server-status", "Servidor rodando em", fmt.Sprintf("http://localhost%s", addr), true)

	go func() {
		if err := a.httpServer.ListenAndServe(); err != http.ErrServerClosed {
			fmt.Printf("Erro no servidor HTTP: %v\n", err)
			// Emite evento de ERRO
			runtime.EventsEmit(a.ctx, "server-error", fmt.Sprintf("Erro no servidor: %v", err))
			a.mu.Lock()
			a.httpServer = nil
			a.mu.Unlock()
		}
	}()

	return nil
}

// StopServer para o servidor HTTP que está em execução.
func (a *App) StopServer() error {
	a.mu.Lock()
	defer a.mu.Unlock()

	if a.httpServer == nil {
		// Não retorna erro se o servidor já estiver parado, apenas ignora.
		return nil
	}

	fmt.Println("Parando o servidor HTTP...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := a.httpServer.Shutdown(ctx)
	a.httpServer = nil

	if err != nil {
		fmt.Printf("Erro ao parar o servidor: %v\n", err)
		// Emite evento de ERRO
		runtime.EventsEmit(a.ctx, "server-error", fmt.Sprintf("Erro ao parar o servidor: %v", err))
		return err
	}

	fmt.Println("Servidor parado com sucesso.")
	// Emite evento de PARADO
	runtime.EventsEmit(a.ctx, "server-status", "Servidor parado", "", false)
	return nil
}
