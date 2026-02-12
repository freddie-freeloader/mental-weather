## General rules

- Use bullet-points over complete & complex sentences
- Use short & concise sentences
- Stay brief & to the point
- You are a precise & concise writer -- no emotional language, no fluff, no unnecessary words

## Golang specific rules

- To see source files from a dependency, or to answer questions about a dependency, run `go mod download -json MODULE` and use the returned `Dir` path to read the files.

- Use `go doc foo.Bar` or `go doc -all foo` to read documentation for packages, types, functions, etc.

- Use `go run .` or `go run ./cmd/foo` instead of `go build` to run programs, to avoid leaving behind build artifacts.
