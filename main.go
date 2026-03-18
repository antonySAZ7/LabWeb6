package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

var apichat = "https://chat.joelsiervas.online"

func getMessages(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Get(apichat + "/messages")
	if err != nil {
		http.Error(w, "error", 500)
		return
	}

	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	io.Copy(w, resp.Body)
}

func postMessage(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Post(apichat+"/messages", "application/json", r.Body)
	if err != nil {
		http.Error(w, "error", 500)
		return
	}

	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}

func main() {

	fs := http.FileServer(http.Dir("./front"))

	http.Handle("/", fs)

	http.HandleFunc("/api/messages", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" {
			getMessages(w, r)
			return
		}

		if r.Method == "POST" {
			postMessage(w, r)
			return
		}

	})

	http.ListenAndServe(":8000", nil)
	fmt.Println("Servidor en http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
