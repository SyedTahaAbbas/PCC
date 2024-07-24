export const random = (lowerBound = 0, upperBound = 1) => {
	return Math.random() * (upperBound - lowerBound) + lowerBound;
}

export const floor = (num) => {
	return Math.floor(num);
}

export const min = (num1, num2) => {
	return Math.min(num1, num2);
}
