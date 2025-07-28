package backend

import (
	"context"
	"net/http"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx        context.Context
	httpServer *http.Server
	endpoints  map[string]*Endpoint
	mu         sync.RWMutex
}

func NewApp() *App {
	return &App{
		endpoints: make(map[string]*Endpoint),
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) DomReady(ctx context.Context) {
	runtime.WindowShow(ctx)
	runtime.WindowMaximise(ctx)
}

func (a *App) Shutdown(ctx context.Context) {
	a.StopServer()
}
