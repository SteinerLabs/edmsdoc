package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/SteinerLabs/edmsdoc/backend/internal/config"
	"github.com/SteinerLabs/edmsdoc/backend/internal/web"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	log := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))

	err := run(log)
	if err != nil {
		log.Error("startup", "error", err)
		os.Exit(1)
	}
}

func run(log *slog.Logger) error {
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	app := web.NewApp(log)

	app.Get("api/v1", "/", func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
		_, err := w.Write([]byte("Hello World!"))
		return err
	})

	server := &http.Server{
		Addr:        fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port),
		Handler:     http.TimeoutHandler(app, 5*time.Second, "request timed out"),
		IdleTimeout: 60 * time.Second,
	}

	serverError := make(chan error, 1)

	go func() {
		log.Info("startup", "address", server.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverError <- fmt.Errorf("error starting server: %w", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverError:
		return err
	case <-stop:
		log.Info("graceful shutdown initiated")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		server.SetKeepAlivesEnabled(false)
		if err := server.Shutdown(ctx); err != nil {
			return fmt.Errorf("error gracefully shutting down server: %w", err)
		}
		log.Info("graceful shutdown complete")
		return nil
	}
}
