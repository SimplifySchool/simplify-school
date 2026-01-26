# Stage 1: Builder
# Use the official Go image to build the app
FROM golang:latest-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
# CGO_ENABLED=0: Disables C bindings for a static binary (required for Alpine)
# GOOS=linux: Ensures we build for Linux
RUN CGO_ENABLED=0 GOOS=linux go build -o backend main.go

# Stage 2: Runner
# Use a tiny Alpine image for the final container
FROM alpine:latest

# Install certificates to allow HTTPS requests (e.g. to databases or APIs)
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/backend .

# Expose the port Fiber runs on
# Fiber defaults to 3000. If your main.go uses a different port, update this.
EXPOSE 3000

# Command to run the executable
CMD ["./backend"]