FROM golang:tip-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY src/ ./src/

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./src/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

# Create data directory
RUN mkdir -p data

EXPOSE 8080

CMD ["./main"]
