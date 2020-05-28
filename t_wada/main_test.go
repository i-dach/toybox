package main

import (
	"testing"
)

// 1. 予想通り落ちることを確認する
// func TestA(t *testing.T) {
// 	t.Error("これは落ちるはず")
// }

// 5. 共通化させる
func Setup() FizzBuzz {
	return FizzBuzz{}
}

// 2. 具体化させたものでテストを作る
func Test_1を渡したら文字列1を返す(t *testing.T) {
	fizzbuzz := Setup()
	if "1" != fizzbuzz.Convert(1) {
		t.Error("まともじゃないよ！")
	}
}

// 3. アサーションルーレットパターンを避けて別のテストとして実装
func Test_2を渡したら文字列2を返す(t *testing.T) {
	fizzbuzz := Setup()
	if "2" != fizzbuzz.Convert(2) {
		t.Error("まともじゃないよ！")
	}
}

// 4. 先に進む
func Test_3を渡したら文字列Fizzを返す(t *testing.T) {
	fizzbuzz := Setup()
	if "Fizz" != fizzbuzz.Convert(3) {
		t.Error("まともじゃないよ！")
	}
}

// 4. 先に進む
func Test_5を渡したら文字列Buzzを返す(t *testing.T) {
	fizzbuzz := Setup()
	if "Buzz" != fizzbuzz.Convert(5) {
		t.Error("まともじゃないよ！")
	}
}
