package atcode

import "testing"

/*
問題文
高橋君は青木君と待ち合わせをしています。

待ち合わせ場所は高橋君の家から
Dメートル離れた地点であり、待ち合わせの時刻は
T分後です。

高橋君は今から家を出発し、
分速Sメートルで待ち合わせ場所までまっすぐ移動します。
待ち合わせに間に合うでしょうか？

制約
1≤D≤10000
1≤T≤10000
1≤S≤10000
入力は全て整数

[image]
range:	P1	(D m)		P2
time:	n1	(S m/min)	n2
*/

func TestA(t *testing.T) {
	// p := 100       // 移動先の距離(m)
	// s := 10        // 移動速度(m/min)
	limit := 10000 // 制限時間(min)
	for p := 1; p <= limit; p++ {
		for s := 1; p <= 10000; s++ {
			// 距離と速度を入れたらどのくらいかかるかを教えてくれる関数
			n := timeCal(p, s)

			if n > limit || n <= 0 {
				t.Error("limit over n, p, s:", n, p, s)
			}
		}
	}

}
