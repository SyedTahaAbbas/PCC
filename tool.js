export const getRandom = (lowerBound = 0, upperBound = 1) => {
	return Math.random() * (upperBound - lowerBound) + lowerBound;
}

export const getFloor = (num) => {
	return Math.floor(num);
}

export const getMin = (num1, num2) => {
	return Math.min(num1, num2);
}
