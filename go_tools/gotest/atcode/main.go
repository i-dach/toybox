package atcode

import (
	"bufio"
	"os"
)

/*
	@func timeCal 距離と速度を入れたらどのくらいかかるかを教えてくれる関数
	@param {int, int} 移動先の距離(m), 移動速度(m/min)
	@return {int} 移動に必要な時間
*/
func timeCal(point, speed int) int {
	return point / speed
}

/*
	@func timeCal 待ち合わせに間に合うか教えてくれる関数
	@param {int, int, int} 移動先の距離(m), 移動速度(m/min), 待ち合わせ時間(min)
	@return {string} Yes/No
*/
func Meeting(point, speed, limit int) string {
	n := timeCal(point, speed)
	if n > limit || n < 1 {
		return "No"
	}

	return "Yes"
}

func main() {
	var sc = bufio.NewScanner(os.Stdin)

}
