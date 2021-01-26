package main

import (
	"log"
	"net/http"
)

func main() {
	// Chat main stream
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`
			<html>
				<head>
					<title>チャット</title>
				</head>
				<body>
					<p>チャットしよう</p>
				</body>
			</html>
		`))
	})

	// Start web server
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
