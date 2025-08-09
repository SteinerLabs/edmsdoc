package config

import "os"

type Config struct {
	Server ServerConfig
}

type ServerConfig struct {
	Host string
	Port string
}

func Load() (*Config, error) {
	config := &Config{
		Server: ServerConfig{
			Host: getEnv("HOST", "localhost"),
			Port: getEnv("PORT", "8080"),
		},
	}
	return config, nil
}

func getEnv(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
