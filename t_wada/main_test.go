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

// 6. 実装レベルになっているので、より仕様が分かる形にする
func Test_その他場合のテスト(t *testing.T) {
	data := []struct {
		name   string
		expect string
		val    int
	}{
		{name: "1を渡したら文字列1を返す", expect: "1", val: 1},
	}

	for _, line := range data {
		t.Run(line.name, func(t *testing.T) {
			fizzbuzz := Setup()
			if line.expect != fizzbuzz.Convert(line.val) {
				t.Error("まともじゃないよ！")
			}
		})
	}
}

func Test_3の倍数のテスト(t *testing.T) {
	data := []struct {
		name   string
		expect string
		val    int
	}{
		{name: "3を渡したら文字列Fizzを返す", expect: "Fizz", val: 3},
	}

	for _, line := range data {
		t.Run(line.name, func(t *testing.T) {
			fizzbuzz := Setup()
			if line.expect != fizzbuzz.Convert(line.val) {
				t.Error("まともじゃないよ！")
			}
		})
	}
}

func Test_5の倍数のテスト(t *testing.T) {
	data := []struct {
		name   string
		expect string
		val    int
	}{
		{name: "5を渡したら文字列Buzzを返す", expect: "Buzz", val: 5},
	}

	for _, line := range data {
		t.Run(line.name, func(t *testing.T) {
			fizzbuzz := Setup()
			if line.expect != fizzbuzz.Convert(line.val) {
				t.Error("まともじゃないよ！")
			}
		})
	}
}
