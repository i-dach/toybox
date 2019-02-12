package main

import "testing"

func TestHelloWorld(t *testing.T) {
	// t.Fatal("not implemented")
}

func TestA(t *testing.T) {
	t.Log("A start")
	t.Fail() // ここでテストを失敗させる
	t.Log("A End")
}

func TestB(t *testing.T) {
	t.Log("B start")
	t.Log("B End")
}
