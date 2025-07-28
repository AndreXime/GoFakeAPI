package backend

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
)

type Endpoint struct {
	ID           string `json:"id"`
	Method       string `json:"method"`
	Path         string `json:"path"`
	Response     string `json:"response"`
	RequiresAuth bool   `json:"requiresAuth"`
}

func (a *App) AddEndpoint(method, path, response string, requiresAuth bool) (*Endpoint, error) {
	var js json.RawMessage
	if err := json.Unmarshal([]byte(response), &js); err != nil {
		return nil, fmt.Errorf("JSON de resposta inválido: %w", err)
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	newEndpoint := &Endpoint{
		ID:           uuid.New().String(),
		Method:       method,
		Path:         path,
		Response:     response,
		RequiresAuth: requiresAuth,
	}

	a.endpoints[newEndpoint.ID] = newEndpoint
	fmt.Printf("Endpoint adicionado: ID=%s %s %s Auth=%t\n", newEndpoint.ID, method, path, requiresAuth)

	return newEndpoint, nil
}

func (a *App) GetEndpoints() []*Endpoint {
	a.mu.RLock()
	defer a.mu.RUnlock()

	endpointsList := make([]*Endpoint, 0, len(a.endpoints))
	for _, ep := range a.endpoints {
		endpointsList = append(endpointsList, ep)
	}
	return endpointsList
}

func (a *App) RemoveEndpoint(id string) {
	a.mu.Lock()
	defer a.mu.Unlock()

	if _, ok := a.endpoints[id]; ok {
		delete(a.endpoints, id)
		fmt.Printf("Endpoint removido: ID=%s\n", id)
	}
}
