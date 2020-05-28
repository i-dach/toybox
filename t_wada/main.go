package main

import (
	"strconv"
)

// FizzBuzz は繰り返し範囲を定義するよ
type FizzBuzz struct{}

// 1. 最初のgreen = ミューテーションテスト(テストコードのテスト)
// func (*FizzBuzz) Convert(x int) string {
// 	return "1"
// }

// Convert is FizzuBuzzの定義がされていたらint -> stringにConvertするよ！
func (*FizzBuzz) Convert(x int) string {
	// 仮実装
	if x%3 == 0 {
		return "Fizz"
	}

	if x%5 == 0 {
		return "Buzz"
	}

	return strconv.Itoa(x)
}
