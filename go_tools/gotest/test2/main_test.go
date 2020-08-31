package main

import "testing"

func TestA(t *testing.T) {
	t.Log("A start")
	//	t.FailNow() // ここでテストを失敗させる
	t.Log("A End")
}

func TestB(t *testing.T) {
	t.Log("B start")
	t.Log("B End")
}
