# Build stage
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Install git for fetch dependencies
RUN apk add --no-cache git

# Copy go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY src/ ./src/

# Build the application
# Disable CGO for static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./src/main.go

# Run stage
FROM alpine:latest

WORKDIR /app

# Create data directory
RUN mkdir -p /data

# Copy binary from builder
COPY --from=builder /app/main .

# Expose port
EXPOSE 8080

# Environment variables
ENV DATA_DIR=/data

CMD ["./main"]
